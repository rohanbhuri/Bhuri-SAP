import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApiKeyController } from './api-key.controller';
import { ApiKeyService } from './api-key.service';
import { ApiKeyGuard } from './api-key.guard';
import { ApiKey } from '../entities/api-key.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
    imports: [TypeOrmModule.forFeature([ApiKey]), AuthModule],
    controllers: [ApiKeyController],
    providers: [ApiKeyService, ApiKeyGuard],
    exports: [ApiKeyService, ApiKeyGuard, TypeOrmModule]
})
export class ApiKeyModule { }
