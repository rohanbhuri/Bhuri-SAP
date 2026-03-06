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
        const smtpHost = this.configService.get('SMTP_HOST') || 'smtp.gmail.com';
        const smtpPort = parseInt(this.configService.get('SMTP_PORT')) || 587;
        const smtpSecure = this.configService.get('SMTP_SECURE') === 'true';
        const smtpUser = this.configService.get('SMTP_USER') || '';
        const smtpPass = this.configService.get('SMTP_PASS') || '';
        console.log('[MailService] Initializing SMTP transporter...');
        console.log('[MailService] SMTP Host:', smtpHost);
        console.log('[MailService] SMTP Port:', smtpPort);
        console.log('[MailService] SMTP Secure:', smtpSecure);
        console.log('[MailService] SMTP User:', smtpUser);
        console.log('[MailService] SMTP Password set:', !!smtpPass);
        if (!smtpUser || !smtpPass) {
            console.error('[MailService] ERROR: SMTP_USER or SMTP_PASS is not configured!');
        }
        this.transporter = nodemailer.createTransport({
            host: smtpHost,
            port: smtpPort,
            secure: smtpSecure,
            auth: {
                user: smtpUser,
                pass: smtpPass,
            },
        });
        this.transporter.verify((error, success) => {
            if (error) {
                console.error('[MailService] SMTP connection verification FAILED:', error.message);
            }
            else {
                console.log('[MailService] SMTP connection verified successfully!');
            }
        });
    }
    getDefaultAdminEmails() {
        const envEmails = this.configService.get('ADMIN_EMAIL_RECIPIENTS');
        if (envEmails) {
            return envEmails.split(',').map(e => e.trim()).filter(e => !!e);
        }
        return [
            'admin@purpul.in',
            'deeksha@racconti.in',
            'rosemary@racconti.in'
        ];
    }
    async getActiveAdminEmails() {
        const defaultAdminEmails = this.getDefaultAdminEmails();
        try {
            const users = await this.userRepo.find({
                where: {
                    enableEmailNotifications: true,
                    isActive: true,
                    isDeleted: { $ne: true }
                }
            });
            const userEmails = users.map(u => u.email).filter(email => !!email);
            const allEmails = [...new Set([...defaultAdminEmails, ...userEmails])];
            console.log(`[MailService] Found ${allEmails.length} admin emails (${defaultAdminEmails.length} default + ${userEmails.length} from users with notifications enabled)`);
            return allEmails;
        }
        catch (error) {
            console.error('[MailService] Error fetching admin emails:', error.message || error);
            console.log('[MailService] Returning default admin emails due to database error');
            return defaultAdminEmails;
        }
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
        console.log('[MailService] sendContactUsNotification called');
        const emails = await this.getActiveAdminEmails();
        if (emails.length === 0) {
            console.warn('[MailService] No admin emails found. Email will not be sent.');
            return { success: false, error: 'No admin emails configured' };
        }
        console.log('[MailService] Sending contact us notification to:', emails);
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
        <a href="${this.configService.get('FRONTEND_URL')}/client-management?tab=contact-us" style="background-color: #1a1a1a; color: #ffffff; padding: 12px 25px; text-decoration: none; border-radius: 4px; font-weight: 600; display: inline-block;">View in Dashboard</a>
      </div>
      ${this.getEmailFooter()}
    `;
        const result = await this.sendMail(emails, `New Contact Inquiry: ${data.subject}`, html);
        return result;
    }
    async sendCredentialRequestNotification(data) {
        console.log('[MailService] sendCredentialRequestNotification called');
        const emails = await this.getActiveAdminEmails();
        if (emails.length === 0) {
            console.warn('[MailService] No admin emails found. Email will not be sent.');
            return { success: false, error: 'No admin emails configured' };
        }
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
        <a href="${this.configService.get('FRONTEND_URL')}/client-management?tab=requests" style="background-color: #1a1a1a; color: #ffffff; padding: 12px 25px; text-decoration: none; border-radius: 4px; font-weight: 600; display: inline-block;">View in Dashboard</a>
      </div>
      ${this.getEmailFooter()}
    `;
        const result = await this.sendMail(emails, `New Credential Request: ${data.companyName}`, html);
        return result;
    }
    async sendEnquiryNotification(data) {
        console.log('[MailService] sendEnquiryNotification called with:', data);
        const emails = await this.getActiveAdminEmails();
        if (emails.length === 0) {
            console.warn('[MailService] No admin emails found. Email will not be sent.');
            return { success: false, error: 'No admin emails configured' };
        }
        console.log('[MailService] Sending enquiry notification to:', emails);
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
        <a href="${this.configService.get('FRONTEND_URL')}/quotations?tab=enquiries" style="background-color: #1a1a1a; color: #ffffff; padding: 12px 25px; text-decoration: none; border-radius: 4px; font-weight: 600; display: inline-block;">View in Dashboard</a>
      </div>
      ${this.getEmailFooter()}
    `;
        const result = await this.sendMail(emails, `New Cart Enquiry Received: ${data.enquiryNumber}`, html);
        return result;
    }
    async sendPasswordResetEmail(email, firstName, resetUrl) {
        console.log('[MailService] sendPasswordResetEmail called for:', email);
        const html = `
      ${this.getEmailHeader()}
      <h2 style="color: #1a1a1a; margin-top: 0;">Password Reset Request</h2>
      <p style="line-height: 1.6; color: #666;">Hi ${firstName},</p>
      <p style="line-height: 1.6; color: #666;">We received a request to reset your password. Click the button below to create a new password:</p>

      <div style="text-align: center; margin: 30px 0;">
        <a href="${resetUrl}" style="background-color: #1a1a1a; color: #ffffff; padding: 14px 30px; text-decoration: none; border-radius: 4px; font-weight: 600; display: inline-block;">Reset Password</a>
      </div>

      <div style="background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0;">
        <p style="margin: 0; color: #856404; font-size: 14px;"><strong>Important:</strong> This link will expire in 1 hour and can only be used once.</p>
      </div>

      <p style="line-height: 1.6; color: #666; font-size: 14px;">If you didn't request a password reset, please ignore this email or contact support if you have concerns.</p>

      <p style="line-height: 1.6; color: #999; font-size: 12px; margin-top: 20px;">If the button doesn't work, copy and paste this link into your browser:<br>
      <a href="${resetUrl}" style="color: #666; word-break: break-all;">${resetUrl}</a></p>
      ${this.getEmailFooter()}
    `;
        const result = await this.sendMail([email], 'Password Reset Request - RACCONTI', html);
        return result;
    }
    async sendMail(to, subject, html) {
        if (!to || to.length === 0) {
            const err = '[MailService] No recipients specified for email';
            console.error(err);
            return { success: false, error: err };
        }
        try {
            const fromAddress = this.configService.get('SMTP_FROM') || 'noreply@racconti.in';
            console.log('[MailService] Sending email from:', fromAddress, 'to:', to);
            const info = await this.transporter.sendMail({
                from: `"RACCONTI" <${fromAddress}>`,
                to: to.join(', '),
                subject: subject,
                html: html,
            });
            console.log('[MailService] Email sent successfully! MessageId:', info.messageId);
            return { success: true, messageId: info.messageId };
        }
        catch (error) {
            const errorMessage = error.message || String(error);
            console.error('[MailService] Error sending email:', errorMessage);
            console.error('[MailService] Error details:', error);
            return { success: false, error: errorMessage };
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