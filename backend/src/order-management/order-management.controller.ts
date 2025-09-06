import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { OrderManagementService, CreateOrderDto, UpdateOrderDto } from './order-management.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { OrderStatus } from '../entities/order.entity';

@Controller('order-management')
@UseGuards(JwtAuthGuard)
export class OrderManagementController {
  constructor(private readonly orderManagementService: OrderManagementService) {}

  @Get('dashboard')
  async getDashboardStats(@Request() req) {
    const organizationId = req.user.organizationId;
    return await this.orderManagementService.getDashboardStats(organizationId);
  }

  @Get('orders')
  async getAllOrders(
    @Request() req,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10
  ) {
    const organizationId = req.user.organizationId;
    return await this.orderManagementService.getAllOrders(organizationId, page, limit);
  }

  @Get('orders/:id')
  async getOrderById(@Request() req, @Param('id') id: string) {
    const organizationId = req.user.organizationId;
    return await this.orderManagementService.getOrderById(id, organizationId);
  }

  @Post('orders')
  async createOrder(@Request() req, @Body() createOrderDto: CreateOrderDto) {
    const organizationId = req.user.organizationId;
    const userId = req.user.userId;
    return await this.orderManagementService.createOrder(createOrderDto, organizationId, userId);
  }

  @Put('orders/:id')
  async updateOrder(
    @Request() req,
    @Param('id') id: string,
    @Body() updateOrderDto: UpdateOrderDto
  ) {
    const organizationId = req.user.organizationId;
    const userId = req.user.userId;
    return await this.orderManagementService.updateOrder(id, updateOrderDto, organizationId, userId);
  }

  @Delete('orders/:id')
  async deleteOrder(@Request() req, @Param('id') id: string) {
    const organizationId = req.user.organizationId;
    return await this.orderManagementService.deleteOrder(id, organizationId);
  }

  @Get('orders/:id/status-history')
  async getOrderStatusHistory(@Request() req, @Param('id') id: string) {
    const organizationId = req.user.organizationId;
    return await this.orderManagementService.getOrderStatusHistory(id, organizationId);
  }

  @Put('orders/:id/status')
  async updateOrderStatus(
    @Request() req,
    @Param('id') id: string,
    @Body() body: { status: OrderStatus; notes?: string }
  ) {
    const organizationId = req.user.organizationId;
    const userId = req.user.userId;
    return await this.orderManagementService.updateOrderStatus(
      id,
      body.status,
      organizationId,
      userId,
      body.notes
    );
  }

  @Get('orders/status/:status')
  async getOrdersByStatus(@Request() req, @Param('status') status: OrderStatus) {
    const organizationId = req.user.organizationId;
    return await this.orderManagementService.getOrdersByStatus(status, organizationId);
  }

  @Get('orders/customer/:customerId')
  async getOrdersByCustomer(@Request() req, @Param('customerId') customerId: string) {
    const organizationId = req.user.organizationId;
    return await this.orderManagementService.getOrdersByCustomer(customerId, organizationId);
  }

  @Get('orders/search')
  async searchOrders(@Request() req, @Query('q') query: string) {
    const organizationId = req.user.organizationId;
    return await this.orderManagementService.searchOrders(query, organizationId);
  }
}
