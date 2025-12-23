import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MongoRepository } from 'typeorm';
import { Product } from '../entities/product.entity';
import { Category } from '../entities/category.entity';
import { Collection } from '../entities/collection.entity';
import { ObjectId } from 'mongodb';

@Injectable()
export class CatalogueService {
    constructor(
        @InjectRepository(Product)
        private productRepository: MongoRepository<Product>,
        @InjectRepository(Category)
        private categoryRepository: MongoRepository<Category>,
        @InjectRepository(Collection)
        private collectionRepository: MongoRepository<Collection>,
    ) { }

    // Products
    async findAllProducts(): Promise<Product[]> {
        return this.productRepository.find();
    }

    async findOneProduct(id: string): Promise<Product> {
        return this.productRepository.findOneBy({ _id: new ObjectId(id) });
    }

    async createProduct(data: Partial<Product>): Promise<Product> {
        const product = this.productRepository.create(data);
        return this.productRepository.save(product);
    }

    async updateProduct(id: string, data: Partial<Product>): Promise<Product> {
        await this.productRepository.update(id, data);
        return this.findOneProduct(id);
    }

    async deleteProduct(id: string): Promise<void> {
        await this.productRepository.delete(id);
    }

    // Categories
    async findAllCategories(): Promise<Category[]> {
        return this.categoryRepository.find();
    }

    async createCategory(data: Partial<Category>): Promise<Category> {
        const category = this.categoryRepository.create(data);
        return this.categoryRepository.save(category);
    }

    // Collections
    async findAllCollections(): Promise<Collection[]> {
        return this.collectionRepository.find();
    }

    async createCollection(data: Partial<Collection>): Promise<Collection> {
        const collection = this.collectionRepository.create(data);
        return this.collectionRepository.save(collection);
    }
}
