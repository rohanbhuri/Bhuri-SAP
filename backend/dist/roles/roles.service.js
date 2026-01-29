"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RolesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const mongodb_1 = require("mongodb");
const role_entity_1 = require("../entities/role.entity");
const permission_entity_1 = require("../entities/permission.entity");
let RolesService = class RolesService {
    constructor(roleRepository, permissionRepository) {
        this.roleRepository = roleRepository;
        this.permissionRepository = permissionRepository;
    }
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
    async findOne(id) {
        const role = await this.roleRepository.findOne({ where: { _id: new mongodb_1.ObjectId(id) } });
        if (!role) {
            throw new common_1.NotFoundException('Role not found');
        }
        const permissions = await this.permissionRepository.find({
            where: { _id: { $in: role.permissionIds } }
        });
        return {
            ...role,
            permissions: permissions.map(p => ({ id: p._id, module: p.module, action: p.action, resource: p.resource }))
        };
    }
    async create(roleData) {
        const role = this.roleRepository.create({
            ...roleData,
            type: roleData.type || role_entity_1.RoleType.CUSTOM,
            permissionIds: roleData.permissionIds ? roleData.permissionIds.map(id => new mongodb_1.ObjectId(id)) : []
        });
        const savedRole = await this.roleRepository.save(role);
        return this.findOne(savedRole._id.toString());
    }
    async update(id, updateData) {
        const role = await this.roleRepository.findOne({ where: { _id: new mongodb_1.ObjectId(id) } });
        if (!role) {
            throw new common_1.NotFoundException('Role not found');
        }
        if (updateData.permissionIds) {
            updateData.permissionIds = updateData.permissionIds.map(id => new mongodb_1.ObjectId(id));
        }
        await this.roleRepository.update({ _id: new mongodb_1.ObjectId(id) }, updateData);
        return this.findOne(id);
    }
    async delete(id) {
        const result = await this.roleRepository.delete({ _id: new mongodb_1.ObjectId(id) });
        if (result.affected === 0) {
            throw new common_1.NotFoundException('Role not found');
        }
        return { message: 'Role deleted successfully' };
    }
    async assignPermission(roleId, permissionId) {
        const role = await this.roleRepository.findOne({ where: { _id: new mongodb_1.ObjectId(roleId) } });
        if (!role) {
            throw new common_1.NotFoundException('Role not found');
        }
        const permissionObjectId = new mongodb_1.ObjectId(permissionId);
        if (!role.permissionIds.some(id => id.equals(permissionObjectId))) {
            role.permissionIds.push(permissionObjectId);
            await this.roleRepository.save(role);
        }
        return this.findOne(roleId);
    }
    async removePermission(roleId, permissionId) {
        const role = await this.roleRepository.findOne({ where: { _id: new mongodb_1.ObjectId(roleId) } });
        if (!role) {
            throw new common_1.NotFoundException('Role not found');
        }
        role.permissionIds = role.permissionIds.filter(id => !id.equals(new mongodb_1.ObjectId(permissionId)));
        await this.roleRepository.save(role);
        return this.findOne(roleId);
    }
    async getAllPermissions() {
        return this.permissionRepository.find();
    }
    async createPermission(permissionData) {
        const permission = this.permissionRepository.create(permissionData);
        return this.permissionRepository.save(permission);
    }
    async updatePermission(id, permissionData) {
        const permission = await this.permissionRepository.findOne({ where: { _id: new mongodb_1.ObjectId(id) } });
        if (!permission) {
            throw new common_1.NotFoundException('Permission not found');
        }
        await this.permissionRepository.update({ _id: new mongodb_1.ObjectId(id) }, permissionData);
        return this.permissionRepository.findOne({ where: { _id: new mongodb_1.ObjectId(id) } });
    }
    async deletePermission(id) {
        const result = await this.permissionRepository.delete({ _id: new mongodb_1.ObjectId(id) });
        if (result.affected === 0) {
            throw new common_1.NotFoundException('Permission not found');
        }
        return { message: 'Permission deleted successfully' };
    }
    async getPermissionTemplates() {
        return {
            admin: {
                name: 'Admin Template',
                description: 'Full administrative access to organization',
                permissions: [
                    { module: 'users', action: permission_entity_1.ActionType.READ, resource: 'organization' },
                    { module: 'users', action: permission_entity_1.ActionType.CREATE, resource: 'organization' },
                    { module: 'users', action: permission_entity_1.ActionType.UPDATE, resource: 'organization' },
                    { module: 'roles', action: permission_entity_1.ActionType.READ, resource: 'organization' },
                    { module: 'organizations', action: permission_entity_1.ActionType.READ, resource: 'own' },
                    { module: 'organizations', action: permission_entity_1.ActionType.UPDATE, resource: 'own' },
                    { module: 'modules', action: permission_entity_1.ActionType.READ, resource: 'own' },
                    { module: 'dashboard', action: permission_entity_1.ActionType.READ, resource: 'organization' },
                    { module: 'reports', action: permission_entity_1.ActionType.READ, resource: 'organization' }
                ]
            },
            hr_manager: {
                name: 'HR Manager Template',
                description: 'Complete HR management access',
                permissions: [
                    { module: 'hr-management', action: permission_entity_1.ActionType.READ, resource: 'organization' },
                    { module: 'hr-management', action: permission_entity_1.ActionType.CREATE, resource: 'organization' },
                    { module: 'hr-management', action: permission_entity_1.ActionType.UPDATE, resource: 'organization' },
                    { module: 'hr-management', action: permission_entity_1.ActionType.DELETE, resource: 'organization' },
                    { module: 'employees', action: permission_entity_1.ActionType.READ, resource: 'organization' },
                    { module: 'employees', action: permission_entity_1.ActionType.CREATE, resource: 'organization' },
                    { module: 'employees', action: permission_entity_1.ActionType.UPDATE, resource: 'organization' },
                    { module: 'payroll', action: permission_entity_1.ActionType.READ, resource: 'organization' },
                    { module: 'payroll', action: permission_entity_1.ActionType.CREATE, resource: 'organization' },
                    { module: 'payroll', action: permission_entity_1.ActionType.UPDATE, resource: 'organization' },
                    { module: 'users', action: permission_entity_1.ActionType.READ, resource: 'organization' },
                    { module: 'reports', action: permission_entity_1.ActionType.READ, resource: 'organization' },
                    { module: 'dashboard', action: permission_entity_1.ActionType.READ, resource: 'organization' }
                ]
            },
            crm_manager: {
                name: 'CRM Manager Template',
                description: 'Complete CRM and sales management',
                permissions: [
                    { module: 'crm', action: permission_entity_1.ActionType.READ, resource: 'organization' },
                    { module: 'crm', action: permission_entity_1.ActionType.CREATE, resource: 'organization' },
                    { module: 'crm', action: permission_entity_1.ActionType.UPDATE, resource: 'organization' },
                    { module: 'crm', action: permission_entity_1.ActionType.DELETE, resource: 'organization' },
                    { module: 'contacts', action: permission_entity_1.ActionType.READ, resource: 'organization' },
                    { module: 'contacts', action: permission_entity_1.ActionType.CREATE, resource: 'organization' },
                    { module: 'contacts', action: permission_entity_1.ActionType.UPDATE, resource: 'organization' },
                    { module: 'contacts', action: permission_entity_1.ActionType.DELETE, resource: 'organization' },
                    { module: 'leads', action: permission_entity_1.ActionType.READ, resource: 'organization' },
                    { module: 'leads', action: permission_entity_1.ActionType.CREATE, resource: 'organization' },
                    { module: 'leads', action: permission_entity_1.ActionType.UPDATE, resource: 'organization' },
                    { module: 'deals', action: permission_entity_1.ActionType.READ, resource: 'organization' },
                    { module: 'deals', action: permission_entity_1.ActionType.CREATE, resource: 'organization' },
                    { module: 'deals', action: permission_entity_1.ActionType.UPDATE, resource: 'organization' },
                    { module: 'sales-management', action: permission_entity_1.ActionType.READ, resource: 'organization' },
                    { module: 'sales-management', action: permission_entity_1.ActionType.CREATE, resource: 'organization' },
                    { module: 'reports', action: permission_entity_1.ActionType.READ, resource: 'organization' },
                    { module: 'dashboard', action: permission_entity_1.ActionType.READ, resource: 'organization' }
                ]
            },
            project_manager: {
                name: 'Project Manager Template',
                description: 'Project and task management access',
                permissions: [
                    { module: 'projects-management', action: permission_entity_1.ActionType.READ, resource: 'organization' },
                    { module: 'projects-management', action: permission_entity_1.ActionType.CREATE, resource: 'organization' },
                    { module: 'projects-management', action: permission_entity_1.ActionType.UPDATE, resource: 'organization' },
                    { module: 'projects-management', action: permission_entity_1.ActionType.DELETE, resource: 'organization' },
                    { module: 'tasks-management', action: permission_entity_1.ActionType.READ, resource: 'organization' },
                    { module: 'tasks-management', action: permission_entity_1.ActionType.CREATE, resource: 'organization' },
                    { module: 'tasks-management', action: permission_entity_1.ActionType.UPDATE, resource: 'organization' },
                    { module: 'tasks-management', action: permission_entity_1.ActionType.DELETE, resource: 'organization' },
                    { module: 'users', action: permission_entity_1.ActionType.READ, resource: 'organization' },
                    { module: 'reports', action: permission_entity_1.ActionType.READ, resource: 'organization' },
                    { module: 'dashboard', action: permission_entity_1.ActionType.READ, resource: 'organization' }
                ]
            },
            sales_manager: {
                name: 'Sales Manager Template',
                description: 'Sales and inventory management',
                permissions: [
                    { module: 'sales-management', action: permission_entity_1.ActionType.READ, resource: 'organization' },
                    { module: 'sales-management', action: permission_entity_1.ActionType.CREATE, resource: 'organization' },
                    { module: 'sales-management', action: permission_entity_1.ActionType.UPDATE, resource: 'organization' },
                    { module: 'inventory-management', action: permission_entity_1.ActionType.READ, resource: 'organization' },
                    { module: 'inventory-management', action: permission_entity_1.ActionType.CREATE, resource: 'organization' },
                    { module: 'inventory-management', action: permission_entity_1.ActionType.UPDATE, resource: 'organization' },
                    { module: 'crm', action: permission_entity_1.ActionType.READ, resource: 'organization' },
                    { module: 'contacts', action: permission_entity_1.ActionType.READ, resource: 'organization' },
                    { module: 'leads', action: permission_entity_1.ActionType.READ, resource: 'organization' },
                    { module: 'deals', action: permission_entity_1.ActionType.READ, resource: 'organization' },
                    { module: 'reports', action: permission_entity_1.ActionType.READ, resource: 'organization' },
                    { module: 'dashboard', action: permission_entity_1.ActionType.READ, resource: 'organization' }
                ]
            },
            staff: {
                name: 'Staff Template',
                description: 'Basic staff access with limited permissions',
                permissions: [
                    { module: 'users', action: permission_entity_1.ActionType.READ, resource: 'own' },
                    { module: 'users', action: permission_entity_1.ActionType.UPDATE, resource: 'own' },
                    { module: 'organizations', action: permission_entity_1.ActionType.READ, resource: 'own' },
                    { module: 'modules', action: permission_entity_1.ActionType.READ, resource: 'own' },
                    { module: 'preferences', action: permission_entity_1.ActionType.READ, resource: 'own' },
                    { module: 'preferences', action: permission_entity_1.ActionType.CREATE, resource: 'own' },
                    { module: 'preferences', action: permission_entity_1.ActionType.UPDATE, resource: 'own' },
                    { module: 'messages', action: permission_entity_1.ActionType.READ, resource: 'own' },
                    { module: 'messages', action: permission_entity_1.ActionType.CREATE, resource: 'own' },
                    { module: 'dashboard', action: permission_entity_1.ActionType.READ, resource: 'own' },
                    { module: 'tasks-management', action: permission_entity_1.ActionType.READ, resource: 'organization' }
                ]
            },
            viewer: {
                name: 'Viewer Template',
                description: 'Read-only access to organization data',
                permissions: [
                    { module: 'users', action: permission_entity_1.ActionType.READ, resource: 'organization' },
                    { module: 'organizations', action: permission_entity_1.ActionType.READ, resource: 'own' },
                    { module: 'hr-management', action: permission_entity_1.ActionType.READ, resource: 'organization' },
                    { module: 'employees', action: permission_entity_1.ActionType.READ, resource: 'organization' },
                    { module: 'crm', action: permission_entity_1.ActionType.READ, resource: 'organization' },
                    { module: 'contacts', action: permission_entity_1.ActionType.READ, resource: 'organization' },
                    { module: 'leads', action: permission_entity_1.ActionType.READ, resource: 'organization' },
                    { module: 'deals', action: permission_entity_1.ActionType.READ, resource: 'organization' },
                    { module: 'projects-management', action: permission_entity_1.ActionType.READ, resource: 'organization' },
                    { module: 'tasks-management', action: permission_entity_1.ActionType.READ, resource: 'organization' },
                    { module: 'reports', action: permission_entity_1.ActionType.READ, resource: 'organization' },
                    { module: 'dashboard', action: permission_entity_1.ActionType.READ, resource: 'organization' },
                    { module: 'preferences', action: permission_entity_1.ActionType.READ, resource: 'own' },
                    { module: 'preferences', action: permission_entity_1.ActionType.UPDATE, resource: 'own' }
                ]
            },
            form_builder: {
                name: 'Form Builder Template',
                description: 'Form creation and management access',
                permissions: [
                    { module: 'form-builder', action: permission_entity_1.ActionType.READ, resource: 'organization' },
                    { module: 'form-builder', action: permission_entity_1.ActionType.CREATE, resource: 'organization' },
                    { module: 'form-builder', action: permission_entity_1.ActionType.UPDATE, resource: 'organization' },
                    { module: 'form-builder', action: permission_entity_1.ActionType.DELETE, resource: 'organization' },
                    { module: 'users', action: permission_entity_1.ActionType.READ, resource: 'organization' },
                    { module: 'dashboard', action: permission_entity_1.ActionType.READ, resource: 'organization' }
                ]
            }
        };
    }
    async applyPermissionTemplate(roleId, templateId) {
        const templates = await this.getPermissionTemplates();
        const template = templates[templateId];
        if (!template) {
            throw new common_1.NotFoundException('Template not found');
        }
        const role = await this.roleRepository.findOne({ where: { _id: new mongodb_1.ObjectId(roleId) } });
        if (!role) {
            throw new common_1.NotFoundException('Role not found');
        }
        const permissionIds = [];
        for (const permData of template.permissions) {
            let permission = await this.permissionRepository.findOne({
                where: { module: permData.module, action: permData.action, resource: permData.resource }
            });
            if (!permission) {
                permission = await this.createPermission(permData);
            }
            permissionIds.push(permission._id);
        }
        role.permissionIds = permissionIds;
        await this.roleRepository.save(role);
        return this.findOne(roleId);
    }
};
exports.RolesService = RolesService;
exports.RolesService = RolesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(role_entity_1.Role)),
    __param(1, (0, typeorm_1.InjectRepository)(permission_entity_1.Permission)),
    __metadata("design:paramtypes", [typeorm_2.MongoRepository,
        typeorm_2.MongoRepository])
], RolesService);
//# sourceMappingURL=roles.service.js.map