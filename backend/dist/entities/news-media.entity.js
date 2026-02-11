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
exports.NewsMedia = exports.MediaType = exports.NewsStatus = void 0;
const typeorm_1 = require("typeorm");
var NewsStatus;
(function (NewsStatus) {
    NewsStatus["DRAFT"] = "draft";
    NewsStatus["PUBLISHED"] = "published";
    NewsStatus["ARCHIVED"] = "archived";
})(NewsStatus || (exports.NewsStatus = NewsStatus = {}));
var MediaType;
(function (MediaType) {
    MediaType["IMAGE"] = "image";
    MediaType["VIDEO"] = "video";
    MediaType["DOCUMENT"] = "document";
})(MediaType || (exports.MediaType = MediaType = {}));
let NewsMedia = class NewsMedia {
    constructor() {
        this.status = NewsStatus.DRAFT;
        this.isFeatured = false;
        this.seo = {};
        this.tags = [];
        this.mediaFiles = [];
        this.gallery = [];
        this.createdAt = new Date();
        this.changeLog = [];
    }
};
exports.NewsMedia = NewsMedia;
__decorate([
    (0, typeorm_1.ObjectIdColumn)(),
    __metadata("design:type", typeorm_1.ObjectId)
], NewsMedia.prototype, "_id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], NewsMedia.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], NewsMedia.prototype, "slug", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], NewsMedia.prototype, "content", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], NewsMedia.prototype, "excerpt", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], NewsMedia.prototype, "featuredImage", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'array', default: [] }),
    __metadata("design:type", Array)
], NewsMedia.prototype, "mediaFiles", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'array', default: [] }),
    __metadata("design:type", Array)
], NewsMedia.prototype, "gallery", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: NewsStatus, default: NewsStatus.DRAFT }),
    __metadata("design:type", String)
], NewsMedia.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], NewsMedia.prototype, "isFeatured", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', default: {} }),
    __metadata("design:type", Object)
], NewsMedia.prototype, "seo", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'array', default: [] }),
    __metadata("design:type", Array)
], NewsMedia.prototype, "tags", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Date)
], NewsMedia.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Date)
], NewsMedia.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Date)
], NewsMedia.prototype, "publishedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], NewsMedia.prototype, "authorId", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], NewsMedia.prototype, "createdBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], NewsMedia.prototype, "updatedBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', default: [] }),
    __metadata("design:type", Array)
], NewsMedia.prototype, "changeLog", void 0);
exports.NewsMedia = NewsMedia = __decorate([
    (0, typeorm_1.Entity)('news_media'),
    __metadata("design:paramtypes", [])
], NewsMedia);
//# sourceMappingURL=news-media.entity.js.map