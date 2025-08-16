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

  async findByEmail(email: string) {
    return this.userRepository.findOne({ where: { email } });
  }

  async findAll(currentUser: any) {
    const user = await this.userRepository.findOne({
      where: { _id: new ObjectId(currentUser.userId) }
    });

    const userRoles = await this.roleRepository.find({
      where: { _id: { $in: user.roleIds } }
    });

    const isSuperAdmin = userRoles.some(role => role.type === RoleType.SUPER_ADMIN);
    
    let users;
    if (isSuperAdmin) {
      users = await this.userRepository.find();
    } else {
      users = await this.userRepository.find({
        where: { currentOrganizationId: user.currentOrganizationId }
      });
    }

    // Populate role data for each user
    const usersWithRoles = await Promise.all(
      users.map(async (user) => {
        if (user.roleIds && user.roleIds.length > 0) {
          const roles = await this.roleRepository.find({
            where: { _id: { $in: user.roleIds } }
          });
          return {
            ...user,
            roles: roles.map(role => ({ id: role._id, name: role.name, type: role.type }))
          };
        }
        return { ...user, roles: [] };
      })
    );

    return usersWithRoles;
  }

  async create(userData: any, currentUser: any) {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const roleIds = userData.roleIds ? userData.roleIds.map(id => new ObjectId(id)) : [];
    
    const user = this.userRepository.create({
      ...userData,
      password: hashedPassword,
      organizationId: new ObjectId(userData.organizationId),
      roleIds,
    });

    const savedUser = await this.userRepository.save(user);
    
    // Return user with populated roles
    if (roleIds.length > 0) {
      const roles = await this.roleRepository.find({
        where: { _id: { $in: roleIds } }
      });
      return {
        ...savedUser,
        roles: roles.map(role => ({ id: role._id, name: role.name, type: role.type }))
      };
    }
    
    return { ...savedUser, roles: [] };
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