import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuotationsController } from './quotations.controller';
import { QuotationsService } from './quotations.service';
import { Quotation } from '../entities/quotation.entity';
import { Enquiry } from '../entities/enquiry.entity';
import { EmailTemplate } from '../entities/email-template.entity';
import { Presentation } from '../entities/presentation.entity';
import { Product } from '../entities/product.entity';
import { Client } from '../entities/client.entity';
import { ApiKeyModule } from '../guards/api-key.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { User } from '../entities/user.entity';
import { Role } from '../entities/role.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([Quotation, Enquiry, EmailTemplate, Presentation, Product, Client, User, Role]),
        ApiKeyModule,
        NotificationsModule
    ],
    controllers: [QuotationsController],
    providers: [QuotationsService],
    exports: [QuotationsService]
})
export class QuotationsModule { }
