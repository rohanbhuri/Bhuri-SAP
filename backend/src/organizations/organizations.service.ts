import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { ObjectId } from 'mongodb';
import { Organization } from '../entities/organization.entity';
import { User } from '../entities/user.entity';
import { RoleType } from '../entities/role.entity';

@Injectable()
export class OrganizationsService {
  constructor(
    @InjectRepository(Organization)
    private organizationRepository: MongoRepository<Organization>,
    @InjectRepository(User)
    private userRepository: MongoRepository<User>,
  ) {}

  async findAll() {
    return this.organizationRepository.find();
  }

  async create(orgData: any) {
    const organization = this.organizationRepository.create(orgData);
    return this.organizationRepository.save(organization);
  }

  async update(id: string, updateData: any) {
    await this.organizationRepository.update(new ObjectId(id), updateData);
    return this.organizationRepository.findOne({ where: { _id: new ObjectId(id) } });
  }

  async delete(id: string) {
    return this.organizationRepository.delete(new ObjectId(id));
  }

  async findUserOrganizations(userId: string) {
    const user = await this.userRepository.findOne({
      where: { _id: new ObjectId(userId) }
    });
    
    if (!user || user.roleIds.length === 0) {
      return [];
    }

    const organizationIds = user.organizationId ? [user.organizationId] : [];
    
    return this.organizationRepository.find({
      where: { _id: { $in: organizationIds } }
    });
  }
}