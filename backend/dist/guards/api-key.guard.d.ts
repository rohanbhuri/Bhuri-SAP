import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { MongoRepository } from 'typeorm';
import { ApiKey } from '../entities/api-key.entity';
export declare class ApiKeyGuard implements CanActivate {
    private reflector;
    private apiKeyRepository;
    constructor(reflector: Reflector, apiKeyRepository: MongoRepository<ApiKey>);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
