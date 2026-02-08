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
exports.QuotationsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const quotation_entity_1 = require("../entities/quotation.entity");
const enquiry_entity_1 = require("../entities/enquiry.entity");
const email_template_entity_1 = require("../entities/email-template.entity");
const presentation_entity_1 = require("../entities/presentation.entity");
const product_entity_1 = require("../entities/product.entity");
const client_entity_1 = require("../entities/client.entity");
const user_entity_1 = require("../entities/user.entity");
const role_entity_1 = require("../entities/role.entity");
const notifications_service_1 = require("../notifications/notifications.service");
const mongodb_1 = require("mongodb");
const https = require("https");
const http = require("http");
const ExcelJS = require("exceljs");
const fs = require("fs");
const PptxGenJS = require('pptxgenjs');
let QuotationsService = class QuotationsService {
    constructor(quotationRepository, enquiryRepository, emailTemplateRepository, presentationRepository, productRepository, clientRepository, userRepository, roleRepository, notificationsService) {
        this.quotationRepository = quotationRepository;
        this.enquiryRepository = enquiryRepository;
        this.emailTemplateRepository = emailTemplateRepository;
        this.presentationRepository = presentationRepository;
        this.productRepository = productRepository;
        this.clientRepository = clientRepository;
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.notificationsService = notificationsService;
    }
    async findAll(organizationId) {
        return this.quotationRepository.find({ where: { organizationId, isDeleted: { $ne: true } } });
    }
    async findOne(id) {
        return this.quotationRepository.findOneBy({ _id: new mongodb_1.ObjectId(id) });
    }
    async findByClient(clientId) {
        return this.quotationRepository.find({ where: { clientId, isDeleted: { $ne: true } } });
    }
    async create(data, organizationId) {
        const quotation = this.quotationRepository.create({
            ...data,
            organizationId,
            quotationNumber: `Q-${Date.now()}`,
            createdAt: new Date(),
            changeLog: []
        });
        return this.quotationRepository.save(quotation);
    }
    async createFromEnquiry(enquiryId, userId) {
        const enquiry = await this.enquiryRepository.findOneBy({ _id: new mongodb_1.ObjectId(enquiryId) });
        if (!enquiry)
            throw new common_1.NotFoundException('Enquiry not found');
        const client = await this.clientRepository.findOneBy({ _id: new mongodb_1.ObjectId(enquiry.clientId) });
        const quotationItems = await Promise.all(enquiry.items.map(async (item) => {
            const product = await this.productRepository.findOneBy({
                _id: new mongodb_1.ObjectId(item.productId)
            });
            return {
                productId: item.productId,
                productName: product?.name || item.productName,
                quantity: item.quantity,
                originalPrice: product?.basePrice || item.unitPrice,
                unitPrice: product?.basePrice || item.unitPrice,
                total: item.quantity * (product?.basePrice || item.unitPrice),
                description: item.specifications
            };
        }));
        const subtotal = quotationItems.reduce((sum, item) => sum + item.total, 0);
        const taxTotal = subtotal * 0.18;
        const grandTotal = subtotal + taxTotal;
        const quotation = await this.quotationRepository.save({
            quotationNumber: `Q-${Date.now()}`,
            clientId: enquiry.clientId,
            clientName: client?.contactPerson || enquiry.customerName,
            clientEmail: client?.email || enquiry.customerEmail,
            enquiryId,
            items: quotationItems,
            subtotal,
            taxTotal,
            discountTotal: 0,
            grandTotal,
            currency: 'INR',
            status: quotation_entity_1.QuotationStatus.DRAFT,
            validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            organizationId: enquiry.organizationId,
            createdBy: userId,
            createdAt: new Date()
        });
        await this.enquiryRepository.update({ _id: new mongodb_1.ObjectId(enquiryId) }, { quotationId: quotation._id.toString(), status: enquiry_entity_1.EnquiryStatus.QUOTED, updatedAt: new Date() });
        return quotation;
    }
    async update(id, data, userId) {
        const current = await this.findOne(id);
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
            if (changes.length > 0) {
                changeLog.push({ userId, action: 'updated', timestamp: new Date(), details: `Updated: ${changes.join(', ')}` });
            }
        }
        await this.quotationRepository.update({ _id: new mongodb_1.ObjectId(id) }, {
            ...data,
            updatedAt: new Date(),
            changeLog
        });
        return this.findOne(id);
    }
    async submitForApproval(id) {
        const quotation = await this.update(id, { status: quotation_entity_1.QuotationStatus.PENDING_APPROVAL });
        try {
            const adminRoles = await this.roleRepository.find({
                where: { type: { $in: [role_entity_1.RoleType.ADMIN, role_entity_1.RoleType.SUPER_ADMIN] } }
            });
            const adminRoleIds = adminRoles.map(role => role._id);
            const admins = await this.userRepository.find({
                where: {
                    roleIds: { $in: adminRoleIds },
                    organizationIds: { $in: [new mongodb_1.ObjectId(quotation.organizationId)] }
                }
            });
            for (const admin of admins) {
                await this.notificationsService.createNotification(admin._id, 'system', 'Quotation Pending Approval', `Quotation ${quotation.quotationNumber} for ${quotation.clientName} requires your approval.`, {
                    quotationId: quotation._id,
                    organizationId: new mongodb_1.ObjectId(quotation.organizationId),
                    type: 'quotation_approval_request'
                });
            }
        }
        catch (error) {
            console.error('Failed to send quotation approval notifications:', error);
        }
        return quotation;
    }
    async approve(id, userId) {
        const quotation = await this.update(id, {
            status: quotation_entity_1.QuotationStatus.APPROVED,
            approvedBy: userId,
            approvedAt: new Date()
        });
        try {
            if (quotation.createdBy) {
                await this.notificationsService.createNotification(new mongodb_1.ObjectId(quotation.createdBy), 'module_approved', 'Quotation Approved', `Your quotation ${quotation.quotationNumber} has been approved.`, {
                    quotationId: quotation._id,
                    organizationId: new mongodb_1.ObjectId(quotation.organizationId),
                    type: 'quotation_approved'
                });
            }
        }
        catch (error) {
            console.error('Failed to send quotation approval notification:', error);
        }
        return quotation;
    }
    async sendQuotation(id, via) {
        const quotation = await this.findOne(id);
        if (!quotation)
            throw new common_1.NotFoundException('Quotation not found');
        if (quotation.status !== quotation_entity_1.QuotationStatus.APPROVED) {
            throw new Error('Only approved quotations can be sent');
        }
        return this.update(id, {
            status: quotation_entity_1.QuotationStatus.SENT,
            sentAt: new Date(),
            sentVia: via
        });
    }
    async delete(id, userId) {
        const quotation = await this.findOne(id);
        if (quotation?.presentationId) {
            await this.presentationRepository.update({ _id: new mongodb_1.ObjectId(quotation.presentationId) }, { quotationId: null, updatedAt: new Date() });
        }
        const changeLog = quotation?.changeLog || [];
        if (userId) {
            changeLog.push({ userId, action: 'deleted', timestamp: new Date(), details: 'Quotation soft-deleted' });
        }
        await this.quotationRepository.update({ _id: new mongodb_1.ObjectId(id) }, {
            isDeleted: true,
            deletedAt: new Date(),
            deletedBy: userId,
            changeLog: changeLog
        });
    }
    async findAllEnquiries(organizationId) {
        return this.enquiryRepository.find({ where: { organizationId, isDeleted: { $ne: true } } });
    }
    async findEnquiry(id) {
        return this.enquiryRepository.findOneBy({ _id: new mongodb_1.ObjectId(id) });
    }
    async createEnquiry(data, organizationId) {
        const enquiry = this.enquiryRepository.create({
            ...data,
            organizationId,
            enquiryNumber: `ENQ-${Date.now()}`,
            createdAt: new Date(),
            changeLog: []
        });
        return this.enquiryRepository.save(enquiry);
    }
    async createFromWebsiteCart(cartData, organizationId) {
        const enquiryData = {
            customerName: cartData.customerName,
            customerEmail: cartData.customerEmail,
            customerPhone: cartData.customerPhone,
            company: cartData.company,
            items: cartData.items.map(item => ({
                productId: item.productId,
                productName: item.productName,
                quantity: item.quantity,
                unitPrice: item.unitPrice,
                specifications: item.specifications
            })),
            message: cartData.message,
            source: enquiry_entity_1.EnquirySource.WEBSITE,
            status: enquiry_entity_1.EnquiryStatus.NEW,
            organizationId
        };
        return this.createEnquiry(enquiryData, organizationId);
    }
    async updateEnquiry(id, data, userId) {
        const current = await this.findEnquiry(id);
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
            if (changes.length > 0) {
                changeLog.push({ userId, action: 'updated', timestamp: new Date(), details: `Updated: ${changes.join(', ')}` });
            }
        }
        await this.enquiryRepository.update({ _id: new mongodb_1.ObjectId(id) }, {
            ...data,
            updatedAt: new Date(),
            changeLog
        });
        return this.findEnquiry(id);
    }
    async deleteEnquiry(id, userId) {
        const enquiry = await this.findEnquiry(id);
        const changeLog = enquiry?.changeLog || [];
        if (userId) {
            changeLog.push({ userId, action: 'deleted', timestamp: new Date(), details: 'Enquiry soft-deleted' });
        }
        await this.enquiryRepository.update({ _id: new mongodb_1.ObjectId(id) }, {
            isDeleted: true,
            deletedAt: new Date(),
            deletedBy: userId,
            changeLog: changeLog
        });
    }
    async findAllTemplates() {
        return this.emailTemplateRepository.find();
    }
    async createTemplate(data) {
        const template = this.emailTemplateRepository.create(data);
        return this.emailTemplateRepository.save(template);
    }
    async findAllPresentations(organizationId) {
        return this.presentationRepository.find({ where: { organizationId, isDeleted: { $ne: true } } });
    }
    async findPresentation(id) {
        return this.presentationRepository.findOneBy({ _id: new mongodb_1.ObjectId(id) });
    }
    async createPresentation(data, organizationId, userId) {
        const presentation = this.presentationRepository.create({
            ...data,
            organizationId,
            presentationNumber: `PRES-${Date.now()}`,
            createdBy: userId,
            createdAt: new Date(),
            status: presentation_entity_1.PresentationStatus.DRAFT,
            changeLog: [{ userId, action: 'created', timestamp: new Date(), details: 'Presentation created' }]
        });
        return this.presentationRepository.save(presentation);
    }
    async updatePresentation(id, data, userId) {
        const presentation = await this.findPresentation(id);
        if (!presentation)
            throw new common_1.NotFoundException('Presentation not found');
        if (presentation.status !== presentation_entity_1.PresentationStatus.DRAFT) {
            throw new Error('Only draft presentations can be edited');
        }
        const changeLog = presentation?.changeLog || [];
        if (userId) {
            const changes = [];
            const skipFields = ['updatedAt', 'updatedBy', 'changeLog', '_id'];
            for (const key in data) {
                if (skipFields.includes(key))
                    continue;
                if (JSON.stringify(presentation[key]) !== JSON.stringify(data[key])) {
                    changes.push(key);
                }
            }
            if (changes.length > 0) {
                changeLog.push({ userId, action: 'updated', timestamp: new Date(), details: `Updated: ${changes.join(', ')}` });
            }
        }
        await this.presentationRepository.update({ _id: new mongodb_1.ObjectId(id) }, {
            ...data,
            updatedAt: new Date(),
            changeLog
        });
        return this.findPresentation(id);
    }
    async markPresentationFinal(id) {
        const presentation = await this.findPresentation(id);
        if (!presentation)
            throw new common_1.NotFoundException('Presentation not found');
        if (presentation.status !== presentation_entity_1.PresentationStatus.DRAFT) {
            throw new Error('Only draft presentations can be marked as final');
        }
        await this.presentationRepository.update({ _id: new mongodb_1.ObjectId(id) }, { status: presentation_entity_1.PresentationStatus.FINAL, updatedAt: new Date() });
        return this.findPresentation(id);
    }
    async sendPresentationToClient(id) {
        const presentation = await this.findPresentation(id);
        if (!presentation)
            throw new common_1.NotFoundException('Presentation not found');
        if (presentation.status !== presentation_entity_1.PresentationStatus.FINAL) {
            throw new Error('Only final presentations can be sent to client');
        }
        await this.presentationRepository.update({ _id: new mongodb_1.ObjectId(id) }, { status: presentation_entity_1.PresentationStatus.SENT_TO_CLIENT, sentAt: new Date(), updatedAt: new Date() });
        return this.findPresentation(id);
    }
    async deletePresentation(id, userId) {
        const presentation = await this.findPresentation(id);
        const changeLog = presentation?.changeLog || [];
        if (userId) {
            changeLog.push({ userId, action: 'deleted', timestamp: new Date(), details: 'Presentation soft-deleted' });
        }
        await this.presentationRepository.update({ _id: new mongodb_1.ObjectId(id) }, {
            isDeleted: true,
            deletedAt: new Date(),
            deletedBy: userId,
            changeLog: changeLog
        });
    }
    async linkQuotationToPresentation(presentationId, quotationId) {
        await this.presentationRepository.update({ _id: new mongodb_1.ObjectId(presentationId) }, { quotationId, updatedAt: new Date() });
        return this.findPresentation(presentationId);
    }
    downloadImage(url) {
        return new Promise((resolve, reject) => {
            const protocol = url.startsWith('https') ? https : http;
            protocol.get(url, (response) => {
                if (response.statusCode !== 200) {
                    reject(new Error(`Failed to download image: ${response.statusCode}`));
                    return;
                }
                const chunks = [];
                response.on('data', (chunk) => chunks.push(chunk));
                response.on('end', () => resolve(Buffer.concat(chunks)));
                response.on('error', reject);
            }).on('error', reject);
        });
    }
    async getProductImageSource(product) {
        const candidates = [product.featuredImage, ...(product.imageGallery || [])];
        for (const candidate of candidates) {
            if (!candidate)
                continue;
            if (candidate.startsWith('http')) {
                try {
                    const buffer = await this.downloadImage(candidate);
                    return { data: buffer.toString('base64') };
                }
                catch (e) {
                    console.error(`Failed to download product image: ${candidate}`, e.message);
                    continue;
                }
            }
            else {
                const imgPath = candidate.startsWith('/') ? `.${candidate}` : candidate;
                if (fs.existsSync(imgPath)) {
                    return { path: imgPath };
                }
            }
        }
        return null;
    }
    resolveImagePath(imagePath) {
        if (!imagePath)
            return null;
        if (imagePath.startsWith('http'))
            return imagePath;
        const localPath = imagePath.startsWith('/') ? `.${imagePath}` : imagePath;
        if (fs.existsSync(localPath))
            return localPath;
        return null;
    }
    async generatePPTX(id) {
        const presentation = await this.findPresentation(id);
        if (!presentation)
            throw new common_1.NotFoundException('Presentation not found');
        let displayClientName = presentation.clientName || 'Client';
        if (presentation.clientId) {
            try {
                const client = await this.clientRepository.findOneBy({ _id: new mongodb_1.ObjectId(presentation.clientId) });
                if (client && client.contactPerson) {
                    displayClientName = client.contactPerson;
                }
            }
            catch (e) {
                console.error('Error fetching client for PPTX generation:', e);
            }
        }
        const pptx = new PptxGenJS();
        pptx.layout = 'LAYOUT_WIDE';
        pptx.defineLayout({ name: 'CUSTOM', width: 10, height: 5.625 });
        pptx.layout = 'CUSTOM';
        const coverSlide = pptx.addSlide();
        if (presentation.coverBackground) {
            const imagePath = this.resolveImagePath(presentation.coverBackground);
            if (imagePath) {
                try {
                    coverSlide.addImage({ path: imagePath, x: 0, y: 0, w: '100%', h: '100%', sizing: { type: 'cover', w: '100%', h: '100%' } });
                }
                catch (error) {
                    coverSlide.background = { color: 'FFFFFF' };
                }
            }
            else {
                coverSlide.background = { color: 'FFFFFF' };
            }
        }
        else {
            coverSlide.background = { color: 'FFFFFF' };
        }
        if (presentation.overlayColor && presentation.overlayTransparency) {
            const overlayColor = presentation.overlayColor.replace('#', '');
            const transparency = Math.round((presentation.overlayTransparency / 100) * 100);
            coverSlide.addShape(pptx.ShapeType.rect, {
                x: 0, y: 0, w: '100%', h: '100%',
                fill: { color: overlayColor, transparency }
            });
        }
        try {
            coverSlide.addImage({ path: '../configs/assets/raccontixrm/icons/logo-racconti.png', x: 4.055, y: 1.5, w: 1.89, h: 0.2 });
        }
        catch (error) {
            console.error('Failed to load brand logo');
        }
        const textColor = presentation.textColor?.replace('#', '') || 'FFFFFF';
        coverSlide.addText('Design Concept For', { x: 3.5, y: 2.5, w: 3, h: 0.3, fontSize: 18, align: 'center', color: textColor });
        coverSlide.addText(displayClientName, { x: 3.5, y: 2.9, w: 3, h: 0.4, fontSize: 24, bold: true, align: 'center', color: textColor });
        if (presentation.layoutImage) {
            const layoutSlide = pptx.addSlide();
            layoutSlide.background = { color: 'FFFFFF' };
            try {
                layoutSlide.addImage({ path: '../configs/assets/raccontixrm/icons/logo-racconti.png', x: 8.555, y: 0.4, w: 0.945, h: 0.1 });
            }
            catch (error) {
                console.error('Failed to load brand logo');
            }
            layoutSlide.addText('Layout', { x: 0.2, y: 0.2, w: 2, h: 0.3, fontSize: 14, bold: true, color: '000000' });
            const layoutImagePath = this.resolveImagePath(presentation.layoutImage);
            if (layoutImagePath) {
                try {
                    layoutSlide.addImage({ path: layoutImagePath, x: 0.5, y: 0.8 });
                }
                catch (error) {
                    console.error('Failed to load layout image:', error);
                }
            }
        }
        for (const slide of presentation.slides) {
            const products = await Promise.all(slide.productIds.map(pid => this.productRepository.findOneBy({ _id: new mongodb_1.ObjectId(pid) })));
            if (slide.layout === 'single' && products[0]) {
                const productSlide = pptx.addSlide();
                try {
                    productSlide.addImage({ path: '../configs/assets/raccontixrm/icons/logo-racconti.png', x: 8.555, y: 0.4, w: 0.945, h: 0.1 });
                }
                catch (error) {
                    console.error('Failed to load brand logo');
                }
                if (slide.slideTitle) {
                    productSlide.addText(slide.slideTitle, { x: 0.2, y: 0.2, w: 3, h: 0.3, fontSize: 14, bold: true, color: '000000' });
                }
                const product = products[0];
                const imageSource = await this.getProductImageSource(product);
                if (imageSource) {
                    try {
                        productSlide.addImage({ ...imageSource, x: 0.5, y: 1 });
                    }
                    catch (error) {
                        console.error('Failed to load product image:', product.name, error.message);
                    }
                }
                productSlide.addText(product.name, { x: 1, y: 4.7, w: 8, h: 0.3, fontSize: 20, bold: true });
                productSlide.addText(`Code: ${product.productCode}`, { x: 1, y: 5.1, w: 8, h: 0.2, fontSize: 14, color: '666666' });
            }
            else {
                const validProducts = products.filter(p => p);
                const productChunks = [];
                for (let i = 0; i < validProducts.length; i += 2) {
                    productChunks.push(validProducts.slice(i, i + 2));
                }
                for (const chunk of productChunks) {
                    const productSlide = pptx.addSlide();
                    try {
                        productSlide.addImage({ path: '../configs/assets/raccontixrm/icons/logo-racconti.png', x: 8.555, y: 0.4, w: 0.945, h: 0.1 });
                    }
                    catch (error) {
                        console.error('Failed to load brand logo');
                    }
                    if (slide.slideTitle) {
                        productSlide.addText(slide.slideTitle, { x: 0.2, y: 0.2, w: 3, h: 0.3, fontSize: 14, bold: true, color: '000000' });
                    }
                    let yPos = 0.5;
                    for (const product of chunk) {
                        const imageSource = await this.getProductImageSource(product);
                        if (imageSource) {
                            try {
                                productSlide.addImage({ ...imageSource, x: 1, y: yPos });
                            }
                            catch (error) {
                                console.error('Failed to load product image:', product.name, error.message);
                            }
                        }
                        productSlide.addText(product.name, { x: 4.5, y: yPos, w: 5, h: 0.3, fontSize: 16, bold: true });
                        productSlide.addText(`Code: ${product.productCode}`, { x: 4.5, y: yPos + 0.4, w: 5, h: 0.2, fontSize: 12, color: '666666' });
                        yPos += 2.5;
                    }
                }
            }
        }
        const thankYouSlide = pptx.addSlide();
        thankYouSlide.background = { color: 'FFFFFF' };
        try {
            thankYouSlide.addImage({ path: '../configs/assets/raccontixrm/icons/logo-racconti.png', x: 4.055, y: 1.5, w: 1.89, h: 0.2 });
        }
        catch (error) {
            console.error('Failed to load brand logo');
        }
        thankYouSlide.addText('Thank You', { x: 3, y: 2.5, w: 4, h: 0.6, fontSize: 36, bold: true, align: 'center', color: '000000' });
        thankYouSlide.addText('We look forward to working with you', { x: 2.5, y: 3.3, w: 5, h: 0.3, fontSize: 18, align: 'center', color: '666666' });
        return pptx.write({ outputType: 'nodebuffer' });
    }
    async convertPresentationToQuotation(presentationId) {
        const presentation = await this.findPresentation(presentationId);
        if (!presentation)
            throw new common_1.NotFoundException('Presentation not found');
        if (presentation.status !== presentation_entity_1.PresentationStatus.FINAL && presentation.status !== presentation_entity_1.PresentationStatus.SENT_TO_CLIENT) {
            throw new Error('Only final or sent presentations can be converted to quotation');
        }
        if (presentation.quotationId) {
            return { existingQuotationId: presentation.quotationId };
        }
        const productIds = [...new Set(presentation.slides.flatMap(slide => slide.productIds))];
        const products = await Promise.all(productIds.map(pid => this.productRepository.findOneBy({ _id: new mongodb_1.ObjectId(pid) })));
        const items = products.filter(p => p).map(product => ({
            productId: product._id.toString(),
            productName: product.name,
            quantity: 1,
            originalPrice: product.basePrice,
            unitPrice: product.basePrice,
            total: product.basePrice
        }));
        const subtotal = items.reduce((sum, item) => sum + item.total, 0);
        return {
            clientId: presentation.clientId,
            clientName: presentation.clientName,
            items,
            subtotal,
            discountTotal: 0,
            grandTotal: subtotal,
            currency: 'INR'
        };
    }
    async generateQuotationExcel(id) {
        const quotation = await this.findOne(id);
        if (!quotation)
            throw new common_1.NotFoundException('Quotation not found');
        let clientName = 'CLIENT';
        try {
            if (quotation.clientId) {
                const client = await this.clientRepository.findOneBy({ _id: new mongodb_1.ObjectId(quotation.clientId) });
                if (client) {
                    clientName = client.contactPerson || client.companyName || 'CLIENT';
                }
            }
            if (clientName === 'CLIENT' && quotation.clientName) {
                clientName = quotation.clientName;
            }
        }
        catch (error) {
            console.error('Error fetching client for Excel:', error);
            clientName = quotation.clientName || 'CLIENT';
        }
        const downloadImage = (url) => {
            return new Promise((resolve, reject) => {
                const protocol = url.startsWith('https') ? https : http;
                protocol.get(url, (response) => {
                    const chunks = [];
                    response.on('data', (chunk) => chunks.push(chunk));
                    response.on('end', () => resolve(Buffer.concat(chunks)));
                    response.on('error', reject);
                }).on('error', reject);
            });
        };
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Quotation');
        worksheet.mergeCells('A1:L1');
        const titleCell = worksheet.getCell('A1');
        titleCell.value = clientName.toUpperCase();
        titleCell.font = { size: 18, bold: true, color: { argb: 'FFF1C40F' } };
        titleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF2C3E50' } };
        titleCell.alignment = { horizontal: 'center', vertical: 'middle' };
        worksheet.getRow(1).height = 40;
        const columns = [
            { header: 'S.NO', key: 'sno', width: 8 },
            { header: 'PRODUCT CODE', key: 'productCode', width: 15 },
            { header: 'PRODUCT NAME', key: 'productName', width: 20 },
            { header: 'REF. IMAGE', key: 'image', width: 15 },
            { header: 'QTY', key: 'quantity', width: 8 },
            { header: 'SEATER', key: 'seater', width: 10 },
            { header: 'MEASUREMENTS', key: 'measurements', width: 18 },
            { header: 'PRICE PER PIECE', key: 'unitPrice', width: 15 }
        ];
        if (quotation.discount || quotation.discountTotal > 0) {
            const discountLabel = quotation.discount?.type === 'percentage'
                ? `DISCOUNTED PRICE PER PIECE @ ${quotation.discount.value}%`
                : 'DISCOUNTED PRICE PER PIECE';
            columns.push({ header: discountLabel, key: 'discountedUnitPrice', width: 20 });
        }
        columns.push({ header: 'PRICE', key: 'total', width: 12 });
        if (quotation.discount || quotation.discountTotal > 0) {
            const discountLabel = quotation.discount?.type === 'percentage'
                ? `DISCOUNTED PRICE @ ${quotation.discount.value}%`
                : 'DISCOUNTED PRICE';
            columns.push({ header: discountLabel, key: 'discountedTotal', width: 18 });
        }
        columns.push({ header: 'SPECIFICATION', key: 'specification', width: 30 });
        worksheet.columns = columns;
        const headerRow = worksheet.getRow(2);
        headerRow.values = columns.map(c => c.header);
        headerRow.font = { bold: true, color: { argb: 'FFF1C40F' } };
        headerRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF2C3E50' } };
        headerRow.alignment = { horizontal: 'center', vertical: 'middle' };
        headerRow.height = 30;
        const groupedItems = {};
        for (const item of quotation.items) {
            const product = await this.productRepository.findOneBy({ _id: new mongodb_1.ObjectId(item.productId) });
            const area = product?.tags?.[0] || 'ITEMS';
            if (!groupedItems[area])
                groupedItems[area] = [];
            groupedItems[area].push({ ...item, product });
        }
        let sno = 1;
        let currentRow = 3;
        for (const [area, items] of Object.entries(groupedItems)) {
            worksheet.mergeCells(`A${currentRow}:${String.fromCharCode(64 + columns.length)}${currentRow}`);
            const areaCell = worksheet.getCell(`A${currentRow}`);
            areaCell.value = area.toUpperCase();
            areaCell.font = { bold: true, color: { argb: 'FFF1C40F' } };
            areaCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF34495E' } };
            areaCell.alignment = { horizontal: 'left', vertical: 'middle' };
            worksheet.getRow(currentRow).height = 20;
            currentRow++;
            for (const item of items) {
                const product = item.product;
                const shape = product?.dimensionConfig?.shape || 'rectangle';
                const unit = product?.dimensionConfig?.unit || 'cm';
                const width = shape === 'rectangle'
                    ? (item.customDimensions?.width || product?.dimensionConfig?.width?.default || '')
                    : (item.customDimensions?.diameter || product?.dimensionConfig?.diameter?.default || '');
                const depth = item.customDimensions?.depth || product?.dimensionConfig?.depth || '';
                const height = item.customDimensions?.height || product?.dimensionConfig?.height || '';
                const label = shape === 'rectangle' ? 'W' : 'D';
                const measurements = `${label}:${width} D:${depth} H:${height} (${unit})`;
                const rowData = {
                    sno: sno++,
                    productCode: item.productCode || product?.productCode || '',
                    productName: item.productName || '',
                    image: '',
                    quantity: item.quantity,
                    seater: product?.attributes?.seater || '',
                    measurements: measurements
                };
                rowData.unitPrice = item.unitPrice;
                if (quotation.discount || quotation.discountTotal > 0) {
                    rowData.discountedUnitPrice = quotation.discount?.type === 'percentage'
                        ? item.unitPrice * (1 - quotation.discount.value / 100)
                        : item.unitPrice;
                }
                rowData.total = item.total;
                if (quotation.discount || quotation.discountTotal > 0) {
                    rowData.discountedTotal = item.discountedPrice || (item.total * (1 - (quotation.discount?.value || 0) / 100));
                }
                rowData.specification = '';
                const row = worksheet.addRow(rowData);
                row.alignment = { horizontal: 'center', vertical: 'middle' };
                row.height = 60;
                row.border = {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' }
                };
                if (product?.featuredImage || product?.imageGallery?.[0]) {
                    try {
                        const imgUrl = product.featuredImage || product.imageGallery[0];
                        let imageBuffer;
                        if (imgUrl.startsWith('http://') || imgUrl.startsWith('https://')) {
                            imageBuffer = await downloadImage(imgUrl);
                        }
                        else {
                            const fs = require('fs');
                            const imgPath = imgUrl.startsWith('/') ? `.${imgUrl}` : imgUrl;
                            if (fs.existsSync(imgPath)) {
                                imageBuffer = fs.readFileSync(imgPath);
                            }
                            else {
                                console.error('Excel image file does not exist:', imgPath);
                                imageBuffer = null;
                            }
                        }
                        if (imageBuffer) {
                            const imageId = workbook.addImage({
                                buffer: imageBuffer,
                                extension: 'jpeg',
                            });
                            worksheet.addImage(imageId, {
                                tl: { col: 3, row: currentRow - 1 },
                                ext: { width: 80, height: 60 }
                            });
                        }
                    }
                    catch (e) {
                        console.error('Failed to add image:', e);
                    }
                }
                currentRow++;
            }
        }
        return workbook.xlsx.writeBuffer();
    }
};
exports.QuotationsService = QuotationsService;
exports.QuotationsService = QuotationsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(quotation_entity_1.Quotation)),
    __param(1, (0, typeorm_1.InjectRepository)(enquiry_entity_1.Enquiry)),
    __param(2, (0, typeorm_1.InjectRepository)(email_template_entity_1.EmailTemplate)),
    __param(3, (0, typeorm_1.InjectRepository)(presentation_entity_1.Presentation)),
    __param(4, (0, typeorm_1.InjectRepository)(product_entity_1.Product)),
    __param(5, (0, typeorm_1.InjectRepository)(client_entity_1.Client)),
    __param(6, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(7, (0, typeorm_1.InjectRepository)(role_entity_1.Role)),
    __metadata("design:paramtypes", [typeorm_2.MongoRepository,
        typeorm_2.MongoRepository,
        typeorm_2.MongoRepository,
        typeorm_2.MongoRepository,
        typeorm_2.MongoRepository,
        typeorm_2.MongoRepository,
        typeorm_2.MongoRepository,
        typeorm_2.MongoRepository,
        notifications_service_1.NotificationsService])
], QuotationsService);
//# sourceMappingURL=quotations.service.js.map