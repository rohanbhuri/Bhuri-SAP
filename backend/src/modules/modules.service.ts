import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { ObjectId } from 'mongodb';
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
    return this.moduleRepository.find();
  }

  async getActiveModulesForOrg(orgId: string) {
    const org = await this.organizationRepository.findOne({
      where: { _id: new ObjectId(orgId) }
    });
    
    if (!org || !org.activeModuleIds) {
      return [];
    }
    
    return this.moduleRepository.find({
      where: { _id: { $in: org.activeModuleIds } }
    });
  }

  async activateModule(moduleId: string, orgId: string) {
    const org = await this.organizationRepository.findOne({
      where: { _id: new ObjectId(orgId) }
    });

    if (!org) {
      throw new Error('Organization not found');
    }

    if (!org.activeModuleIds) {
      org.activeModuleIds = [];
    }

    if (!org.activeModuleIds.includes(new ObjectId(moduleId))) {
      org.activeModuleIds.push(new ObjectId(moduleId));
      await this.organizationRepository.save(org);
    }

    return { success: true };
  }

  async deactivateModule(moduleId: string, orgId: string) {
    const org = await this.organizationRepository.findOne({
      where: { _id: new ObjectId(orgId) }
    });

    if (!org) {
      throw new Error('Organization not found');
    }

    if (!org.activeModuleIds) {
      org.activeModuleIds = [];
    }

    org.activeModuleIds = org.activeModuleIds.filter(
      id => !id.equals(new ObjectId(moduleId))
    );
    
    await this.organizationRepository.save(org);
    return { success: true };
  }

  async getAllAvailable(orgId: string) {
    const org = await this.organizationRepository.findOne({
      where: { _id: new ObjectId(orgId) }
    });
    
    const activeIds = org?.activeModuleIds || [];
    const modules = await this.moduleRepository.find({ where: { isAvailable: true } });
    
    return modules.map(module => ({
      ...module,
      isActive: activeIds.some(id => id.equals(module._id)),
      canActivate: module.permissionType === ModulePermissionType.PUBLIC
    }));
  }

  async requestActivation(moduleId: string, userId: string, orgId: string) {
    const module = await this.moduleRepository.findOne({
      where: { _id: new ObjectId(moduleId) }
    });

    if (!module) {
      throw new Error('Module not found');
    }

    if (module.permissionType === ModulePermissionType.PUBLIC) {
      return this.activateModule(moduleId, orgId);
    }

    const existingRequest = await this.moduleRequestRepository.findOne({
      where: {
        moduleId: new ObjectId(moduleId),
        userId: new ObjectId(userId),
        organizationId: new ObjectId(orgId),
        status: ModuleRequestStatus.PENDING
      }
    });

    if (existingRequest) {
      throw new Error('Request already pending');
    }

    const request = new ModuleRequest();
    request.moduleId = new ObjectId(moduleId);
    request.userId = new ObjectId(userId);
    request.organizationId = new ObjectId(orgId);
    
    await this.moduleRequestRepository.save(request);
    return { success: true, message: 'Request submitted for approval' };
  }

  async getPendingRequests(orgId: string) {
    return this.moduleRequestRepository.find({
      where: {
        organizationId: new ObjectId(orgId),
        status: ModuleRequestStatus.PENDING
      }
    });
  }

  async approveRequest(requestId: string, adminId: string) {
    const request = await this.moduleRequestRepository.findOne({
      where: { _id: new ObjectId(requestId) }
    });

    if (!request) {
      throw new Error('Request not found');
    }

    await this.activateModule(request.moduleId.toString(), request.organizationId.toString());
    
    request.status = ModuleRequestStatus.APPROVED;
    request.processedAt = new Date();
    request.processedBy = new ObjectId(adminId);
    
    await this.moduleRequestRepository.save(request);
    return { success: true };
  }

  async rejectRequest(requestId: string, adminId: string) {
    const request = await this.moduleRequestRepository.findOne({
      where: { _id: new ObjectId(requestId) }
    });

    if (!request) {
      throw new Error('Request not found');
    }

    request.status = ModuleRequestStatus.REJECTED;
    request.processedAt = new Date();
    request.processedBy = new ObjectId(adminId);
    
    await this.moduleRequestRepository.save(request);
    return { success: true };
  }
}