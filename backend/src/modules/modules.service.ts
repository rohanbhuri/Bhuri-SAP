import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { ObjectId, MongoClient } from 'mongodb';
import { Module, ModulePermissionType } from '../entities/module.entity';
import { Organization } from '../entities/organization.entity';
import { ModuleRequest, ModuleRequestStatus } from '../entities/module-request.entity';
import { User } from '../entities/user.entity';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class ModulesService {
  constructor(
    @InjectRepository(Module)
    private moduleRepository: MongoRepository<Module>,
    @InjectRepository(Organization)
    private organizationRepository: MongoRepository<Organization>,
    @InjectRepository(ModuleRequest)
    private moduleRequestRepository: MongoRepository<ModuleRequest>,
    @InjectRepository(User)
    private userRepository: MongoRepository<User>,
    private notificationsService: NotificationsService,
  ) {}

  private getDbConfig() {
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

  async getActiveModulesForOrg(orgId: string, userId?: string) {
    const { uri, dbName } = this.getDbConfig();
    const client = new MongoClient(uri);
    
    try {
      await client.connect();
      const db = client.db(dbName);
      
      let activeIds = [];
      
      if (orgId && orgId !== 'undefined') {
        const org = await db.collection('organizations').findOne({ _id: new ObjectId(orgId) });
        activeIds = org?.activeModuleIds || [];
      }
      
      if (activeIds.length === 0 && userId) {
        const user = await db.collection('users').findOne({ _id: new ObjectId(userId) });
        activeIds = user?.activeModuleIds || [];
      }
      
      if (activeIds.length === 0) {
        return [];
      }
      
      const modules = await db.collection('modules').find({
        _id: { $in: activeIds }
      }).toArray();
      
      return modules.map(module => ({
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
    } finally {
      await client.close();
    }
  }

  async activateModule(moduleId: string, orgId: string, userId?: string) {
    const { uri, dbName } = this.getDbConfig();
    const client = new MongoClient(uri);
    
    try {
      await client.connect();
      const db = client.db(dbName);
      
      // For organization context
      if (orgId && orgId !== 'undefined' && orgId !== 'personal') {
        await db.collection('organizations').updateOne(
          { _id: new ObjectId(orgId) },
          { $addToSet: { activeModuleIds: new ObjectId(moduleId) } }
        );
        return { success: true };
      }
      
      // For personal context or when no valid orgId
      if (userId) {
        await db.collection('users').updateOne(
          { _id: new ObjectId(userId) },
          { $addToSet: { activeModuleIds: new ObjectId(moduleId) } }
        );
        return { success: true };
      }
      
      return { success: false, message: 'No organization or user found' };
    } finally {
      await client.close();
    }
  }

  async deactivateModule(moduleId: string, orgId: string, userId?: string) {
    const { uri, dbName } = this.getDbConfig();
    const client = new MongoClient(uri);
    
    try {
      await client.connect();
      const db = client.db(dbName);
      
      // For organization context
      if (orgId && orgId !== 'undefined' && orgId !== 'personal') {
        await db.collection('organizations').updateOne(
          { _id: new ObjectId(orgId) },
          { $pull: { activeModuleIds: new ObjectId(moduleId) } } as any
        );
        return { success: true };
      }
      
      // For personal context or when no valid orgId
      if (userId) {
        await db.collection('users').updateOne(
          { _id: new ObjectId(userId) },
          { $pull: { activeModuleIds: new ObjectId(moduleId) } } as any
        );
        return { success: true };
      }
      
      return { success: false, message: 'No organization or user found' };
    } finally {
      await client.close();
    }
  }

  async getAllAvailable(orgId: string, userId: string) {
    const { uri, dbName } = this.getDbConfig();
    const client = new MongoClient(uri);
    
    try {
      await client.connect();
      const db = client.db(dbName);
      const modules = await db.collection('modules').find({}).toArray();
      
      let activeIds = [];
      let isPersonalContext = false;
      
      // Check if this is personal context
      if (!orgId || orgId === 'undefined' || orgId === 'personal') {
        isPersonalContext = true;
        const user = await db.collection('users').findOne({ _id: new ObjectId(userId) });
        activeIds = user?.activeModuleIds || [];
        console.log('Personal context - User active modules:', activeIds.length);
      } else {
        // Organization context
        const org = await db.collection('organizations').findOne({ _id: new ObjectId(orgId) });
        activeIds = org?.activeModuleIds || [];
        console.log('Organization context - Org active modules:', activeIds.length);
      }
      
      // Get pending requests based on context
      let pendingRequestsQuery: any = { status: 'pending', userId: new ObjectId(userId) };
      
      if (!isPersonalContext && orgId && orgId !== 'undefined') {
        pendingRequestsQuery.organizationId = new ObjectId(orgId);
      } else if (isPersonalContext) {
        // For personal context, only get requests without organizationId or with null organizationId
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
      
    } finally {
      await client.close();
    }
  }

  async requestActivation(moduleId: string, userId: string, orgId: string, requesterRoles?: string[]) {
    const { uri, dbName } = this.getDbConfig();
    const client = new MongoClient(uri);
    
    try {
      await client.connect();
      const db = client.db(dbName);
      
      const module = await db.collection('modules').findOne({ _id: new ObjectId(moduleId) });
      if (!module) {
        throw new Error('Module not found');
      }
      
      // Check if user is super admin - they can auto-approve their own requests
      const isSuperAdmin = requesterRoles?.includes('super_admin');
      console.log('=== MODULE REQUEST ACTIVATION ===');
      console.log('Module permission type:', module.permissionType);
      console.log('Is super admin:', isSuperAdmin);
      console.log('Requester roles:', requesterRoles);
      console.log('Organization ID:', orgId);
      console.log('User ID:', userId);
      
      if (module.permissionType === 'public' || isSuperAdmin) {
        console.log('Auto-activating module (public or super admin)');
        // For personal context, pass 'personal' as orgId to ensure user activation
        const contextOrgId = orgId === 'personal' ? 'personal' : orgId;
        const activationResult = await this.activateModule(moduleId, contextOrgId, userId);
        console.log('Activation result:', activationResult);
        return {
          ...activationResult,
          approverType: isSuperAdmin ? 'auto_approved_super_admin' : 'public',
          message: isSuperAdmin ? 'Module activated automatically (Super Admin)' : 'Module activated (Public)'
        };
      }
      
      const query: any = {
        moduleId: new ObjectId(moduleId),
        userId: new ObjectId(userId),
        status: 'pending'
      };
      if (orgId && orgId !== 'undefined') {
        query.organizationId = new ObjectId(orgId);
      }
      const existingRequest = await db.collection('module-requests').findOne(query);
      
      if (existingRequest) {
        return { success: false, message: 'Request already pending' };
      }
      
      // Determine the appropriate approver for this request
      const approverInfo = await this.determineApprover(userId, orgId, moduleId);
      
      const requestDoc = {
        moduleId: new ObjectId(moduleId),
        userId: new ObjectId(userId),
        organizationId: orgId && orgId !== 'undefined' ? new ObjectId(orgId) : null,
        status: 'pending',
        requestedAt: new Date(),
        approverType: approverInfo.type, // 'org_admin', 'super_admin', 'system'
        approverId: approverInfo.approverId,
        priority: approverInfo.priority
      };
      
      await db.collection('module-requests').insertOne(requestDoc);
      
      // Notify appropriate approvers about the new module request
      await this.notifyApproversAboutModuleRequest(moduleId, userId, orgId, approverInfo);
      
      return { 
        success: true, 
        message: `Request submitted for approval to ${approverInfo.type}`,
        approverType: approverInfo.type,
        requiresApproval: true
      };
    } finally {
      await client.close();
    }
  }

  async getPendingRequests(orgId: string, isSuperAdmin: boolean = false, currentUserId?: string) {
    const { uri, dbName } = this.getDbConfig();
    const client = new MongoClient(uri);
    
    try {
      await client.connect();
      const db = client.db(dbName);
      
      let query: any = { status: 'pending' };
      
      // Super admins can see all requests
      if (isSuperAdmin) {
        // No additional filtering - show all pending requests
      } else {
        // Regular admins can only see requests for their organization
        if (orgId && orgId !== 'undefined') {
          query.organizationId = new ObjectId(orgId);
        } else {
          // If no organization, only show requests where they are the approver
          query.approverId = new ObjectId(currentUserId);
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
                { $eq: ['$approverId', new ObjectId(currentUserId)] },
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
    } finally {
      await client.close();
    }
  }

  async approveRequest(requestId: string, adminId: string) {
    const { uri, dbName } = this.getDbConfig();
    const client = new MongoClient(uri);
    
    try {
      await client.connect();
      const db = client.db(dbName);
      
      const request = await db.collection('module-requests').findOne({ _id: new ObjectId(requestId) });
      if (!request) {
        return { success: false, message: 'Request not found' };
      }
      
      // Check if the admin has permission to approve this request
      const admin = await db.collection('users').findOne({ _id: new ObjectId(adminId) });
      if (!admin) {
        return { success: false, message: 'Admin not found' };
      }
      
      // Get admin roles to check permissions
      const adminRoles = await db.collection('roles').find({
        _id: { $in: admin.roleIds }
      }).toArray();
      
      const isSuperAdmin = adminRoles.some(role => role.type === 'super_admin');
      const isOrgAdmin = adminRoles.some(role => role.type === 'admin');
      
      // Check if admin can approve this request
      const canApprove = isSuperAdmin || 
        (isOrgAdmin && request.organizationId && 
         admin.organizationIds?.some(orgId => orgId.toString() === request.organizationId.toString()));
      
      if (!canApprove) {
        return { success: false, message: 'Insufficient permissions to approve this request' };
      }
      
      // Activate the module
      if (request.organizationId) {
        await db.collection('organizations').updateOne(
          { _id: request.organizationId },
          { $addToSet: { activeModuleIds: request.moduleId } } as any,
          { upsert: true }
        );
      } else {
        await db.collection('users').updateOne(
          { _id: request.userId },
          { $addToSet: { activeModuleIds: request.moduleId } } as any
        );
      }
      
      // Update request status
      await db.collection('module-requests').updateOne(
        { _id: new ObjectId(requestId) },
        { 
          $set: { 
            status: 'approved', 
            processedAt: new Date(),
            processedBy: new ObjectId(adminId)
          } 
        } as any
      );
      
      // Create audit log
      await this.createAuditLog('module_request_approved', {
        requestId: requestId,
        moduleId: request.moduleId.toString(),
        userId: request.userId.toString(),
        organizationId: request.organizationId?.toString(),
        approvedBy: adminId,
        approverType: isSuperAdmin ? 'super_admin' : 'org_admin'
      });
      
      // Notify the requester about approval
      await this.notifyRequesterAboutApproval(request.userId, request.moduleId, true);
      
      return { success: true };
      
    } catch (error) {
      return { success: false, message: error.message };
    } finally {
      await client.close();
    }
  }

  async rejectRequest(requestId: string, adminId: string) {
    const { uri, dbName } = this.getDbConfig();
    const client = new MongoClient(uri);
    
    try {
      await client.connect();
      const db = client.db(dbName);
      
      const request = await db.collection('module-requests').findOne({ _id: new ObjectId(requestId) });
      if (!request) {
        return { success: false, message: 'Request not found' };
      }
      
      // Check if the admin has permission to reject this request
      const admin = await db.collection('users').findOne({ _id: new ObjectId(adminId) });
      if (!admin) {
        return { success: false, message: 'Admin not found' };
      }
      
      // Get admin roles to check permissions
      const adminRoles = await db.collection('roles').find({
        _id: { $in: admin.roleIds }
      }).toArray();
      
      const isSuperAdmin = adminRoles.some(role => role.type === 'super_admin');
      const isOrgAdmin = adminRoles.some(role => role.type === 'admin');
      
      // Check if admin can reject this request
      const canReject = isSuperAdmin || 
        (isOrgAdmin && request.organizationId && 
         admin.organizationIds?.some(orgId => orgId.toString() === request.organizationId.toString()));
      
      if (!canReject) {
        return { success: false, message: 'Insufficient permissions to reject this request' };
      }
      
      await db.collection('module-requests').updateOne(
        { _id: new ObjectId(requestId) },
        { 
          $set: {
            status: 'rejected',
            processedAt: new Date(),
            processedBy: new ObjectId(adminId)
          }
        } as any
      );
      
      // Create audit log
      await this.createAuditLog('module_request_rejected', {
        requestId: requestId,
        moduleId: request.moduleId.toString(),
        userId: request.userId.toString(),
        organizationId: request.organizationId?.toString(),
        rejectedBy: adminId,
        approverType: isSuperAdmin ? 'super_admin' : 'org_admin'
      });
      
      // Notify the requester about rejection
      await this.notifyRequesterAboutApproval(request.userId, request.moduleId, false);
      
      return { success: true };
    } finally {
      await client.close();
    }
  }

  async getPersonalModules(userId: string) {
    const { uri, dbName } = this.getDbConfig();
    const client = new MongoClient(uri);
    
    try {
      await client.connect();
      const db = client.db(dbName);
      
      const user = await db.collection('users').findOne({ _id: new ObjectId(userId) });
      const activeIds = user?.activeModuleIds || [];
      
      if (activeIds.length === 0) {
        return [];
      }
      
      const modules = await db.collection('modules').find({
        _id: { $in: activeIds }
      }).toArray();
      
      return modules.map(module => ({
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
    } finally {
      await client.close();
    }
  }

  private async determineApprover(userId: string, orgId: string, moduleId: string) {
    const { uri, dbName } = this.getDbConfig();
    const client = new MongoClient(uri);
    
    try {
      await client.connect();
      const db = client.db(dbName);
      
      // Get module details to check if it's a critical module
      const module = await db.collection('modules').findOne({ _id: new ObjectId(moduleId) });
      const isCriticalModule = module?.category === 'core' || module?.permissionType === 'require_permission';
      
      // If user has organization, check for org admins first
      if (orgId && orgId !== 'undefined') {
        const org = await db.collection('organizations').findOne({ _id: new ObjectId(orgId) });
        if (org) {
          // Find organization admins
          const adminRoles = await db.collection('roles').find({
            type: { $in: ['admin', 'super_admin'] }
          }).toArray();
          
          const adminRoleIds = adminRoles.map(role => role._id);
          const orgAdmins = await db.collection('users').find({
            roleIds: { $in: adminRoleIds },
            organizationIds: new ObjectId(orgId)
          }).toArray();
          
          if (orgAdmins.length > 0) {
            return {
              type: 'org_admin',
              approverId: orgAdmins[0]._id, // Primary org admin
              priority: isCriticalModule ? 'high' : 'normal'
            };
          }
        }
      }
      
      // Fallback to super admins for critical modules or when no org admin
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
            approverId: superAdmins[0]._id, // Primary super admin
            priority: 'high'
          };
        }
      }
      
      // System fallback
      return {
        type: 'system',
        approverId: null,
        priority: 'normal'
      };
    } finally {
      await client.close();
    }
  }

  private async notifyApproversAboutModuleRequest(moduleId: string, userId: string, orgId: string, approverInfo: any) {
    const { uri, dbName } = this.getDbConfig();
    const client = new MongoClient(uri);
    
    try {
      await client.connect();
      const db = client.db(dbName);
      
      // Get module and user details
      const module = await db.collection('modules').findOne({ _id: new ObjectId(moduleId) });
      const user = await db.collection('users').findOne({ _id: new ObjectId(userId) });
      
      if (!module || !user) return;
      
      let approvers = [];
      
      // Determine who to notify based on approver type
      switch (approverInfo.type) {
        case 'org_admin':
          if (orgId && orgId !== 'undefined') {
            const adminRoles = await db.collection('roles').find({
              type: { $in: ['admin', 'super_admin'] }
            }).toArray();
            
            const adminRoleIds = adminRoles.map(role => role._id);
            approvers = await db.collection('users').find({
              roleIds: { $in: adminRoleIds },
              organizationIds: new ObjectId(orgId)
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
          // Notify all super admins as system fallback
          const systemAdminRoles = await db.collection('roles').find({
            type: 'super_admin'
          }).toArray();
          
          const systemAdminRoleIds = systemAdminRoles.map(role => role._id);
          approvers = await db.collection('users').find({
            roleIds: { $in: systemAdminRoleIds }
          }).toArray();
          break;
      }
      
      // Send notification to each approver
      for (const approver of approvers) {
        const notificationTitle = approverInfo.priority === 'high' 
          ? 'High Priority Module Request' 
          : 'New Module Request';
          
        const notificationMessage = approverInfo.type === 'super_admin'
          ? `${user.firstName || user.email} has requested access to ${module.displayName || module.name} (requires super admin approval)`
          : `${user.firstName || user.email} has requested access to ${module.displayName || module.name}`;
        
        await this.notificationsService.createNotification(
          approver._id,
          'system',
          notificationTitle,
          notificationMessage,
          {
            moduleId: new ObjectId(moduleId),
            requesterId: new ObjectId(userId),
            organizationId: orgId && orgId !== 'undefined' ? new ObjectId(orgId) : null,
            approverType: approverInfo.type,
            priority: approverInfo.priority
          }
        );
      }
    } catch (error) {
      console.error('Error notifying approvers about module request:', error);
    } finally {
      await client.close();
    }
  }

  private async createAuditLog(action: string, data: any) {
    const { uri, dbName } = this.getDbConfig();
    const client = new MongoClient(uri);
    
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
    } catch (error) {
      console.error('Error creating audit log:', error);
    } finally {
      await client.close();
    }
  }

  private async notifyRequesterAboutApproval(userId: ObjectId, moduleId: ObjectId, approved: boolean) {
    const { uri, dbName } = this.getDbConfig();
    const client = new MongoClient(uri);
    
    try {
      await client.connect();
      const db = client.db(dbName);
      
      const module = await db.collection('modules').findOne({ _id: moduleId });
      if (!module) return;
      
      const title = approved ? 'Module Request Approved' : 'Module Request Rejected';
      const message = approved 
        ? `Your request for ${module.displayName || module.name} has been approved. You can now access this module.`
        : `Your request for ${module.displayName || module.name} has been rejected. Please contact your administrator for more information.`;
      
      await this.notificationsService.createNotification(
        userId,
        'system',
        title,
        message,
        {
          moduleId: moduleId,
          approved: approved,
          moduleName: module.displayName || module.name
        }
      );
    } catch (error) {
      console.error('Error notifying requester about approval:', error);
    } finally {
      await client.close();
    }
  }
}