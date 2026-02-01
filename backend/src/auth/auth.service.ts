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

  async login(email: string, password: string, deviceId?: string, userAgent?: string, ip?: string) {
    const user = await this.userRepository.findOne({ where: { email, isDeleted: { $ne: true } } } as any);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('User account is inactive');
    }

    // IP Whitelist check
    if (user.ipWhitelist && user.ipWhitelist.trim() !== '') {
      const allowedIps = user.ipWhitelist.split(',').map(i => i.trim());
      if (ip && !allowedIps.includes(ip) && !allowedIps.includes('127.0.0.1') && !allowedIps.includes('::1')) {
        throw new UnauthorizedException(`Access from IP ${ip} is not allowed.`);
      }
    }

    // Business hours restriction (9:00 AM - 6:00 PM)
    if (user.restrictToBusinessHours) {
      const now = new Date();
      // Get hours in IST or local server time
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const currentTime = hours + minutes / 60;

      if (currentTime < 9 || currentTime >= 18) {
        throw new UnauthorizedException('Login is restricted to business hours (9:00 AM - 6:00 PM).');
      }
    }

    // Always handle session to enforce maxDevices
    await this.handleSession(user, deviceId || `agent-${Buffer.from(userAgent || 'unknown').toString('base64').substring(0, 16)}`, userAgent);

    const roles = await this.roleRepository.find({
      where: { _id: { $in: user.roleIds } }
    });

    const payload = { 
      email: user.email, 
      sub: user._id.toString(), 
      organizationId: user.organizationId?.toString() || user.organizationIds?.[0]?.toString(),
      roles: roles.map(r => r.type),
      deviceId
    };

    const { password: _, ...userWithoutPassword } = user;
    
    // JWT options with dynamic expiration if sessionTimeout is set
    const signOptions: any = {};
    if (user.sessionTimeout) {
      signOptions.expiresIn = `${user.sessionTimeout}m`;
    }

    return {
      access_token: this.jwtService.sign(payload, signOptions),
      user: userWithoutPassword,
    };
  }

  private async handleSession(user: User, deviceId: string, userAgent?: string) {
    if (!user.activeDevices) {
      user.activeDevices = [];
    }

    const existingDeviceIndex = user.activeDevices.findIndex(d => d.deviceId === deviceId);

    if (existingDeviceIndex !== -1) {
      user.activeDevices[existingDeviceIndex].lastActive = new Date();
      user.activeDevices[existingDeviceIndex].userAgent = userAgent;
    } else {
      if (user.maxDevices && user.activeDevices.length >= user.maxDevices) {
        throw new UnauthorizedException(`Maximum device limit reached (${user.maxDevices}). Please logout from another device.`);
      }
      user.activeDevices.push({
        deviceId,
        lastActive: new Date(),
        userAgent
      });
    }

    await this.userRepository.save(user);
  }

  async logout(userId: string, deviceId?: string) {
    const user = await this.userRepository.findOne({ where: { _id: new ObjectId(userId) } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (deviceId && user.activeDevices) {
      user.activeDevices = user.activeDevices.filter(d => d.deviceId !== deviceId);
      await this.userRepository.save(user);
    }

    return { success: true, message: 'Logged out successfully' };
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