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
exports.OrderManagementService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const mongodb_1 = require("mongodb");
const order_entity_1 = require("../entities/order.entity");
const contact_entity_1 = require("../entities/contact.entity");
const user_entity_1 = require("../entities/user.entity");
let OrderManagementService = class OrderManagementService {
    constructor(orderRepository, orderStatusHistoryRepository, contactRepository, userRepository) {
        this.orderRepository = orderRepository;
        this.orderStatusHistoryRepository = orderStatusHistoryRepository;
        this.contactRepository = contactRepository;
        this.userRepository = userRepository;
    }
    async getDashboardStats(organizationId) {
        const orders = await this.orderRepository.find({
            where: { organizationId: new mongodb_1.ObjectId(organizationId) }
        });
        const totalOrders = orders.length;
        const pendingOrders = orders.filter(o => o.status === order_entity_1.OrderStatus.PENDING).length;
        const processingOrders = orders.filter(o => o.status === order_entity_1.OrderStatus.PROCESSING).length;
        const shippedOrders = orders.filter(o => o.status === order_entity_1.OrderStatus.SHIPPED).length;
        const deliveredOrders = orders.filter(o => o.status === order_entity_1.OrderStatus.DELIVERED).length;
        const cancelledOrders = orders.filter(o => o.status === order_entity_1.OrderStatus.CANCELLED).length;
        const totalValue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
        const averageOrderValue = totalOrders > 0 ? totalValue / totalOrders : 0;
        const today = new Date();
        const overdueOrders = orders.filter(o => o.expectedDeliveryDate &&
            o.expectedDeliveryDate < today &&
            o.status !== order_entity_1.OrderStatus.DELIVERED &&
            o.status !== order_entity_1.OrderStatus.CANCELLED).length;
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
    async getAllOrders(organizationId, page = 1, limit = 10) {
        const skip = (page - 1) * limit;
        const [orders, total] = await this.orderRepository.findAndCount({
            where: { organizationId: new mongodb_1.ObjectId(organizationId) },
            skip,
            take: limit,
            order: { createdAt: 'DESC' }
        });
        return { orders, total };
    }
    async getOrderById(id, organizationId) {
        return await this.orderRepository.findOne({
            where: {
                _id: new mongodb_1.ObjectId(id),
                organizationId: new mongodb_1.ObjectId(organizationId)
            }
        });
    }
    async createOrder(createOrderDto, organizationId, userId) {
        const orderNumber = await this.generateOrderNumber(organizationId);
        const totalAmount = createOrderDto.items.reduce((sum, item) => {
            return sum + (item.quantity * item.unitPrice);
        }, 0);
        const order = new order_entity_1.Order();
        order.orderNumber = orderNumber;
        order.organizationId = organizationId;
        order.customerId = new mongodb_1.ObjectId(createOrderDto.customerId);
        order.status = createOrderDto.status || order_entity_1.OrderStatus.PENDING;
        order.priority = createOrderDto.priority || order_entity_1.OrderPriority.MEDIUM;
        order.orderDate = new Date();
        order.expectedDeliveryDate = createOrderDto.expectedDeliveryDate;
        order.totalAmount = totalAmount;
        order.items = createOrderDto.items.map(item => ({
            productId: new mongodb_1.ObjectId(item.productId),
            productName: item.productName,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            total: item.quantity * item.unitPrice,
            totalPrice: item.quantity * item.unitPrice,
            specifications: item.specifications
        }));
        order.shippingAddress = createOrderDto.shippingAddress;
        order.billingAddress = createOrderDto.billingAddress;
        order.notes = createOrderDto.notes;
        order.createdBy = new mongodb_1.ObjectId(userId);
        order.assignedTo = createOrderDto.assignedTo ? new mongodb_1.ObjectId(createOrderDto.assignedTo) : null;
        order.tags = createOrderDto.tags || [];
        order.customFields = createOrderDto.customFields || {};
        const savedOrder = await this.orderRepository.save(order);
        await this.createStatusHistory(savedOrder._id, savedOrder.status, userId, 'Order created');
        return savedOrder;
    }
    async updateOrder(id, updateOrderDto, organizationId, userId) {
        const order = await this.getOrderById(id, organizationId);
        if (!order) {
            return null;
        }
        const oldStatus = order.status;
        if (updateOrderDto.status !== undefined)
            order.status = updateOrderDto.status;
        if (updateOrderDto.priority !== undefined)
            order.priority = updateOrderDto.priority;
        if (updateOrderDto.expectedDeliveryDate !== undefined)
            order.expectedDeliveryDate = updateOrderDto.expectedDeliveryDate;
        if (updateOrderDto.actualDeliveryDate !== undefined)
            order.actualDeliveryDate = updateOrderDto.actualDeliveryDate;
        if (updateOrderDto.items !== undefined) {
            order.items = updateOrderDto.items.map(item => ({
                productId: new mongodb_1.ObjectId(item.productId),
                productName: item.productName,
                quantity: item.quantity,
                unitPrice: item.unitPrice,
                total: item.quantity * item.unitPrice,
                totalPrice: item.quantity * item.unitPrice,
                specifications: item.specifications
            }));
            order.totalAmount = order.items.reduce((sum, item) => sum + (item.total || item.totalPrice || 0), 0);
        }
        if (updateOrderDto.shippingAddress !== undefined)
            order.shippingAddress = updateOrderDto.shippingAddress;
        if (updateOrderDto.billingAddress !== undefined)
            order.billingAddress = updateOrderDto.billingAddress;
        if (updateOrderDto.notes !== undefined)
            order.notes = updateOrderDto.notes;
        if (updateOrderDto.assignedTo !== undefined)
            order.assignedTo = updateOrderDto.assignedTo ? new mongodb_1.ObjectId(updateOrderDto.assignedTo) : null;
        if (updateOrderDto.tags !== undefined)
            order.tags = updateOrderDto.tags;
        if (updateOrderDto.customFields !== undefined)
            order.customFields = updateOrderDto.customFields;
        order.updatedAt = new Date();
        const updatedOrder = await this.orderRepository.save(order);
        if (oldStatus !== updatedOrder.status) {
            await this.createStatusHistory(updatedOrder._id, updatedOrder.status, userId, 'Status updated');
        }
        return updatedOrder;
    }
    async deleteOrder(id, organizationId) {
        const result = await this.orderRepository.deleteOne({
            _id: new mongodb_1.ObjectId(id),
            organizationId: organizationId
        });
        return result.deletedCount > 0;
    }
    async getOrderStatusHistory(orderId, organizationId) {
        return await this.orderStatusHistoryRepository.find({
            where: {
                orderId: new mongodb_1.ObjectId(orderId)
            },
            order: { timestamp: 'DESC' }
        });
    }
    async updateOrderStatus(orderId, status, organizationId, userId, notes) {
        const order = await this.getOrderById(orderId, organizationId);
        if (!order) {
            return null;
        }
        order.status = status;
        order.updatedAt = new Date();
        if (status === order_entity_1.OrderStatus.DELIVERED) {
            order.actualDeliveryDate = new Date();
        }
        const updatedOrder = await this.orderRepository.save(order);
        await this.createStatusHistory(new mongodb_1.ObjectId(orderId), status, userId, notes);
        return updatedOrder;
    }
    async createStatusHistory(orderId, status, userId, notes) {
        const statusHistory = new order_entity_1.OrderStatusHistory();
        statusHistory.orderId = orderId;
        statusHistory.status = status;
        statusHistory.updatedBy = new mongodb_1.ObjectId(userId);
        statusHistory.notes = notes;
        await this.orderStatusHistoryRepository.save(statusHistory);
    }
    async generateOrderNumber(organizationId) {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        const prefix = `ORD-${year}${month}${day}`;
        const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
        const count = await this.orderRepository.count({
            where: {
                organizationId: new mongodb_1.ObjectId(organizationId),
                createdAt: {
                    $gte: startOfDay,
                    $lt: endOfDay
                }
            }
        });
        const sequence = String(count + 1).padStart(4, '0');
        return `${prefix}-${sequence}`;
    }
    async getOrdersByStatus(status, organizationId) {
        return await this.orderRepository.find({
            where: {
                status,
                organizationId: new mongodb_1.ObjectId(organizationId)
            },
            order: { createdAt: 'DESC' }
        });
    }
    async getOrdersByCustomer(customerId, organizationId) {
        return await this.orderRepository.find({
            where: {
                customerId: new mongodb_1.ObjectId(customerId),
                organizationId: new mongodb_1.ObjectId(organizationId)
            },
            order: { createdAt: 'DESC' }
        });
    }
    async searchOrders(query, organizationId) {
        return await this.orderRepository.find({
            where: {
                organizationId: new mongodb_1.ObjectId(organizationId),
                $or: [
                    { orderNumber: { $regex: query, $options: 'i' } },
                    { 'items.productName': { $regex: query, $options: 'i' } },
                    { notes: { $regex: query, $options: 'i' } }
                ]
            },
            order: { createdAt: 'DESC' }
        });
    }
};
exports.OrderManagementService = OrderManagementService;
exports.OrderManagementService = OrderManagementService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(order_entity_1.Order)),
    __param(1, (0, typeorm_1.InjectRepository)(order_entity_1.OrderStatusHistory)),
    __param(2, (0, typeorm_1.InjectRepository)(contact_entity_1.Contact)),
    __param(3, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.MongoRepository,
        typeorm_2.MongoRepository,
        typeorm_2.MongoRepository,
        typeorm_2.MongoRepository])
], OrderManagementService);
//# sourceMappingURL=order-management.service.js.map