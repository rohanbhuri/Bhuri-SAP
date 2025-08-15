import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { ObjectId } from 'mongodb';
import { Module } from '../entities/module.entity';
import { Organization } from '../entities/organization.entity';

@Injectable()
export class ModulesService {
  constructor(
    @InjectRepository(Module)
    private moduleRepository: MongoRepository<Module>,
    @InjectRepository(Organization)
    private organizationRepository: MongoRepository<Organization>,
  ) {}

  async findAll() {
    return this.moduleRepository.find();
  }

  async getActiveModulesForOrg(orgId: string) {
    const org = await this.organizationRepository.findOne({
      where: { _id: new ObjectId(orgId) }
    });
    
    return this.moduleRepository.find({
      where: { _id: { $in: org.activeModuleIds } }
    });
  }

  async activateModule(moduleId: string, orgId: string) {
    const org = await this.organizationRepository.findOne({
      where: { _id: new ObjectId(orgId) }
    });

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

    org.activeModuleIds = org.activeModuleIds.filter(
      id => !id.equals(new ObjectId(moduleId))
    );
    
    await this.organizationRepository.save(org);
    return { success: true };
  }
}