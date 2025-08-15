import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { ObjectId } from 'mongodb';
import { User } from '../entities/user.entity';
import { Role, RoleType } from '../entities/role.entity';
import { Permission } from '../entities/permission.entity';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @InjectRepository(User)
    private userRepository: MongoRepository<User>,
    @InjectRepository(Role)
    private roleRepository: MongoRepository<Role>,
    @InjectRepository(Permission)
    private permissionRepository: MongoRepository<Permission>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.get<string[]>('permissions', context.getHandler());
    const requiredRoles = this.reflector.get<RoleType[]>('roles', context.getHandler());
    
    if (!requiredPermissions && !requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      return false;
    }

    const fullUser = await this.userRepository.findOne({
      where: { _id: new ObjectId(user.userId) }
    });

    if (!fullUser) {
      return false;
    }

    const userRoles = await this.roleRepository.find({
      where: { _id: { $in: fullUser.roleIds } }
    });

    // Super admin can do everything
    if (userRoles.some(role => role.type === RoleType.SUPER_ADMIN)) {
      return true;
    }

    // Check role requirements
    if (requiredRoles && !userRoles.some(role => requiredRoles.includes(role.type))) {
      return false;
    }

    // Check permission requirements
    if (requiredPermissions) {
      const userPermissions = await this.permissionRepository.find({
        where: { _id: { $in: fullUser.permissionIds } }
      });
      const permissionStrings = userPermissions.map(p => `${p.module}:${p.action}`);
      return requiredPermissions.every(permission => permissionStrings.includes(permission));
    }

    return true;
  }
}