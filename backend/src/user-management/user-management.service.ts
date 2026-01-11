import { Injectable, ConflictException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { ObjectId } from 'mongodb';
import { User } from '../entities/user.entity';
import { Role, RoleType } from '../entities/role.entity';
import { Permission, ActionType } from '../entities/permission.entity';
import { Module, ModulePermissionType } from '../entities/module.entity';
import { Organization } from '../entities/organization.entity';
import { JwtService } from '@nestjs/jwt';
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
    private jwtService: JwtService,
  ) {}

  async apiLogin(email: string, password: string) {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('User account is inactive');
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

    const { password: _, ...userWithoutPassword } = user;
    return {
      access_token: this.jwtService.sign(payload),
      user: userWithoutPassword,
      roles: roles.map(r => ({ id: r._id.toString(), name: r.name, type: r.type }))
    };
  }

  async apiLogout(userId: string) {
    const user = await this.userRepository.findOne({ where: { _id: new ObjectId(userId) } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return { success: true, message: 'Logged out successfully' };
  }

  async getAllUsers(currentUser?: any) {
    let users = await this.userRepository.find();
    
    if (currentUser) {
      const user = await this.userRepository.findOne({
        where: { _id: new ObjectId(currentUser.userId) }
      });

      const userRoles = await this.roleRepository.find({
        where: { _id: { $in: user.roleIds } }
      });

      const isSuperAdmin = userRoles.some(role => role.type === RoleType.SUPER_ADMIN);
      const currentUserMaxLevel = Math.max(...userRoles.map(r => r.hierarchyLevel || 0), 0);
      
      if (!isSuperAdmin) {
        const allRoles = await this.roleRepository.find();
        users = users.filter(u => {
          if (u._id.equals(user._id)) return true;
          const targetUserRoles = allRoles.filter(r => u.roleIds.some(roleId => r._id.equals(roleId)));
          const targetUserMaxLevel = Math.max(...targetUserRoles.map(r => r.hierarchyLevel || 0), 0);
          return targetUserMaxLevel < currentUserMaxLevel;
        });
      }
    }
    
    return this.populateUserRoles(users);
  }

  async searchUsers(query: string, currentUser?: any) {
    const searchRegex = new RegExp(query, 'i');
    let users = await this.userRepository.find();
    
    users = users.filter(u => 
      searchRegex.test(u.firstName) || 
      searchRegex.test(u.lastName) || 
      searchRegex.test(u.email)
    );

    if (currentUser) {
      const user = await this.userRepository.findOne({
        where: { _id: new ObjectId(currentUser.userId) }
      });

      const userRoles = await this.roleRepository.find({
        where: { _id: { $in: user.roleIds } }
      });

      const isSuperAdmin = userRoles.some(role => role.type === RoleType.SUPER_ADMIN);
      const currentUserMaxLevel = Math.max(...userRoles.map(r => r.hierarchyLevel || 0), 0);
      
      if (!isSuperAdmin) {
        const allRoles = await this.roleRepository.find();
        users = users.filter(u => {
          if (u._id.equals(user._id)) return true;
          const targetUserRoles = allRoles.filter(r => u.roleIds.some(roleId => r._id.equals(roleId)));
          const targetUserMaxLevel = Math.max(...targetUserRoles.map(r => r.hierarchyLevel || 0), 0);
          return targetUserMaxLevel < currentUserMaxLevel;
        });
      }
    }

    return this.populateUserRoles(users);
  }

  async searchRoles(query: string) {
    const searchRegex = new RegExp(query, 'i');
    const roles = await this.roleRepository.find();
    return roles.filter(r => searchRegex.test(r.name) || searchRegex.test(r.type));
  }

  async searchPermissions(query: string) {
    const searchRegex = new RegExp(query, 'i');
    const permissions = await this.permissionRepository.find();
    return permissions.filter(p => 
      searchRegex.test(p.module) || 
      searchRegex.test(p.action) || 
      searchRegex.test(p.resource)
    );
  }

  private async populateUserRoles(users: User[]) {
    return Promise.all(
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
  }

  async createUser(userData: any) {
    const existingUser = await this.userRepository.findOne({ where: { email: userData.email } });
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const user = this.userRepository.create({
      email: userData.email,
      password: hashedPassword,
      firstName: userData.firstName,
      lastName: userData.lastName,
      isActive: userData.isActive ?? true,
      organizationId: userData.organizationId ? new ObjectId(userData.organizationId) : null,
      organizationIds: userData.organizationId ? [new ObjectId(userData.organizationId)] : [],
      roleIds: userData.roleIds?.map(id => new ObjectId(id)) || [],
      currency: userData.currency || 'USD',
      currencySymbol: userData.currencySymbol || '$',
      forcePasswordChange: userData.forcePasswordChange || false,
      requireTwoFactor: userData.requireTwoFactor || false,
      restrictToBusinessHours: userData.restrictToBusinessHours || false,
      allowApiAccess: userData.allowApiAccess || false,
      sessionTimeout: userData.sessionTimeout || null,
      maxDevices: userData.maxDevices || null,
      ipWhitelist: userData.ipWhitelist || null
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

    if (userData.email && userData.email !== user.email) {
      const existingUser = await this.userRepository.findOne({ where: { email: userData.email } });
      if (existingUser) {
        throw new ConflictException('User with this email already exists');
      }
    }

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
    if (userData.currency) user.currency = userData.currency;
    if (userData.currencySymbol) user.currencySymbol = userData.currencySymbol;
    if (userData.forcePasswordChange !== undefined) user.forcePasswordChange = userData.forcePasswordChange;
    if (userData.requireTwoFactor !== undefined) user.requireTwoFactor = userData.requireTwoFactor;
    if (userData.restrictToBusinessHours !== undefined) user.restrictToBusinessHours = userData.restrictToBusinessHours;
    if (userData.allowApiAccess !== undefined) user.allowApiAccess = userData.allowApiAccess;
    if (userData.sessionTimeout !== undefined) user.sessionTimeout = userData.sessionTimeout;
    if (userData.maxDevices !== undefined) user.maxDevices = userData.maxDevices;
    if (userData.ipWhitelist !== undefined) user.ipWhitelist = userData.ipWhitelist;

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

  async getAllRoles() {
    return this.roleRepository.find();
  }

  async createRole(roleData: any) {
    const existingRole = await this.roleRepository.findOne({ where: { name: roleData.name } });
    if (existingRole) {
      throw new ConflictException('Role with this name already exists');
    }

    const role = this.roleRepository.create({
      name: roleData.name,
      type: roleData.type,
      description: roleData.description || '',
      hierarchyLevel: roleData.hierarchyLevel || 0,
      permissionIds: roleData.permissionIds?.map(id => new ObjectId(id)) || []
    });

    return this.roleRepository.save(role);
  }

  async updateRole(roleId: string, roleData: any) {
    const role = await this.roleRepository.findOne({ where: { _id: new ObjectId(roleId) } });
    if (!role) {
      throw new NotFoundException('Role not found');
    }

    if (roleData.name && roleData.name !== role.name) {
      const existingRole = await this.roleRepository.findOne({ where: { name: roleData.name } });
      if (existingRole) {
        throw new ConflictException('Role with this name already exists');
      }
    }

    if (roleData.name) role.name = roleData.name;
    if (roleData.type) role.type = roleData.type;
    if (roleData.description !== undefined) role.description = roleData.description;
    if (roleData.hierarchyLevel !== undefined) role.hierarchyLevel = roleData.hierarchyLevel;
    if (roleData.permissionIds) role.permissionIds = roleData.permissionIds.map(id => new ObjectId(id));

    return this.roleRepository.save(role);
  }

  async deleteRole(roleId: string) {
    const role = await this.roleRepository.findOne({ where: { _id: new ObjectId(roleId) } });
    if (!role) {
      throw new NotFoundException('Role not found');
    }

    await this.roleRepository.delete({ _id: new ObjectId(roleId) });
    return { success: true, message: 'Role deleted successfully' };
  }

  async getAllPermissions() {
    return this.permissionRepository.find();
  }

  async createPermission(permissionData: any) {
    const existingPermission = await this.permissionRepository.findOne({
      where: { module: permissionData.module, action: permissionData.action, resource: permissionData.resource }
    });
    if (existingPermission) {
      throw new ConflictException('Permission already exists');
    }

    const permission = this.permissionRepository.create({
      module: permissionData.module,
      action: permissionData.action,
      resource: permissionData.resource,
      description: permissionData.description || ''
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
    if (permissionData.description !== undefined) permission.description = permissionData.description;

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

  async getAllOrganizations() {
    return this.organizationRepository.find();
  }

  async getAllModules() {
    return this.moduleRepository.find();
  }

  async updateUserRoles(userId: string, roleIds: string[]) {
    const user = await this.userRepository.findOne({ where: { _id: new ObjectId(userId) } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.roleIds = roleIds.map(id => new ObjectId(id));
    const savedUser = await this.userRepository.save(user);
    const { password, ...userWithoutPassword } = savedUser;
    return userWithoutPassword;
  }
}
