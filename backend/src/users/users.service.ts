import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { ObjectId } from 'mongodb';
import * as bcrypt from 'bcrypt';
import { User } from '../entities/user.entity';
import { Role, RoleType } from '../entities/role.entity';
import { Permission } from '../entities/permission.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: MongoRepository<User>,
    @InjectRepository(Role)
    private roleRepository: MongoRepository<Role>,
    @InjectRepository(Permission)
    private permissionRepository: MongoRepository<Permission>,
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

  async findOne(id: string) {
    const user = await this.userRepository.findOne({
      where: { _id: new ObjectId(id) }
    });
    
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const roles = await this.roleRepository.find({
      where: { _id: { $in: user.roleIds } }
    });

    const permissions = await this.permissionRepository.find({
      where: { _id: { $in: user.permissionIds } }
    });

    return {
      ...user,
      roles: roles.map(role => ({ id: role._id, name: role.name, type: role.type })),
      permissions: permissions.map(perm => ({ id: perm._id, module: perm.module, action: perm.action }))
    };
  }

  async update(id: string, userData: any) {
    const user = await this.userRepository.findOne({
      where: { _id: new ObjectId(id) }
    });
    
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (userData.password) {
      userData.password = await bcrypt.hash(userData.password, 10);
    }

    if (userData.roleIds) {
      userData.roleIds = userData.roleIds.map(id => new ObjectId(id));
    }

    if (userData.permissionIds) {
      userData.permissionIds = userData.permissionIds.map(id => new ObjectId(id));
    }

    await this.userRepository.update({ _id: new ObjectId(id) }, userData);
    return this.findOne(id);
  }

  async delete(id: string) {
    const result = await this.userRepository.delete({ _id: new ObjectId(id) });
    if (result.affected === 0) {
      throw new NotFoundException('User not found');
    }
    return { message: 'User deleted successfully' };
  }

  async assignRole(userId: string, roleId: string, currentUser: any) {
    const user = await this.userRepository.findOne({
      where: { _id: new ObjectId(userId) }
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const roleObjectId = new ObjectId(roleId);
    if (!user.roleIds.some(id => id.equals(roleObjectId))) {
      user.roleIds.push(roleObjectId);
      await this.userRepository.save(user);
    }
    
    return this.findOne(userId);
  }

  async removeRole(userId: string, roleId: string) {
    const user = await this.userRepository.findOne({
      where: { _id: new ObjectId(userId) }
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.roleIds = user.roleIds.filter(id => !id.equals(new ObjectId(roleId)));
    await this.userRepository.save(user);
    
    return this.findOne(userId);
  }

  async assignPermission(userId: string, permissionId: string) {
    const user = await this.userRepository.findOne({
      where: { _id: new ObjectId(userId) }
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const permissionObjectId = new ObjectId(permissionId);
    if (!user.permissionIds.some(id => id.equals(permissionObjectId))) {
      user.permissionIds.push(permissionObjectId);
      await this.userRepository.save(user);
    }
    
    return this.findOne(userId);
  }

  async removePermission(userId: string, permissionId: string) {
    const user = await this.userRepository.findOne({
      where: { _id: new ObjectId(userId) }
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.permissionIds = user.permissionIds.filter(id => !id.equals(new ObjectId(permissionId)));
    await this.userRepository.save(user);
    
    return this.findOne(userId);
  }

  async toggleStatus(userId: string, isActive: boolean) {
    const user = await this.userRepository.findOne({
      where: { _id: new ObjectId(userId) }
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.isActive = isActive;
    await this.userRepository.save(user);
    
    return this.findOne(userId);
  }

  async updateUserOrganization(userId: string, organizationId: string) {
    const user = await this.userRepository.findOne({
      where: { _id: new ObjectId(userId) }
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.currentOrganizationId = new ObjectId(organizationId);
    await this.userRepository.save(user);
    
    return {
      id: user._id.toString(),
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      organizationId: organizationId
    };
  }
}