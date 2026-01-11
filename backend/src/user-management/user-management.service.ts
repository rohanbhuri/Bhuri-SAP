import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { ObjectId } from 'mongodb';
import { User } from '../entities/user.entity';
import { Role, RoleType } from '../entities/role.entity';
import { Permission, ActionType } from '../entities/permission.entity';
import { Module, ModulePermissionType } from '../entities/module.entity';
import { Organization } from '../entities/organization.entity';

import * as bcrypt from 'bcrypt';

@Injectable()
export class UserManagementService {
  constructor(
    @InjectRepository(User)
    private userRepository: MongoRepository<User>,
    @InjectRepository(Role)
    private roleRepository: MongoRepository<Role>,
    @InjectRepository(Permission)
    private permissionRepository: MongoRepository<Permission>,
    @InjectRepository(Module)
    private moduleRepository: MongoRepository<Module>,
    @InjectRepository(Organization)
    private organizationRepository: MongoRepository<Organization>,
  ) {}

  async getAllUsers() {
    const users = await this.userRepository.find();
    
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

  async createUser(userData: any) {
    // Check if user already exists
    const existingUser = await this.userRepository.findOne({ where: { email: userData.email } });
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const user = this.userRepository.create({
      email: userData.email,
      password: hashedPassword,
      firstName: userData.firstName,
      lastName: userData.lastName,
      isActive: userData.isActive ?? true,
      organizationId: userData.organizationId ? new ObjectId(userData.organizationId) : null,
      organizationIds: userData.organizationId ? [new ObjectId(userData.organizationId)] : [],
      roleIds: userData.roleIds?.map(id => new ObjectId(id)) || []
    });

    const savedUser = await this.userRepository.save(user);
    const { password, ...userWithoutPassword } = savedUser;
    return userWithoutPassword;
  }

  async updateUser(userId: string, userData: any) {
    const user = await this.userRepository.findOne({ where: { _id: new ObjectId(userId) } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Check email uniqueness if email is being changed
    if (userData.email && userData.email !== user.email) {
      const existingUser = await this.userRepository.findOne({ where: { email: userData.email } });
      if (existingUser) {
        throw new ConflictException('User with this email already exists');
      }
    }

    // Update user fields
    if (userData.email) user.email = userData.email;
    if (userData.firstName) user.firstName = userData.firstName;
    if (userData.lastName) user.lastName = userData.lastName;
    if (userData.isActive !== undefined) user.isActive = userData.isActive;
    if (userData.organizationId) {
      user.organizationId = new ObjectId(userData.organizationId);
      if (!user.organizationIds.some(id => id.equals(new ObjectId(userData.organizationId)))) {
        user.organizationIds.push(new ObjectId(userData.organizationId));
      }
    }
    if (userData.roleIds) user.roleIds = userData.roleIds.map(id => new ObjectId(id));

    // Hash new password if provided
    if (userData.password) {
      user.password = await bcrypt.hash(userData.password, 10);
    }

    const savedUser = await this.userRepository.save(user);
    const { password, ...userWithoutPassword } = savedUser;
    return userWithoutPassword;
  }

  async deleteUser(userId: string) {
    const user = await this.userRepository.findOne({ where: { _id: new ObjectId(userId) } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.userRepository.delete({ _id: new ObjectId(userId) });
    return { success: true, message: 'User deleted successfully' };
  }

  async toggleUserStatus(userId: string, isActive: boolean) {
    const user = await this.userRepository.findOne({ where: { _id: new ObjectId(userId) } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.isActive = isActive;
    const savedUser = await this.userRepository.save(user);
    const { password, ...userWithoutPassword } = savedUser;
    return userWithoutPassword;
  }

  async getAllOrganizations() {
    return this.organizationRepository.find();
  }

  async getAllRoles() {
    return this.roleRepository.find();
  }

  async getAllPermissions() {
    return this.permissionRepository.find();
  }

  async getAllModules() {
    return this.moduleRepository.find();
  }

  async updateUserRoles(userId: string, roleIds: string[]) {
    const user = await this.userRepository.findOne({
      where: { _id: new ObjectId(userId) }
    });
    
    user.roleIds = roleIds.map(id => new ObjectId(id));
    return this.userRepository.save(user);
  }

  async createRole(roleData: any) {
    const role = this.roleRepository.create({
      name: roleData.name,
      type: roleData.type || RoleType.CUSTOM,
      description: roleData.description,
      permissionIds: roleData.permissionIds?.map(id => new ObjectId(id)) || []
    });
    return this.roleRepository.save(role);
  }

  async updateRole(roleId: string, roleData: any) {
    const role = await this.roleRepository.findOne({ where: { _id: new ObjectId(roleId) } });
    if (!role) {
      throw new NotFoundException('Role not found');
    }

    if (roleData.name) role.name = roleData.name;
    if (roleData.type) role.type = roleData.type;
    if (roleData.description !== undefined) role.description = roleData.description;
    if (roleData.permissionIds) role.permissionIds = roleData.permissionIds.map(id => new ObjectId(id));

    return this.roleRepository.save(role);
  }

  async createPermission(permissionData: any) {
    const permission = this.permissionRepository.create({
      module: permissionData.module,
      action: permissionData.action,
      resource: permissionData.resource
    });
    return this.permissionRepository.save(permission);
  }

  async updatePermission(permissionId: string, permissionData: any) {
    const permission = await this.permissionRepository.findOne({ where: { _id: new ObjectId(permissionId) } });
    if (!permission) {
      throw new NotFoundException('Permission not found');
    }

    if (permissionData.module) permission.module = permissionData.module;
    if (permissionData.action) permission.action = permissionData.action;
    if (permissionData.resource) permission.resource = permissionData.resource;

    return this.permissionRepository.save(permission);
  }

  async deletePermission(permissionId: string) {
    const permission = await this.permissionRepository.findOne({ where: { _id: new ObjectId(permissionId) } });
    if (!permission) {
      throw new NotFoundException('Permission not found');
    }

    await this.permissionRepository.delete({ _id: new ObjectId(permissionId) });
    return { success: true, message: 'Permission deleted successfully' };
  }

  async deleteRole(roleId: string) {
    const role = await this.roleRepository.findOne({ where: { _id: new ObjectId(roleId) } });
    if (!role) {
      throw new NotFoundException('Role not found');
    }

    await this.roleRepository.delete({ _id: new ObjectId(roleId) });
    return { success: true, message: 'Role deleted successfully' };
  }


}