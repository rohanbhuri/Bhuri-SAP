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
        description: 'Full administrative access to organization',
        permissions: [
          { module: 'users', action: ActionType.READ, resource: 'organization' },
          { module: 'users', action: ActionType.WRITE, resource: 'organization' },
          { module: 'users', action: ActionType.EDIT, resource: 'organization' },
          { module: 'roles', action: ActionType.READ, resource: 'organization' },
          { module: 'organizations', action: ActionType.READ, resource: 'own' },
          { module: 'organizations', action: ActionType.EDIT, resource: 'own' },
          { module: 'modules', action: ActionType.READ, resource: 'own' },
          { module: 'dashboard', action: ActionType.READ, resource: 'organization' },
          { module: 'reports', action: ActionType.READ, resource: 'organization' }
        ]
      },
      hr_manager: {
        name: 'HR Manager Template',
        description: 'Complete HR management access',
        permissions: [
          { module: 'hr-management', action: ActionType.READ, resource: 'organization' },
          { module: 'hr-management', action: ActionType.WRITE, resource: 'organization' },
          { module: 'hr-management', action: ActionType.EDIT, resource: 'organization' },
          { module: 'hr-management', action: ActionType.DELETE, resource: 'organization' },
          { module: 'employees', action: ActionType.READ, resource: 'organization' },
          { module: 'employees', action: ActionType.WRITE, resource: 'organization' },
          { module: 'employees', action: ActionType.EDIT, resource: 'organization' },
          { module: 'payroll', action: ActionType.READ, resource: 'organization' },
          { module: 'payroll', action: ActionType.WRITE, resource: 'organization' },
          { module: 'payroll', action: ActionType.EDIT, resource: 'organization' },
          { module: 'users', action: ActionType.READ, resource: 'organization' },
          { module: 'reports', action: ActionType.READ, resource: 'organization' },
          { module: 'dashboard', action: ActionType.READ, resource: 'organization' }
        ]
      },
      crm_manager: {
        name: 'CRM Manager Template',
        description: 'Complete CRM and sales management',
        permissions: [
          { module: 'crm', action: ActionType.READ, resource: 'organization' },
          { module: 'crm', action: ActionType.WRITE, resource: 'organization' },
          { module: 'crm', action: ActionType.EDIT, resource: 'organization' },
          { module: 'crm', action: ActionType.DELETE, resource: 'organization' },
          { module: 'contacts', action: ActionType.READ, resource: 'organization' },
          { module: 'contacts', action: ActionType.WRITE, resource: 'organization' },
          { module: 'contacts', action: ActionType.EDIT, resource: 'organization' },
          { module: 'contacts', action: ActionType.DELETE, resource: 'organization' },
          { module: 'leads', action: ActionType.READ, resource: 'organization' },
          { module: 'leads', action: ActionType.WRITE, resource: 'organization' },
          { module: 'leads', action: ActionType.EDIT, resource: 'organization' },
          { module: 'deals', action: ActionType.READ, resource: 'organization' },
          { module: 'deals', action: ActionType.WRITE, resource: 'organization' },
          { module: 'deals', action: ActionType.EDIT, resource: 'organization' },
          { module: 'sales-management', action: ActionType.READ, resource: 'organization' },
          { module: 'sales-management', action: ActionType.WRITE, resource: 'organization' },
          { module: 'reports', action: ActionType.READ, resource: 'organization' },
          { module: 'dashboard', action: ActionType.READ, resource: 'organization' }
        ]
      },
      project_manager: {
        name: 'Project Manager Template',
        description: 'Project and task management access',
        permissions: [
          { module: 'projects-management', action: ActionType.READ, resource: 'organization' },
          { module: 'projects-management', action: ActionType.WRITE, resource: 'organization' },
          { module: 'projects-management', action: ActionType.EDIT, resource: 'organization' },
          { module: 'projects-management', action: ActionType.DELETE, resource: 'organization' },
          { module: 'tasks-management', action: ActionType.READ, resource: 'organization' },
          { module: 'tasks-management', action: ActionType.WRITE, resource: 'organization' },
          { module: 'tasks-management', action: ActionType.EDIT, resource: 'organization' },
          { module: 'tasks-management', action: ActionType.DELETE, resource: 'organization' },
          { module: 'users', action: ActionType.READ, resource: 'organization' },
          { module: 'reports', action: ActionType.READ, resource: 'organization' },
          { module: 'dashboard', action: ActionType.READ, resource: 'organization' }
        ]
      },
      sales_manager: {
        name: 'Sales Manager Template',
        description: 'Sales and inventory management',
        permissions: [
          { module: 'sales-management', action: ActionType.READ, resource: 'organization' },
          { module: 'sales-management', action: ActionType.WRITE, resource: 'organization' },
          { module: 'sales-management', action: ActionType.EDIT, resource: 'organization' },
          { module: 'inventory-management', action: ActionType.READ, resource: 'organization' },
          { module: 'inventory-management', action: ActionType.WRITE, resource: 'organization' },
          { module: 'inventory-management', action: ActionType.EDIT, resource: 'organization' },
          { module: 'crm', action: ActionType.READ, resource: 'organization' },
          { module: 'contacts', action: ActionType.READ, resource: 'organization' },
          { module: 'leads', action: ActionType.READ, resource: 'organization' },
          { module: 'deals', action: ActionType.READ, resource: 'organization' },
          { module: 'reports', action: ActionType.READ, resource: 'organization' },
          { module: 'dashboard', action: ActionType.READ, resource: 'organization' }
        ]
      },
      staff: {
        name: 'Staff Template',
        description: 'Basic staff access with limited permissions',
        permissions: [
          { module: 'users', action: ActionType.READ, resource: 'own' },
          { module: 'users', action: ActionType.EDIT, resource: 'own' },
          { module: 'organizations', action: ActionType.READ, resource: 'own' },
          { module: 'modules', action: ActionType.READ, resource: 'own' },
          { module: 'preferences', action: ActionType.READ, resource: 'own' },
          { module: 'preferences', action: ActionType.WRITE, resource: 'own' },
          { module: 'preferences', action: ActionType.EDIT, resource: 'own' },
          { module: 'messages', action: ActionType.READ, resource: 'own' },
          { module: 'messages', action: ActionType.WRITE, resource: 'own' },
          { module: 'dashboard', action: ActionType.READ, resource: 'own' },
          { module: 'tasks-management', action: ActionType.READ, resource: 'organization' }
        ]
      },
      viewer: {
        name: 'Viewer Template',
        description: 'Read-only access to organization data',
        permissions: [
          { module: 'users', action: ActionType.READ, resource: 'organization' },
          { module: 'organizations', action: ActionType.READ, resource: 'own' },
          { module: 'hr-management', action: ActionType.READ, resource: 'organization' },
          { module: 'employees', action: ActionType.READ, resource: 'organization' },
          { module: 'crm', action: ActionType.READ, resource: 'organization' },
          { module: 'contacts', action: ActionType.READ, resource: 'organization' },
          { module: 'leads', action: ActionType.READ, resource: 'organization' },
          { module: 'deals', action: ActionType.READ, resource: 'organization' },
          { module: 'projects-management', action: ActionType.READ, resource: 'organization' },
          { module: 'tasks-management', action: ActionType.READ, resource: 'organization' },
          { module: 'reports', action: ActionType.READ, resource: 'organization' },
          { module: 'dashboard', action: ActionType.READ, resource: 'organization' },
          { module: 'preferences', action: ActionType.READ, resource: 'own' },
          { module: 'preferences', action: ActionType.EDIT, resource: 'own' }
        ]
      },
      form_builder: {
        name: 'Form Builder Template',
        description: 'Form creation and management access',
        permissions: [
          { module: 'form-builder', action: ActionType.READ, resource: 'organization' },
          { module: 'form-builder', action: ActionType.WRITE, resource: 'organization' },
          { module: 'form-builder', action: ActionType.EDIT, resource: 'organization' },
          { module: 'form-builder', action: ActionType.DELETE, resource: 'organization' },
          { module: 'users', action: ActionType.READ, resource: 'organization' },
          { module: 'dashboard', action: ActionType.READ, resource: 'organization' }
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