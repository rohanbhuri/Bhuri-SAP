import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { Quotation, QuotationStatus } from '../entities/quotation.entity';
import { EmailTemplate } from '../entities/email-template.entity';
import { Product } from '../entities/product.entity';
import { ObjectId } from 'mongodb';

@Injectable()
export class QuotationsService {
    constructor(
        @InjectRepository(Quotation)
        private quotationRepository: MongoRepository<Quotation>,
        @InjectRepository(EmailTemplate)
        private emailTemplateRepository: MongoRepository<EmailTemplate>,
        @InjectRepository(Product)
        private productRepository: MongoRepository<Product>,
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

    async createFromCart(cartItems: any[], clientData: any): Promise<Quotation> {
        const quotationItems = await Promise.all(
            cartItems.map(async (item) => {
                const product = await this.productRepository.findOneBy({ 
                    _id: new ObjectId(item.productId) 
                });
                return {
                    productId: item.productId,
                    productName: product?.name || item.productName,
                    quantity: item.quantity,
                    unitPrice: product?.price || item.unitPrice,
                    total: item.quantity * (product?.price || item.unitPrice),
                    description: item.specifications
                };
            })
        );

        const subtotal = quotationItems.reduce((sum, item) => sum + item.total, 0);
        const taxTotal = subtotal * 0.18;
        const grandTotal = subtotal + taxTotal;

        const quotation = this.quotationRepository.create({
            quotationNumber: `Q-${Date.now()}`,
            clientName: clientData.name,
            clientEmail: clientData.email,
            items: quotationItems,
            subtotal,
            taxTotal,
            grandTotal,
            currency: 'USD',
            status: QuotationStatus.DRAFT,
            validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            createdAt: new Date()
        });

        return this.quotationRepository.save(quotation);
    }

    async sendQuotationEmail(id: string): Promise<void> {
        const quotation = await this.findOne(id);
        if (!quotation) throw new Error('Quotation not found');

        // Email sending logic would go here
        // For now, just update status to sent
        await this.quotationRepository.update(id, {
            status: QuotationStatus.SENT,
            updatedAt: new Date()
        });
    }
}
