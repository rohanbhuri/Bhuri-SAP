import { Controller, Get, Post, Put, Body, Param, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { PermissionsGuard } from '../guards/permissions.guard';
import { RequireRoles } from '../decorators/permissions.decorator';
import { RoleType } from '../entities/role.entity';
import { CrmFunnelService } from './crm-funnel.service';
import { PaymentStatus, DeliveryStatus } from '../entities/order.entity';

@Controller('crm/funnel')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class CrmFunnelController {
  constructor(private readonly crmFunnelService: CrmFunnelService) {}

  // ==================== DASHBOARD ====================
  @Get('dashboard')
  @RequireRoles(RoleType.SUPER_ADMIN, RoleType.ADMIN, RoleType.STAFF)
  async getFunnelDashboard(@Request() req) {
    return this.crmFunnelService.getFunnelDashboard(req.user.organizationId);
  }

  @Get('pipeline')
  @RequireRoles(RoleType.SUPER_ADMIN, RoleType.ADMIN, RoleType.STAFF)
  async getPipeline(@Request() req) {
    return this.crmFunnelService.getPipeline(req.user.organizationId);
  }

  // ==================== CONTACTS ====================
  @Get('contacts/:id/history')
  @RequireRoles(RoleType.SUPER_ADMIN, RoleType.ADMIN, RoleType.STAFF)
  async getContactWithHistory(@Param('id') contactId: string, @Request() req) {
    return this.crmFunnelService.getContactWithHistory(contactId, req.user.organizationId);
  }

  // ==================== ENQUIRIES ====================
  @Get('enquiries')
  @RequireRoles(RoleType.SUPER_ADMIN, RoleType.ADMIN, RoleType.STAFF)
  async getEnquiries(@Request() req) {
    return this.crmFunnelService.getEnquiries(req.user.organizationId);
  }

  @Post('enquiries/from-contact/:contactId')
  @RequireRoles(RoleType.SUPER_ADMIN, RoleType.ADMIN)
  async createEnquiryFromContact(
    @Param('contactId') contactId: string,
    @Body() enquiryData: any,
    @Request() req
  ) {
    return this.crmFunnelService.createEnquiryFromContact(contactId, enquiryData, req.user.organizationId);
  }

  @Put('enquiries/:id/mark-lost')
  @RequireRoles(RoleType.SUPER_ADMIN, RoleType.ADMIN)
  async markEnquiryLost(
    @Param('id') enquiryId: string,
    @Body() body: { reason: string },
    @Request() req
  ) {
    return this.crmFunnelService.markEnquiryLost(enquiryId, body.reason, req.user.organizationId);
  }

  @Put('enquiries/:id/mark-on-hold')
  @RequireRoles(RoleType.SUPER_ADMIN, RoleType.ADMIN)
  async markEnquiryOnHold(
    @Param('id') enquiryId: string,
    @Body() body: { followUpDate: Date },
    @Request() req
  ) {
    return this.crmFunnelService.markEnquiryOnHold(enquiryId, body.followUpDate, req.user.organizationId);
  }

  // ==================== PRESENTATIONS ====================
  @Get('presentations')
  @RequireRoles(RoleType.SUPER_ADMIN, RoleType.ADMIN, RoleType.STAFF)
  async getPresentations(@Request() req) {
    return this.crmFunnelService.getPresentations(req.user.organizationId);
  }

  @Post('presentations/from-enquiry/:enquiryId')
  @RequireRoles(RoleType.SUPER_ADMIN, RoleType.ADMIN)
  async createPresentationFromEnquiry(
    @Param('enquiryId') enquiryId: string,
    @Body() presentationData: any,
    @Request() req
  ) {
    return this.crmFunnelService.createPresentationFromEnquiry(
      enquiryId,
      presentationData,
      req.user.userId,
      req.user.organizationId
    );
  }

  @Post('presentations/:id/send')
  @RequireRoles(RoleType.SUPER_ADMIN, RoleType.ADMIN)
  async sendPresentation(@Param('id') presentationId: string, @Request() req) {
    return this.crmFunnelService.sendPresentation(presentationId, req.user.organizationId);
  }

  // ==================== QUOTATIONS ====================
  @Get('quotations')
  @RequireRoles(RoleType.SUPER_ADMIN, RoleType.ADMIN, RoleType.STAFF)
  async getQuotations(@Request() req) {
    return this.crmFunnelService.getQuotations(req.user.organizationId);
  }

  @Post('quotations/from-enquiry/:enquiryId')
  @RequireRoles(RoleType.SUPER_ADMIN, RoleType.ADMIN)
  async createQuotationFromEnquiry(
    @Param('enquiryId') enquiryId: string,
    @Body() quotationData: any,
    @Request() req
  ) {
    return this.crmFunnelService.createQuotationFromEnquiry(enquiryId, quotationData, req.user.organizationId);
  }

  @Post('quotations/:id/accept')
  @RequireRoles(RoleType.SUPER_ADMIN, RoleType.ADMIN, RoleType.CLIENT)
  async acceptQuotation(@Param('id') quotationId: string, @Request() req) {
    return this.crmFunnelService.acceptQuotation(quotationId, req.user.organizationId);
  }

  @Post('quotations/:id/decline')
  @RequireRoles(RoleType.SUPER_ADMIN, RoleType.ADMIN, RoleType.CLIENT)
  async declineQuotation(
    @Param('id') quotationId: string,
    @Body() body: { reason: string },
    @Request() req
  ) {
    return this.crmFunnelService.declineQuotation(quotationId, body.reason, req.user.organizationId);
  }

  // ==================== ORDERS ====================
  @Get('orders')
  @RequireRoles(RoleType.SUPER_ADMIN, RoleType.ADMIN, RoleType.STAFF)
  async getOrders(@Request() req) {
    return this.crmFunnelService.getOrders(req.user.organizationId);
  }

  @Post('orders/from-quotation/:quotationId')
  @RequireRoles(RoleType.SUPER_ADMIN, RoleType.ADMIN)
  async createOrderFromQuotation(@Param('quotationId') quotationId: string, @Request() req) {
    return this.crmFunnelService.createOrderFromQuotation(quotationId, req.user.organizationId);
  }

  @Put('orders/:id/payment-status')
  @RequireRoles(RoleType.SUPER_ADMIN, RoleType.ADMIN)
  async updateOrderPaymentStatus(
    @Param('id') orderId: string,
    @Body() body: { paymentStatus: PaymentStatus },
    @Request() req
  ) {
    return this.crmFunnelService.updateOrderPaymentStatus(orderId, body.paymentStatus, req.user.organizationId);
  }

  @Put('orders/:id/delivery-status')
  @RequireRoles(RoleType.SUPER_ADMIN, RoleType.ADMIN)
  async updateOrderDeliveryStatus(
    @Param('id') orderId: string,
    @Body() body: { deliveryStatus: DeliveryStatus },
    @Request() req
  ) {
    return this.crmFunnelService.updateOrderDeliveryStatus(orderId, body.deliveryStatus, req.user.organizationId);
  }
}
