"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const nodemailer = require("nodemailer");
const user_entity_1 = require("../entities/user.entity");
let MailService = class MailService {
    constructor(userRepo, configService) {
        this.userRepo = userRepo;
        this.configService = configService;
        this.transporter = nodemailer.createTransport({
            host: this.configService.get('SMTP_HOST') || 'smtp.gmail.com',
            port: parseInt(this.configService.get('SMTP_PORT')) || 587,
            secure: this.configService.get('SMTP_SECURE') === 'true',
            auth: {
                user: this.configService.get('SMTP_USER') || '',
                pass: this.configService.get('SMTP_PASS') || '',
            },
        });
    }
    async getActiveAdminEmails() {
        const users = await this.userRepo.find({
            where: {
                enableEmailNotifications: true,
                isActive: true,
                isDeleted: { $ne: true }
            }
        });
        return users.map(u => u.email).filter(email => !!email);
    }
    getEmailHeader() {
        return `
      <div style="background-color: #f8f9fa; padding: 20px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <div style="background-color: #1a1a1a; padding: 30px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; letter-spacing: 2px; font-weight: 300;">RACCONTI</h1>
            <p style="color: #888; margin: 5px 0 0 0; font-size: 12px; text-transform: uppercase;">System Notification</p>
          </div>
          <div style="padding: 40px;">
    `;
    }
    getEmailFooter() {
        return `
          </div>
          <div style="background-color: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #eee;">
            <p style="margin: 0; color: #999; font-size: 12px;">&copy; ${new Date().getFullYear()} RACCONTI. All rights reserved.</p>
            <p style="margin: 5px 0 0 0; color: #bbb; font-size: 11px;">This is an automated system message, please do not reply.</p>
          </div>
        </div>
      </div>
    `;
    }
    async sendContactUsNotification(data) {
        const emails = await this.getActiveAdminEmails();
        if (emails.length === 0)
            return;
        const html = `
      ${this.getEmailHeader()}
      <h2 style="color: #1a1a1a; margin-top: 0;">New Contact Inquiry</h2>
      <p style="line-height: 1.6; color: #666;">A new message has been received from the website contact form.</p>
      
      <div style="background-color: #f9f9f9; padding: 20px; border-radius: 4px; margin: 20px 0;">
        <p style="margin: 5px 0;"><strong>From:</strong> ${data.name}</p>
        <p style="margin: 5px 0;"><strong>Email:</strong> ${data.email}</p>
        <p style="margin: 5px 0;"><strong>Subject:</strong> ${data.subject}</p>
        <div style="margin-top: 15px; border-top: 1px solid #eee; padding-top: 15px;">
          <strong>Message:</strong><br>
          <p style="font-style: italic; color: #444;">${data.message}</p>
        </div>
      </div>
      
      <div style="text-align: center; margin-top: 30px;">
        <a href="${this.configService.get('FRONTEND_URL')}/client-management/contact-us" style="background-color: #1a1a1a; color: #ffffff; padding: 12px 25px; text-decoration: none; border-radius: 4px; font-weight: 600; display: inline-block;">View in Dashboard</a>
      </div>
      ${this.getEmailFooter()}
    `;
        await this.sendMail(emails, `New Contact Inquiry: ${data.subject}`, html);
    }
    async sendCredentialRequestNotification(data) {
        const emails = await this.getActiveAdminEmails();
        if (emails.length === 0)
            return;
        const html = `
      ${this.getEmailHeader()}
      <h2 style="color: #1a1a1a; margin-top: 0;">Login Credential Request</h2>
      <p style="line-height: 1.6; color: #666;">A new client has requested login credentials for the portal.</p>
      
      <div style="background-color: #f9f9f9; padding: 20px; border-radius: 4px; margin: 20px 0;">
        <p style="margin: 5px 0;"><strong>Company:</strong> ${data.companyName}</p>
        <p style="margin: 5px 0;"><strong>Contact Person:</strong> ${data.contactPerson}</p>
        <p style="margin: 5px 0;"><strong>Email:</strong> ${data.email}</p>
        <p style="margin: 5px 0;"><strong>Phone:</strong> ${data.phone}</p>
      </div>
      
      <div style="text-align: center; margin-top: 30px;">
        <a href="${this.configService.get('FRONTEND_URL')}/client-management/requests" style="background-color: #1a1a1a; color: #ffffff; padding: 12px 25px; text-decoration: none; border-radius: 4px; font-weight: 600; display: inline-block;">Review Request</a>
      </div>
      ${this.getEmailFooter()}
    `;
        await this.sendMail(emails, `New Credential Request: ${data.companyName}`, html);
    }
    async sendEnquiryNotification(data) {
        const emails = await this.getActiveAdminEmails();
        if (emails.length === 0)
            return;
        const html = `
      ${this.getEmailHeader()}
      <h2 style="color: #1a1a1a; margin-top: 0;">New Cart Enquiry</h2>
      <p style="line-height: 1.6; color: #666;">A new product enquiry has been captured from the quotation system.</p>
      
      <div style="background-color: #f9f9f9; padding: 20px; border-radius: 4px; margin: 20px 0;">
        <p style="margin: 5px 0;"><strong>Enquiry #:</strong> ${data.enquiryNumber}</p>
        <p style="margin: 5px 0;"><strong>Customer:</strong> ${data.customerName}</p>
        <p style="margin: 5px 0;"><strong>Email:</strong> ${data.customerEmail}</p>
        <p style="margin: 5px 0;"><strong>Products:</strong> ${data.itemsCount} items</p>
        ${data.message ? `<p style="margin: 15px 0 5px 0;"><strong>Additional Note:</strong><br><span style="color: #666;">${data.message}</span></p>` : ''}
      </div>
      
      <div style="text-align: center; margin-top: 30px;">
        <a href="${this.configService.get('FRONTEND_URL')}/quotations/enquiries" style="background-color: #1a1a1a; color: #ffffff; padding: 12px 25px; text-decoration: none; border-radius: 4px; font-weight: 600; display: inline-block;">View Enquiry</a>
      </div>
      ${this.getEmailFooter()}
    `;
        await this.sendMail(emails, `New Cart Enquiry Received: ${data.enquiryNumber}`, html);
    }
    async sendMail(to, subject, html) {
        try {
            const info = await this.transporter.sendMail({
                from: `"RACCONTI" <${this.configService.get('SMTP_FROM') || 'noreply@racconti.in'}>`,
                to: to.join(','),
                subject: subject,
                html: html,
            });
            console.log('Email sent: %s', info.messageId);
        }
        catch (error) {
            console.error('Error sending email:', error);
        }
    }
};
exports.MailService = MailService;
exports.MailService = MailService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.MongoRepository,
        config_1.ConfigService])
], MailService);
//# sourceMappingURL=mail.service.js.map