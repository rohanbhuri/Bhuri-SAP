import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { FinanceService, CreateInvoiceDto, UpdateInvoiceDto, CreateReceiptDto, CreatePaymentDto } from './finance.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { InvoiceStatus } from '../entities/invoice.entity';

@Controller('finance')
@UseGuards(JwtAuthGuard)
export class FinanceController {
  constructor(private readonly financeService: FinanceService) {}

  @Get('dashboard')
  async getDashboardStats(@Request() req) {
    const organizationId = req.user.organizationId;
    return await this.financeService.getDashboardStats(organizationId);
  }

  // Invoice endpoints
  @Get('invoices')
  async getAllInvoices(
    @Request() req,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10
  ) {
    const organizationId = req.user.organizationId;
    return await this.financeService.getAllInvoices(organizationId, page, limit);
  }

  @Get('invoices/:id')
  async getInvoiceById(@Request() req, @Param('id') id: string) {
    const organizationId = req.user.organizationId;
    return await this.financeService.getInvoiceById(id, organizationId);
  }

  @Post('invoices')
  async createInvoice(@Request() req, @Body() createInvoiceDto: CreateInvoiceDto) {
    const organizationId = req.user.organizationId;
    const userId = req.user.userId;
    return await this.financeService.createInvoice(createInvoiceDto, organizationId, userId);
  }

  @Put('invoices/:id')
  async updateInvoice(
    @Request() req,
    @Param('id') id: string,
    @Body() updateInvoiceDto: UpdateInvoiceDto
  ) {
    const organizationId = req.user.organizationId;
    const userId = req.user.userId;
    return await this.financeService.updateInvoice(id, updateInvoiceDto, organizationId, userId);
  }

  @Delete('invoices/:id')
  async deleteInvoice(@Request() req, @Param('id') id: string) {
    const organizationId = req.user.organizationId;
    return await this.financeService.deleteInvoice(id, organizationId);
  }

  @Get('invoices/status/:status')
  async getInvoicesByStatus(@Request() req, @Param('status') status: InvoiceStatus) {
    const organizationId = req.user.organizationId;
    return await this.financeService.getInvoicesByStatus(status, organizationId);
  }

  @Get('invoices/customer/:customerId')
  async getInvoicesByCustomer(@Request() req, @Param('customerId') customerId: string) {
    const organizationId = req.user.organizationId;
    return await this.financeService.getInvoicesByCustomer(customerId, organizationId);
  }

  @Get('invoices/search')
  async searchInvoices(@Request() req, @Query('q') query: string) {
    const organizationId = req.user.organizationId;
    return await this.financeService.searchInvoices(query, organizationId);
  }

  // Receipt endpoints
  @Get('receipts')
  async getAllReceipts(
    @Request() req,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10
  ) {
    const organizationId = req.user.organizationId;
    return await this.financeService.getAllReceipts(organizationId, page, limit);
  }

  @Post('receipts')
  async createReceipt(@Request() req, @Body() createReceiptDto: CreateReceiptDto) {
    const organizationId = req.user.organizationId;
    const userId = req.user.userId;
    return await this.financeService.createReceipt(createReceiptDto, organizationId, userId);
  }

  // Payment endpoints
  @Get('payments')
  async getAllPayments(
    @Request() req,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10
  ) {
    const organizationId = req.user.organizationId;
    return await this.financeService.getAllPayments(organizationId, page, limit);
  }

  @Post('payments')
  async createPayment(@Request() req, @Body() createPaymentDto: CreatePaymentDto) {
    const organizationId = req.user.organizationId;
    const userId = req.user.userId;
    return await this.financeService.createPayment(createPaymentDto, organizationId, userId);
  }
}
