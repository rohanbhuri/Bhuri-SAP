import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MongoRepository } from 'typeorm';
import { Product } from '../entities/product.entity';
import { Category } from '../entities/category.entity';
import { Collection } from '../entities/collection.entity';
import { Designer } from '../entities/designer.entity';
import { Enquiry } from '../entities/enquiry.entity';
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
        @InjectRepository(Designer)
        private designerRepository: MongoRepository<Designer>,
        @InjectRepository(Enquiry)
        private enquiryRepository: MongoRepository<Enquiry>,
    ) { }

    // Products
    async findAllProducts(query: { 
        page?: number; 
        limit?: number; 
        search?: string; 
        categoryId?: string; 
        collectionId?: string;
        designerId?: string;
        isExclusive?: string | boolean;
        isFeatured?: string | boolean;
        isPublished?: string | boolean;
    } = {}): Promise<{ items: Product[]; total: number }> {
        const page = Number(query.page) || 1;
        const limit = Number(query.limit) || 10;
        const skip = (page - 1) * limit;

        const where: any = {};

        if (query.search) {
            where.$or = [
                { name: { $regex: query.search, $options: 'i' } },
                { productCode: { $regex: query.search, $options: 'i' } }
            ];
        }

        if (query.categoryId) {
            where.categoryId = query.categoryId;
        }

        if (query.collectionId) {
            where.collectionId = query.collectionId;
        }

        if (query.designerId) {
            where.designerId = query.designerId;
        }

        if (query.isFeatured !== undefined) {
            where.isFeatured = query.isFeatured === 'true' || query.isFeatured === true;
        }

        if (query.isExclusive !== undefined) {
            where.isExclusive = query.isExclusive === 'true' || query.isExclusive === true;
        }

        if (query.isPublished !== undefined) {
            where.isPublished = query.isPublished === 'true' || query.isPublished === true;
        }

        const [items, total] = await this.productRepository.findAndCount({
            where,
            skip,
            take: limit,
            order: { createdAt: 'DESC' }
        } as any);

        return { items, total };
    }

    async checkProductCodeExists(productCode: string, excludeId?: string): Promise<boolean> {
        const query: any = { productCode };
        if (excludeId) {
            query._id = { $ne: new ObjectId(excludeId) };
        }
        const product = await this.productRepository.findOne({ where: query });
        return !!product;
    }

    async findOneProduct(id: string): Promise<Product> {
        return this.productRepository.findOneBy({ _id: new ObjectId(id) });
    }

    async createProduct(data: Partial<Product>): Promise<Product> {
        // Check if product code already exists
        if (data.productCode) {
            const exists = await this.checkProductCodeExists(data.productCode);
            if (exists) {
                throw new ConflictException('Product code already exists');
            }
        }
        
        const product = this.productRepository.create({
            ...data,
            createdAt: new Date(),
            updatedAt: new Date()
        });
        return this.productRepository.save(product);
    }

    async updateProduct(id: string, data: Partial<Product>): Promise<Product> {
        // Check if product code already exists (excluding current product)
        if (data.productCode) {
            const exists = await this.checkProductCodeExists(data.productCode, id);
            if (exists) {
                throw new ConflictException('Product code already exists');
            }
        }
        
        await this.productRepository.update(id, {
            ...data,
            updatedAt: new Date()
        });
        return this.findOneProduct(id);
    }

    async deleteProduct(id: string): Promise<void> {
        await this.productRepository.delete(id);
    }

    // Categories
    async findAllCategories(): Promise<Category[]> {
        return this.categoryRepository.find();
    }

    async findOneCategory(id: string): Promise<Category> {
        return this.categoryRepository.findOneBy({ _id: new ObjectId(id) });
    }

    async createCategory(data: Partial<Category>): Promise<Category> {
        const category = this.categoryRepository.create({
            ...data,
            createdAt: new Date(),
            updatedAt: new Date()
        });
        return this.categoryRepository.save(category);
    }

    async updateCategory(id: string, data: Partial<Category>): Promise<Category> {
        await this.categoryRepository.update(id, {
            ...data,
            updatedAt: new Date()
        });
        return this.findOneCategory(id);
    }

    async deleteCategory(id: string): Promise<void> {
        await this.categoryRepository.delete(id);
    }

    // Collections
    async findAllCollections(): Promise<Collection[]> {
        return this.collectionRepository.find();
    }

    async findOneCollection(id: string): Promise<Collection> {
        return this.collectionRepository.findOneBy({ _id: new ObjectId(id) });
    }

    async createCollection(data: Partial<Collection>): Promise<Collection> {
        const collection = this.collectionRepository.create({
            ...data,
            createdAt: new Date(),
            updatedAt: new Date()
        });
        return this.collectionRepository.save(collection);
    }

    async updateCollection(id: string, data: Partial<Collection>): Promise<Collection> {
        await this.collectionRepository.update(id, {
            ...data,
            updatedAt: new Date()
        });
        return this.findOneCollection(id);
    }

    async deleteCollection(id: string): Promise<void> {
        await this.collectionRepository.delete(id);
    }

    // Designers
    async findAllDesigners(): Promise<Designer[]> {
        return this.designerRepository.find();
    }

    async findOneDesigner(id: string): Promise<Designer> {
        return this.designerRepository.findOneBy({ _id: new ObjectId(id) });
    }

    async createDesigner(data: Partial<Designer>): Promise<Designer> {
        const designer = this.designerRepository.create({
            ...data,
            createdAt: new Date(),
            updatedAt: new Date()
        });
        return this.designerRepository.save(designer);
    }

    async updateDesigner(id: string, data: Partial<Designer>): Promise<Designer> {
        await this.designerRepository.update(id, {
            ...data,
            updatedAt: new Date()
        });
        return this.findOneDesigner(id);
    }

    async deleteDesigner(id: string): Promise<void> {
        await this.designerRepository.delete(id);
    }

    // Analytics
    async getAnalytics() {
        const products = await this.productRepository.find();
        const categories = await this.categoryRepository.find();
        const collections = await this.collectionRepository.find();
        const designers = await this.designerRepository.find();

        const totalVariations = products.reduce((sum, p) => sum + (p.variations?.length || 0), 0);
        const prices = products.map(p => p.basePrice || 0).filter(p => p > 0);
        
        const categoryMap = new Map();
        categories.forEach(c => categoryMap.set(c._id.toString(), c.name));
        
        const collectionMap = new Map();
        collections.forEach(c => collectionMap.set(c._id.toString(), c.name));

        const productsByCategory = {};
        const productsByCollection = {};
        
        products.forEach(p => {
            const catId = p.categoryId || 'uncategorized';
            productsByCategory[catId] = (productsByCategory[catId] || 0) + 1;
            
            const colId = p.collectionId || 'none';
            productsByCollection[colId] = (productsByCollection[colId] || 0) + 1;
        });

        const mediaAssets = {
            images: products.reduce((sum, p) => sum + (p.imageGallery?.length || 0) + (p.featuredImage ? 1 : 0), 0),
            videos: products.reduce((sum, p) => sum + (p.videos?.length || 0), 0),
            models3d: products.reduce((sum, p) => sum + (p.models3d?.length || 0), 0)
        };

        // Calculate recent changes (last 7 days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        
        const recentChanges = {
            products: products.filter(p => p.updatedAt && new Date(p.updatedAt) >= sevenDaysAgo).length,
            categories: categories.filter(c => c.updatedAt && new Date(c.updatedAt) >= sevenDaysAgo).length,
            collections: collections.filter(c => c.updatedAt && new Date(c.updatedAt) >= sevenDaysAgo).length,
            designers: designers.filter(d => d.updatedAt && new Date(d.updatedAt) >= sevenDaysAgo).length
        };

        // Product Popularity (based on enquiries)
        const enquiries = await this.enquiryRepository.find();
        const productPopularityMap = new Map();
        enquiries.forEach(enq => {
            enq.items?.forEach(item => {
                if (item.productId) {
                    const count = productPopularityMap.get(item.productId) || 0;
                    productPopularityMap.set(item.productId, count + 1);
                }
            });
        });

        const productMap = new Map();
        products.forEach(p => productMap.set(p._id.toString(), p.name));

        const popularProducts = Array.from(productPopularityMap.entries())
            .map(([productId, count]) => ({
                id: productId,
                name: productMap.get(productId) || 'Unknown Product',
                count
            }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 5);

        return {
            totalProducts: products.length,
            publishedProducts: products.filter(p => p.isPublished).length,
            totalCategories: categories.length,
            activeCategories: categories.filter(c => c.isActive).length,
            totalCollections: collections.length,
            activeCollections: collections.filter(c => c.isActive).length,
            totalDesigners: designers.length,
            activeDesigners: designers.filter(d => d.isActive).length,
            totalVariations,
            avgVariationsPerProduct: products.length ? (totalVariations / products.length).toFixed(1) : 0,
            productsByCategory: Object.entries(productsByCategory).map(([id, count]) => ({
                id,
                name: categoryMap.get(id) || 'Uncategorized',
                count
            })),
            productsByCollection: Object.entries(productsByCollection).map(([id, count]) => ({
                id,
                name: collectionMap.get(id) || 'No Collection',
                count
            })),
            popularProducts,
            priceRange: {
                min: prices.length ? Math.min(...prices) : 0,
                avg: prices.length ? (prices.reduce((a, b) => a + b, 0) / prices.length).toFixed(2) : 0,
                max: prices.length ? Math.max(...prices) : 0
            },
            mediaAssets,
            recentChanges
        };
    }

    // Export
    async exportProductsCSV(query: { 
        search?: string; 
        categoryId?: string; 
        collectionId?: string;
        designerId?: string;
        isExclusive?: string | boolean;
        isFeatured?: string | boolean;
        isPublished?: string | boolean;
    } = {}): Promise<string> {
        const where: any = {};

        if (query.search) {
            where.$or = [
                { name: { $regex: query.search, $options: 'i' } },
                { productCode: { $regex: query.search, $options: 'i' } }
            ];
        }

        if (query.categoryId) {
            where.categoryId = query.categoryId;
        }

        if (query.collectionId) {
            where.collectionId = query.collectionId;
        }

        if (query.designerId) {
            where.designerId = query.designerId;
        }

        if (query.isFeatured !== undefined) {
             where.isFeatured = query.isFeatured === 'true' || query.isFeatured === true;
        }

        if (query.isExclusive !== undefined) {
            where.isExclusive = query.isExclusive === 'true' || query.isExclusive === true;
        }

        if (query.isPublished !== undefined) {
            where.isPublished = query.isPublished === 'true' || query.isPublished === true;
        }

        const products = await this.productRepository.find({
            where,
            order: { createdAt: 'DESC' }
        } as any);
        const headers = [
            '_id', 'name', 'productCode', 'slug', 'description', 'descriptionHtml',
            'basePrice', 'currency', 'featuredImage', 'imageGallery', 'videos', 'models3d',
            'categoryId', 'collectionId', 'designerId', 'tags', 'isPublished', 'isExclusive', 'isFeatured',
            'dimensionConfig', 'variations', 'attributes', 'seo', 'createdAt', 'updatedAt'
        ];
        const rows = products.map(p => [
            p._id.toString(),
            p.name,
            p.productCode,
            p.slug,
            p.description || '',
            p.descriptionHtml || '',
            p.basePrice,
            p.currency,
            p.featuredImage || '',
            p.imageGallery?.join('; ') || '',
            p.videos?.join('; ') || '',
            p.models3d?.join('; ') || '',
            p.categoryId || '',
            p.collectionId || '',
            p.designerId || '',
            p.tags?.join('; ') || '',
            p.isPublished ? 'true' : 'false',
            p.isExclusive ? 'true' : 'false',
            p.isFeatured ? 'true' : 'false',
            JSON.stringify(p.dimensionConfig),
            JSON.stringify(p.variations),
            JSON.stringify(p.attributes),
            JSON.stringify(p.seo),
            p.createdAt?.toISOString() || '',
            p.updatedAt?.toISOString() || ''
        ]);
        return [headers, ...rows].map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')).join('\n');
    }

    async exportCategoriesCSV(): Promise<string> {
        const categories = await this.categoryRepository.find();
        const headers = ['ID', 'Name', 'Slug', 'Description', 'Active', 'Image'];
        const rows = categories.map(c => [
            c._id.toString(),
            c.name,
            c.slug,
            c.description || '',
            c.isActive ? 'Yes' : 'No',
            c.image || ''
        ]);
        return [headers, ...rows].map(row => row.join(',')).join('\n');
    }

    async exportDesignersCSV(): Promise<string> {
        const designers = await this.designerRepository.find();
        const headers = ['ID', 'Name', 'Bio', 'Description', 'Email', 'Phone', 'Website', 'Active', 'Profile Image'];
        const rows = designers.map(d => [
            d._id.toString(),
            d.name,
            d.bio || '',
            d.description || '',
            d.email || '',
            d.phone || '',
            d.website || '',
            d.isActive ? 'Yes' : 'No',
            d.profileImage || ''
        ]);
        return [headers, ...rows].map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')).join('\n');
    }

    async exportCollectionsCSV(): Promise<string> {
        const collections = await this.collectionRepository.find();
        const headers = ['ID', 'Name', 'Slug', 'Description', 'Active', 'Exclusive', 'Appointment Required', 'Featured', 'Image'];
        const rows = collections.map(c => [
            c._id.toString(),
            c.name,
            c.slug,
            c.description || '',
            c.isActive ? 'Yes' : 'No',
            c.isExclusive ? 'Yes' : 'No',
            c.isAppointmentRequired ? 'Yes' : 'No',
            c.isFeatured ? 'Yes' : 'No',
            c.image || ''
        ]);
        return [headers, ...rows].map(row => row.join(',')).join('\n');
    }

    async exportAllZIP(): Promise<Buffer> {
        const AdmZip = require('adm-zip');
        const zip = new AdmZip();
        
        zip.addFile('products.csv', Buffer.from(await this.exportProductsCSV()));
        zip.addFile('categories.csv', Buffer.from(await this.exportCategoriesCSV()));
        zip.addFile('collections.csv', Buffer.from(await this.exportCollectionsCSV()));
        zip.addFile('designers.csv', Buffer.from(await this.exportDesignersCSV()));
        
        return zip.toBuffer();
    }

    async getProductTemplate(): Promise<string> {
        const headers = [
            '_id', 'name', 'productCode', 'slug', 'description', 'descriptionHtml',
            'basePrice', 'currency', 'featuredImage', 'imageGallery', 'videos', 'models3d',
            'categoryId', 'collectionId', 'designerId', 'tags', 'isPublished', 'isExclusive', 'isFeatured',
            'dimensionConfig', 'variations', 'attributes', 'seo', 'createdAt', 'updatedAt'
        ];
        return headers.map(h => `"${h}"`).join(',');
    }

    async importProductsFromCSV(csvContent: string): Promise<{ success: number; failed: number; errors: string[] }> {
        const lines = csvContent.split(/\r?\n/).filter(line => line.trim());
        if (lines.length === 0) return { success: 0, failed: 0, errors: ['Empty CSV file'] };

        const parseLine = (line: string) => {
            const result = [];
            let current = '';
            let inQuotes = false;
            for (let i = 0; i < line.length; i++) {
                const char = line[i];
                if (char === '"') {
                    if (inQuotes && line[i + 1] === '"') {
                        current += '"';
                        i++;
                    } else {
                        inQuotes = !inQuotes;
                    }
                } else if (char === ',' && !inQuotes) {
                    result.push(current.trim());
                    current = '';
                } else {
                    current += char;
                }
            }
            result.push(current.trim());
            return result;
        };

        const headers = parseLine(lines[0]);
        let success = 0;
        let failed = 0;
        const errors: string[] = [];

        for (let i = 1; i < lines.length; i++) {
            try {
                const values = parseLine(lines[i]);
                const product: any = {};

                headers.forEach((header, index) => {
                    const value = values[index];
                    if (value !== undefined && value !== '') {
                        if (header === 'tags' || header === 'imageGallery' || header === 'videos' || header === 'models3d') {
                            product[header] = value.split(';').map(v => v.trim()).filter(v => v);
                        } else if (header === 'basePrice' || header === 'widthMin' || header === 'widthMax' || header === 'widthDefault' || header === 'height' || header === 'depth' || header === 'diameterMin' || header === 'diameterMax' || header === 'diameterDefault') {
                            product[header] = parseFloat(value) || 0;
                        } else if (header === 'isPublished' || header === 'isExclusive' || header === 'isAppointmentRequired' || header === 'isFeatured') {
                            product[header] = value.toLowerCase() === 'true';
                        } else if (header === 'dimensionConfig' || header === 'variations' || header === 'attributes' || header === 'seo') {
                            try {
                                product[header] = JSON.parse(value);
                            } catch {
                                product[header] = {};
                            }
                        } else if (header === 'createdAt' || header === 'updatedAt') {
                            product[header] = value ? new Date(value) : undefined;
                        } else {
                            product[header] = value;
                        }
                    }
                });

                // Clean up temporary fields logic helper
                const cleanLegacyFields = (p: any) => {
                    delete p.dimensionShape;
                    delete p.dimensionUnit;
                    delete p.widthMin;
                    delete p.widthMax;
                    delete p.widthDefault;
                    delete p.height;
                    delete p.depth;
                    delete p.diameterMin;
                    delete p.diameterMax;
                    delete p.diameterDefault;
                    delete p.seoTitle;
                    delete p.seoDescription;
                    delete p.seoKeywords;
                };

                // Check if product with this code already exists
                let existingProduct = null;
                if (product.productCode) {
                    existingProduct = await this.productRepository.findOne({
                        where: { productCode: product.productCode }
                    } as any);
                }

                if (existingProduct) {
                    // UPDATE EXISTING PRODUCT
                    
                    // Only build/merge complex objects if relevant fields are actually in the CSV for this row
                    const hasLegacyDimension = ['dimensionShape', 'dimensionUnit', 'widthMin', 'widthMax', 'widthDefault', 'height', 'depth', 'diameterMin', 'diameterMax', 'diameterDefault'].some(k => k in product);
                    if (hasLegacyDimension && (!product.dimensionConfig || Object.keys(product.dimensionConfig).length === 0)) {
                        const current = existingProduct.dimensionConfig || {};
                        product.dimensionConfig = {
                            shape: product.dimensionShape || current.shape || 'rectangle',
                            unit: product.dimensionUnit || current.unit || 'cm',
                            width: product.widthMin !== undefined ? { min: product.widthMin, max: product.widthMax || 0, default: product.widthDefault || 0 } : current.width,
                            height: product.height !== undefined ? product.height : current.height,
                            depth: product.depth !== undefined ? product.depth : current.depth,
                            diameter: product.diameterMin !== undefined ? { min: product.diameterMin, max: product.diameterMax || 0, default: product.diameterDefault || 0 } : current.diameter
                        };
                    }

                    const hasLegacySeo = ['seoTitle', 'seoDescription', 'seoKeywords'].some(k => k in product);
                    if (hasLegacySeo && (!product.seo || Object.keys(product.seo).length === 0)) {
                        const current = existingProduct.seo || {};
                        product.seo = {
                            title: product.seoTitle || current.title,
                            description: product.seoDescription || current.description,
                            keywords: product.seoKeywords || current.keywords
                        };
                    }

                    cleanLegacyFields(product);
                    delete product._id;
                    
                    // updatedAt is handled by updateProduct
                    await this.updateProduct(existingProduct._id.toString(), product);
                } else {
                    // CREATE NEW PRODUCT
                    
                    // If dimensionConfig is not provided, build from legacy fields or use defaults
                    if (!product.dimensionConfig || Object.keys(product.dimensionConfig).length === 0) {
                        product.dimensionConfig = {
                            shape: product.dimensionShape || 'rectangle',
                            unit: product.dimensionUnit || 'cm',
                            width: product.widthMin !== undefined ? { min: product.widthMin, max: product.widthMax || 0, default: product.widthDefault || 0 } : undefined,
                            height: product.height || undefined,
                            depth: product.depth || undefined,
                            diameter: product.diameterMin !== undefined ? { min: product.diameterMin, max: product.diameterMax || 0, default: product.diameterDefault || 0 } : undefined
                        };
                    }

                    if (!product.seo || Object.keys(product.seo).length === 0) {
                        product.seo = {
                            title: product.seoTitle,
                            description: product.seoDescription,
                            keywords: product.seoKeywords
                        };
                    }

                    cleanLegacyFields(product);

                    // Set defaults for new products
                    product.imageGallery = product.imageGallery || [];
                    product.videos = product.videos || [];
                    product.models3d = product.models3d || [];
                    product.tags = product.tags || [];
                    product.variations = product.variations || [];
                    product.attributes = product.attributes || {};
                    product.seo = product.seo || {};

                    await this.createProduct(product);
                }
                success++;
            } catch (error) {
                failed++;
                errors.push(`Row ${i + 1}: ${error.message}`);
            }
        }

        return { success, failed, errors };
    }
}
