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
import { Enquiry } from '../entities/enquiry.entity';
import { User } from '../entities/user.entity';
import { Role } from '../entities/role.entity';
import { Permission } from '../entities/permission.entity';
import { TechnicalSheetDownload } from '../entities/technical-sheet-download.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([Product, Category, Collection, Designer, Enquiry, User, Role, Permission, TechnicalSheetDownload]),
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
