import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import * as nodemailer from 'nodemailer';
import { User } from '../entities/user.entity';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor(
    @InjectRepository(User)
    private userRepo: MongoRepository<User>,
    private configService: ConfigService,
  ) {
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

    // Verify connection on startup
    this.transporter.verify((error, success) => {
      if (error) {
        console.error('[MailService] SMTP connection verification FAILED:', error.message);
      } else {
        console.log('[MailService] SMTP connection verified successfully!');
      }
    });
  }

  private getDefaultAdminEmails(): string[] {
    // Get from env or use defaults
    const envEmails = this.configService.get('ADMIN_EMAIL_RECIPIENTS');
    if (envEmails) {
      return envEmails.split(',').map(e => e.trim()).filter(e => !!e);
    }
    
    // Default admin emails
    return [
      'admin@purpul.in',
      'deeksha@racconti.in', 
      'rosemary@racconti.in'
    ];
  }

  private async getActiveAdminEmails(): Promise<string[]> {
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
      
      // Combine default emails with user-configured emails, removing duplicates
      const allEmails = [...new Set([...defaultAdminEmails, ...userEmails])];
      console.log(`[MailService] Found ${allEmails.length} admin emails (${defaultAdminEmails.length} default + ${userEmails.length} from users with notifications enabled)`);
      return allEmails;
    } catch (error: any) {
      console.error('[MailService] Error fetching admin emails:', error.message || error);
      // Return default emails if database query fails
      console.log('[MailService] Returning default admin emails due to database error');
      return defaultAdminEmails;
    }
  }

  private getEmailHeader() {
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

  private getEmailFooter() {
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

  async sendContactUsNotification(data: { name: string; email: string; subject: string; message: string }) {
    console.log('[MailService] sendContactUsNotification called');
    
    const emails = await this.getActiveAdminEmails();
    if (emails.length === 0) {
      console.warn('[MailService] No admin emails found with enableEmailNotifications=true. Email will not be sent.');
      return;
    }

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

    await this.sendMail(emails, `New Contact Inquiry: ${data.subject}`, html);
  }

  async sendCredentialRequestNotification(data: { companyName: string; contactPerson: string; email: string; phone: string }) {
    console.log('[MailService] sendCredentialRequestNotification called');
    
    const emails = await this.getActiveAdminEmails();
    if (emails.length === 0) {
      console.warn('[MailService] No admin emails found with enableEmailNotifications=true. Email will not be sent.');
      return;
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

    await this.sendMail(emails, `New Credential Request: ${data.companyName}`, html);
  }

  async sendEnquiryNotification(data: { enquiryNumber: string; customerName: string; customerEmail: string; itemsCount: number; message?: string }) {
    console.log('[MailService] sendEnquiryNotification called with:', data);
    
    const emails = await this.getActiveAdminEmails();
    if (emails.length === 0) {
      console.warn('[MailService] No admin emails found with enableEmailNotifications=true. Email will not be sent.');
      return;
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

    await this.sendMail(emails, `New Enquiry Received: ${data.enquiryNumber}`, html);
  }

  private async sendMail(to: string[], subject: string, html: string) {
    if (!to || to.length === 0) {
      console.error('[MailService] No recipients specified for email');
      return;
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
    } catch (error: any) {
      console.error('[MailService] Error sending email:', error.message || error);
      console.error('[MailService] Error details:', error);
      // Re-throw to ensure calling code knows about the failure
      throw error;
    }
  }
}
