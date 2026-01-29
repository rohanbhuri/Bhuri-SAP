import { MongoRepository } from 'typeorm';
import { Enquiry, EnquiryStatus } from '../entities/enquiry.entity';
import { Quotation } from '../entities/quotation.entity';
import { Product } from '../entities/product.entity';
import { MailService } from '../notifications/mail.service';
export declare class EnquiryService {
    private enquiryRepository;
    private quotationRepository;
    private productRepository;
    private mailService;
    constructor(enquiryRepository: MongoRepository<Enquiry>, quotationRepository: MongoRepository<Quotation>, productRepository: MongoRepository<Product>, mailService: MailService);
    createEnquiry(data: Partial<Enquiry>): Promise<Enquiry>;
    findAll(): Promise<Enquiry[]>;
    findOne(id: string): Promise<Enquiry>;
    updateStatus(id: string, status: EnquiryStatus): Promise<Enquiry>;
    generateQuotation(enquiryId: string, approvedBy: string): Promise<Quotation>;
}
