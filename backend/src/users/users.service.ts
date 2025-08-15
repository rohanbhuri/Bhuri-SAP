import { Injectable, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { ObjectId } from 'mongodb';
import * as bcrypt from 'bcrypt';
import { User } from '../entities/user.entity';
import { Role, RoleType } from '../entities/role.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: MongoRepository<User>,
    @InjectRepository(Role)
    private roleRepository: MongoRepository<Role>,
  ) {}

  async findAll(currentUser: any) {
    const user = await this.userRepository.findOne({
      where: { _id: new ObjectId(currentUser.userId) }
    });

    const userRoles = await this.roleRepository.find({
      where: { _id: { $in: user.roleIds } }
    });

    const isSuperAdmin = userRoles.some(role => role.type === RoleType.SUPER_ADMIN);
    
    if (isSuperAdmin) {
      return this.userRepository.find();
    }

    return this.userRepository.find({
      where: { organizationId: user.organizationId }
    });
  }

  async create(userData: any, currentUser: any) {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    
    const user = this.userRepository.create({
      ...userData,
      password: hashedPassword,
      organizationId: new ObjectId(userData.organizationId),
    });

    return this.userRepository.save(user);
  }

  async createPublic(userData: any) {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    
    const user = this.userRepository.create({
      ...userData,
      password: hashedPassword,
      organizationId: userData.organizationId ? new ObjectId(userData.organizationId) : null,
      roleIds: [],
    });

    return this.userRepository.save(user);
  }

  async assignRole(userId: string, roleId: string, currentUser: any) {
    const user = await this.userRepository.findOne({
      where: { _id: new ObjectId(userId) }
    });

    if (!user.roleIds.includes(new ObjectId(roleId))) {
      user.roleIds.push(new ObjectId(roleId));
    }
    
    return this.userRepository.save(user);
  }
}