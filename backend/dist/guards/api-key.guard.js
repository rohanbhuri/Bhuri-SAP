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
exports.ApiKeyGuard = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const api_key_entity_1 = require("../entities/api-key.entity");
const public_decorator_1 = require("../decorators/public.decorator");
let ApiKeyGuard = class ApiKeyGuard {
    constructor(reflector, apiKeyRepository) {
        this.reflector = reflector;
        this.apiKeyRepository = apiKeyRepository;
    }
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        if (request.url && (request.url.startsWith('/uploads/') || request.url.startsWith('/api/uploads/'))) {
            return true;
        }
        const isPublic = this.reflector.getAllAndOverride(public_decorator_1.IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (isPublic) {
            return true;
        }
        const authHeader = request.headers['authorization'];
        if (authHeader && authHeader.startsWith('Bearer ')) {
            return true;
        }
        const token = request.headers['x-api-key'] || request.query.apiKey;
        if (!token) {
            throw new common_1.UnauthorizedException('API key is required');
        }
        const apiKey = await this.apiKeyRepository.findOne({ where: { token, isActive: true } });
        if (!apiKey) {
            throw new common_1.UnauthorizedException('Invalid API key');
        }
        if (new Date() > new Date(apiKey.expiresAt)) {
            throw new common_1.UnauthorizedException('API key has expired');
        }
        await this.apiKeyRepository.update(apiKey._id, {
            usageCount: apiKey.usageCount + 1,
            lastUsedAt: new Date()
        });
        request.apiKey = apiKey;
        return true;
    }
};
exports.ApiKeyGuard = ApiKeyGuard;
exports.ApiKeyGuard = ApiKeyGuard = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, typeorm_1.InjectRepository)(api_key_entity_1.ApiKey)),
    __metadata("design:paramtypes", [core_1.Reflector,
        typeorm_2.MongoRepository])
], ApiKeyGuard);
//# sourceMappingURL=api-key.guard.js.map