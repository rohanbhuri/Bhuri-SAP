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
      isAvailable: module.isAvailable,
      permissionType: module.permissionType,
      createdAt: module.createdAt
    }));
  }

  async getActiveModulesForOrg(orgId: string) {
    const org = await this.organizationRepository.findOne({
      where: { _id: new ObjectId(orgId) }
    });
    
    if (!org || !org.activeModuleIds) {
      return [];
    }
    
    const modules = await this.moduleRepository.find({
      where: { _id: { $in: org.activeModuleIds } }
    });
    
    return modules.map(module => ({
      id: module._id.toString(),
      name: module.name,
      displayName: module.displayName,
      description: module.description,
      isAvailable: module.isAvailable,
      permissionType: module.permissionType
    }));
  }

  async activateModule(moduleId: string, orgId: string) {
    const uri = process.env.MONGODB_URI || 'mongodb+srv://rohanbhuri:nokiaset@bhuri-db.zg9undw.mongodb.net/?retryWrites=true&w=majority&appName=bhuri-db';
    const client = new MongoClient(uri);
    
    try {
      await client.connect();
      const db = client.db('beaxrm');
      
      console.log('Activating module:', moduleId, 'for org:', orgId);
      
      // Handle undefined orgId by using the existing organization
      let targetOrgId = orgId;
      if (!orgId || orgId === 'undefined') {
        const existingOrg = await db.collection('organization').findOne({});
        if (existingOrg) {
          targetOrgId = existingOrg._id.toString();
          console.log('Using existing org:', targetOrgId);
        } else {
          console.error('No organization found');
          return { success: false, message: 'No organization found' };
        }
      }
      
      // Simple update without conflicting operations
      await db.collection('organization').updateOne(
        { _id: new ObjectId(targetOrgId) },
        { $addToSet: { activeModuleIds: new ObjectId(moduleId) } } as any
      );
      
      console.log('Module activated successfully');
      return { success: true };
    } finally {
      await client.close();
    }
  }

  async deactivateModule(moduleId: string, orgId: string) {
    const uri = process.env.MONGODB_URI || 'mongodb+srv://rohanbhuri:nokiaset@bhuri-db.zg9undw.mongodb.net/?retryWrites=true&w=majority&appName=bhuri-db';
    const client = new MongoClient(uri);
    
    try {
      await client.connect();
      const db = client.db('beaxrm');
      
      await db.collection('organization').updateOne(
        { _id: new ObjectId(orgId) },
        { $pull: { activeModuleIds: new ObjectId(moduleId) } } as any
      );
      
      return { success: true };
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
      const modules = await db.collection('module').find({}).toArray();
      console.log('Found modules:', modules.length);
      
      // Get organization's active modules - try multiple approaches
      let org = await db.collection('organization').findOne({ _id: new ObjectId(orgId) });
      
      if (!org) {
        // Try finding by any field that might match
        org = await db.collection('organization').findOne({});
        console.log('Found fallback org:', org?._id);
      }
      
      const activeIds = org?.activeModuleIds || [];
      console.log('Active module IDs for org:', activeIds.map(id => id.toString()));
      
      await client.close();
      
      const result = modules.map(module => ({
        id: module._id.toString(),
        name: module.name,
        displayName: module.displayName,
        description: module.description,
        isActive: activeIds.some(id => id.toString() === module._id.toString()),
        canActivate: true,
        permissionType: module.permissionType
      }));
      
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
      
      const module = await db.collection('module').findOne({ _id: new ObjectId(moduleId) });
      if (!module) {
        throw new Error('Module not found');
      }
      
      if (module.permissionType === 'public') {
        return this.activateModule(moduleId, orgId);
      }
      
      // Check for existing pending request
      const existingRequest = await db.collection('modulerequest').findOne({
        moduleId: new ObjectId(moduleId),
        userId: new ObjectId(userId),
        organizationId: new ObjectId(orgId),
        status: 'pending'
      });
      
      if (existingRequest) {
        return { success: false, message: 'Request already pending' };
      }
      
      // Create new request
      const requestDoc = {
        moduleId: new ObjectId(moduleId),
        userId: new ObjectId(userId),
        organizationId: new ObjectId(orgId),
        status: 'pending',
        requestedAt: new Date()
      };
      
      console.log('Creating request:', requestDoc);
      const result = await db.collection('modulerequest').insertOne(requestDoc);
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
      
      // Super admins see all pending requests, regular users see only their org's requests
      const query = isSuperAdmin ? { status: 'pending' } : { organizationId: new ObjectId(orgId), status: 'pending' };
      const requests = await db.collection('modulerequest').find(query).toArray();
      
      console.log('Found pending requests:', requests.length);
      return requests.map(req => ({
        _id: req._id.toString(),
        moduleId: req.moduleId.toString(),
        userId: req.userId.toString(),
        organizationId: req.organizationId.toString(),
        status: req.status,
        requestedAt: req.requestedAt
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
      
      const request = await db.collection('modulerequest').findOne({ _id: new ObjectId(requestId) });
      if (!request) {
        return { success: false, message: 'Request not found' };
      }
      
      // Add module to organization's activeModuleIds
      await db.collection('organization').updateOne(
        { _id: request.organizationId },
        { $addToSet: { activeModuleIds: request.moduleId } } as any,
        { upsert: true }
      );
      
      // Update request status
      await db.collection('modulerequest').updateOne(
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
      
      await db.collection('modulerequest').updateOne(
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
}