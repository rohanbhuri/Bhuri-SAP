import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { ObjectId, MongoClient } from 'mongodb';
import { Module, ModulePermissionType } from '../entities/module.entity';
import { Organization } from '../entities/organization.entity';
import { ModuleRequest, ModuleRequestStatus } from '../entities/module-request.entity';
import { User } from '../entities/user.entity';

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
      
      if (orgId && orgId !== 'undefined') {
        await db.collection('organizations').updateOne(
          { _id: new ObjectId(orgId) },
          { $addToSet: { activeModuleIds: new ObjectId(moduleId) } }
        );
        return { success: true };
      }
      
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
      
      if (orgId && orgId !== 'undefined') {
        await db.collection('organizations').updateOne(
          { _id: new ObjectId(orgId) },
          { $pull: { activeModuleIds: new ObjectId(moduleId) } } as any
        );
        return { success: true };
      }
      
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
      
      if (orgId && orgId !== 'undefined') {
        const org = await db.collection('organizations').findOne({ _id: new ObjectId(orgId) });
        activeIds = org?.activeModuleIds || [];
      }
      
      if (activeIds.length === 0 && userId) {
        const user = await db.collection('users').findOne({ _id: new ObjectId(userId) });
        activeIds = user?.activeModuleIds || [];
      }
      
      const orConditions: any[] = [{ userId: new ObjectId(userId) }];
      if (orgId && orgId !== 'undefined') {
        orConditions.push({ organizationId: new ObjectId(orgId) });
      }
      const pendingRequests = await db.collection('module-requests').find({
        $or: orConditions,
        status: 'pending'
      }).toArray();
      
      const pendingModuleIds = pendingRequests.map(req => req.moduleId.toString());
      
      return modules.map(module => {
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
      
    } finally {
      await client.close();
    }
  }

  async requestActivation(moduleId: string, userId: string, orgId: string) {
    const { uri, dbName } = this.getDbConfig();
    const client = new MongoClient(uri);
    
    try {
      await client.connect();
      const db = client.db(dbName);
      
      const module = await db.collection('modules').findOne({ _id: new ObjectId(moduleId) });
      if (!module) {
        throw new Error('Module not found');
      }
      
      if (module.permissionType === 'public') {
        return this.activateModule(moduleId, orgId, userId);
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
      
      const requestDoc = {
        moduleId: new ObjectId(moduleId),
        userId: new ObjectId(userId),
        organizationId: orgId && orgId !== 'undefined' ? new ObjectId(orgId) : null,
        status: 'pending',
        requestedAt: new Date()
      };
      
      await db.collection('module-requests').insertOne(requestDoc);
      return { success: true, message: 'Request submitted for approval' };
    } finally {
      await client.close();
    }
  }

  async getPendingRequests(orgId: string, isSuperAdmin: boolean = false) {
    const { uri, dbName } = this.getDbConfig();
    const client = new MongoClient(uri);
    
    try {
      await client.connect();
      const db = client.db(dbName);
      
      let query: any = { status: 'pending' };
      if (!isSuperAdmin && orgId && orgId !== 'undefined') {
        query.organizationId = new ObjectId(orgId);
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
        { $unwind: '$user' }
      ]).toArray();
      
      return requests.map(req => ({
        _id: req._id.toString(),
        moduleId: req.moduleId.toString(),
        userId: req.userId.toString(),
        organizationId: req.organizationId?.toString() || null,
        status: req.status,
        requestedAt: req.requestedAt,
        userName: req.user.name || req.user.email
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
      
      await db.collection('module-requests').updateOne(
        { _id: new ObjectId(requestId) },
        { $set: { status: 'approved', processedAt: new Date() } } as any
      );
      
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
}