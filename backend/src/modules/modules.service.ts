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
    const uri = process.env.MONGODB_URI || 'mongodb+srv://rohanbhuri:nokiaset@bhuri-db.zg9undw.mongodb.net/?retryWrites=true&w=majority&appName=bhuri-db';
    const client = new MongoClient(uri);
    
    try {
      await client.connect();
      const db = client.db('beaxrm');
      
      let activeIds = [];
      
      // Try to get organization's active modules first
      if (orgId && orgId !== 'undefined') {
        const org = await db.collection('organizations').findOne({ _id: new ObjectId(orgId) });
        activeIds = org?.activeModuleIds || [];
      }
      
      // If no org modules and userId provided, check user's active modules
      if (activeIds.length === 0 && userId) {
        const user = await db.collection('users').findOne({ _id: new ObjectId(userId) });
        activeIds = user?.activeModuleIds || [];
      }
      
      // If no active modules, return empty array
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
    const uri = process.env.MONGODB_URI || 'mongodb+srv://rohanbhuri:nokiaset@bhuri-db.zg9undw.mongodb.net/?retryWrites=true&w=majority&appName=bhuri-db';
    const client = new MongoClient(uri);
    
    try {
      await client.connect();
      const db = client.db('beaxrm');
      
      console.log('Activating module:', moduleId, 'for org:', orgId, 'user:', userId);
      
      // Try to activate for organization first
      if (orgId && orgId !== 'undefined') {
        await db.collection('organizations').updateOne(
          { _id: new ObjectId(orgId) },
          { $addToSet: { activeModuleIds: new ObjectId(moduleId) } }
        );
        console.log('Module activated for organization');
        return { success: true };
      }
      
      // If no organization, activate for user
      if (userId) {
        await db.collection('users').updateOne(
          { _id: new ObjectId(userId) },
          { $addToSet: { activeModuleIds: new ObjectId(moduleId) } }
        );
        console.log('Module activated for user');
        return { success: true };
      }
      
      return { success: false, message: 'No organization or user found' };
    } finally {
      await client.close();
    }
  }

  async deactivateModule(moduleId: string, orgId: string, userId?: string) {
    const uri = process.env.MONGODB_URI || 'mongodb+srv://rohanbhuri:nokiaset@bhuri-db.zg9undw.mongodb.net/?retryWrites=true&w=majority&appName=bhuri-db';
    const client = new MongoClient(uri);
    
    try {
      await client.connect();
      const db = client.db('beaxrm');
      
      console.log('Deactivating module:', moduleId, 'for org:', orgId, 'user:', userId);
      
      // Try to deactivate for organization first
      if (orgId && orgId !== 'undefined') {
        await db.collection('organizations').updateOne(
          { _id: new ObjectId(orgId) },
          { $pull: { activeModuleIds: new ObjectId(moduleId) } } as any
        );
        console.log('Module deactivated for organization');
        return { success: true };
      }
      
      // If no organization, deactivate for user
      if (userId) {
        await db.collection('users').updateOne(
          { _id: new ObjectId(userId) },
          { $pull: { activeModuleIds: new ObjectId(moduleId) } } as any
        );
        console.log('Module deactivated for user');
        return { success: true };
      }
      
      return { success: false, message: 'No organization or user found' };
    } finally {
      await client.close();
    }
  }

  async getAllAvailable(orgId: string, userId: string) {
    console.log('getAllAvailable called with:', { orgId, userId });
    
    console.log('Searching for modules...');
    
    // Use direct MongoDB connection
    const uri = process.env.MONGODB_URI || 'mongodb+srv://rohanbhuri:nokiaset@bhuri-db.zg9undw.mongodb.net/?retryWrites=true&w=majority&appName=bhuri-db';
    const client = new MongoClient(uri);
    
    try {
      await client.connect();
      const db = client.db('beaxrm'); // Use 'beaxrm' database
      const modules = await db.collection('modules').find({}).toArray();
      console.log('Found modules:', modules.length);
      
      let activeIds = [];
      
      // Try to get organization's active modules first
      if (orgId && orgId !== 'undefined') {
        const org = await db.collection('organizations').findOne({ _id: new ObjectId(orgId) });
        activeIds = org?.activeModuleIds || [];
        console.log('Active module IDs for org:', activeIds.map(id => id.toString()));
      }
      
      // If no org modules and userId provided, check user's active modules
      if (activeIds.length === 0 && userId) {
        const user = await db.collection('users').findOne({ _id: new ObjectId(userId) });
        activeIds = user?.activeModuleIds || [];
        console.log('Active module IDs for user:', activeIds.map(id => id.toString()));
      }
      
      // Get pending requests for this user/org
      const orConditions: any[] = [{ userId: new ObjectId(userId) }];
      if (orgId && orgId !== 'undefined') {
        orConditions.push({ organizationId: new ObjectId(orgId) });
      }
      const pendingRequests = await db.collection('module-requests').find({
        $or: orConditions,
        status: 'pending'
      }).toArray();
      
      const pendingModuleIds = pendingRequests.map(req => req.moduleId.toString());
      
      await client.close();
      
      const result = modules.map(module => {
        // Check if module is in user/org activeModuleIds
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
      
      console.log('Returning modules:', result);
      return result;
      
    } catch (error) {
      console.error('MongoDB connection error:', error);
      await client.close();
      return [];
    }

  }

  async requestActivation(moduleId: string, userId: string, orgId: string) {
    const uri = process.env.MONGODB_URI || 'mongodb+srv://rohanbhuri:nokiaset@bhuri-db.zg9undw.mongodb.net/?retryWrites=true&w=majority&appName=bhuri-db';
    const client = new MongoClient(uri);
    
    try {
      await client.connect();
      const db = client.db('beaxrm');
      
      const module = await db.collection('modules').findOne({ _id: new ObjectId(moduleId) });
      if (!module) {
        throw new Error('Module not found');
      }
      
      if (module.permissionType === 'public') {
        return this.activateModule(moduleId, orgId, userId);
      }
      
      // Check for existing pending request
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
      
      // Create new request
      const requestDoc = {
        moduleId: new ObjectId(moduleId),
        userId: new ObjectId(userId),
        organizationId: orgId && orgId !== 'undefined' ? new ObjectId(orgId) : null,
        status: 'pending',
        requestedAt: new Date()
      };
      
      console.log('Creating request:', requestDoc);
      const result = await db.collection('module-requests').insertOne(requestDoc);
      console.log('Request created with ID:', result.insertedId);
      
      return { success: true, message: 'Request submitted for approval' };
    } finally {
      await client.close();
    }
  }

  async getPendingRequests(orgId: string, isSuperAdmin: boolean = false) {
    const uri = process.env.MONGODB_URI || 'mongodb+srv://rohanbhuri:nokiaset@bhuri-db.zg9undw.mongodb.net/?retryWrites=true&w=majority&appName=bhuri-db';
    const client = new MongoClient(uri);
    
    try {
      await client.connect();
      const db = client.db('beaxrm');
      
      console.log('Getting requests for orgId:', orgId, 'isSuperAdmin:', isSuperAdmin);
      
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
      
      console.log('Found pending requests:', requests.length);
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
    const uri = process.env.MONGODB_URI || 'mongodb+srv://rohanbhuri:nokiaset@bhuri-db.zg9undw.mongodb.net/?retryWrites=true&w=majority&appName=bhuri-db';
    const client = new MongoClient(uri);
    
    try {
      await client.connect();
      const db = client.db('beaxrm');
      
      console.log('Approving request:', requestId);
      
      const request = await db.collection('module-requests').findOne({ _id: new ObjectId(requestId) });
      if (!request) {
        return { success: false, message: 'Request not found' };
      }
      
      // Add module to organization's or user's activeModuleIds
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
        { $set: { status: 'approved', processedAt: new Date() } } as any
      );
      
      console.log('Request approved successfully');
      return { success: true };
      
    } catch (error) {
      console.error('Error approving request:', error);
      return { success: false, message: error.message };
    } finally {
      await client.close();
    }
  }

  async rejectRequest(requestId: string, adminId: string) {
    const uri = process.env.MONGODB_URI || 'mongodb+srv://rohanbhuri:nokiaset@bhuri-db.zg9undw.mongodb.net/?retryWrites=true&w=majority&appName=bhuri-db';
    const client = new MongoClient(uri);
    
    try {
      await client.connect();
      const db = client.db('beaxrm');
      
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
    const uri = process.env.MONGODB_URI || 'mongodb+srv://rohanbhuri:nokiaset@bhuri-db.zg9undw.mongodb.net/?retryWrites=true&w=majority&appName=bhuri-db';
    const client = new MongoClient(uri);
    
    try {
      await client.connect();
      const db = client.db('beaxrm');
      
      // Get user's personal active modules (without organization context)
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