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
exports.MediaController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const path_1 = require("path");
const fs = require("fs");
const path = require("path");
const public_decorator_1 = require("../decorators/public.decorator");
const api_key_guard_1 = require("../guards/api-key.guard");
let MediaController = class MediaController {
    constructor() {
        this.fileFilter = (req, file, callback) => {
            if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp|mp4|webm|glb|gltf|bin)$/i)) {
                return callback(new common_1.BadRequestException('Unsupported file format'), false);
            }
            callback(null, true);
        };
    }
    ensureDirectoryExists(directory) {
        if (!fs.existsSync(directory)) {
            fs.mkdirSync(directory, { recursive: true });
        }
    }
    getStorageConfig(uploadType = 'general') {
        const baseDir = './uploads';
        const subDir = uploadType === 'general' ? '' : `/${uploadType}`;
        const destination = `${baseDir}${subDir}`;
        return (0, multer_1.diskStorage)({
            destination: (req, file, callback) => {
                this.ensureDirectoryExists(destination);
                callback(null, destination);
            },
            filename: (req, file, callback) => {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
                const ext = (0, path_1.extname)(file.originalname);
                const filename = `file-${uniqueSuffix}${ext}`;
                callback(null, filename);
            },
        });
    }
    async uploadFile(file) {
        if (!file) {
            throw new common_1.BadRequestException('No file uploaded');
        }
        return {
            url: `/uploads/${file.filename}`,
            filename: file.filename,
            mimetype: file.mimetype,
            size: file.size
        };
    }
    async uploadBlogFeaturedImage(file) {
        if (!file) {
            throw new common_1.BadRequestException('No file uploaded');
        }
        const destination = './uploads/blogs';
        this.ensureDirectoryExists(destination);
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = (0, path_1.extname)(file.originalname);
        const filename = `featured-${uniqueSuffix}${ext}`;
        const filepath = path.join(destination, filename);
        fs.writeFileSync(filepath, file.buffer);
        return {
            url: `/uploads/blogs/${filename}`,
            filename: filename,
            mimetype: file.mimetype,
            size: file.size
        };
    }
    async uploadBlogGallery(files) {
        if (!files || files.length === 0) {
            throw new common_1.BadRequestException('No files uploaded');
        }
        const destination = './uploads/blogs';
        this.ensureDirectoryExists(destination);
        const uploadedFiles = files.map((file, index) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            const ext = (0, path_1.extname)(file.originalname);
            const filename = `gallery-${uniqueSuffix}${ext}`;
            const filepath = path.join(destination, filename);
            fs.writeFileSync(filepath, file.buffer);
            return {
                url: `/uploads/blogs/${filename}`,
                filename: filename,
                mimetype: file.mimetype,
                size: file.size,
                order: index
            };
        });
        return {
            files: uploadedFiles,
            count: uploadedFiles.length
        };
    }
    async uploadNewsFeaturedImage(file) {
        if (!file) {
            throw new common_1.BadRequestException('No file uploaded');
        }
        const destination = './uploads/news';
        this.ensureDirectoryExists(destination);
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = (0, path_1.extname)(file.originalname);
        const filename = `featured-${uniqueSuffix}${ext}`;
        const filepath = path.join(destination, filename);
        fs.writeFileSync(filepath, file.buffer);
        return {
            url: `/uploads/news/${filename}`,
            filename: filename,
            mimetype: file.mimetype,
            size: file.size
        };
    }
    async uploadNewsGallery(files) {
        if (!files || files.length === 0) {
            throw new common_1.BadRequestException('No files uploaded');
        }
        const destination = './uploads/news';
        this.ensureDirectoryExists(destination);
        const uploadedFiles = files.map((file, index) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            const ext = (0, path_1.extname)(file.originalname);
            const filename = `gallery-${uniqueSuffix}${ext}`;
            const filepath = path.join(destination, filename);
            fs.writeFileSync(filepath, file.buffer);
            return {
                url: `/uploads/news/${filename}`,
                filename: filename,
                mimetype: file.mimetype,
                size: file.size,
                order: index
            };
        });
        return {
            files: uploadedFiles,
            count: uploadedFiles.length
        };
    }
    serveFile(filename, res) {
        const root = './uploads';
        res.sendFile(filename, { root });
    }
    serveBlogFile(filename, res) {
        const root = './uploads/blogs';
        res.sendFile(filename, { root });
    }
    serveNewsFile(filename, res) {
        const root = './uploads/news';
        res.sendFile(filename, { root });
    }
};
exports.MediaController = MediaController;
__decorate([
    (0, common_1.Post)('upload'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', {
        storage: (0, multer_1.diskStorage)({
            destination: './uploads',
            filename: (req, file, callback) => {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
                const ext = (0, path_1.extname)(file.originalname);
                const filename = `file-${uniqueSuffix}${ext}`;
                callback(null, filename);
            },
        }),
        fileFilter: (req, file, callback) => {
            if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp|mp4|webm|glb|gltf|bin)$/i)) {
                return callback(new common_1.BadRequestException('Unsupported file format'), false);
            }
            callback(null, true);
        },
        limits: {
            fileSize: 50 * 1024 * 1024,
        },
    })),
    __param(0, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MediaController.prototype, "uploadFile", null);
__decorate([
    (0, common_1.Post)('upload/blog/featured'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', {
        fileFilter: (req, file, callback) => {
            if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
                return callback(new common_1.BadRequestException('Only image files are allowed'), false);
            }
            callback(null, true);
        },
        limits: {
            fileSize: 10 * 1024 * 1024,
        },
    })),
    __param(0, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MediaController.prototype, "uploadBlogFeaturedImage", null);
__decorate([
    (0, common_1.Post)('upload/blog/gallery'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FilesInterceptor)('files', 10, {
        fileFilter: (req, file, callback) => {
            if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
                return callback(new common_1.BadRequestException('Only image files are allowed'), false);
            }
            callback(null, true);
        },
        limits: {
            fileSize: 10 * 1024 * 1024,
        },
    })),
    __param(0, (0, common_1.UploadedFiles)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", Promise)
], MediaController.prototype, "uploadBlogGallery", null);
__decorate([
    (0, common_1.Post)('upload/news/featured'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', {
        fileFilter: (req, file, callback) => {
            if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
                return callback(new common_1.BadRequestException('Only image files are allowed'), false);
            }
            callback(null, true);
        },
        limits: {
            fileSize: 10 * 1024 * 1024,
        },
    })),
    __param(0, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MediaController.prototype, "uploadNewsFeaturedImage", null);
__decorate([
    (0, common_1.Post)('upload/news/gallery'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FilesInterceptor)('files', 10, {
        fileFilter: (req, file, callback) => {
            if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
                return callback(new common_1.BadRequestException('Only image files are allowed'), false);
            }
            callback(null, true);
        },
        limits: {
            fileSize: 10 * 1024 * 1024,
        },
    })),
    __param(0, (0, common_1.UploadedFiles)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", Promise)
], MediaController.prototype, "uploadNewsGallery", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)(':filename'),
    __param(0, (0, common_1.Param)('filename')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], MediaController.prototype, "serveFile", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('blogs/:filename'),
    __param(0, (0, common_1.Param)('filename')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], MediaController.prototype, "serveBlogFile", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('news/:filename'),
    __param(0, (0, common_1.Param)('filename')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], MediaController.prototype, "serveNewsFile", null);
exports.MediaController = MediaController = __decorate([
    (0, common_1.Controller)('media'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard)
], MediaController);
//# sourceMappingURL=media.controller.js.map