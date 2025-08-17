import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { ObjectId } from 'mongodb';
import { Role, RoleType } from '../entities/role.entity';
import { Permission, ActionType } from '../entities/permission.entity';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private roleRepository: MongoRepository<Role>,
    @InjectRepository(Permission)
    private permissionRepository: MongoRepository<Permission>,
  ) {}

  async findAll() {
    const roles = await this.roleRepository.find();
    return Promise.all(roles.map(async (role) => {
      const permissions = await this.permissionRepository.find({
        where: { _id: { $in: role.permissionIds } }
      });
      return {
        ...role,
        permissions: permissions.map(p => ({ id: p._id, module: p.module, action: p.action, resource: p.resource }))
      };
    }));
  }

  async findOne(id: string) {
    const role = await this.roleRepository.findOne({ where: { _id: new ObjectId(id) } });
    if (!role) {
      throw new NotFoundException('Role not found');
    }
    
    const permissions = await this.permissionRepository.find({
      where: { _id: { $in: role.permissionIds } }
    });
    
    return {
      ...role,
      permissions: permissions.map(p => ({ id: p._id, module: p.module, action: p.action, resource: p.resource }))
    };
  }

  async create(roleData: any) {
    const role = this.roleRepository.create({
      ...roleData,
      type: roleData.type || RoleType.CUSTOM,
      permissionIds: roleData.permissionIds ? roleData.permissionIds.map(id => new ObjectId(id)) : []
    });
    const savedRole = await this.roleRepository.save(role);
    return this.findOne((savedRole as any)._id.toString());
  }

  async update(id: string, updateData: any) {
    const role = await this.roleRepository.findOne({ where: { _id: new ObjectId(id) } });
    if (!role) {
      throw new NotFoundException('Role not found');
    }
    
    if (updateData.permissionIds) {
      updateData.permissionIds = updateData.permissionIds.map(id => new ObjectId(id));
    }
    
    await this.roleRepository.update({ _id: new ObjectId(id) }, updateData);
    return this.findOne(id);
  }

  async delete(id: string) {
    const result = await this.roleRepository.delete({ _id: new ObjectId(id) });
    if (result.affected === 0) {
      throw new NotFoundException('Role not found');
    }
    return { message: 'Role deleted successfully' };
  }

  async assignPermission(roleId: string, permissionId: string) {
    const role = await this.roleRepository.findOne({ where: { _id: new ObjectId(roleId) } });
    if (!role) {
      throw new NotFoundException('Role not found');
    }
    
    const permissionObjectId = new ObjectId(permissionId);
    if (!role.permissionIds.some(id => id.equals(permissionObjectId))) {
      role.permissionIds.push(permissionObjectId);
      await this.roleRepository.save(role);
    }
    
    return this.findOne(roleId);
  }

  async removePermission(roleId: string, permissionId: string) {
    const role = await this.roleRepository.findOne({ where: { _id: new ObjectId(roleId) } });
    if (!role) {
      throw new NotFoundException('Role not found');
    }
    
    role.permissionIds = role.permissionIds.filter(id => !id.equals(new ObjectId(permissionId)));
    await this.roleRepository.save(role);
    
    return this.findOne(roleId);
  }

  async getAllPermissions() {
    return this.permissionRepository.find();
  }

  async createPermission(permissionData: any) {
    const permission = this.permissionRepository.create(permissionData);
    return this.permissionRepository.save(permission);
  }

  async updatePermission(id: string, permissionData: any) {
    const permission = await this.permissionRepository.findOne({ where: { _id: new ObjectId(id) } });
    if (!permission) {
      throw new NotFoundException('Permission not found');
    }
    
    await this.permissionRepository.update({ _id: new ObjectId(id) }, permissionData);
    return this.permissionRepository.findOne({ where: { _id: new ObjectId(id) } });
  }

  async deletePermission(id: string) {
    const result = await this.permissionRepository.delete({ _id: new ObjectId(id) });
    if (result.affected === 0) {
      throw new NotFoundException('Permission not found');
    }
    return { message: 'Permission deleted successfully' };
  }

  async getPermissionTemplates() {
    return {
      admin: {
        name: 'Admin Template',
        permissions: [
          { module: 'users', action: ActionType.READ, resource: 'all' },
          { module: 'users', action: ActionType.WRITE, resource: 'all' },
          { module: 'users', action: ActionType.EDIT, resource: 'all' },
          { module: 'roles', action: ActionType.READ, resource: 'all' },
          { module: 'organizations', action: ActionType.READ, resource: 'all' },
          { module: 'modules', action: ActionType.READ, resource: 'all' }
        ]
      },
      staff: {
        name: 'Staff Template',
        permissions: [
          { module: 'users', action: ActionType.READ, resource: 'own' },
          { module: 'organizations', action: ActionType.READ, resource: 'own' },
          { module: 'modules', action: ActionType.READ, resource: 'own' }
        ]
      },
      hr: {
        name: 'HR Template',
        permissions: [
          { module: 'hr-management', action: ActionType.READ, resource: 'all' },
          { module: 'hr-management', action: ActionType.WRITE, resource: 'all' },
          { module: 'hr-management', action: ActionType.EDIT, resource: 'all' },
          { module: 'users', action: ActionType.READ, resource: 'all' }
        ]
      },
      crm: {
        name: 'CRM Template',
        permissions: [
          { module: 'crm', action: ActionType.READ, resource: 'all' },
          { module: 'crm', action: ActionType.WRITE, resource: 'all' },
          { module: 'crm', action: ActionType.EDIT, resource: 'all' }
        ]
      }
    };
  }

  async applyPermissionTemplate(roleId: string, templateId: string) {
    const templates = await this.getPermissionTemplates();
    const template = templates[templateId];
    
    if (!template) {
      throw new NotFoundException('Template not found');
    }

    const role = await this.roleRepository.findOne({ where: { _id: new ObjectId(roleId) } });
    if (!role) {
      throw new NotFoundException('Role not found');
    }

    // Create permissions if they don't exist
    const permissionIds = [];
    for (const permData of template.permissions) {
      let permission = await this.permissionRepository.findOne({
        where: { module: permData.module, action: permData.action, resource: permData.resource }
      });
      
      if (!permission) {
        permission = await this.createPermission(permData) as any;
      }
      
      permissionIds.push(permission._id);
    }

    role.permissionIds = permissionIds;
    await this.roleRepository.save(role);
    
    return this.findOne(roleId);
  }
}