import { Injectable, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { ObjectId } from 'mongodb';
import * as bcrypt from 'bcrypt';
import { User } from '../entities/user.entity';
import { Role } from '../entities/role.entity';
import { Organization } from '../entities/organization.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: MongoRepository<User>,
    @InjectRepository(Role)
    private roleRepository: MongoRepository<Role>,
    @InjectRepository(Organization)
    private organizationRepository: MongoRepository<Organization>,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userRepository.findOne({ where: { email } });

    if (user && await bcrypt.compare(password, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(email: string, password: string) {
    const user = await this.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const roles = await this.roleRepository.find({
      where: { _id: { $in: user.roleIds } }
    });

    const payload = { 
      email: user.email, 
      sub: user._id.toString(), 
      organizationId: user.organizationId?.toString() || user.organizationIds[0]?.toString(),
      roles: roles.map(r => r.type)
    };

    return {
      access_token: this.jwtService.sign(payload),
      user,
    };
  }

  async getProfile(userId: string) {
    const user = await this.userRepository.findOne({
      where: { _id: new ObjectId(userId) }
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Get user roles
    const roles = await this.roleRepository.find({
      where: { _id: { $in: user.roleIds } }
    });

    // Get user organizations
    const organizations = await this.organizationRepository.find({
      where: { _id: { $in: user.organizationIds } }
    });

    // Get current organization
    let currentOrganization = null;
    if (user.organizationId) {
      currentOrganization = await this.organizationRepository.findOne({
        where: { _id: user.organizationId }
      });
    }

    return {
      id: user._id.toString(),
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      avatar: user.avatar,
      isActive: user.isActive,
      createdAt: user.createdAt,
      roles: roles.map(role => ({
        id: role._id.toString(),
        name: role.name,
        type: role.type
      })),
      organizations: organizations.map(org => ({
        id: org._id.toString(),
        name: org.name,
        code: org.code,
        description: org.description
      })),
      currentOrganization: currentOrganization ? {
        id: currentOrganization._id.toString(),
        name: currentOrganization.name,
        code: currentOrganization.code,
        description: currentOrganization.description
      } : null
    };
  }

  async updateProfile(userId: string, updateData: { firstName: string; lastName: string }) {
    const user = await this.userRepository.findOne({
      where: { _id: new ObjectId(userId) }
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.userRepository.update(
      { _id: new ObjectId(userId) },
      {
        firstName: updateData.firstName,
        lastName: updateData.lastName
      }
    );

    return this.getProfile(userId);
  }

  async updateAvatar(userId: string, avatarUrl: string) {
    const user = await this.userRepository.findOne({
      where: { _id: new ObjectId(userId) }
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.userRepository.update(
      { _id: new ObjectId(userId) },
      { avatar: avatarUrl }
    );

    return this.getProfile(userId);
  }
}