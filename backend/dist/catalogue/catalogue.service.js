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
exports.CatalogueService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const product_entity_1 = require("../entities/product.entity");
const category_entity_1 = require("../entities/category.entity");
const collection_entity_1 = require("../entities/collection.entity");
const designer_entity_1 = require("../entities/designer.entity");
const enquiry_entity_1 = require("../entities/enquiry.entity");
const mongodb_1 = require("mongodb");
let CatalogueService = class CatalogueService {
    constructor(productRepository, categoryRepository, collectionRepository, designerRepository, enquiryRepository) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
        this.collectionRepository = collectionRepository;
        this.designerRepository = designerRepository;
        this.enquiryRepository = enquiryRepository;
    }
    async findAllProducts(query = {}) {
        const page = Number(query.page) || 1;
        const limit = Number(query.limit) || 10;
        const skip = (page - 1) * limit;
        const where = { isDeleted: { $ne: true } };
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
        });
        return { items, total };
    }
    async checkProductCodeExists(productCode, excludeId) {
        const query = { productCode };
        if (excludeId) {
            query._id = { $ne: new mongodb_1.ObjectId(excludeId) };
        }
        const product = await this.productRepository.findOne({ where: query });
        return !!product;
    }
    async findOneProduct(id) {
        return this.productRepository.findOneBy({ _id: new mongodb_1.ObjectId(id) });
    }
    async createProduct(data, userId) {
        if (data.productCode) {
            const exists = await this.checkProductCodeExists(data.productCode);
            if (exists) {
                throw new common_1.ConflictException('Product code already exists');
            }
        }
        const product = this.productRepository.create({
            ...data,
            createdAt: new Date(),
            updatedAt: new Date(),
            createdBy: userId,
            updatedBy: userId,
            changeLog: userId ? [{ userId, action: 'created', timestamp: new Date(), details: 'Initial creation' }] : []
        });
        return this.productRepository.save(product);
    }
    async updateProduct(id, data, userId) {
        if (data.productCode) {
            const exists = await this.checkProductCodeExists(data.productCode, id);
            if (exists) {
                throw new common_1.ConflictException('Product code already exists');
            }
        }
        const current = await this.findOneProduct(id);
        const changeLog = current?.changeLog || [];
        if (userId) {
            const changes = [];
            const skipFields = ['updatedAt', 'updatedBy', 'changeLog', '_id'];
            for (const key in data) {
                if (skipFields.includes(key))
                    continue;
                const oldValue = current[key];
                const newValue = data[key];
                if (JSON.stringify(oldValue) !== JSON.stringify(newValue)) {
                    if (key === 'variations') {
                        const oldLen = oldValue?.length || 0;
                        const newLen = newValue?.length || 0;
                        changes.push(`variations (${oldLen} -> ${newLen})`);
                    }
                    else if (key === 'imageGallery') {
                        changes.push('images updated');
                    }
                    else if (Array.isArray(newValue)) {
                        changes.push(`${key} (array)`);
                    }
                    else {
                        changes.push(key);
                    }
                }
            }
            const details = changes.length > 0 ? `Updated: ${changes.join(', ')}` : 'No significant changes';
            changeLog.push({ userId, action: 'updated', timestamp: new Date(), details });
        }
        await this.productRepository.update(id, {
            ...data,
            updatedAt: new Date(),
            updatedBy: userId,
            changeLog
        });
        return this.findOneProduct(id);
    }
    async deleteProduct(id, userId) {
        const current = await this.findOneProduct(id);
        const changeLog = current?.changeLog || [];
        if (userId) {
            changeLog.push({ userId, action: 'deleted', timestamp: new Date(), details: 'Product soft-deleted' });
        }
        await this.productRepository.update(id, {
            isDeleted: true,
            isPublished: false,
            deletedAt: new Date(),
            deletedBy: userId,
            changeLog
        });
    }
    async findAllCategories() {
        return this.categoryRepository.find({ where: { isDeleted: { $ne: true } } });
    }
    async findOneCategory(id) {
        return this.categoryRepository.findOneBy({ _id: new mongodb_1.ObjectId(id) });
    }
    async createCategory(data, userId) {
        const category = this.categoryRepository.create({
            ...data,
            createdAt: new Date(),
            updatedAt: new Date(),
            createdBy: userId,
            updatedBy: userId,
            changeLog: userId ? [{ userId, action: 'created', timestamp: new Date(), details: 'Initial creation' }] : []
        });
        return this.categoryRepository.save(category);
    }
    async updateCategory(id, data, userId) {
        const current = await this.findOneCategory(id);
        const changeLog = current?.changeLog || [];
        if (userId) {
            const changes = [];
            const skipFields = ['updatedAt', 'updatedBy', 'changeLog', '_id'];
            for (const key in data) {
                if (skipFields.includes(key))
                    continue;
                if (JSON.stringify(current[key]) !== JSON.stringify(data[key])) {
                    changes.push(key);
                }
            }
            const details = changes.length > 0 ? `Updated: ${changes.join(', ')}` : 'No significant changes';
            changeLog.push({ userId, action: 'updated', timestamp: new Date(), details });
        }
        await this.categoryRepository.update(id, {
            ...data,
            updatedAt: new Date(),
            updatedBy: userId,
            changeLog
        });
        return this.findOneCategory(id);
    }
    async deleteCategory(id, userId) {
        const current = await this.findOneCategory(id);
        const changeLog = current?.changeLog || [];
        if (userId) {
            changeLog.push({ userId, action: 'deleted', timestamp: new Date(), details: 'Category soft-deleted' });
        }
        await this.categoryRepository.update(id, {
            isDeleted: true,
            isActive: false,
            deletedAt: new Date(),
            deletedBy: userId,
            changeLog
        });
    }
    async findAllCollections() {
        return this.collectionRepository.find({ where: { isDeleted: { $ne: true } } });
    }
    async findOneCollection(id) {
        return this.collectionRepository.findOneBy({ _id: new mongodb_1.ObjectId(id) });
    }
    async createCollection(data, userId) {
        const collection = this.collectionRepository.create({
            ...data,
            createdAt: new Date(),
            updatedAt: new Date(),
            createdBy: userId,
            updatedBy: userId,
            changeLog: userId ? [{ userId, action: 'created', timestamp: new Date(), details: 'Initial creation' }] : []
        });
        return this.collectionRepository.save(collection);
    }
    async updateCollection(id, data, userId) {
        const current = await this.findOneCollection(id);
        const changeLog = current?.changeLog || [];
        if (userId) {
            const changes = [];
            const skipFields = ['updatedAt', 'updatedBy', 'changeLog', '_id'];
            for (const key in data) {
                if (skipFields.includes(key))
                    continue;
                if (JSON.stringify(current[key]) !== JSON.stringify(data[key])) {
                    changes.push(key);
                }
            }
            const details = changes.length > 0 ? `Updated: ${changes.join(', ')}` : 'No significant changes';
            changeLog.push({ userId, action: 'updated', timestamp: new Date(), details });
        }
        await this.collectionRepository.update(id, {
            ...data,
            updatedAt: new Date(),
            updatedBy: userId,
            changeLog
        });
        return this.findOneCollection(id);
    }
    async deleteCollection(id, userId) {
        const current = await this.findOneCollection(id);
        const changeLog = current?.changeLog || [];
        if (userId) {
            changeLog.push({ userId, action: 'deleted', timestamp: new Date(), details: 'Collection soft-deleted' });
        }
        await this.collectionRepository.update(id, {
            isDeleted: true,
            isActive: false,
            deletedAt: new Date(),
            deletedBy: userId,
            changeLog
        });
    }
    async findAllDesigners() {
        return this.designerRepository.find({ where: { isDeleted: { $ne: true } } });
    }
    async findOneDesigner(id) {
        return this.designerRepository.findOneBy({ _id: new mongodb_1.ObjectId(id) });
    }
    async createDesigner(data, userId) {
        const designer = this.designerRepository.create({
            ...data,
            createdAt: new Date(),
            updatedAt: new Date(),
            createdBy: userId,
            updatedBy: userId,
            changeLog: userId ? [{ userId, action: 'created', timestamp: new Date(), details: 'Initial creation' }] : []
        });
        return this.designerRepository.save(designer);
    }
    async updateDesigner(id, data, userId) {
        const current = await this.findOneDesigner(id);
        const changeLog = current?.changeLog || [];
        if (userId) {
            const changes = [];
            const skipFields = ['updatedAt', 'updatedBy', 'changeLog', '_id'];
            for (const key in data) {
                if (skipFields.includes(key))
                    continue;
                if (JSON.stringify(current[key]) !== JSON.stringify(data[key])) {
                    changes.push(key);
                }
            }
            const details = changes.length > 0 ? `Updated: ${changes.join(', ')}` : 'No significant changes';
            changeLog.push({ userId, action: 'updated', timestamp: new Date(), details });
        }
        await this.designerRepository.update(id, {
            ...data,
            updatedAt: new Date(),
            updatedBy: userId,
            changeLog
        });
        return this.findOneDesigner(id);
    }
    async deleteDesigner(id, userId) {
        const current = await this.findOneDesigner(id);
        const changeLog = current?.changeLog || [];
        if (userId) {
            changeLog.push({ userId, action: 'deleted', timestamp: new Date(), details: 'Designer soft-deleted' });
        }
        await this.designerRepository.update(id, {
            isDeleted: true,
            isActive: false,
            deletedAt: new Date(),
            deletedBy: userId,
            changeLog
        });
    }
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
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const recentChanges = {
            products: products.filter(p => p.updatedAt && new Date(p.updatedAt) >= sevenDaysAgo).length,
            categories: categories.filter(c => c.updatedAt && new Date(c.updatedAt) >= sevenDaysAgo).length,
            collections: collections.filter(c => c.updatedAt && new Date(c.updatedAt) >= sevenDaysAgo).length,
            designers: designers.filter(d => d.updatedAt && new Date(d.updatedAt) >= sevenDaysAgo).length
        };
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
    async exportProductsCSV(query = {}) {
        const where = { isDeleted: { $ne: true } };
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
        });
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
    async exportCategoriesCSV() {
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
    async exportDesignersCSV() {
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
    async exportCollectionsCSV() {
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
    async exportAllZIP() {
        const AdmZip = require('adm-zip');
        const zip = new AdmZip();
        zip.addFile('products.csv', Buffer.from(await this.exportProductsCSV()));
        zip.addFile('categories.csv', Buffer.from(await this.exportCategoriesCSV()));
        zip.addFile('collections.csv', Buffer.from(await this.exportCollectionsCSV()));
        zip.addFile('designers.csv', Buffer.from(await this.exportDesignersCSV()));
        return zip.toBuffer();
    }
    async getProductTemplate() {
        const headers = [
            '_id', 'name', 'productCode', 'slug', 'description', 'descriptionHtml',
            'basePrice', 'currency', 'featuredImage', 'imageGallery', 'videos', 'models3d',
            'categoryId', 'collectionId', 'designerId', 'tags', 'isPublished', 'isExclusive', 'isFeatured',
            'dimensionConfig', 'variations', 'attributes', 'seo', 'createdAt', 'updatedAt'
        ];
        return headers.map(h => `"${h}"`).join(',');
    }
    parseCSVContent(csvContent) {
        const rows = [];
        let currentRow = [];
        let currentCell = '';
        let inQuotes = false;
        for (let i = 0; i < csvContent.length; i++) {
            const char = csvContent[i];
            const nextChar = csvContent[i + 1];
            if (char === '"') {
                if (inQuotes && nextChar === '"') {
                    currentCell += '"';
                    i++;
                }
                else {
                    inQuotes = !inQuotes;
                }
            }
            else if (char === ',' && !inQuotes) {
                currentRow.push(currentCell.trim());
                currentCell = '';
            }
            else if ((char === '\r' || char === '\n') && !inQuotes) {
                if (char === '\r' && nextChar === '\n')
                    i++;
                if (currentRow.length > 0 || currentCell !== '') {
                    currentRow.push(currentCell.trim());
                    rows.push(currentRow);
                }
                currentRow = [];
                currentCell = '';
            }
            else {
                currentCell += char;
            }
        }
        if (currentRow.length > 0 || currentCell !== '') {
            currentRow.push(currentCell.trim());
            rows.push(currentRow);
        }
        return rows;
    }
    async validateProductsFromCSV(csvContent) {
        const rows = this.parseCSVContent(csvContent);
        if (rows.length <= 1)
            return { totalRows: 0, toAdd: 0, toUpdate: 0, errors: ['Empty CSV file or only headers found'] };
        const headers = rows[0];
        const errors = [];
        let toAdd = 0;
        let toUpdate = 0;
        const productCodeIndex = headers.indexOf('productCode');
        const nameIndex = headers.indexOf('name');
        if (productCodeIndex === -1) {
            errors.push('Missing required header: "productCode"');
        }
        if (errors.length > 0) {
            return { totalRows: rows.length - 1, toAdd: 0, toUpdate: 0, errors };
        }
        for (let i = 1; i < rows.length; i++) {
            const values = rows[i];
            const productCode = values[productCodeIndex];
            const name = nameIndex !== -1 ? values[nameIndex] : '';
            if (!productCode) {
                errors.push(`Row ${i + 1}: Missing product code`);
                continue;
            }
            try {
                const existingProduct = await this.productRepository.findOne({
                    where: { productCode: productCode }
                });
                if (existingProduct) {
                    toUpdate++;
                }
                else {
                    if (!name) {
                        errors.push(`Row ${i + 1}: Missing name (required for new products)`);
                    }
                    toAdd++;
                }
            }
            catch (error) {
                errors.push(`Row ${i + 1}: ${error.message}`);
            }
        }
        return { totalRows: rows.length - 1, toAdd, toUpdate, errors };
    }
    async importProductsFromCSV(csvContent, userId) {
        const rows = this.parseCSVContent(csvContent);
        if (rows.length <= 1)
            return { success: 0, failed: 0, errors: ['Empty CSV file or only headers found'] };
        const headers = rows[0];
        let success = 0;
        let failed = 0;
        const errors = [];
        for (let i = 1; i < rows.length; i++) {
            try {
                const values = rows[i];
                const product = {};
                headers.forEach((header, index) => {
                    const value = values[index];
                    if (value !== undefined && value !== '') {
                        if (header === 'tags' || header === 'imageGallery' || header === 'videos' || header === 'models3d') {
                            product[header] = value.split(';').map(v => v.trim()).filter(v => v);
                        }
                        else if (header === 'basePrice' || header === 'widthMin' || header === 'widthMax' || header === 'widthDefault' || header === 'height' || header === 'depth' || header === 'diameterMin' || header === 'diameterMax' || header === 'diameterDefault') {
                            product[header] = parseFloat(value) || 0;
                        }
                        else if (header === 'isPublished' || header === 'isExclusive' || header === 'isAppointmentRequired' || header === 'isFeatured') {
                            product[header] = value.toLowerCase() === 'true';
                        }
                        else if (header === 'dimensionConfig' || header === 'variations' || header === 'attributes' || header === 'seo') {
                            try {
                                product[header] = JSON.parse(value);
                            }
                            catch {
                                product[header] = {};
                            }
                        }
                        else if (header === 'createdAt' || header === 'updatedAt') {
                            product[header] = value ? new Date(value) : undefined;
                        }
                        else {
                            product[header] = value;
                        }
                    }
                });
                const cleanLegacyFields = (p) => {
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
                let existingProduct = null;
                if (product.productCode) {
                    existingProduct = await this.productRepository.findOne({
                        where: { productCode: product.productCode }
                    });
                }
                if (existingProduct) {
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
                    const changeLog = existingProduct.changeLog || [];
                    if (userId) {
                        changeLog.push({ userId, action: 'imported-updated', timestamp: new Date() });
                    }
                    product.changeLog = changeLog;
                    cleanLegacyFields(product);
                    delete product._id;
                    await this.updateProduct(existingProduct._id.toString(), product, userId);
                }
                else {
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
                    product.imageGallery = product.imageGallery || [];
                    product.videos = product.videos || [];
                    product.models3d = product.models3d || [];
                    product.tags = product.tags || [];
                    product.variations = product.variations || [];
                    product.attributes = product.attributes || {};
                    product.seo = product.seo || {};
                    await this.createProduct(product, userId);
                }
                success++;
            }
            catch (error) {
                failed++;
                errors.push(`Row ${i + 1}: ${error.message}`);
            }
        }
        return { success, failed, errors };
    }
};
exports.CatalogueService = CatalogueService;
exports.CatalogueService = CatalogueService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(product_entity_1.Product)),
    __param(1, (0, typeorm_1.InjectRepository)(category_entity_1.Category)),
    __param(2, (0, typeorm_1.InjectRepository)(collection_entity_1.Collection)),
    __param(3, (0, typeorm_1.InjectRepository)(designer_entity_1.Designer)),
    __param(4, (0, typeorm_1.InjectRepository)(enquiry_entity_1.Enquiry)),
    __metadata("design:paramtypes", [typeorm_2.MongoRepository,
        typeorm_2.MongoRepository,
        typeorm_2.MongoRepository,
        typeorm_2.MongoRepository,
        typeorm_2.MongoRepository])
], CatalogueService);
//# sourceMappingURL=catalogue.service.js.map