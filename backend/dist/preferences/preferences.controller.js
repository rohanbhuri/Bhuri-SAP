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
exports.PreferencesController = void 0;
const common_1 = require("@nestjs/common");
const preferences_service_1 = require("./preferences.service");
const jwt_auth_guard_1 = require("../guards/jwt-auth.guard");
const class_validator_1 = require("class-validator");
class UserPreferencesDto {
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UserPreferencesDto.prototype, "theme", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UserPreferencesDto.prototype, "primaryColor", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UserPreferencesDto.prototype, "accentColor", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UserPreferencesDto.prototype, "secondaryColor", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UserPreferencesDto.prototype, "currency", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UserPreferencesDto.prototype, "currencySymbol", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], UserPreferencesDto.prototype, "pinnedModules", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], UserPreferencesDto.prototype, "dashboardPreferences", void 0);
let PreferencesController = class PreferencesController {
    constructor(preferencesService) {
        this.preferencesService = preferencesService;
    }
    async getUserPreferences(req) {
        if (!req.user?.userId) {
            return null;
        }
        return this.preferencesService.getUserPreferences(req.user.userId);
    }
    async saveUserPreferences(req, preferencesDto) {
        if (!req.user?.userId) {
            throw new Error('User not authenticated');
        }
        console.log('Saving preferences for user:', req.user.userId, 'Data:', preferencesDto);
        return this.preferencesService.saveUserPreferences(req.user.userId, preferencesDto);
    }
    async togglePinnedModule(req, body) {
        return this.preferencesService.togglePinnedModule(req.user.userId, body.moduleId);
    }
    async saveDashboardPreferences(req, dashboardPreferences) {
        return this.preferencesService.saveDashboardPreferences(req.user.userId, dashboardPreferences);
    }
};
exports.PreferencesController = PreferencesController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PreferencesController.prototype, "getUserPreferences", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, UserPreferencesDto]),
    __metadata("design:returntype", Promise)
], PreferencesController.prototype, "saveUserPreferences", null);
__decorate([
    (0, common_1.Post)('toggle-pinned-module'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PreferencesController.prototype, "togglePinnedModule", null);
__decorate([
    (0, common_1.Post)('dashboard'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PreferencesController.prototype, "saveDashboardPreferences", null);
exports.PreferencesController = PreferencesController = __decorate([
    (0, common_1.Controller)('preferences'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [preferences_service_1.PreferencesService])
], PreferencesController);
//# sourceMappingURL=preferences.controller.js.map