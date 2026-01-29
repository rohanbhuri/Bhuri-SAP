import { ApiKeyService } from './api-key.service';
import { ApiKey } from '../entities/api-key.entity';
export declare class ApiKeyController {
    private readonly apiKeyService;
    constructor(apiKeyService: ApiKeyService);
    getAllApiKeys(req: any): Promise<ApiKey[]>;
    getApiKey(id: string): Promise<ApiKey>;
    createApiKey(req: any, data: {
        name: string;
        expiresAt: Date;
        allowedDomains?: string[];
    }): Promise<ApiKey>;
    updateApiKey(id: string, data: Partial<ApiKey>): Promise<ApiKey>;
    deleteApiKey(id: string): Promise<void>;
}
