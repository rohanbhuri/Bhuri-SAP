import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { ObjectId } from 'mongodb';
import { Order, OrderStatus, OrderStatusHistory, OrderPriority } from '../entities/order.entity';
import { Contact } from '../entities/contact.entity';
import { User } from '../entities/user.entity';

export interface OrderStats {
  totalOrders: number;
  pendingOrders: number;
  processingOrders: number;
  shippedOrders: number;
  deliveredOrders: number;
  cancelledOrders: number;
  totalValue: number;
  averageOrderValue: number;
  overdueOrders: number;
}

export interface CreateOrderDto {
  customerId: string;
  status?: OrderStatus;
  priority?: OrderPriority;
  expectedDeliveryDate?: Date;
  items: Array<{
    productId: string;
    productName: string;
    quantity: number;
    unitPrice: number;
    specifications?: any;
  }>;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    phone?: string;
  };
  billingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    phone?: string;
  };
  notes?: string;
  assignedTo?: string;
  tags?: string[];
  customFields?: any;
}

export interface UpdateOrderDto {
  status?: OrderStatus;
  priority?: OrderPriority;
  expectedDeliveryDate?: Date;
  actualDeliveryDate?: Date;
  items?: Array<{
    productId: string;
    productName: string;
    quantity: number;
    unitPrice: number;
    specifications?: any;
  }>;
  shippingAddress?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    phone?: string;
  };
  billingAddress?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    phone?: string;
  };
  notes?: string;
  assignedTo?: string;
  tags?: string[];
  customFields?: any;
}

@Injectable()
export class OrderManagementService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: MongoRepository<Order>,
    @InjectRepository(OrderStatusHistory)
    private orderStatusHistoryRepository: MongoRepository<OrderStatusHistory>,
    @InjectRepository(Contact)
    private contactRepository: MongoRepository<Contact>,
    @InjectRepository(User)
    private userRepository: MongoRepository<User>,
  ) {}

  async getDashboardStats(organizationId: string): Promise<OrderStats> {
    const orders = await this.orderRepository.find({
      where: { organizationId: new ObjectId(organizationId) }
    });

    const totalOrders = orders.length;
    const pendingOrders = orders.filter(o => o.status === OrderStatus.PENDING).length;
    const processingOrders = orders.filter(o => o.status === OrderStatus.PROCESSING).length;
    const shippedOrders = orders.filter(o => o.status === OrderStatus.SHIPPED).length;
    const deliveredOrders = orders.filter(o => o.status === OrderStatus.DELIVERED).length;
    const cancelledOrders = orders.filter(o => o.status === OrderStatus.CANCELLED).length;
    
    const totalValue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
    const averageOrderValue = totalOrders > 0 ? totalValue / totalOrders : 0;
    
    const today = new Date();
    const overdueOrders = orders.filter(o => 
      o.expectedDeliveryDate && 
      o.expectedDeliveryDate < today && 
      o.status !== OrderStatus.DELIVERED && 
      o.status !== OrderStatus.CANCELLED
    ).length;

    return {
      totalOrders,
      pendingOrders,
      processingOrders,
      shippedOrders,
      deliveredOrders,
      cancelledOrders,
      totalValue,
      averageOrderValue,
      overdueOrders
    };
  }

  async getAllOrders(organizationId: string, page: number = 1, limit: number = 10): Promise<{ orders: Order[], total: number }> {
    const skip = (page - 1) * limit;
    
    const [orders, total] = await this.orderRepository.findAndCount({
      where: { organizationId: new ObjectId(organizationId) },
      skip,
      take: limit,
      order: { createdAt: 'DESC' }
    });

    return { orders, total };
  }

  async getOrderById(id: string, organizationId: string): Promise<Order | null> {
    return await this.orderRepository.findOne({
      where: { 
        _id: new ObjectId(id),
        organizationId: new ObjectId(organizationId)
      }
    });
  }

  async createOrder(createOrderDto: CreateOrderDto, organizationId: string, userId: string): Promise<Order> {
    const orderNumber = await this.generateOrderNumber(organizationId);
    
    // Calculate total amount
    const totalAmount = createOrderDto.items.reduce((sum, item) => {
      return sum + (item.quantity * item.unitPrice);
    }, 0);

    const order = new Order();
    order.orderNumber = orderNumber;
    order.organizationId = new ObjectId(organizationId);
    order.customerId = new ObjectId(createOrderDto.customerId);
    order.status = createOrderDto.status || OrderStatus.PENDING;
    order.priority = createOrderDto.priority || OrderPriority.MEDIUM;
    order.orderDate = new Date();
    order.expectedDeliveryDate = createOrderDto.expectedDeliveryDate;
    order.totalAmount = totalAmount;
    order.items = createOrderDto.items.map(item => ({
      productId: new ObjectId(item.productId),
      productName: item.productName,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      totalPrice: item.quantity * item.unitPrice,
      specifications: item.specifications
    }));
    order.shippingAddress = createOrderDto.shippingAddress;
    order.billingAddress = createOrderDto.billingAddress;
    order.notes = createOrderDto.notes;
    order.createdBy = new ObjectId(userId);
    order.assignedTo = createOrderDto.assignedTo ? new ObjectId(createOrderDto.assignedTo) : null;
    order.tags = createOrderDto.tags || [];
    order.customFields = createOrderDto.customFields || {};

    const savedOrder = await this.orderRepository.save(order);
    
    // Create status history entry
    await this.createStatusHistory(savedOrder._id, savedOrder.status, userId, 'Order created');

    return savedOrder;
  }

  async updateOrder(id: string, updateOrderDto: UpdateOrderDto, organizationId: string, userId: string): Promise<Order | null> {
    const order = await this.getOrderById(id, organizationId);
    if (!order) {
      return null;
    }

    const oldStatus = order.status;

    // Update order fields
    if (updateOrderDto.status !== undefined) order.status = updateOrderDto.status;
    if (updateOrderDto.priority !== undefined) order.priority = updateOrderDto.priority;
    if (updateOrderDto.expectedDeliveryDate !== undefined) order.expectedDeliveryDate = updateOrderDto.expectedDeliveryDate;
    if (updateOrderDto.actualDeliveryDate !== undefined) order.actualDeliveryDate = updateOrderDto.actualDeliveryDate;
    if (updateOrderDto.items !== undefined) {
      order.items = updateOrderDto.items.map(item => ({
        productId: new ObjectId(item.productId),
        productName: item.productName,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        totalPrice: item.quantity * item.unitPrice,
        specifications: item.specifications
      }));
      // Recalculate total amount
      order.totalAmount = order.items.reduce((sum, item) => sum + item.totalPrice, 0);
    }
    if (updateOrderDto.shippingAddress !== undefined) order.shippingAddress = updateOrderDto.shippingAddress;
    if (updateOrderDto.billingAddress !== undefined) order.billingAddress = updateOrderDto.billingAddress;
    if (updateOrderDto.notes !== undefined) order.notes = updateOrderDto.notes;
    if (updateOrderDto.assignedTo !== undefined) order.assignedTo = updateOrderDto.assignedTo ? new ObjectId(updateOrderDto.assignedTo) : null;
    if (updateOrderDto.tags !== undefined) order.tags = updateOrderDto.tags;
    if (updateOrderDto.customFields !== undefined) order.customFields = updateOrderDto.customFields;

    order.updatedAt = new Date();

    const updatedOrder = await this.orderRepository.save(order);

    // Create status history entry if status changed
    if (oldStatus !== updatedOrder.status) {
      await this.createStatusHistory(updatedOrder._id, updatedOrder.status, userId, 'Status updated');
    }

    return updatedOrder;
  }

  async deleteOrder(id: string, organizationId: string): Promise<boolean> {
    const result = await this.orderRepository.delete({
      _id: new ObjectId(id),
      organizationId: new ObjectId(organizationId)
    });
    return result.affected > 0;
  }

  async getOrderStatusHistory(orderId: string, organizationId: string): Promise<OrderStatusHistory[]> {
    return await this.orderStatusHistoryRepository.find({
      where: { 
        orderId: new ObjectId(orderId)
      },
      order: { timestamp: 'DESC' }
    });
  }

  async updateOrderStatus(orderId: string, status: OrderStatus, organizationId: string, userId: string, notes?: string): Promise<Order | null> {
    const order = await this.getOrderById(orderId, organizationId);
    if (!order) {
      return null;
    }

    order.status = status;
    order.updatedAt = new Date();

    if (status === OrderStatus.DELIVERED) {
      order.actualDeliveryDate = new Date();
    }

    const updatedOrder = await this.orderRepository.save(order);
    
    // Create status history entry
    await this.createStatusHistory(new ObjectId(orderId), status, userId, notes);

    return updatedOrder;
  }

  private async createStatusHistory(orderId: ObjectId, status: OrderStatus, userId: string, notes?: string): Promise<void> {
    const statusHistory = new OrderStatusHistory();
    statusHistory.orderId = orderId;
    statusHistory.status = status;
    statusHistory.updatedBy = new ObjectId(userId);
    statusHistory.notes = notes;

    await this.orderStatusHistoryRepository.save(statusHistory);
  }

  private async generateOrderNumber(organizationId: string): Promise<string> {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    
    const prefix = `ORD-${year}${month}${day}`;
    
    // Count existing orders for today
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
    
    const count = await this.orderRepository.count({
      where: {
        organizationId: new ObjectId(organizationId),
        createdAt: {
          $gte: startOfDay,
          $lt: endOfDay
        }
      }
    });
    
    const sequence = String(count + 1).padStart(4, '0');
    return `${prefix}-${sequence}`;
  }

  async getOrdersByStatus(status: OrderStatus, organizationId: string): Promise<Order[]> {
    return await this.orderRepository.find({
      where: { 
        status,
        organizationId: new ObjectId(organizationId)
      },
      order: { createdAt: 'DESC' }
    });
  }

  async getOrdersByCustomer(customerId: string, organizationId: string): Promise<Order[]> {
    return await this.orderRepository.find({
      where: { 
        customerId: new ObjectId(customerId),
        organizationId: new ObjectId(organizationId)
      },
      order: { createdAt: 'DESC' }
    });
  }

  async searchOrders(query: string, organizationId: string): Promise<Order[]> {
    return await this.orderRepository.find({
      where: {
        organizationId: new ObjectId(organizationId),
        $or: [
          { orderNumber: { $regex: query, $options: 'i' } },
          { 'items.productName': { $regex: query, $options: 'i' } },
          { notes: { $regex: query, $options: 'i' } }
        ]
      },
      order: { createdAt: 'DESC' }
    });
  }
}
