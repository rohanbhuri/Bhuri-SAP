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
exports.CatalogueController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const path_1 = require("path");
const catalogue_service_1 = require("./catalogue.service");
const api_key_guard_1 = require("../guards/api-key.guard");
const jwt_auth_guard_1 = require("../guards/jwt-auth.guard");
const permissions_guard_1 = require("../guards/permissions.guard");
const permissions_decorator_1 = require("../decorators/permissions.decorator");
const role_entity_1 = require("../entities/role.entity");
const imageStorage = (0, multer_1.diskStorage)({
    destination: './uploads/products/images',
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, `${uniqueSuffix}${(0, path_1.extname)(file.originalname)}`);
    }
});
const videoStorage = (0, multer_1.diskStorage)({
    destination: './uploads/products/videos',
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, `${uniqueSuffix}${(0, path_1.extname)(file.originalname)}`);
    }
});
const modelStorage = (0, multer_1.diskStorage)({
    destination: './uploads/products/models',
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, `${uniqueSuffix}${(0, path_1.extname)(file.originalname)}`);
    }
});
const categoryImageStorage = (0, multer_1.diskStorage)({
    destination: './uploads/categories',
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, `${uniqueSuffix}${(0, path_1.extname)(file.originalname)}`);
    }
});
const collectionImageStorage = (0, multer_1.diskStorage)({
    destination: './uploads/collections',
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, `${uniqueSuffix}${(0, path_1.extname)(file.originalname)}`);
    }
});
const designerImageStorage = (0, multer_1.diskStorage)({
    destination: './uploads/designers',
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, `${uniqueSuffix}${(0, path_1.extname)(file.originalname)}`);
    }
});
const presentationStorage = (0, multer_1.diskStorage)({
    destination: './uploads/presentations',
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, `${uniqueSuffix}${(0, path_1.extname)(file.originalname)}`);
    }
});
const technicalSheetStorage = (0, multer_1.diskStorage)({
    destination: './uploads/products/technical-sheets',
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, `${uniqueSuffix}${(0, path_1.extname)(file.originalname)}`);
    }
});
let CatalogueController = class CatalogueController {
    constructor(catalogueService) {
        this.catalogueService = catalogueService;
    }
    async getAllProducts(query) {
        return this.catalogueService.findAllProducts(query);
    }
    async checkProductCode(code, excludeId) {
        const exists = await this.catalogueService.checkProductCodeExists(code, excludeId);
        return { exists };
    }
    async getProduct(id) {
        return this.catalogueService.findOneProduct(id);
    }
    async createProduct(data, req) {
        return this.catalogueService.createProduct(data, req.user?.userId);
    }
    async uploadImages(files) {
        const urls = files.map(file => `/uploads/products/images/${file.filename}`);
        return { urls };
    }
    async uploadFile(file) {
        return { url: `/uploads/presentations/${file.filename}` };
    }
    async uploadVideo(file) {
        return { url: `/uploads/products/videos/${file.filename}` };
    }
    async uploadModel(file) {
        return { url: `/uploads/products/models/${file.filename}` };
    }
    async uploadTechnicalSheet(file) {
        return { url: `/uploads/products/technical-sheets/${file.filename}` };
    }
    async trackTechnicalSheetDownload(productId, data, req) {
        const ipAddress = req.ip || req.connection.remoteAddress;
        const userAgent = req.headers['user-agent'];
        const referrer = req.headers['referer'] || req.headers['referrer'];
        return this.catalogueService.trackTechnicalSheetDownload(productId, data.email, ipAddress, userAgent, referrer);
    }
    async getTechnicalSheetDownloads(productId) {
        return this.catalogueService.getTechnicalSheetDownloads(productId);
    }
    async getAllTechnicalSheetDownloads() {
        return this.catalogueService.getAllTechnicalSheetDownloads();
    }
    async updateProduct(id, data, req) {
        return this.catalogueService.updateProduct(id, data, req.user?.userId);
    }
    async deleteProduct(id, req) {
        return this.catalogueService.deleteProduct(id, req.user?.userId);
    }
    async getAllCategories() {
        return this.catalogueService.findAllCategories();
    }
    async getCategory(id) {
        return this.catalogueService.findOneCategory(id);
    }
    async createCategory(data, req) {
        return this.catalogueService.createCategory(data, req.user?.userId);
    }
    async uploadCategoryImage(file) {
        return { url: `/uploads/categories/${file.filename}` };
    }
    async updateCategory(id, data, req) {
        return this.catalogueService.updateCategory(id, data, req.user?.userId);
    }
    async deleteCategory(id, req) {
        return this.catalogueService.deleteCategory(id, req.user?.userId);
    }
    async getAllCollections() {
        return this.catalogueService.findAllCollections();
    }
    async getCollection(id) {
        return this.catalogueService.findOneCollection(id);
    }
    async createCollection(data, req) {
        return this.catalogueService.createCollection(data, req.user?.userId);
    }
    async uploadCollectionImage(file) {
        return { url: `/uploads/collections/${file.filename}` };
    }
    async updateCollection(id, data, req) {
        return this.catalogueService.updateCollection(id, data, req.user?.userId);
    }
    async deleteCollection(id, req) {
        return this.catalogueService.deleteCollection(id, req.user?.userId);
    }
    async getAllDesigners() {
        return this.catalogueService.findAllDesigners();
    }
    async getDesigner(id) {
        return this.catalogueService.findOneDesigner(id);
    }
    async createDesigner(data, req) {
        return this.catalogueService.createDesigner(data, req.user?.userId);
    }
    async uploadDesignerProfile(file) {
        return { url: `/uploads/designers/${file.filename}` };
    }
    async uploadDesignerPortfolio(files) {
        const urls = files.map(file => `/uploads/designers/${file.filename}`);
        return { urls };
    }
    async updateDesigner(id, data, req) {
        return this.catalogueService.updateDesigner(id, data, req.user?.userId);
    }
    async deleteDesigner(id, req) {
        return this.catalogueService.deleteDesigner(id, req.user?.userId);
    }
    async getAnalytics() {
        return this.catalogueService.getAnalytics();
    }
    async exportProducts(res, query) {
        const csv = await this.catalogueService.exportProductsCSV(query);
        res.header('Content-Type', 'text/csv');
        res.header('Content-Disposition', 'attachment; filename=products.csv');
        res.send(csv);
    }
    async exportCategories(res) {
        const csv = await this.catalogueService.exportCategoriesCSV();
        res.header('Content-Type', 'text/csv');
        res.header('Content-Disposition', 'attachment; filename=categories.csv');
        res.send(csv);
    }
    async exportCollections(res) {
        const csv = await this.catalogueService.exportCollectionsCSV();
        res.header('Content-Type', 'text/csv');
        res.header('Content-Disposition', 'attachment; filename=collections.csv');
        res.send(csv);
    }
    async exportDesigners(res) {
        const csv = await this.catalogueService.exportDesignersCSV();
        res.header('Content-Type', 'text/csv');
        res.header('Content-Disposition', 'attachment; filename=designers.csv');
        res.send(csv);
    }
    async exportAll(res) {
        const zip = await this.catalogueService.exportAllZIP();
        res.header('Content-Type', 'application/zip');
        res.header('Content-Disposition', 'attachment; filename=catalogue-export.zip');
        res.send(zip);
    }
    async downloadProductTemplate(res) {
        const csv = await this.catalogueService.getProductTemplate();
        res.header('Content-Type', 'text/csv');
        res.header('Content-Disposition', 'attachment; filename=product-import-template.csv');
        res.send(csv);
    }
    async validateImport(file) {
        if (!file || !file.buffer) {
            throw new common_1.BadRequestException('No file uploaded or file is empty');
        }
        return this.catalogueService.validateProductsFromCSV(file.buffer.toString());
    }
    async importProducts(file, req) {
        if (!file || !file.buffer) {
            throw new common_1.BadRequestException('No file uploaded or file is empty');
        }
        return this.catalogueService.importProductsFromCSV(file.buffer.toString(), req.user?.userId);
    }
};
exports.CatalogueController = CatalogueController;
__decorate([
    (0, common_1.Get)('products'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CatalogueController.prototype, "getAllProducts", null);
__decorate([
    (0, common_1.Get)('products/check-code/:code'),
    __param(0, (0, common_1.Param)('code')),
    __param(1, (0, common_1.Query)('excludeId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], CatalogueController.prototype, "checkProductCode", null);
__decorate([
    (0, common_1.Get)('products/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CatalogueController.prototype, "getProduct", null);
__decorate([
    (0, common_1.Post)('products'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], CatalogueController.prototype, "createProduct", null);
__decorate([
    (0, common_1.Post)('products/upload-images'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FilesInterceptor)('images', 10, { storage: imageStorage })),
    __param(0, (0, common_1.UploadedFiles)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", Promise)
], CatalogueController.prototype, "uploadImages", null);
__decorate([
    (0, common_1.Post)('upload'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', { storage: presentationStorage })),
    __param(0, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CatalogueController.prototype, "uploadFile", null);
__decorate([
    (0, common_1.Post)('products/upload-video'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('video', { storage: videoStorage })),
    __param(0, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CatalogueController.prototype, "uploadVideo", null);
__decorate([
    (0, common_1.Post)('products/upload-model'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('model', { storage: modelStorage })),
    __param(0, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CatalogueController.prototype, "uploadModel", null);
__decorate([
    (0, common_1.Post)('products/upload-technical-sheet'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('technicalSheet', {
        storage: technicalSheetStorage,
        fileFilter: (req, file, cb) => {
            if (file.mimetype === 'application/pdf') {
                cb(null, true);
            }
            else {
                cb(new common_1.BadRequestException('Only PDF files are allowed'), false);
            }
        }
    })),
    __param(0, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CatalogueController.prototype, "uploadTechnicalSheet", null);
__decorate([
    (0, common_1.Post)('products/:productId/track-technical-sheet-download'),
    __param(0, (0, common_1.Param)('productId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], CatalogueController.prototype, "trackTechnicalSheetDownload", null);
__decorate([
    (0, common_1.Get)('products/:productId/technical-sheet-downloads'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('productId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CatalogueController.prototype, "getTechnicalSheetDownloads", null);
__decorate([
    (0, common_1.Get)('technical-sheet-downloads'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CatalogueController.prototype, "getAllTechnicalSheetDownloads", null);
__decorate([
    (0, common_1.Put)('products/:id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], CatalogueController.prototype, "updateProduct", null);
__decorate([
    (0, common_1.Delete)('products/:id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CatalogueController.prototype, "deleteProduct", null);
__decorate([
    (0, common_1.Get)('categories'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CatalogueController.prototype, "getAllCategories", null);
__decorate([
    (0, common_1.Get)('categories/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CatalogueController.prototype, "getCategory", null);
__decorate([
    (0, common_1.Post)('categories'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], CatalogueController.prototype, "createCategory", null);
__decorate([
    (0, common_1.Post)('categories/upload-image'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('image', { storage: categoryImageStorage })),
    __param(0, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CatalogueController.prototype, "uploadCategoryImage", null);
__decorate([
    (0, common_1.Put)('categories/:id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], CatalogueController.prototype, "updateCategory", null);
__decorate([
    (0, common_1.Delete)('categories/:id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CatalogueController.prototype, "deleteCategory", null);
__decorate([
    (0, common_1.Get)('collections'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CatalogueController.prototype, "getAllCollections", null);
__decorate([
    (0, common_1.Get)('collections/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CatalogueController.prototype, "getCollection", null);
__decorate([
    (0, common_1.Post)('collections'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], CatalogueController.prototype, "createCollection", null);
__decorate([
    (0, common_1.Post)('collections/upload-image'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('image', { storage: collectionImageStorage })),
    __param(0, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CatalogueController.prototype, "uploadCollectionImage", null);
__decorate([
    (0, common_1.Put)('collections/:id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], CatalogueController.prototype, "updateCollection", null);
__decorate([
    (0, common_1.Delete)('collections/:id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CatalogueController.prototype, "deleteCollection", null);
__decorate([
    (0, common_1.Get)('designers'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CatalogueController.prototype, "getAllDesigners", null);
__decorate([
    (0, common_1.Get)('designers/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CatalogueController.prototype, "getDesigner", null);
__decorate([
    (0, common_1.Post)('designers'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], CatalogueController.prototype, "createDesigner", null);
__decorate([
    (0, common_1.Post)('designers/upload-profile'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('image', { storage: designerImageStorage })),
    __param(0, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CatalogueController.prototype, "uploadDesignerProfile", null);
__decorate([
    (0, common_1.Post)('designers/upload-portfolio'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FilesInterceptor)('images', 10, { storage: designerImageStorage })),
    __param(0, (0, common_1.UploadedFiles)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", Promise)
], CatalogueController.prototype, "uploadDesignerPortfolio", null);
__decorate([
    (0, common_1.Put)('designers/:id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], CatalogueController.prototype, "updateDesigner", null);
__decorate([
    (0, common_1.Delete)('designers/:id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CatalogueController.prototype, "deleteDesigner", null);
__decorate([
    (0, common_1.Get)('analytics'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CatalogueController.prototype, "getAnalytics", null);
__decorate([
    (0, common_1.Get)('export/products'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], CatalogueController.prototype, "exportProducts", null);
__decorate([
    (0, common_1.Get)('export/categories'),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CatalogueController.prototype, "exportCategories", null);
__decorate([
    (0, common_1.Get)('export/collections'),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CatalogueController.prototype, "exportCollections", null);
__decorate([
    (0, common_1.Get)('export/designers'),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CatalogueController.prototype, "exportDesigners", null);
__decorate([
    (0, common_1.Get)('export/all'),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CatalogueController.prototype, "exportAll", null);
__decorate([
    (0, common_1.Get)('template/products'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard),
    (0, permissions_decorator_1.RequireRoles)(role_entity_1.RoleType.SUPER_ADMIN),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CatalogueController.prototype, "downloadProductTemplate", null);
__decorate([
    (0, common_1.Post)('import/validate'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard),
    (0, permissions_decorator_1.RequireRoles)(role_entity_1.RoleType.SUPER_ADMIN),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', { storage: (0, multer_1.memoryStorage)() })),
    __param(0, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CatalogueController.prototype, "validateImport", null);
__decorate([
    (0, common_1.Post)('import/products'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard),
    (0, permissions_decorator_1.RequireRoles)(role_entity_1.RoleType.SUPER_ADMIN),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', { storage: (0, multer_1.memoryStorage)() })),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], CatalogueController.prototype, "importProducts", null);
exports.CatalogueController = CatalogueController = __decorate([
    (0, common_1.Controller)('catalogue'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard),
    __metadata("design:paramtypes", [catalogue_service_1.CatalogueService])
], CatalogueController);
//# sourceMappingURL=catalogue.controller.js.map