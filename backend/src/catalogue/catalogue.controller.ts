import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, UseInterceptors, UploadedFiles, UploadedFile, Res } from '@nestjs/common';
import { FileInterceptor, FilesInterceptor, FileFieldsInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { CatalogueService } from './catalogue.service';
import { Product } from '../entities/product.entity';
import { Category } from '../entities/category.entity';
import { Collection } from '../entities/collection.entity';
import { Designer } from '../entities/designer.entity';
import { ApiKeyGuard } from '../guards/api-key.guard';

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

@Controller('catalogue')
@UseGuards(ApiKeyGuard)
export class CatalogueController {
    constructor(private readonly catalogueService: CatalogueService) { }

    // Products
    @Get('products')
    async getAllProducts() {
        return this.catalogueService.findAllProducts();
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
    async createProduct(@Body() data: Partial<Product>) {
        return this.catalogueService.createProduct(data);
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

    @Put('products/:id')
    async updateProduct(@Param('id') id: string, @Body() data: Partial<Product>) {
        return this.catalogueService.updateProduct(id, data);
    }

    @Delete('products/:id')
    async deleteProduct(@Param('id') id: string) {
        return this.catalogueService.deleteProduct(id);
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
    async createCategory(@Body() data: Partial<Category>) {
        return this.catalogueService.createCategory(data);
    }

    @Post('categories/upload-image')
    @UseInterceptors(FileInterceptor('image', { storage: categoryImageStorage }))
    async uploadCategoryImage(@UploadedFile() file: Express.Multer.File) {
        return { url: `/uploads/categories/${file.filename}` };
    }

    @Put('categories/:id')
    async updateCategory(@Param('id') id: string, @Body() data: Partial<Category>) {
        return this.catalogueService.updateCategory(id, data);
    }

    @Delete('categories/:id')
    async deleteCategory(@Param('id') id: string) {
        return this.catalogueService.deleteCategory(id);
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
    async createCollection(@Body() data: Partial<Collection>) {
        return this.catalogueService.createCollection(data);
    }

    @Post('collections/upload-image')
    @UseInterceptors(FileInterceptor('image', { storage: collectionImageStorage }))
    async uploadCollectionImage(@UploadedFile() file: Express.Multer.File) {
        return { url: `/uploads/collections/${file.filename}` };
    }

    @Put('collections/:id')
    async updateCollection(@Param('id') id: string, @Body() data: Partial<Collection>) {
        return this.catalogueService.updateCollection(id, data);
    }

    @Delete('collections/:id')
    async deleteCollection(@Param('id') id: string) {
        return this.catalogueService.deleteCollection(id);
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
    async createDesigner(@Body() data: Partial<Designer>) {
        return this.catalogueService.createDesigner(data);
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
    async updateDesigner(@Param('id') id: string, @Body() data: Partial<Designer>) {
        return this.catalogueService.updateDesigner(id, data);
    }

    @Delete('designers/:id')
    async deleteDesigner(@Param('id') id: string) {
        return this.catalogueService.deleteDesigner(id);
    }

    // Analytics
    @Get('analytics')
    async getAnalytics() {
        return this.catalogueService.getAnalytics();
    }

    // Export
    @Get('export/products')
    async exportProducts(@Res() res: Response) {
        const csv = await this.catalogueService.exportProductsCSV();
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

    @Get('export/all')
    async exportAll(@Res() res: Response) {
        const zip = await this.catalogueService.exportAllZIP();
        res.header('Content-Type', 'application/zip');
        res.header('Content-Disposition', 'attachment; filename=catalogue-export.zip');
        res.send(zip);
    }

    @Get('template/products')
    async downloadProductTemplate(@Res() res: Response) {
        const csv = await this.catalogueService.getProductTemplate();
        res.header('Content-Type', 'text/csv');
        res.header('Content-Disposition', 'attachment; filename=product-import-template.csv');
        res.send(csv);
    }

    @Post('import/products')
    @UseInterceptors(FileInterceptor('file'))
    async importProducts(@UploadedFile() file: Express.Multer.File) {
        return this.catalogueService.importProductsFromCSV(file.buffer.toString());
    }
}
