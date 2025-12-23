import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { CatalogueService } from './catalogue.service';
import { Product } from '../entities/product.entity';
import { Category } from '../entities/category.entity';
import { Collection } from '../entities/collection.entity';
// import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'; // Uncomment when Auth is ready or stub

@Controller('catalogue')
export class CatalogueController {
    constructor(private readonly catalogueService: CatalogueService) { }

    // Products
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

    @Get('categories/:id')
    async getCategory(@Param('id') id: string) {
        return this.catalogueService.findOneCategory(id);
    }

    @Post('categories')
    async createCategory(@Body() data: Partial<Category>) {
        return this.catalogueService.createCategory(data);
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

    @Put('collections/:id')
    async updateCollection(@Param('id') id: string, @Body() data: Partial<Collection>) {
        return this.catalogueService.updateCollection(id, data);
    }

    @Delete('collections/:id')
    async deleteCollection(@Param('id') id: string) {
        return this.catalogueService.deleteCollection(id);
    }
}
