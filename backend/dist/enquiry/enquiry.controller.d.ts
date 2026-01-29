import { EnquiryService } from './enquiry.service';
import { Enquiry, EnquiryStatus } from '../entities/enquiry.entity';
export declare class EnquiryController {
    private readonly enquiryService;
    constructor(enquiryService: EnquiryService);
    create(createEnquiryDto: Partial<Enquiry>): Promise<Enquiry>;
    findAll(): Promise<Enquiry[]>;
    findOne(id: string): Promise<Enquiry>;
    updateStatus(id: string, status: EnquiryStatus): Promise<Enquiry>;
    generateQuotation(id: string, approvedBy: string): Promise<import("../entities/quotation.entity").Quotation>;
}
