import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from './jwt-auth.guard';
import { ApiKeyService } from './api-key.service';
import { ApiKey } from '../entities/api-key.entity';

@Controller('api-keys')
@UseGuards(JwtAuthGuard)
export class ApiKeyController {
    constructor(private readonly apiKeyService: ApiKeyService) { }

    @Get()
    async getAllApiKeys(@Request() req): Promise<ApiKey[]> {
        return this.apiKeyService.findAllByUser(req.user.userId);
    }

    @Get(':id')
    async getApiKey(@Param('id') id: string): Promise<ApiKey> {
        return this.apiKeyService.findOne(id);
    }

    @Post()
    async createApiKey(@Request() req, @Body() data: { name: string; expiresAt: Date; allowedDomains?: string[] }): Promise<ApiKey> {
        return this.apiKeyService.createApiKey(
            req.user.userId,
            req.user.organizationId,
            data.name,
            new Date(data.expiresAt),
            data.allowedDomains || []
        );
    }

    @Put(':id')
    async updateApiKey(@Param('id') id: string, @Body() data: Partial<ApiKey>): Promise<ApiKey> {
        return this.apiKeyService.updateApiKey(id, data);
    }

    @Delete(':id')
    async deleteApiKey(@Param('id') id: string): Promise<void> {
        return this.apiKeyService.deleteApiKey(id);
    }
}
