import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { MongoRepository } from 'typeorm';
import { User } from '../entities/user.entity';
import { Role } from '../entities/role.entity';
import { Permission } from '../entities/permission.entity';
export declare class PermissionsGuard implements CanActivate {
    private reflector;
    private userRepository;
    private roleRepository;
    private permissionRepository;
    constructor(reflector: Reflector, userRepository: MongoRepository<User>, roleRepository: MongoRepository<Role>, permissionRepository: MongoRepository<Permission>);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
