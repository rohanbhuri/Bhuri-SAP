import { Controller, Get, Post, Put, Delete, Body, Param, Request, UseGuards, Res } from '@nestjs/common';
import { QuotationsService } from './quotations.service';
import { Quotation } from '../entities/quotation.entity';
import { Enquiry } from '../entities/enquiry.entity';
import { EmailTemplate } from '../entities/email-template.entity';
import { Presentation } from '../entities/presentation.entity';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { ApiKeyGuard } from '../guards/api-key.guard';
import { Public } from '../decorators/public.decorator';
import { Response } from 'express';

@Controller('quotations')
export class QuotationsController {
    constructor(private readonly quotationsService: QuotationsService) { }

    // Quotations
    @Get()
    @UseGuards(JwtAuthGuard, ApiKeyGuard)
    async getAllQuotations(@Request() req) {
        return this.quotationsService.findAll(req.user.organizationId);
    }

    @Get('client/:clientId')
    @UseGuards(JwtAuthGuard, ApiKeyGuard)
    async getQuotationsByClient(@Param('clientId') clientId: string) {
        return this.quotationsService.findByClient(clientId);
    }

    @Get(':id')
    @UseGuards(JwtAuthGuard, ApiKeyGuard)
    async getQuotation(@Param('id') id: string) {
        return this.quotationsService.findOne(id);
    }

    @Post()
    @UseGuards(JwtAuthGuard, ApiKeyGuard)
    async createQuotation(@Body() data: Partial<Quotation>, @Request() req) {
        return this.quotationsService.create(data, req.user.organizationId);
    }

    @Post('from-enquiry/:enquiryId')
    @UseGuards(JwtAuthGuard, ApiKeyGuard)
    async createFromEnquiry(@Param('enquiryId') enquiryId: string, @Request() req) {
        return this.quotationsService.createFromEnquiry(enquiryId, req.user.userId);
    }

    @Put(':id')
    @UseGuards(JwtAuthGuard, ApiKeyGuard)
    async updateQuotation(@Param('id') id: string, @Body() data: Partial<Quotation>, @Request() req) {
        return this.quotationsService.update(id, data, req.user?.userId);
    }

    @Post(':id/submit-approval')
    @UseGuards(JwtAuthGuard, ApiKeyGuard)
    async submitForApproval(@Param('id') id: string) {
        return this.quotationsService.submitForApproval(id);
    }

    @Post(':id/approve')
    @UseGuards(JwtAuthGuard, ApiKeyGuard)
    async approveQuotation(@Param('id') id: string, @Request() req) {
        return this.quotationsService.approve(id, req.user.userId);
    }

    @Post(':id/send')
    @UseGuards(JwtAuthGuard, ApiKeyGuard)
    async sendQuotation(@Param('id') id: string, @Body() body: { via: 'email' | 'whatsapp' }) {
        return this.quotationsService.sendQuotation(id, body.via);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard, ApiKeyGuard)
    async deleteQuotation(@Param('id') id: string, @Request() req) {
        return this.quotationsService.delete(id, req.user?.userId);
    }

    // Website Cart API
    @Post('cart')
    @UseGuards(ApiKeyGuard)
    async createFromWebsiteCart(@Body() cartData: any, @Request() req) {
        return this.quotationsService.createFromWebsiteCart(cartData, req.apiKey.organizationId);
    }

    // Enquiries
    @Get('enquiries/all')
    @UseGuards(JwtAuthGuard, ApiKeyGuard)
    async getAllEnquiries(@Request() req) {
        return this.quotationsService.findAllEnquiries(req.user.organizationId);
    }

    @Get('enquiries/:id')
    @UseGuards(JwtAuthGuard, ApiKeyGuard)
    async getEnquiry(@Param('id') id: string) {
        return this.quotationsService.findEnquiry(id);
    }

    @Post('enquiries')
    @Public()
    async createEnquiry(@Body() data: Partial<Enquiry>, @Request() req) {
        const organizationId = req.user?.organizationId;
        return this.quotationsService.createEnquiry(data, organizationId);
    }

    @Put('enquiries/:id')
    @UseGuards(JwtAuthGuard, ApiKeyGuard)
    async updateEnquiry(@Param('id') id: string, @Body() data: Partial<Enquiry>, @Request() req) {
        return this.quotationsService.updateEnquiry(id, data, req.user?.userId);
    }

    @Delete('enquiries/:id')
    @UseGuards(JwtAuthGuard, ApiKeyGuard)
    async deleteEnquiry(@Param('id') id: string, @Request() req) {
        return this.quotationsService.deleteEnquiry(id, req.user?.userId);
    }

    // Email Templates
    @Get('templates/all')
    @UseGuards(JwtAuthGuard, ApiKeyGuard)
    async getAllTemplates() {
        return this.quotationsService.findAllTemplates();
    }

    @Post('templates')
    @UseGuards(JwtAuthGuard, ApiKeyGuard)
    async createTemplate(@Body() data: Partial<EmailTemplate>) {
        return this.quotationsService.createTemplate(data);
    }

    // Presentations
    @Get('presentations/all')
    @UseGuards(JwtAuthGuard, ApiKeyGuard)
    async getAllPresentations(@Request() req) {
        return this.quotationsService.findAllPresentations(req.user.organizationId);
    }

    @Get('presentations/:id')
    @UseGuards(JwtAuthGuard, ApiKeyGuard)
    async getPresentation(@Param('id') id: string) {
        return this.quotationsService.findPresentation(id);
    }

    @Post('presentations')
    @UseGuards(JwtAuthGuard, ApiKeyGuard)
    async createPresentation(@Body() data: Partial<Presentation>, @Request() req) {
        return this.quotationsService.createPresentation(data, req.user.organizationId, req.user.userId);
    }

    @Put('presentations/:id')
    @UseGuards(JwtAuthGuard, ApiKeyGuard)
    async updatePresentation(@Param('id') id: string, @Body() data: Partial<Presentation>, @Request() req) {
        return this.quotationsService.updatePresentation(id, data, req.user?.userId);
    }

    @Post('presentations/:id/mark-final')
    @UseGuards(JwtAuthGuard, ApiKeyGuard)
    async markPresentationFinal(@Param('id') id: string) {
        return this.quotationsService.markPresentationFinal(id);
    }

    @Post('presentations/:id/send-to-client')
    @UseGuards(JwtAuthGuard, ApiKeyGuard)
    async sendPresentationToClient(@Param('id') id: string) {
        return this.quotationsService.sendPresentationToClient(id);
    }

    @Delete('presentations/:id')
    @UseGuards(JwtAuthGuard, ApiKeyGuard)
    async deletePresentation(@Param('id') id: string, @Request() req) {
        return this.quotationsService.deletePresentation(id, req.user?.userId);
    }

    @Post('presentations/:id/generate')
    @UseGuards(JwtAuthGuard, ApiKeyGuard)
    async generatePresentation(@Param('id') id: string, @Res() res: Response) {
        const buffer = await this.quotationsService.generatePPTX(id);
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.presentationml.presentation');
        res.setHeader('Content-Disposition', `attachment; filename=presentation-${id}.pptx`);
        res.send(buffer);
    }

    @Post('presentations/:id/convert-to-quotation')
    @UseGuards(JwtAuthGuard, ApiKeyGuard)
    async convertPresentationToQuotation(@Param('id') id: string) {
        return this.quotationsService.convertPresentationToQuotation(id);
    }

    @Post('presentations/:id/link-quotation')
    @UseGuards(JwtAuthGuard, ApiKeyGuard)
    async linkQuotationToPresentation(@Param('id') id: string, @Body() body: { quotationId: string }) {
        return this.quotationsService.linkQuotationToPresentation(id, body.quotationId);
    }


    @Get(':id/download-excel')
    @UseGuards(JwtAuthGuard, ApiKeyGuard)
    async downloadQuotationExcel(@Param('id') id: string, @Res() res: Response) {
        const buffer = await this.quotationsService.generateQuotationExcel(id);
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename=quotation-${id}.xlsx`);
        res.send(buffer);
    }
}
