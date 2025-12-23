import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CatalogueController } from './catalogue.controller';
import { CatalogueService } from './catalogue.service';
import { Product } from '../entities/product.entity';
import { Category } from '../entities/category.entity';
import { Collection } from '../entities/collection.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([Product, Category, Collection])
    ],
    controllers: [CatalogueController],
    providers: [CatalogueService],
    exports: [CatalogueService]
})
export class CatalogueModule { }
