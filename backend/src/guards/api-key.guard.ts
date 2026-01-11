import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { ApiKey } from '../entities/api-key.entity';

@Injectable()
export class ApiKeyGuard implements CanActivate {
    constructor(
        @InjectRepository(ApiKey)
        private apiKeyRepository: MongoRepository<ApiKey>,
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        
        // Check if JWT token exists (allow authenticated users)
        const authHeader = request.headers['authorization'];
        if (authHeader && authHeader.startsWith('Bearer ')) {
            return true; // Allow JWT authenticated requests
        }
        
        // Otherwise, require API key
        const token = request.headers['x-api-key'] || request.query.apiKey;

        if (!token) {
            throw new UnauthorizedException('API key is required');
        }

        const apiKey = await this.apiKeyRepository.findOne({ where: { token, isActive: true } });

        if (!apiKey) {
            throw new UnauthorizedException('Invalid API key');
        }

        if (new Date() > new Date(apiKey.expiresAt)) {
            throw new UnauthorizedException('API key has expired');
        }

        // Update usage stats
        await this.apiKeyRepository.update(apiKey._id, {
            usageCount: apiKey.usageCount + 1,
            lastUsedAt: new Date()
        });

        request.apiKey = apiKey;
        return true;
    }
}
