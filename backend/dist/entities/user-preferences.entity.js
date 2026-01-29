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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserPreferences = void 0;
const typeorm_1 = require("typeorm");
let UserPreferences = class UserPreferences {
};
exports.UserPreferences = UserPreferences;
__decorate([
    (0, typeorm_1.ObjectIdColumn)(),
    __metadata("design:type", typeorm_1.ObjectId)
], UserPreferences.prototype, "_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], UserPreferences.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 'light' }),
    __metadata("design:type", String)
], UserPreferences.prototype, "theme", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: '#1976d2' }),
    __metadata("design:type", String)
], UserPreferences.prototype, "primaryColor", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: '#ff4081' }),
    __metadata("design:type", String)
], UserPreferences.prototype, "accentColor", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: '#424242' }),
    __metadata("design:type", String)
], UserPreferences.prototype, "secondaryColor", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: [] }),
    __metadata("design:type", Array)
], UserPreferences.prototype, "pinnedModules", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: {} }),
    __metadata("design:type", Object)
], UserPreferences.prototype, "dashboardPreferences", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 'INR' }),
    __metadata("design:type", String)
], UserPreferences.prototype, "currency", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: '₹' }),
    __metadata("design:type", String)
], UserPreferences.prototype, "currencySymbol", void 0);
exports.UserPreferences = UserPreferences = __decorate([
    (0, typeorm_1.Entity)('user-preferences')
], UserPreferences);
//# sourceMappingURL=user-preferences.entity.js.map