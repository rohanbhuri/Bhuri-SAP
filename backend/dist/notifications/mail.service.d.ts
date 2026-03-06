import { ConfigService } from '@nestjs/config';
import { MongoRepository } from 'typeorm';
import { User } from '../entities/user.entity';
export declare class MailService {
    private userRepo;
    private configService;
    private transporter;
    constructor(userRepo: MongoRepository<User>, configService: ConfigService);
    private getDefaultAdminEmails;
    private getActiveAdminEmails;
    private getEmailHeader;
    private getEmailFooter;
    sendContactUsNotification(data: {
        name: string;
        email: string;
        subject: string;
        message: string;
    }): Promise<{
        success: boolean;
        messageId?: string;
        error?: string;
    }>;
    sendCredentialRequestNotification(data: {
        companyName: string;
        contactPerson: string;
        email: string;
        phone: string;
    }): Promise<{
        success: boolean;
        messageId?: string;
        error?: string;
    }>;
    sendEnquiryNotification(data: {
        enquiryNumber: string;
        customerName: string;
        customerEmail: string;
        itemsCount: number;
        message?: string;
    }): Promise<{
        success: boolean;
        messageId?: string;
        error?: string;
    }>;
    sendPasswordResetEmail(email: string, firstName: string, resetUrl: string): Promise<{
        success: boolean;
        messageId?: string;
        error?: string;
    }>;
    private sendMail;
}
