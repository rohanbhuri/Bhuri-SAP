import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from '@nestjs/platform-express';
import { CatalogueController } from './catalogue.controller';
import { CatalogueService } from './catalogue.service';
import { Product } from '../entities/product.entity';
import { Category } from '../entities/category.entity';
import { Collection } from '../entities/collection.entity';
import { Designer } from '../entities/designer.entity';
import { ApiKeyModule } from '../guards/api-key.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Product, Category, Collection, Designer]),
        ApiKeyModule,
        MulterModule.register({
            dest: './uploads/products'
        })
    ],
    controllers: [CatalogueController],
    providers: [CatalogueService],
    exports: [CatalogueService]
})
export class CatalogueModule { }
