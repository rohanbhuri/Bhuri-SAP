import { MongoRepository } from 'typeorm';
import { ApiKey } from '../entities/api-key.entity';
export declare class ApiKeyService {
    private apiKeyRepository;
    constructor(apiKeyRepository: MongoRepository<ApiKey>);
    createApiKey(userId: string, organizationId: string, name: string, expiresAt: Date, allowedDomains?: string[]): Promise<ApiKey>;
    findAllByUser(userId: string): Promise<ApiKey[]>;
    findOne(id: string): Promise<ApiKey>;
    updateApiKey(id: string, data: Partial<ApiKey>): Promise<ApiKey>;
    deleteApiKey(id: string): Promise<void>;
    validateToken(token: string): Promise<ApiKey | null>;
}
