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
exports.DocumentRecord = exports.DocumentChunk = exports.DocumentFile = void 0;
const typeorm_1 = require("typeorm");
let DocumentFile = class DocumentFile {
};
exports.DocumentFile = DocumentFile;
__decorate([
    (0, typeorm_1.ObjectIdColumn)(),
    __metadata("design:type", typeorm_1.ObjectId)
], DocumentFile.prototype, "_id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], DocumentFile.prototype, "filename", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], DocumentFile.prototype, "length", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], DocumentFile.prototype, "chunkSize", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Date)
], DocumentFile.prototype, "uploadDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], DocumentFile.prototype, "contentType", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'simple-json', nullable: true }),
    __metadata("design:type", Object)
], DocumentFile.prototype, "metadata", void 0);
exports.DocumentFile = DocumentFile = __decorate([
    (0, typeorm_1.Entity)('documents.files')
], DocumentFile);
let DocumentChunk = class DocumentChunk {
};
exports.DocumentChunk = DocumentChunk;
__decorate([
    (0, typeorm_1.ObjectIdColumn)(),
    __metadata("design:type", typeorm_1.ObjectId)
], DocumentChunk.prototype, "_id", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.Column)({ type: String }),
    __metadata("design:type", typeorm_1.ObjectId)
], DocumentChunk.prototype, "files_id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], DocumentChunk.prototype, "n", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'bytea' }),
    __metadata("design:type", Buffer)
], DocumentChunk.prototype, "data", void 0);
exports.DocumentChunk = DocumentChunk = __decorate([
    (0, typeorm_1.Entity)('documents.chunks')
], DocumentChunk);
let DocumentRecord = class DocumentRecord {
    constructor() {
        this.createdAt = new Date();
    }
};
exports.DocumentRecord = DocumentRecord;
__decorate([
    (0, typeorm_1.ObjectIdColumn)(),
    __metadata("design:type", typeorm_1.ObjectId)
], DocumentRecord.prototype, "_id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], DocumentRecord.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], DocumentRecord.prototype, "fileId", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.Column)({ type: String }),
    __metadata("design:type", typeorm_1.ObjectId)
], DocumentRecord.prototype, "employeeId", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], DocumentRecord.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: String }),
    __metadata("design:type", typeorm_1.ObjectId)
], DocumentRecord.prototype, "organizationId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Date)
], DocumentRecord.prototype, "createdAt", void 0);
exports.DocumentRecord = DocumentRecord = __decorate([
    (0, typeorm_1.Entity)('document-records'),
    __metadata("design:paramtypes", [])
], DocumentRecord);
//# sourceMappingURL=document.entity.js.map