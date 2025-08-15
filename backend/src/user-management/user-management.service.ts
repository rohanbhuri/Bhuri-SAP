import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { ObjectId } from 'mongodb';
import { User } from '../entities/user.entity';
import { Role, RoleType } from '../entities/role.entity';
import { Permission, ActionType } from '../entities/permission.entity';
import { Module, ModulePermissionType } from '../entities/module.entity';

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
  ) {}

  async getAllUsers() {
    return this.userRepository.find();
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

  async updateUserPermissions(userId: string, permissionIds: string[]) {
    const user = await this.userRepository.findOne({
      where: { _id: new ObjectId(userId) }
    });
    
    user.permissionIds = permissionIds.map(id => new ObjectId(id));
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

  async createPermission(permissionData: any) {
    const permission = this.permissionRepository.create({
      module: permissionData.module,
      action: permissionData.action,
      resource: permissionData.resource
    });
    return this.permissionRepository.save(permission);
  }

  async setupDefaults() {
    // Create default modules
    const modules = [
      { name: 'user-management', displayName: 'User Management', description: 'Manage users, roles and permissions', permissionType: ModulePermissionType.PUBLIC },
      { name: 'dashboard', displayName: 'Dashboard', description: 'Main dashboard view', permissionType: ModulePermissionType.PUBLIC },
      { name: 'reports', displayName: 'Reports', description: 'Generate and view reports', permissionType: ModulePermissionType.REQUIRE_PERMISSION },
      { name: 'settings', displayName: 'Settings', description: 'System settings', permissionType: ModulePermissionType.REQUIRE_PERMISSION }
    ];

    for (const moduleData of modules) {
      const existing = await this.moduleRepository.findOne({ where: { name: moduleData.name } });
      if (!existing) {
        await this.moduleRepository.save(this.moduleRepository.create(moduleData));
      }
    }

    // Create default permissions
    const permissions = [
      { module: 'user-management', action: ActionType.READ, resource: 'users' },
      { module: 'user-management', action: ActionType.WRITE, resource: 'users' },
      { module: 'dashboard', action: ActionType.READ, resource: 'dashboard' },
      { module: 'reports', action: ActionType.READ, resource: 'reports' },
      { module: 'settings', action: ActionType.READ, resource: 'settings' }
    ];

    for (const permData of permissions) {
      const existing = await this.permissionRepository.findOne({ 
        where: { module: permData.module, action: permData.action, resource: permData.resource } 
      });
      if (!existing) {
        await this.permissionRepository.save(this.permissionRepository.create(permData));
      }
    }

    // Create super admin role if not exists
    const superAdminRole = await this.roleRepository.findOne({ where: { type: RoleType.SUPER_ADMIN } });
    if (!superAdminRole) {
      const allPermissions = await this.permissionRepository.find();
      await this.roleRepository.save(this.roleRepository.create({
        name: 'Super Administrator',
        type: RoleType.SUPER_ADMIN,
        description: 'Full system access',
        permissionIds: allPermissions.map(p => p._id)
      }));
    }

    return { success: true, message: 'Default data created' };
  }
}