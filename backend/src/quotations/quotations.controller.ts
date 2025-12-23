import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { QuotationsService } from './quotations.service';
import { Quotation } from '../entities/quotation.entity';
import { EmailTemplate } from '../entities/email-template.entity';

@Controller('quotations')
export class QuotationsController {
    constructor(private readonly quotationsService: QuotationsService) { }

    @Get()
    async getAllQuotations() {
        return this.quotationsService.findAll();
    }

    @Get(':id')
    async getQuotation(@Param('id') id: string) {
        return this.quotationsService.findOne(id);
    }

    @Post()
    async createQuotation(@Body() data: Partial<Quotation>) {
        return this.quotationsService.create(data);
    }

    @Put(':id')
    async updateQuotation(@Param('id') id: string, @Body() data: Partial<Quotation>) {
        return this.quotationsService.update(id, data);
    }

    @Delete(':id')
    async deleteQuotation(@Param('id') id: string) {
        return this.quotationsService.delete(id);
    }

    // // Client Portal Endpoints
    // @Get('client/:email')
    // async getQuotationsByClient(@Param('email') email: string) {
    //     return this.quotationsService.findByClientEmail(email);
    // }

    // @Put(':id/accept')
    // async acceptQuotation(@Param('id') id: string) {
    //     return this.quotationsService.updateStatus(id, 'ACCEPTED');
    // }

    // @Put(':id/reject')
    // async rejectQuotation(@Param('id') id: string, @Body() body: { reason?: string }) {
    //     return this.quotationsService.updateStatus(id, 'DECLINED', body.reason);
    // }

    // Email Templates
    @Get('templates')
    async getAllTemplates() {
        return this.quotationsService.findAllTemplates();
    }

    @Post('templates')
    async createTemplate(@Body() data: Partial<EmailTemplate>) {
        return this.quotationsService.createTemplate(data);
    }
}
