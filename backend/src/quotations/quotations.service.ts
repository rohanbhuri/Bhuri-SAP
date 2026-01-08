import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { Quotation, QuotationStatus } from '../entities/quotation.entity';
import { Enquiry, EnquiryStatus } from '../entities/enquiry.entity';
import { EmailTemplate } from '../entities/email-template.entity';
import { Product } from '../entities/product.entity';
import { Client } from '../entities/client.entity';
import { ObjectId } from 'mongodb';

@Injectable()
export class QuotationsService {
    constructor(
        @InjectRepository(Quotation)
        private quotationRepository: MongoRepository<Quotation>,
        @InjectRepository(Enquiry)
        private enquiryRepository: MongoRepository<Enquiry>,
        @InjectRepository(EmailTemplate)
        private emailTemplateRepository: MongoRepository<EmailTemplate>,
        @InjectRepository(Product)
        private productRepository: MongoRepository<Product>,
        @InjectRepository(Client)
        private clientRepository: MongoRepository<Client>,
    ) { }

    // Quotations
    async findAll(organizationId: string): Promise<Quotation[]> {
        return this.quotationRepository.find({ where: { organizationId } });
    }

    async findOne(id: string): Promise<Quotation> {
        return this.quotationRepository.findOneBy({ _id: new ObjectId(id) });
    }

    async findByClient(clientId: string): Promise<Quotation[]> {
        return this.quotationRepository.find({ where: { clientId } });
    }

    async create(data: Partial<Quotation>, organizationId: string): Promise<Quotation> {
        const quotation = this.quotationRepository.create({
            ...data,
            organizationId,
            quotationNumber: `Q-${Date.now()}`,
            createdAt: new Date()
        });
        return this.quotationRepository.save(quotation);
    }

    async createFromEnquiry(enquiryId: string, userId: string): Promise<Quotation> {
        const enquiry = await this.enquiryRepository.findOneBy({ _id: new ObjectId(enquiryId) });
        if (!enquiry) throw new NotFoundException('Enquiry not found');

        const client = await this.clientRepository.findOneBy({ _id: new ObjectId(enquiry.clientId) });
        
        const quotationItems = await Promise.all(
            enquiry.items.map(async (item) => {
                const product = await this.productRepository.findOneBy({ 
                    _id: new ObjectId(item.productId) 
                });
                return {
                    productId: item.productId,
                    productName: product?.name || item.productName,
                    quantity: item.quantity,
                    unitPrice: product?.basePrice || item.unitPrice,
                    total: item.quantity * (product?.basePrice || item.unitPrice),
                    description: item.specifications
                };
            })
        );

        const subtotal = quotationItems.reduce((sum, item) => sum + item.total, 0);
        const taxTotal = subtotal * 0.18;
        const grandTotal = subtotal + taxTotal;

        const quotation = await this.quotationRepository.save({
            quotationNumber: `Q-${Date.now()}`,
            clientId: enquiry.clientId,
            clientName: client?.companyName || enquiry.customerName,
            clientEmail: client?.email || enquiry.customerEmail,
            enquiryId,
            items: quotationItems,
            subtotal,
            taxTotal,
            discountTotal: 0,
            grandTotal,
            currency: 'USD',
            status: QuotationStatus.DRAFT,
            validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            organizationId: enquiry.organizationId,
            createdBy: userId,
            createdAt: new Date()
        });

        await this.enquiryRepository.update(
            { _id: new ObjectId(enquiryId) },
            { quotationId: quotation._id.toString(), status: EnquiryStatus.QUOTED, updatedAt: new Date() }
        );

        return quotation;
    }

    async update(id: string, data: Partial<Quotation>): Promise<Quotation> {
        await this.quotationRepository.update({ _id: new ObjectId(id) }, { ...data, updatedAt: new Date() });
        return this.findOne(id);
    }

    async submitForApproval(id: string): Promise<Quotation> {
        return this.update(id, { status: QuotationStatus.PENDING_APPROVAL });
    }

    async approve(id: string, userId: string): Promise<Quotation> {
        return this.update(id, { 
            status: QuotationStatus.APPROVED, 
            approvedBy: userId,
            approvedAt: new Date()
        });
    }

    async sendQuotation(id: string, via: 'email' | 'whatsapp'): Promise<Quotation> {
        const quotation = await this.findOne(id);
        if (!quotation) throw new NotFoundException('Quotation not found');
        if (quotation.status !== QuotationStatus.APPROVED) {
            throw new Error('Only approved quotations can be sent');
        }

        // TODO: Implement actual email/whatsapp sending
        return this.update(id, { 
            status: QuotationStatus.SENT,
            sentAt: new Date(),
            sentVia: via
        });
    }

    async delete(id: string): Promise<void> {
        await this.quotationRepository.delete({ _id: new ObjectId(id) });
    }

    // Enquiries
    async findAllEnquiries(organizationId: string): Promise<Enquiry[]> {
        return this.enquiryRepository.find({ where: { organizationId } });
    }

    async findEnquiry(id: string): Promise<Enquiry> {
        return this.enquiryRepository.findOneBy({ _id: new ObjectId(id) });
    }

    async createEnquiry(data: Partial<Enquiry>, organizationId: string): Promise<Enquiry> {
        const enquiry = this.enquiryRepository.create({
            ...data,
            organizationId,
            enquiryNumber: `ENQ-${Date.now()}`,
            createdAt: new Date()
        });
        return this.enquiryRepository.save(enquiry);
    }

    async updateEnquiry(id: string, data: Partial<Enquiry>): Promise<Enquiry> {
        await this.enquiryRepository.update({ _id: new ObjectId(id) }, { ...data, updatedAt: new Date() });
        return this.findEnquiry(id);
    }

    async deleteEnquiry(id: string): Promise<void> {
        await this.enquiryRepository.delete({ _id: new ObjectId(id) });
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
