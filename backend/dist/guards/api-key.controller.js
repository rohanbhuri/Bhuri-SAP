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
exports.ApiKeyController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("./jwt-auth.guard");
const api_key_service_1 = require("./api-key.service");
let ApiKeyController = class ApiKeyController {
    constructor(apiKeyService) {
        this.apiKeyService = apiKeyService;
    }
    async getAllApiKeys(req) {
        return this.apiKeyService.findAllByUser(req.user.userId);
    }
    async getApiKey(id) {
        return this.apiKeyService.findOne(id);
    }
    async createApiKey(req, data) {
        return this.apiKeyService.createApiKey(req.user.userId, req.user.organizationId, data.name, new Date(data.expiresAt), data.allowedDomains || []);
    }
    async updateApiKey(id, data) {
        return this.apiKeyService.updateApiKey(id, data);
    }
    async deleteApiKey(id) {
        return this.apiKeyService.deleteApiKey(id);
    }
};
exports.ApiKeyController = ApiKeyController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ApiKeyController.prototype, "getAllApiKeys", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ApiKeyController.prototype, "getApiKey", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ApiKeyController.prototype, "createApiKey", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ApiKeyController.prototype, "updateApiKey", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ApiKeyController.prototype, "deleteApiKey", null);
exports.ApiKeyController = ApiKeyController = __decorate([
    (0, common_1.Controller)('api-keys'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [api_key_service_1.ApiKeyService])
], ApiKeyController);
//# sourceMappingURL=api-key.controller.js.map