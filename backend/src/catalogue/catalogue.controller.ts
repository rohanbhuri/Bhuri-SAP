import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { CatalogueService } from './catalogue.service';
import { Product } from '../entities/product.entity';
import { Category } from '../entities/category.entity';
import { Collection } from '../entities/collection.entity';
// import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'; // Uncomment when Auth is ready or stub

@Controller('catalogue')
export class CatalogueController {
    constructor(private readonly catalogueService: CatalogueService) { }

    @Get('products')
    async getAllProducts() {
        return this.catalogueService.findAllProducts();
    }

    @Get('products/:id')
    async getProduct(@Param('id') id: string) {
        return this.catalogueService.findOneProduct(id);
    }

    @Post('products')
    async createProduct(@Body() data: Partial<Product>) {
        return this.catalogueService.createProduct(data);
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

    @Post('categories')
    async createCategory(@Body() data: Partial<Category>) {
        return this.catalogueService.createCategory(data);
    }

    // Collections
    @Get('collections')
    async getAllCollections() {
        return this.catalogueService.findAllCollections();
    }

    @Post('collections')
    async createCollection(@Body() data: Partial<Collection>) {
        return this.catalogueService.createCollection(data);
    }
}
