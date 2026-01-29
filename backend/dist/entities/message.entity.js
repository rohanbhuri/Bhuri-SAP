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
exports.Message = void 0;
const typeorm_1 = require("typeorm");
let Message = class Message {
    constructor() {
        this.readBy = [];
        this.reactions = [];
        this.createdAt = new Date();
    }
};
exports.Message = Message;
__decorate([
    (0, typeorm_1.ObjectIdColumn)(),
    __metadata("design:type", typeorm_1.ObjectId)
], Message.prototype, "_id", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.Column)('objectid'),
    __metadata("design:type", typeorm_1.ObjectId)
], Message.prototype, "conversationId", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.Column)('objectid'),
    __metadata("design:type", typeorm_1.ObjectId)
], Message.prototype, "organizationId", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.Column)('objectid'),
    __metadata("design:type", typeorm_1.ObjectId)
], Message.prototype, "senderId", void 0);
__decorate([
    (0, typeorm_1.Column)('text'),
    __metadata("design:type", String)
], Message.prototype, "content", void 0);
__decorate([
    (0, typeorm_1.Column)('array'),
    __metadata("design:type", Array)
], Message.prototype, "readBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'array', nullable: true }),
    __metadata("design:type", Array)
], Message.prototype, "reactions", void 0);
__decorate([
    (0, typeorm_1.Column)('datetime'),
    __metadata("design:type", Date)
], Message.prototype, "createdAt", void 0);
exports.Message = Message = __decorate([
    (0, typeorm_1.Entity)('messages'),
    __metadata("design:paramtypes", [])
], Message);
//# sourceMappingURL=message.entity.js.map