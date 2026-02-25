import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { Enquiry, EnquiryStatus } from '../entities/enquiry.entity';
import { Quotation, QuotationStatus } from '../entities/quotation.entity';
import { Product } from '../entities/product.entity';
import { ObjectId } from 'mongodb';
import { MailService } from '../notifications/mail.service';

@Injectable()
export class EnquiryService {
    constructor(
        @InjectRepository(Enquiry)
        private enquiryRepository: MongoRepository<Enquiry>,
        @InjectRepository(Quotation)
        private quotationRepository: MongoRepository<Quotation>,
        @InjectRepository(Product)
        private productRepository: MongoRepository<Product>,
        private mailService: MailService,
    ) {}

    async createEnquiry(data: Partial<Enquiry>): Promise<Enquiry> {
        const enquiry = this.enquiryRepository.create({
            ...data,
            enquiryNumber: `ENQ-${Date.now()}`,
            createdAt: new Date()
        });
        const savedEnquiry = await this.enquiryRepository.save(enquiry);

        // Send email notification to admins
        const emailResult = await this.mailService.sendEnquiryNotification({
            enquiryNumber: savedEnquiry.enquiryNumber,
            customerName: savedEnquiry.customerName,
            customerEmail: savedEnquiry.customerEmail,
            itemsCount: savedEnquiry.items?.length || 0,
            message: savedEnquiry.message
        });
        console.log('[EnquiryService] Email notification result:', emailResult);

        return savedEnquiry;
    }

    async findAll(): Promise<Enquiry[]> {
        return this.enquiryRepository.find({ order: { createdAt: -1 } });
    }

    async findOne(id: string): Promise<Enquiry> {
        return this.enquiryRepository.findOneBy({ _id: new ObjectId(id) });
    }

    async updateStatus(id: string, status: EnquiryStatus): Promise<Enquiry> {
        await this.enquiryRepository.update(id, { 
            status, 
            updatedAt: new Date() 
        });
        return this.findOne(id);
    }

    async generateQuotation(enquiryId: string, approvedBy: string): Promise<Quotation> {
        const enquiry = await this.findOne(enquiryId);
        if (!enquiry) throw new Error('Enquiry not found');

        const quotationItems = await Promise.all(
            enquiry.items.map(async (item) => {
                const product = await this.productRepository.findOneBy({ 
                    _id: new ObjectId(item.productId) 
                });
                return {
                    productId: item.productId,
                    productName: item.productName,
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

        const quotation = this.quotationRepository.create({
            quotationNumber: `Q-${Date.now()}`,
            clientName: enquiry.customerName,
            clientEmail: enquiry.customerEmail,
            items: quotationItems,
            subtotal,
            taxTotal,
            grandTotal,
            currency: 'INR',
            status: QuotationStatus.DRAFT,
            validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            createdBy: approvedBy,
            createdAt: new Date()
        });

        const savedQuotation = await this.quotationRepository.save(quotation);

        await this.enquiryRepository.update(enquiryId, {
            status: EnquiryStatus.QUOTED,
            quotationId: savedQuotation._id.toString(),
            updatedAt: new Date()
        });

        return savedQuotation;
    }
}