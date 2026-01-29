import { QuotationsService } from './quotations.service';
import { Quotation } from '../entities/quotation.entity';
import { Enquiry } from '../entities/enquiry.entity';
import { EmailTemplate } from '../entities/email-template.entity';
import { Presentation } from '../entities/presentation.entity';
import { Response } from 'express';
export declare class QuotationsController {
    private readonly quotationsService;
    constructor(quotationsService: QuotationsService);
    getAllQuotations(req: any): Promise<Quotation[]>;
    getQuotationsByClient(clientId: string): Promise<Quotation[]>;
    getQuotation(id: string): Promise<Quotation>;
    createQuotation(data: Partial<Quotation>, req: any): Promise<Quotation>;
    createFromEnquiry(enquiryId: string, req: any): Promise<Quotation>;
    updateQuotation(id: string, data: Partial<Quotation>, req: any): Promise<Quotation>;
    submitForApproval(id: string): Promise<Quotation>;
    approveQuotation(id: string, req: any): Promise<Quotation>;
    sendQuotation(id: string, body: {
        via: 'email' | 'whatsapp';
    }): Promise<Quotation>;
    deleteQuotation(id: string, req: any): Promise<void>;
    createFromWebsiteCart(cartData: any, req: any): Promise<Enquiry>;
    getAllEnquiries(req: any): Promise<Enquiry[]>;
    getEnquiry(id: string): Promise<Enquiry>;
    createEnquiry(data: Partial<Enquiry>, req: any): Promise<Enquiry>;
    updateEnquiry(id: string, data: Partial<Enquiry>, req: any): Promise<Enquiry>;
    deleteEnquiry(id: string, req: any): Promise<void>;
    getAllTemplates(): Promise<EmailTemplate[]>;
    createTemplate(data: Partial<EmailTemplate>): Promise<EmailTemplate>;
    getAllPresentations(req: any): Promise<Presentation[]>;
    getPresentation(id: string): Promise<Presentation>;
    createPresentation(data: Partial<Presentation>, req: any): Promise<Presentation>;
    updatePresentation(id: string, data: Partial<Presentation>, req: any): Promise<Presentation>;
    markPresentationFinal(id: string): Promise<Presentation>;
    sendPresentationToClient(id: string): Promise<Presentation>;
    deletePresentation(id: string, req: any): Promise<void>;
    generatePresentation(id: string, res: Response): Promise<void>;
    convertPresentationToQuotation(id: string): Promise<any>;
    linkQuotationToPresentation(id: string, body: {
        quotationId: string;
    }): Promise<Presentation>;
    downloadQuotationExcel(id: string, res: Response): Promise<void>;
}
