import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { ObjectId } from 'mongodb';
import { Role, RoleType } from '../entities/role.entity';
import { Permission } from '../entities/permission.entity';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private roleRepository: MongoRepository<Role>,
    @InjectRepository(Permission)
    private permissionRepository: MongoRepository<Permission>,
  ) {}

  async findAll() {
    return this.roleRepository.find();
  }

  async create(roleData: any) {
    const role = this.roleRepository.create({
      ...roleData,
      type: roleData.type || RoleType.CUSTOM,
    });
    return this.roleRepository.save(role);
  }

  async update(id: string, updateData: any) {
    await this.roleRepository.update(new ObjectId(id), updateData);
    return this.roleRepository.findOne({ where: { _id: new ObjectId(id) } });
  }

  async assignPermission(roleId: string, permissionId: string) {
    const role = await this.roleRepository.findOne({ where: { _id: new ObjectId(roleId) } });
    
    if (!role.permissionIds.includes(new ObjectId(permissionId))) {
      role.permissionIds.push(new ObjectId(permissionId));
    }
    
    return this.roleRepository.save(role);
  }

  async getPermissions() {
    return this.permissionRepository.find();
  }
}