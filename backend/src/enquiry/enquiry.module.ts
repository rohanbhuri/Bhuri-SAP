import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EnquiryController } from './enquiry.controller';
import { EnquiryService } from './enquiry.service';
import { Enquiry } from '../entities/enquiry.entity';
import { Quotation } from '../entities/quotation.entity';
import { Product } from '../entities/product.entity';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Enquiry, Quotation, Product]),
        NotificationsModule
    ],
    controllers: [EnquiryController],
    providers: [EnquiryService],
    exports: [EnquiryService]
})
export class EnquiryModule {}