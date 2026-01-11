import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { ApiKey } from '../entities/api-key.entity';
import { ObjectId } from 'mongodb';
import * as crypto from 'crypto';

@Injectable()
export class ApiKeyService {
    constructor(
        @InjectRepository(ApiKey)
        private apiKeyRepository: MongoRepository<ApiKey>,
    ) { }

    async createApiKey(userId: string, organizationId: string, name: string, expiresAt: Date, allowedDomains: string[] = []): Promise<ApiKey> {
        const token = crypto.randomBytes(32).toString('hex');
        
        const apiKey = this.apiKeyRepository.create({
            name,
            token,
            userId,
            organizationId,
            expiresAt,
            allowedDomains,
            isActive: true,
            usageCount: 0,
            createdAt: new Date(),
            lastUsedAt: null
        });

        return this.apiKeyRepository.save(apiKey);
    }

    async findAllByUser(userId: string): Promise<ApiKey[]> {
        return this.apiKeyRepository.find({ where: { userId } });
    }

    async findOne(id: string): Promise<ApiKey> {
        return this.apiKeyRepository.findOneBy({ _id: new ObjectId(id) });
    }

    async updateApiKey(id: string, data: Partial<ApiKey>): Promise<ApiKey> {
        await this.apiKeyRepository.update(id, data);
        return this.findOne(id);
    }

    async deleteApiKey(id: string): Promise<void> {
        await this.apiKeyRepository.delete(id);
    }

    async validateToken(token: string): Promise<ApiKey | null> {
        const apiKey = await this.apiKeyRepository.findOne({ where: { token, isActive: true } });
        
        if (!apiKey || new Date() > new Date(apiKey.expiresAt)) {
            return null;
        }

        return apiKey;
    }
}
