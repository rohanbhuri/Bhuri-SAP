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
exports.Page = exports.PageStatus = void 0;
const typeorm_1 = require("typeorm");
var PageStatus;
(function (PageStatus) {
    PageStatus["DRAFT"] = "draft";
    PageStatus["PUBLISHED"] = "published";
    PageStatus["ARCHIVED"] = "archived";
})(PageStatus || (exports.PageStatus = PageStatus = {}));
let Page = class Page {
    constructor() {
        this.status = PageStatus.DRAFT;
        this.seo = {};
        this.createdAt = new Date();
    }
};
exports.Page = Page;
__decorate([
    (0, typeorm_1.ObjectIdColumn)(),
    __metadata("design:type", typeorm_1.ObjectId)
], Page.prototype, "_id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Page.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Page.prototype, "slug", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Page.prototype, "content", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: PageStatus, default: PageStatus.DRAFT }),
    __metadata("design:type", String)
], Page.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', default: {} }),
    __metadata("design:type", Object)
], Page.prototype, "seo", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Date)
], Page.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Date)
], Page.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Page.prototype, "authorId", void 0);
exports.Page = Page = __decorate([
    (0, typeorm_1.Entity)('pages'),
    __metadata("design:paramtypes", [])
], Page);
//# sourceMappingURL=page.entity.js.map