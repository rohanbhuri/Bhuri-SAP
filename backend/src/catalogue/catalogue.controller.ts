import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, UseInterceptors, UploadedFiles, UploadedFile, Res, Request, BadRequestException } from '@nestjs/common';
import { FileInterceptor, FilesInterceptor, FileFieldsInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { diskStorage, memoryStorage } from 'multer';
import { extname } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { CatalogueService } from './catalogue.service';
import { Product } from '../entities/product.entity';
import { Category } from '../entities/category.entity';
import { Collection } from '../entities/collection.entity';
import { Designer } from '../entities/designer.entity';
import { ApiKeyGuard } from '../guards/api-key.guard';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { PermissionsGuard } from '../guards/permissions.guard';
import { RequireRoles } from '../decorators/permissions.decorator';
import { RoleType } from '../entities/role.entity';

const imageStorage = diskStorage({
    destination: './uploads/products/images',
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
    }
});

const videoStorage = diskStorage({
    destination: './uploads/products/videos',
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
    }
});

const modelStorage = diskStorage({
    destination: './uploads/products/models',
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
    }
});

const categoryImageStorage = diskStorage({
    destination: './uploads/categories',
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
    }
});

const collectionImageStorage = diskStorage({
    destination: './uploads/collections',
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
    }
});

const designerImageStorage = diskStorage({
    destination: './uploads/designers',
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
    }
});

const presentationStorage = diskStorage({
    destination: './uploads/presentations',
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
    }
});

const technicalSheetStorage = diskStorage({
    destination: (req, file, cb) => {
        const dir = './uploads/products/technical-sheets';
        if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
    }
});

@Controller('catalogue')
@UseGuards(ApiKeyGuard)
export class CatalogueController {
    constructor(private readonly catalogueService: CatalogueService) { }

    // Products
    @Get('products')
    async getAllProducts(@Query() query: any) {
        return this.catalogueService.findAllProducts(query);
    }

    @Get('products/check-code/:code')
    async checkProductCode(@Param('code') code: string, @Query('excludeId') excludeId?: string) {
        const exists = await this.catalogueService.checkProductCodeExists(code, excludeId);
        return { exists };
    }

    @Get('products/:id')
    async getProduct(@Param('id') id: string) {
        return this.catalogueService.findOneProduct(id);
    }

    @Post('products')
    @UseGuards(JwtAuthGuard)
    async createProduct(@Body() data: Partial<Product>, @Request() req) {
        return this.catalogueService.createProduct(data, req.user?.userId);
    }

    @Post('products/upload-images')
    @UseInterceptors(FilesInterceptor('images', 10, { storage: imageStorage }))
    async uploadImages(@UploadedFiles() files: Express.Multer.File[]) {
        const urls = files.map(file => `/uploads/products/images/${file.filename}`);
        return { urls };
    }

    @Post('upload')
    @UseInterceptors(FileInterceptor('file', { storage: presentationStorage }))
    async uploadFile(@UploadedFile() file: Express.Multer.File) {
        return { url: `/uploads/presentations/${file.filename}` };
    }

    @Post('products/upload-video')
    @UseInterceptors(FileInterceptor('video', { storage: videoStorage }))
    async uploadVideo(@UploadedFile() file: Express.Multer.File) {
        return { url: `/uploads/products/videos/${file.filename}` };
    }

    @Post('products/upload-model')
    @UseInterceptors(FileInterceptor('model', { storage: modelStorage }))
    async uploadModel(@UploadedFile() file: Express.Multer.File) {
        return { url: `/uploads/products/models/${file.filename}` };
    }

    @Post('products/upload-technical-sheet')
    @UseInterceptors(FileInterceptor('technicalSheet', { 
        storage: technicalSheetStorage,
        limits: {
            fileSize: 20 * 1024 * 1024, // 20MB limit for technical sheets
        },
        fileFilter: (req, file, cb) => {
            if (file.mimetype === 'application/pdf' || file.originalname?.toLowerCase().endsWith('.pdf')) {
                cb(null, true);
            } else {
                cb(new BadRequestException('Only PDF files are allowed'), false);
            }
        }
    }))
    async uploadTechnicalSheet(@UploadedFile() file: Express.Multer.File) {
        if (!file) {
            throw new BadRequestException('No file uploaded or file was rejected. Please upload a valid PDF file.');
        }
        return { url: `/uploads/products/technical-sheets/${file.filename}` };
    }

    @Post('products/:productId/track-technical-sheet-download')
    async trackTechnicalSheetDownload(
        @Param('productId') productId: string,
        @Body() data: { email: string },
        @Request() req
    ) {
        const ipAddress = req.ip || req.connection.remoteAddress;
        const userAgent = req.headers['user-agent'];
        const referrer = req.headers['referer'] || req.headers['referrer'];
        
        return this.catalogueService.trackTechnicalSheetDownload(
            productId,
            data.email,
            ipAddress,
            userAgent,
            referrer
        );
    }

    @Get('products/:productId/technical-sheet-downloads')
    @UseGuards(JwtAuthGuard)
    async getTechnicalSheetDownloads(@Param('productId') productId: string) {
        return this.catalogueService.getTechnicalSheetDownloads(productId);
    }

    @Get('technical-sheet-downloads')
    @UseGuards(JwtAuthGuard)
    async getAllTechnicalSheetDownloads() {
        return this.catalogueService.getAllTechnicalSheetDownloads();
    }

    @Put('products/:id')
    @UseGuards(JwtAuthGuard)
    async updateProduct(@Param('id') id: string, @Body() data: Partial<Product>, @Request() req) {
        return this.catalogueService.updateProduct(id, data, req.user?.userId);
    }

    @Delete('products/:id')
    @UseGuards(JwtAuthGuard)
    async deleteProduct(@Param('id') id: string, @Request() req) {
        return this.catalogueService.deleteProduct(id, req.user?.userId);
    }

    // Categories
    @Get('categories')
    async getAllCategories() {
        return this.catalogueService.findAllCategories();
    }

    @Get('categories/:id')
    async getCategory(@Param('id') id: string) {
        return this.catalogueService.findOneCategory(id);
    }

    @Post('categories')
    @UseGuards(JwtAuthGuard)
    async createCategory(@Body() data: Partial<Category>, @Request() req) {
        return this.catalogueService.createCategory(data, req.user?.userId);
    }

    @Post('categories/upload-image')
    @UseInterceptors(FileInterceptor('image', { storage: categoryImageStorage }))
    async uploadCategoryImage(@UploadedFile() file: Express.Multer.File) {
        return { url: `/uploads/categories/${file.filename}` };
    }

    @Put('categories/:id')
    @UseGuards(JwtAuthGuard)
    async updateCategory(@Param('id') id: string, @Body() data: Partial<Category>, @Request() req) {
        return this.catalogueService.updateCategory(id, data, req.user?.userId);
    }

    @Delete('categories/:id')
    @UseGuards(JwtAuthGuard)
    async deleteCategory(@Param('id') id: string, @Request() req) {
        return this.catalogueService.deleteCategory(id, req.user?.userId);
    }

    // Collections
    @Get('collections')
    async getAllCollections() {
        return this.catalogueService.findAllCollections();
    }

    @Get('collections/:id')
    async getCollection(@Param('id') id: string) {
        return this.catalogueService.findOneCollection(id);
    }

    @Post('collections')
    @UseGuards(JwtAuthGuard)
    async createCollection(@Body() data: Partial<Collection>, @Request() req) {
        return this.catalogueService.createCollection(data, req.user?.userId);
    }

    @Post('collections/upload-image')
    @UseInterceptors(FileInterceptor('image', { storage: collectionImageStorage }))
    async uploadCollectionImage(@UploadedFile() file: Express.Multer.File) {
        return { url: `/uploads/collections/${file.filename}` };
    }

    @Put('collections/:id')
    @UseGuards(JwtAuthGuard)
    async updateCollection(@Param('id') id: string, @Body() data: Partial<Collection>, @Request() req) {
        return this.catalogueService.updateCollection(id, data, req.user?.userId);
    }

    @Delete('collections/:id')
    @UseGuards(JwtAuthGuard)
    async deleteCollection(@Param('id') id: string, @Request() req) {
        return this.catalogueService.deleteCollection(id, req.user?.userId);
    }

    // Designers
    @Get('designers')
    async getAllDesigners() {
        return this.catalogueService.findAllDesigners();
    }

    @Get('designers/:id')
    async getDesigner(@Param('id') id: string) {
        return this.catalogueService.findOneDesigner(id);
    }

    @Post('designers')
    @UseGuards(JwtAuthGuard)
    async createDesigner(@Body() data: Partial<Designer>, @Request() req) {
        return this.catalogueService.createDesigner(data, req.user?.userId);
    }

    @Post('designers/upload-profile')
    @UseInterceptors(FileInterceptor('image', { storage: designerImageStorage }))
    async uploadDesignerProfile(@UploadedFile() file: Express.Multer.File) {
        return { url: `/uploads/designers/${file.filename}` };
    }

    @Post('designers/upload-portfolio')
    @UseInterceptors(FilesInterceptor('images', 10, { storage: designerImageStorage }))
    async uploadDesignerPortfolio(@UploadedFiles() files: Express.Multer.File[]) {
        const urls = files.map(file => `/uploads/designers/${file.filename}`);
        return { urls };
    }

    @Put('designers/:id')
    @UseGuards(JwtAuthGuard)
    async updateDesigner(@Param('id') id: string, @Body() data: Partial<Designer>, @Request() req) {
        return this.catalogueService.updateDesigner(id, data, req.user?.userId);
    }

    @Delete('designers/:id')
    @UseGuards(JwtAuthGuard)
    async deleteDesigner(@Param('id') id: string, @Request() req) {
        return this.catalogueService.deleteDesigner(id, req.user?.userId);
    }

    // Analytics
    @Get('analytics')
    async getAnalytics() {
        return this.catalogueService.getAnalytics();
    }

    // Export
    @Get('export/products')
    async exportProducts(@Res() res: Response, @Query() query: any) {
        const csv = await this.catalogueService.exportProductsCSV(query);
        res.header('Content-Type', 'text/csv');
        res.header('Content-Disposition', 'attachment; filename=products.csv');
        res.send(csv);
    }

    @Get('export/categories')
    async exportCategories(@Res() res: Response) {
        const csv = await this.catalogueService.exportCategoriesCSV();
        res.header('Content-Type', 'text/csv');
        res.header('Content-Disposition', 'attachment; filename=categories.csv');
        res.send(csv);
    }

    @Get('export/collections')
    async exportCollections(@Res() res: Response) {
        const csv = await this.catalogueService.exportCollectionsCSV();
        res.header('Content-Type', 'text/csv');
        res.header('Content-Disposition', 'attachment; filename=collections.csv');
        res.send(csv);
    }

    @Get('export/designers')
    async exportDesigners(@Res() res: Response) {
        const csv = await this.catalogueService.exportDesignersCSV();
        res.header('Content-Type', 'text/csv');
        res.header('Content-Disposition', 'attachment; filename=designers.csv');
        res.send(csv);
    }

    @Get('export/all')
    async exportAll(@Res() res: Response) {
        const zip = await this.catalogueService.exportAllZIP();
        res.header('Content-Type', 'application/zip');
        res.header('Content-Disposition', 'attachment; filename=catalogue-export.zip');
        res.send(zip);
    }

    @Get('template/products')
    @UseGuards(JwtAuthGuard, PermissionsGuard)
    @RequireRoles(RoleType.SUPER_ADMIN)
    async downloadProductTemplate(@Res() res: Response) {
        const csv = await this.catalogueService.getProductTemplate();
        res.header('Content-Type', 'text/csv');
        res.header('Content-Disposition', 'attachment; filename=product-import-template.csv');
        res.send(csv);
    }

    @Post('import/validate')
    @UseGuards(JwtAuthGuard, PermissionsGuard)
    @RequireRoles(RoleType.SUPER_ADMIN)
    @UseInterceptors(FileInterceptor('file', { storage: memoryStorage() }))
    async validateImport(@UploadedFile() file: Express.Multer.File) {
        if (!file || !file.buffer) {
            throw new BadRequestException('No file uploaded or file is empty');
        }
        return this.catalogueService.validateProductsFromCSV(file.buffer.toString());
    }

    @Post('import/products')
    @UseGuards(JwtAuthGuard, PermissionsGuard)
    @RequireRoles(RoleType.SUPER_ADMIN)
    @UseInterceptors(FileInterceptor('file', { storage: memoryStorage() }))
    async importProducts(@UploadedFile() file: Express.Multer.File, @Request() req) {
        if (!file || !file.buffer) {
            throw new BadRequestException('No file uploaded or file is empty');
        }
        return this.catalogueService.importProductsFromCSV(file.buffer.toString(), req.user?.userId);
    }
}
