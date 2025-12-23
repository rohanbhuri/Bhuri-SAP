import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { Quotation } from '../entities/quotation.entity';
import { EmailTemplate } from '../entities/email-template.entity';
import { ObjectId } from 'mongodb';

@Injectable()
export class QuotationsService {
    constructor(
        @InjectRepository(Quotation)
        private quotationRepository: MongoRepository<Quotation>,
        @InjectRepository(EmailTemplate)
        private emailTemplateRepository: MongoRepository<EmailTemplate>,
    ) { }

    // Quotations
    async findAll(): Promise<Quotation[]> {
        return this.quotationRepository.find();
    }

    async findOne(id: string): Promise<Quotation> {
        return this.quotationRepository.findOneBy({ _id: new ObjectId(id) });
    }

    async create(data: Partial<Quotation>): Promise<Quotation> {
        const quotation = this.quotationRepository.create(data);
        // TODO: Generate auto quotation number
        if (!quotation.quotationNumber) {
            quotation.quotationNumber = `Q-${Date.now()}`;
        }
        return this.quotationRepository.save(quotation);
    }

    async update(id: string, data: Partial<Quotation>): Promise<Quotation> {
        await this.quotationRepository.update(id, data);
        return this.findOne(id);
    }

    async delete(id: string): Promise<void> {
        await this.quotationRepository.delete(id);
    }

    // Email Templates
    async findAllTemplates(): Promise<EmailTemplate[]> {
        return this.emailTemplateRepository.find();
    }

    async createTemplate(data: Partial<EmailTemplate>): Promise<EmailTemplate> {
        const template = this.emailTemplateRepository.create(data);
        return this.emailTemplateRepository.save(template);
    }
}
