import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuotationsController } from './quotations.controller';
import { QuotationsService } from './quotations.service';
import { Quotation } from '../entities/quotation.entity';
import { EmailTemplate } from '../entities/email-template.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([Quotation, EmailTemplate])
    ],
    controllers: [QuotationsController],
    providers: [QuotationsService],
    exports: [QuotationsService]
})
export class QuotationsModule { }
