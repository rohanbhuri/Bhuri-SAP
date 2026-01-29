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
exports.ModulesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const mongodb_1 = require("mongodb");
const module_entity_1 = require("../entities/module.entity");
const organization_entity_1 = require("../entities/organization.entity");
const module_request_entity_1 = require("../entities/module-request.entity");
const user_entity_1 = require("../entities/user.entity");
const notifications_service_1 = require("../notifications/notifications.service");
let ModulesService = class ModulesService {
    constructor(moduleRepository, organizationRepository, moduleRequestRepository, userRepository, notificationsService) {
        this.moduleRepository = moduleRepository;
        this.organizationRepository = organizationRepository;
        this.moduleRequestRepository = moduleRequestRepository;
        this.userRepository = userRepository;
        this.notificationsService = notificationsService;
    }
    getDbConfig() {
        const uri = process.env.MONGODB_URI;
        const dbName = uri.split('/')[3].split('?')[0];
        return { uri, dbName };
    }
    async findAll() {
        const modules = await this.moduleRepository.find();
        return modules.map(module => ({
            id: module._id.toString(),
            name: module.name,
            displayName: module.displayName,
            description: module.description,
            permissionType: module.permissionType,
            createdAt: module.createdAt
        }));
    }
    async getActiveModulesForOrg(orgId, userId) {
        const { uri, dbName } = this.getDbConfig();
        const client = new mongodb_1.MongoClient(uri);
        try {
            await client.connect();
            const db = client.db(dbName);
            let activeIds = [];
            if (orgId && orgId !== 'undefined') {
                const org = await db.collection('organizations').findOne({ _id: new mongodb_1.ObjectId(orgId) });
                activeIds = org?.activeModuleIds || [];
            }
            if (activeIds.length === 0 && userId) {
                const user = await db.collection('users').findOne({ _id: new mongodb_1.ObjectId(userId) });
                activeIds = user?.activeModuleIds || [];
            }
            if (activeIds.length === 0) {
                return [];
            }
            const modules = await db.collection('modules').find({
                _id: { $in: activeIds }
            }).toArray();
            const filteredModules = await this.filterModulesByPermissions(db, modules, userId);
            return filteredModules.map(module => ({
                id: module._id.toString(),
                name: module.name,
                displayName: module.displayName,
                description: module.description,
                isActive: true,
                permissionType: module.permissionType,
                category: module.category,
                icon: module.icon,
                color: module.color
            }));
        }
        finally {
            await client.close();
        }
    }
    async activateModule(moduleId, orgId, userId) {
        const { uri, dbName } = this.getDbConfig();
        const client = new mongodb_1.MongoClient(uri);
        try {
            await client.connect();
            const db = client.db(dbName);
            if (orgId && orgId !== 'undefined' && orgId !== 'personal') {
                await db.collection('organizations').updateOne({ _id: new mongodb_1.ObjectId(orgId) }, { $addToSet: { activeModuleIds: new mongodb_1.ObjectId(moduleId) } });
                return { success: true };
            }
            if (userId) {
                await db.collection('users').updateOne({ _id: new mongodb_1.ObjectId(userId) }, { $addToSet: { activeModuleIds: new mongodb_1.ObjectId(moduleId) } });
                return { success: true };
            }
            return { success: false, message: 'No organization or user found' };
        }
        finally {
            await client.close();
        }
    }
    async deactivateModule(moduleId, orgId, userId) {
        const { uri, dbName } = this.getDbConfig();
        const client = new mongodb_1.MongoClient(uri);
        try {
            await client.connect();
            const db = client.db(dbName);
            if (orgId && orgId !== 'undefined' && orgId !== 'personal') {
                await db.collection('organizations').updateOne({ _id: new mongodb_1.ObjectId(orgId) }, { $pull: { activeModuleIds: new mongodb_1.ObjectId(moduleId) } });
                return { success: true };
            }
            if (userId) {
                await db.collection('users').updateOne({ _id: new mongodb_1.ObjectId(userId) }, { $pull: { activeModuleIds: new mongodb_1.ObjectId(moduleId) } });
                return { success: true };
            }
            return { success: false, message: 'No organization or user found' };
        }
        finally {
            await client.close();
        }
    }
    async getAllAvailable(orgId, userId) {
        const { uri, dbName } = this.getDbConfig();
        const client = new mongodb_1.MongoClient(uri);
        try {
            await client.connect();
            const db = client.db(dbName);
            const modules = await db.collection('modules').find({}).toArray();
            let activeIds = [];
            let isPersonalContext = false;
            if (!orgId || orgId === 'undefined' || orgId === 'personal') {
                isPersonalContext = true;
                const user = await db.collection('users').findOne({ _id: new mongodb_1.ObjectId(userId) });
                activeIds = user?.activeModuleIds || [];
                console.log('Personal context - User active modules:', activeIds.length);
            }
            else {
                const org = await db.collection('organizations').findOne({ _id: new mongodb_1.ObjectId(orgId) });
                activeIds = org?.activeModuleIds || [];
                console.log('Organization context - Org active modules:', activeIds.length);
            }
            let pendingRequestsQuery = { status: 'pending', userId: new mongodb_1.ObjectId(userId) };
            if (!isPersonalContext && orgId && orgId !== 'undefined') {
                pendingRequestsQuery.organizationId = new mongodb_1.ObjectId(orgId);
            }
            else if (isPersonalContext) {
                pendingRequestsQuery.$or = [
                    { organizationId: { $exists: false } },
                    { organizationId: null }
                ];
            }
            const pendingRequests = await db.collection('module-requests').find(pendingRequestsQuery).toArray();
            const pendingModuleIds = pendingRequests.map(req => req.moduleId.toString());
            const result = modules.map(module => {
                const isActive = activeIds.some(id => id.toString() === module._id.toString());
                const isPending = pendingModuleIds.includes(module._id.toString());
                return {
                    id: module._id.toString(),
                    name: module.name,
                    displayName: module.displayName,
                    description: module.description,
                    isActive,
                    canActivate: !isActive && !isPending,
                    isPending,
                    permissionType: module.permissionType,
                    category: module.category,
                    icon: module.icon,
                    color: module.color
                };
            });
            console.log('Returning modules with active count:', result.filter(m => m.isActive).length);
            return result;
        }
        finally {
            await client.close();
        }
    }
    async requestActivation(moduleId, userId, orgId, requesterRoles) {
        const { uri, dbName } = this.getDbConfig();
        const client = new mongodb_1.MongoClient(uri);
        try {
            await client.connect();
            const db = client.db(dbName);
            const module = await db.collection('modules').findOne({ _id: new mongodb_1.ObjectId(moduleId) });
            if (!module) {
                throw new Error('Module not found');
            }
            const isSuperAdmin = requesterRoles?.includes('super_admin');
            console.log('=== MODULE REQUEST ACTIVATION ===');
            console.log('Module permission type:', module.permissionType);
            console.log('Is super admin:', isSuperAdmin);
            console.log('Requester roles:', requesterRoles);
            console.log('Organization ID:', orgId);
            console.log('User ID:', userId);
            if (module.permissionType === 'public' || isSuperAdmin) {
                console.log('Auto-activating module (public or super admin)');
                const contextOrgId = orgId === 'personal' ? 'personal' : orgId;
                const activationResult = await this.activateModule(moduleId, contextOrgId, userId);
                console.log('Activation result:', activationResult);
                return {
                    ...activationResult,
                    approverType: isSuperAdmin ? 'auto_approved_super_admin' : 'public',
                    message: isSuperAdmin ? 'Module activated automatically (Super Admin)' : 'Module activated (Public)'
                };
            }
            const query = {
                moduleId: new mongodb_1.ObjectId(moduleId),
                userId: new mongodb_1.ObjectId(userId),
                status: 'pending'
            };
            if (orgId && orgId !== 'undefined') {
                query.organizationId = new mongodb_1.ObjectId(orgId);
            }
            const existingRequest = await db.collection('module-requests').findOne(query);
            if (existingRequest) {
                return { success: false, message: 'Request already pending' };
            }
            const approverInfo = await this.determineApprover(userId, orgId, moduleId);
            const requestDoc = {
                moduleId: new mongodb_1.ObjectId(moduleId),
                userId: new mongodb_1.ObjectId(userId),
                organizationId: orgId && orgId !== 'undefined' ? new mongodb_1.ObjectId(orgId) : null,
                status: 'pending',
                requestedAt: new Date(),
                approverType: approverInfo.type,
                approverId: approverInfo.approverId,
                priority: approverInfo.priority
            };
            const result = await db.collection('module-requests').insertOne(requestDoc);
            const requestId = result.insertedId;
            await this.notifyApproversAboutModuleRequest(moduleId, userId, orgId, approverInfo, requestId);
            return {
                success: true,
                message: `Request submitted for approval to ${approverInfo.type}`,
                approverType: approverInfo.type,
                requiresApproval: true
            };
        }
        finally {
            await client.close();
        }
    }
    async getPendingRequests(orgId, isSuperAdmin = false, currentUserId, status = 'pending') {
        const { uri, dbName } = this.getDbConfig();
        const client = new mongodb_1.MongoClient(uri);
        try {
            await client.connect();
            const db = client.db(dbName);
            let query = { status };
            if (isSuperAdmin) {
            }
            else {
                if (orgId && orgId !== 'undefined') {
                    query.organizationId = new mongodb_1.ObjectId(orgId);
                }
                else if (currentUserId) {
                    query.approverId = new mongodb_1.ObjectId(currentUserId);
                }
            }
            const requests = await db.collection('module-requests').aggregate([
                { $match: query },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'userId',
                        foreignField: '_id',
                        as: 'user'
                    }
                },
                {
                    $lookup: {
                        from: 'modules',
                        localField: 'moduleId',
                        foreignField: '_id',
                        as: 'module'
                    }
                },
                { $unwind: '$user' },
                { $unwind: '$module' },
                {
                    $addFields: {
                        canApprove: {
                            $or: [
                                { $eq: ['$approverId', new mongodb_1.ObjectId(currentUserId)] },
                                { $eq: ['$approverType', 'org_admin'] },
                                { $eq: ['$approverType', 'super_admin'] }
                            ]
                        }
                    }
                }
            ]).toArray();
            return requests.map(req => ({
                _id: req._id.toString(),
                moduleId: req.moduleId.toString(),
                userId: req.userId.toString(),
                organizationId: req.organizationId?.toString() || null,
                status: req.status,
                requestedAt: req.requestedAt,
                userName: req.user.name || req.user.email,
                moduleName: req.module.displayName || req.module.name,
                approverType: req.approverType || 'unknown',
                priority: req.priority || 'normal',
                canApprove: req.canApprove
            }));
        }
        finally {
            await client.close();
        }
    }
    async approveRequest(requestId, adminId) {
        const { uri, dbName } = this.getDbConfig();
        const client = new mongodb_1.MongoClient(uri);
        try {
            await client.connect();
            const db = client.db(dbName);
            const request = await db.collection('module-requests').findOne({ _id: new mongodb_1.ObjectId(requestId) });
            if (!request) {
                return { success: false, message: 'Request not found' };
            }
            const admin = await db.collection('users').findOne({ _id: new mongodb_1.ObjectId(adminId) });
            if (!admin) {
                return { success: false, message: 'Admin not found' };
            }
            const adminRoles = await db.collection('roles').find({
                _id: { $in: admin.roleIds }
            }).toArray();
            const isSuperAdmin = adminRoles.some(role => role.type === 'super_admin');
            const isOrgAdmin = adminRoles.some(role => role.type === 'admin');
            const canApprove = isSuperAdmin ||
                (isOrgAdmin && request.organizationId &&
                    admin.organizationIds?.some(orgId => orgId.toString() === request.organizationId.toString()));
            if (!canApprove) {
                return { success: false, message: 'Insufficient permissions to approve this request' };
            }
            if (request.organizationId) {
                await db.collection('organizations').updateOne({ _id: request.organizationId }, { $addToSet: { activeModuleIds: request.moduleId } }, { upsert: true });
            }
            else {
                await db.collection('users').updateOne({ _id: request.userId }, { $addToSet: { activeModuleIds: request.moduleId } });
            }
            await db.collection('module-requests').updateOne({ _id: new mongodb_1.ObjectId(requestId) }, {
                $set: {
                    status: 'approved',
                    processedAt: new Date(),
                    processedBy: new mongodb_1.ObjectId(adminId)
                }
            });
            await this.createAuditLog('module_request_approved', {
                requestId: requestId,
                moduleId: request.moduleId.toString(),
                userId: request.userId.toString(),
                organizationId: request.organizationId?.toString(),
                approvedBy: adminId,
                approverType: isSuperAdmin ? 'super_admin' : 'org_admin'
            });
            await this.notifyRequesterAboutApproval(request.userId, request.moduleId, true);
            return { success: true };
        }
        catch (error) {
            return { success: false, message: error.message };
        }
        finally {
            await client.close();
        }
    }
    async rejectRequest(requestId, adminId) {
        const { uri, dbName } = this.getDbConfig();
        const client = new mongodb_1.MongoClient(uri);
        try {
            await client.connect();
            const db = client.db(dbName);
            const request = await db.collection('module-requests').findOne({ _id: new mongodb_1.ObjectId(requestId) });
            if (!request) {
                return { success: false, message: 'Request not found' };
            }
            const admin = await db.collection('users').findOne({ _id: new mongodb_1.ObjectId(adminId) });
            if (!admin) {
                return { success: false, message: 'Admin not found' };
            }
            const adminRoles = await db.collection('roles').find({
                _id: { $in: admin.roleIds }
            }).toArray();
            const isSuperAdmin = adminRoles.some(role => role.type === 'super_admin');
            const isOrgAdmin = adminRoles.some(role => role.type === 'admin');
            const canReject = isSuperAdmin ||
                (isOrgAdmin && request.organizationId &&
                    admin.organizationIds?.some(orgId => orgId.toString() === request.organizationId.toString()));
            if (!canReject) {
                return { success: false, message: 'Insufficient permissions to reject this request' };
            }
            await db.collection('module-requests').updateOne({ _id: new mongodb_1.ObjectId(requestId) }, {
                $set: {
                    status: 'rejected',
                    processedAt: new Date(),
                    processedBy: new mongodb_1.ObjectId(adminId)
                }
            });
            await this.createAuditLog('module_request_rejected', {
                requestId: requestId,
                moduleId: request.moduleId.toString(),
                userId: request.userId.toString(),
                organizationId: request.organizationId?.toString(),
                rejectedBy: adminId,
                approverType: isSuperAdmin ? 'super_admin' : 'org_admin'
            });
            await this.notifyRequesterAboutApproval(request.userId, request.moduleId, false);
            return { success: true };
        }
        finally {
            await client.close();
        }
    }
    async getPersonalModules(userId) {
        const { uri, dbName } = this.getDbConfig();
        const client = new mongodb_1.MongoClient(uri);
        try {
            await client.connect();
            const db = client.db(dbName);
            const user = await db.collection('users').findOne({ _id: new mongodb_1.ObjectId(userId) });
            const activeIds = user?.activeModuleIds || [];
            if (activeIds.length === 0) {
                return [];
            }
            const modules = await db.collection('modules').find({
                _id: { $in: activeIds }
            }).toArray();
            const filteredModules = await this.filterModulesByPermissions(db, modules, userId);
            return filteredModules.map(module => ({
                id: module._id.toString(),
                name: module.name,
                displayName: module.displayName,
                description: module.description,
                isActive: true,
                permissionType: module.permissionType,
                category: module.category,
                icon: module.icon,
                color: module.color
            }));
        }
        finally {
            await client.close();
        }
    }
    async determineApprover(userId, orgId, moduleId) {
        const { uri, dbName } = this.getDbConfig();
        const client = new mongodb_1.MongoClient(uri);
        try {
            await client.connect();
            const db = client.db(dbName);
            const module = await db.collection('modules').findOne({ _id: new mongodb_1.ObjectId(moduleId) });
            const isCriticalModule = module?.category === 'core' || module?.permissionType === 'require_permission';
            if (orgId && orgId !== 'undefined') {
                const org = await db.collection('organizations').findOne({ _id: new mongodb_1.ObjectId(orgId) });
                if (org) {
                    const adminRoles = await db.collection('roles').find({
                        type: { $in: ['admin', 'super_admin'] }
                    }).toArray();
                    const adminRoleIds = adminRoles.map(role => role._id);
                    const orgAdmins = await db.collection('users').find({
                        roleIds: { $in: adminRoleIds },
                        organizationIds: new mongodb_1.ObjectId(orgId)
                    }).toArray();
                    if (orgAdmins.length > 0) {
                        return {
                            type: 'org_admin',
                            approverId: orgAdmins[0]._id,
                            priority: isCriticalModule ? 'high' : 'normal'
                        };
                    }
                }
            }
            if (isCriticalModule || !orgId || orgId === 'undefined') {
                const superAdminRoles = await db.collection('roles').find({
                    type: 'super_admin'
                }).toArray();
                const superAdminRoleIds = superAdminRoles.map(role => role._id);
                const superAdmins = await db.collection('users').find({
                    roleIds: { $in: superAdminRoleIds }
                }).toArray();
                if (superAdmins.length > 0) {
                    return {
                        type: 'super_admin',
                        approverId: superAdmins[0]._id,
                        priority: 'high'
                    };
                }
            }
            return {
                type: 'system',
                approverId: null,
                priority: 'normal'
            };
        }
        finally {
            await client.close();
        }
    }
    async notifyApproversAboutModuleRequest(moduleId, userId, orgId, approverInfo, requestId) {
        const { uri, dbName } = this.getDbConfig();
        const client = new mongodb_1.MongoClient(uri);
        try {
            await client.connect();
            const db = client.db(dbName);
            const module = await db.collection('modules').findOne({ _id: new mongodb_1.ObjectId(moduleId) });
            const user = await db.collection('users').findOne({ _id: new mongodb_1.ObjectId(userId) });
            if (!module || !user)
                return;
            let approvers = [];
            switch (approverInfo.type) {
                case 'org_admin':
                    if (orgId && orgId !== 'undefined') {
                        const adminRoles = await db.collection('roles').find({
                            type: { $in: ['admin', 'super_admin'] }
                        }).toArray();
                        const adminRoleIds = adminRoles.map(role => role._id);
                        approvers = await db.collection('users').find({
                            roleIds: { $in: adminRoleIds },
                            organizationIds: new mongodb_1.ObjectId(orgId)
                        }).toArray();
                    }
                    break;
                case 'super_admin':
                    const superAdminRoles = await db.collection('roles').find({
                        type: 'super_admin'
                    }).toArray();
                    const superAdminRoleIds = superAdminRoles.map(role => role._id);
                    approvers = await db.collection('users').find({
                        roleIds: { $in: superAdminRoleIds }
                    }).toArray();
                    break;
                case 'system':
                    const systemAdminRoles = await db.collection('roles').find({
                        type: 'super_admin'
                    }).toArray();
                    const systemAdminRoleIds = systemAdminRoles.map(role => role._id);
                    approvers = await db.collection('users').find({
                        roleIds: { $in: systemAdminRoleIds }
                    }).toArray();
                    break;
            }
            for (const approver of approvers) {
                const notificationTitle = approverInfo.priority === 'high'
                    ? 'High Priority Module Request'
                    : 'New Module Request';
                const notificationMessage = approverInfo.type === 'super_admin'
                    ? `${user.firstName || user.email} has requested access to ${module.displayName || module.name} (requires super admin approval)`
                    : `${user.firstName || user.email} has requested access to ${module.displayName || module.name}`;
                await this.notificationsService.createNotification(approver._id, 'module_request', notificationTitle, notificationMessage, {
                    moduleId: new mongodb_1.ObjectId(moduleId),
                    requesterId: new mongodb_1.ObjectId(userId),
                    requestId: requestId,
                    organizationId: orgId && orgId !== 'undefined' ? new mongodb_1.ObjectId(orgId) : null,
                    approverType: approverInfo.type,
                    priority: approverInfo.priority
                });
            }
        }
        catch (error) {
            console.error('Error notifying approvers about module request:', error);
        }
        finally {
            await client.close();
        }
    }
    async createAuditLog(action, data) {
        const { uri, dbName } = this.getDbConfig();
        const client = new mongodb_1.MongoClient(uri);
        try {
            await client.connect();
            const db = client.db(dbName);
            const auditLog = {
                action,
                data,
                timestamp: new Date(),
                source: 'modules_service'
            };
            await db.collection('audit_logs').insertOne(auditLog);
        }
        catch (error) {
            console.error('Error creating audit log:', error);
        }
        finally {
            await client.close();
        }
    }
    async notifyRequesterAboutApproval(userId, moduleId, approved) {
        const { uri, dbName } = this.getDbConfig();
        const client = new mongodb_1.MongoClient(uri);
        try {
            await client.connect();
            const db = client.db(dbName);
            const module = await db.collection('modules').findOne({ _id: moduleId });
            if (!module)
                return;
            const title = approved ? 'Module Request Approved' : 'Module Request Rejected';
            const message = approved
                ? `Your request for ${module.displayName || module.name} has been approved. You can now access this module.`
                : `Your request for ${module.displayName || module.name} has been rejected. Please contact your administrator for more information.`;
            await this.notificationsService.createNotification(userId, approved ? 'module_approved' : 'module_rejected', title, message, {
                moduleId: moduleId,
                approved: approved,
                moduleName: module.displayName || module.name
            });
        }
        catch (error) {
            console.error('Error notifying requester about approval:', error);
        }
        finally {
            await client.close();
        }
    }
    async filterModulesByPermissions(db, modules, userId) {
        if (!userId || modules.length === 0) {
            return modules;
        }
        try {
            const user = await db.collection('users').findOne({ _id: new mongodb_1.ObjectId(userId) });
            if (!user || !user.roleIds || user.roleIds.length === 0) {
                return [];
            }
            const roles = await db.collection('roles').find({
                _id: { $in: user.roleIds }
            }).toArray();
            const isSuperAdmin = roles.some(role => role.type === 'super_admin');
            if (isSuperAdmin) {
                return modules;
            }
            const permissionIds = roles.reduce((acc, role) => {
                if (role.permissionIds && Array.isArray(role.permissionIds)) {
                    return [...acc, ...role.permissionIds];
                }
                return acc;
            }, []);
            if (permissionIds.length === 0) {
                return [];
            }
            const permissions = await db.collection('permissions').find({
                _id: { $in: permissionIds }
            }).toArray();
            return modules.filter(module => {
                if (module.permissionType === 'public') {
                    return true;
                }
                const hasPermission = permissions.some(perm => perm.module === module.name && perm.action === 'read');
                return hasPermission;
            });
        }
        catch (error) {
            console.error('Error filtering modules by permissions:', error);
            return [];
        }
    }
};
exports.ModulesService = ModulesService;
exports.ModulesService = ModulesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(module_entity_1.Module)),
    __param(1, (0, typeorm_1.InjectRepository)(organization_entity_1.Organization)),
    __param(2, (0, typeorm_1.InjectRepository)(module_request_entity_1.ModuleRequest)),
    __param(3, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.MongoRepository,
        typeorm_2.MongoRepository,
        typeorm_2.MongoRepository,
        typeorm_2.MongoRepository,
        notifications_service_1.NotificationsService])
], ModulesService);
//# sourceMappingURL=modules.service.js.map