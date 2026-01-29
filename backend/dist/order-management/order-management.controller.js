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
exports.OrderManagementController = void 0;
const common_1 = require("@nestjs/common");
const order_management_service_1 = require("./order-management.service");
const jwt_auth_guard_1 = require("../guards/jwt-auth.guard");
const order_entity_1 = require("../entities/order.entity");
let OrderManagementController = class OrderManagementController {
    constructor(orderManagementService) {
        this.orderManagementService = orderManagementService;
    }
    async getDashboardStats(req) {
        const organizationId = req.user.organizationId;
        return await this.orderManagementService.getDashboardStats(organizationId);
    }
    async getAllOrders(req, page = 1, limit = 10) {
        const organizationId = req.user.organizationId;
        return await this.orderManagementService.getAllOrders(organizationId, page, limit);
    }
    async getOrderById(req, id) {
        const organizationId = req.user.organizationId;
        return await this.orderManagementService.getOrderById(id, organizationId);
    }
    async createOrder(req, createOrderDto) {
        const organizationId = req.user.organizationId;
        const userId = req.user.userId;
        return await this.orderManagementService.createOrder(createOrderDto, organizationId, userId);
    }
    async updateOrder(req, id, updateOrderDto) {
        const organizationId = req.user.organizationId;
        const userId = req.user.userId;
        return await this.orderManagementService.updateOrder(id, updateOrderDto, organizationId, userId);
    }
    async deleteOrder(req, id) {
        const organizationId = req.user.organizationId;
        return await this.orderManagementService.deleteOrder(id, organizationId);
    }
    async getOrderStatusHistory(req, id) {
        const organizationId = req.user.organizationId;
        return await this.orderManagementService.getOrderStatusHistory(id, organizationId);
    }
    async updateOrderStatus(req, id, body) {
        const organizationId = req.user.organizationId;
        const userId = req.user.userId;
        return await this.orderManagementService.updateOrderStatus(id, body.status, organizationId, userId, body.notes);
    }
    async getOrdersByStatus(req, status) {
        const organizationId = req.user.organizationId;
        return await this.orderManagementService.getOrdersByStatus(status, organizationId);
    }
    async getOrdersByCustomer(req, customerId) {
        const organizationId = req.user.organizationId;
        return await this.orderManagementService.getOrdersByCustomer(customerId, organizationId);
    }
    async searchOrders(req, query) {
        const organizationId = req.user.organizationId;
        return await this.orderManagementService.searchOrders(query, organizationId);
    }
};
exports.OrderManagementController = OrderManagementController;
__decorate([
    (0, common_1.Get)('dashboard'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], OrderManagementController.prototype, "getDashboardStats", null);
__decorate([
    (0, common_1.Get)('orders'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, Number]),
    __metadata("design:returntype", Promise)
], OrderManagementController.prototype, "getAllOrders", null);
__decorate([
    (0, common_1.Get)('orders/:id'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], OrderManagementController.prototype, "getOrderById", null);
__decorate([
    (0, common_1.Post)('orders'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], OrderManagementController.prototype, "createOrder", null);
__decorate([
    (0, common_1.Put)('orders/:id'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], OrderManagementController.prototype, "updateOrder", null);
__decorate([
    (0, common_1.Delete)('orders/:id'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], OrderManagementController.prototype, "deleteOrder", null);
__decorate([
    (0, common_1.Get)('orders/:id/status-history'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], OrderManagementController.prototype, "getOrderStatusHistory", null);
__decorate([
    (0, common_1.Put)('orders/:id/status'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], OrderManagementController.prototype, "updateOrderStatus", null);
__decorate([
    (0, common_1.Get)('orders/status/:status'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], OrderManagementController.prototype, "getOrdersByStatus", null);
__decorate([
    (0, common_1.Get)('orders/customer/:customerId'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('customerId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], OrderManagementController.prototype, "getOrdersByCustomer", null);
__decorate([
    (0, common_1.Get)('orders/search'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('q')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], OrderManagementController.prototype, "searchOrders", null);
exports.OrderManagementController = OrderManagementController = __decorate([
    (0, common_1.Controller)('order-management'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [order_management_service_1.OrderManagementService])
], OrderManagementController);
//# sourceMappingURL=order-management.controller.js.map