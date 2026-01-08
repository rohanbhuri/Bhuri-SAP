import { Controller, Get, Post, Put, Delete, Body, Param, Request, UseGuards } from '@nestjs/common';
import { QuotationsService } from './quotations.service';
import { Quotation } from '../entities/quotation.entity';
import { Enquiry } from '../entities/enquiry.entity';
import { EmailTemplate } from '../entities/email-template.entity';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@Controller('quotations')
@UseGuards(JwtAuthGuard)
export class QuotationsController {
    constructor(private readonly quotationsService: QuotationsService) { }

    // Quotations
    @Get()
    async getAllQuotations(@Request() req) {
        return this.quotationsService.findAll(req.user.organizationId);
    }

    @Get('client/:clientId')
    async getQuotationsByClient(@Param('clientId') clientId: string) {
        return this.quotationsService.findByClient(clientId);
    }

    @Get(':id')
    async getQuotation(@Param('id') id: string) {
        return this.quotationsService.findOne(id);
    }

    @Post()
    async createQuotation(@Body() data: Partial<Quotation>, @Request() req) {
        return this.quotationsService.create(data, req.user.organizationId);
    }

    @Post('from-enquiry/:enquiryId')
    async createFromEnquiry(@Param('enquiryId') enquiryId: string, @Request() req) {
        return this.quotationsService.createFromEnquiry(enquiryId, req.user.userId);
    }

    @Put(':id')
    async updateQuotation(@Param('id') id: string, @Body() data: Partial<Quotation>) {
        return this.quotationsService.update(id, data);
    }

    @Post(':id/submit-approval')
    async submitForApproval(@Param('id') id: string) {
        return this.quotationsService.submitForApproval(id);
    }

    @Post(':id/approve')
    async approveQuotation(@Param('id') id: string, @Request() req) {
        return this.quotationsService.approve(id, req.user.userId);
    }

    @Post(':id/send')
    async sendQuotation(@Param('id') id: string, @Body() body: { via: 'email' | 'whatsapp' }) {
        return this.quotationsService.sendQuotation(id, body.via);
    }

    @Delete(':id')
    async deleteQuotation(@Param('id') id: string) {
        return this.quotationsService.delete(id);
    }

    // Enquiries
    @Get('enquiries/all')
    async getAllEnquiries(@Request() req) {
        return this.quotationsService.findAllEnquiries(req.user.organizationId);
    }

    @Get('enquiries/:id')
    async getEnquiry(@Param('id') id: string) {
        return this.quotationsService.findEnquiry(id);
    }

    @Post('enquiries')
    async createEnquiry(@Body() data: Partial<Enquiry>, @Request() req) {
        return this.quotationsService.createEnquiry(data, req.user.organizationId);
    }

    @Put('enquiries/:id')
    async updateEnquiry(@Param('id') id: string, @Body() data: Partial<Enquiry>) {
        return this.quotationsService.updateEnquiry(id, data);
    }

    @Delete('enquiries/:id')
    async deleteEnquiry(@Param('id') id: string) {
        return this.quotationsService.deleteEnquiry(id);
    }

    // Email Templates
    @Get('templates/all')
    async getAllTemplates() {
        return this.quotationsService.findAllTemplates();
    }

    @Post('templates')
    async createTemplate(@Body() data: Partial<EmailTemplate>) {
        return this.quotationsService.createTemplate(data);
    }
}
