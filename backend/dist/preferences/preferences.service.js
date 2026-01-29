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
exports.PreferencesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_preferences_entity_1 = require("../entities/user-preferences.entity");
let PreferencesService = class PreferencesService {
    constructor(userPreferencesRepository) {
        this.userPreferencesRepository = userPreferencesRepository;
    }
    async getUserPreferences(userId) {
        if (!userId)
            return null;
        const prefs = await this.userPreferencesRepository.findOne({ where: { userId } });
        return prefs || null;
    }
    async saveUserPreferences(userId, preferences) {
        if (!userId)
            throw new Error('User ID is required');
        const existing = await this.userPreferencesRepository.findOne({ where: { userId } });
        if (existing) {
            await this.userPreferencesRepository.update({ userId }, preferences);
            return this.userPreferencesRepository.findOne({ where: { userId } });
        }
        else {
            const newPreferences = this.userPreferencesRepository.create({ userId, ...preferences });
            return this.userPreferencesRepository.save(newPreferences);
        }
    }
    async togglePinnedModule(userId, moduleId) {
        const prefs = await this.getUserPreferences(userId) || { userId, pinnedModules: [] };
        const pinnedModules = prefs.pinnedModules || [];
        const index = pinnedModules.indexOf(moduleId);
        if (index > -1) {
            pinnedModules.splice(index, 1);
        }
        else {
            pinnedModules.push(moduleId);
        }
        return this.saveUserPreferences(userId, { pinnedModules });
    }
    async saveDashboardPreferences(userId, dashboardPreferences) {
        return this.saveUserPreferences(userId, { dashboardPreferences });
    }
};
exports.PreferencesService = PreferencesService;
exports.PreferencesService = PreferencesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_preferences_entity_1.UserPreferences)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], PreferencesService);
//# sourceMappingURL=preferences.service.js.map