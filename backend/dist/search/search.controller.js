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
exports.SearchController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../guards/jwt-auth.guard");
const search_service_1 = require("./search.service");
let SearchController = class SearchController {
    constructor(searchService) {
        this.searchService = searchService;
    }
    async globalSearch(query, organizationId, modules, types, limit, req) {
        try {
            if (!query || query.trim().length < 2) {
                return { results: [], total: 0, query: query || '' };
            }
            const parsedLimit = limit ? parseInt(limit) : 50;
            if (parsedLimit < 1 || parsedLimit > 100) {
                throw new common_1.BadRequestException('Limit must be between 1 and 100');
            }
            const filters = {};
            if (modules) {
                filters.modules = modules.split(',').filter(m => m.trim().length > 0);
            }
            if (types) {
                filters.types = types.split(',').filter(t => t.trim().length > 0);
            }
            const results = await this.searchService.globalSearch(query.trim(), req.user.userId, organizationId, filters, parsedLimit);
            return {
                results,
                total: results.length,
                query: query.trim()
            };
        }
        catch (error) {
            console.error('Search error:', error);
            if (error instanceof common_1.BadRequestException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException('Search failed');
        }
    }
    async getSearchSuggestions(query, organizationId, req) {
        try {
            if (!query || query.trim().length < 2) {
                return { suggestions: [] };
            }
            const suggestions = await this.searchService.getSearchSuggestions(query.trim(), req.user.userId, organizationId);
            return { suggestions };
        }
        catch (error) {
            console.error('Suggestions error:', error);
            return { suggestions: [] };
        }
    }
};
exports.SearchController = SearchController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('q')),
    __param(1, (0, common_1.Query)('organizationId')),
    __param(2, (0, common_1.Query)('modules')),
    __param(3, (0, common_1.Query)('types')),
    __param(4, (0, common_1.Query)('limit')),
    __param(5, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String, Object]),
    __metadata("design:returntype", Promise)
], SearchController.prototype, "globalSearch", null);
__decorate([
    (0, common_1.Get)('suggestions'),
    __param(0, (0, common_1.Query)('q')),
    __param(1, (0, common_1.Query)('organizationId')),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], SearchController.prototype, "getSearchSuggestions", null);
exports.SearchController = SearchController = __decorate([
    (0, common_1.Controller)('search'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [search_service_1.SearchService])
], SearchController);
//# sourceMappingURL=search.controller.js.map