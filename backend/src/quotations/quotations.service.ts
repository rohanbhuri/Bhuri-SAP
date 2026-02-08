import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { Quotation, QuotationStatus } from '../entities/quotation.entity';
import { Enquiry, EnquiryStatus, EnquirySource } from '../entities/enquiry.entity';
import { EmailTemplate } from '../entities/email-template.entity';
import { Presentation, PresentationStatus } from '../entities/presentation.entity';
import { Product } from '../entities/product.entity';
import { Client } from '../entities/client.entity';
import { User } from '../entities/user.entity';
import { Role, RoleType } from '../entities/role.entity';
import { NotificationsService } from '../notifications/notifications.service';
import { ObjectId } from 'mongodb';
import * as PDFDocument from 'pdfkit';
import * as https from 'https';
import * as http from 'http';
import * as ExcelJS from 'exceljs';
import * as fs from 'fs';
const PptxGenJS = require('pptxgenjs');

@Injectable()
export class QuotationsService {
    constructor(
        @InjectRepository(Quotation)
        private quotationRepository: MongoRepository<Quotation>,
        @InjectRepository(Enquiry)
        private enquiryRepository: MongoRepository<Enquiry>,
        @InjectRepository(EmailTemplate)
        private emailTemplateRepository: MongoRepository<EmailTemplate>,
        @InjectRepository(Presentation)
        private presentationRepository: MongoRepository<Presentation>,
        @InjectRepository(Product)
        private productRepository: MongoRepository<Product>,
        @InjectRepository(Client)
        private clientRepository: MongoRepository<Client>,
        @InjectRepository(User)
        private userRepository: MongoRepository<User>,
        @InjectRepository(Role)
        private roleRepository: MongoRepository<Role>,
        private notificationsService: NotificationsService,
    ) { }

    // Quotations
    async findAll(organizationId: string): Promise<Quotation[]> {
        return this.quotationRepository.find({ where: { organizationId, isDeleted: { $ne: true } } as any });
    }

    async findOne(id: string): Promise<Quotation> {
        return this.quotationRepository.findOneBy({ _id: new ObjectId(id) });
    }

    async findByClient(clientId: string): Promise<Quotation[]> {
        return this.quotationRepository.find({ where: { clientId, isDeleted: { $ne: true } } as any });
    }

    async create(data: Partial<Quotation>, organizationId: string): Promise<Quotation> {
        const quotation = this.quotationRepository.create({
            ...data,
            organizationId,
            quotationNumber: `Q-${Date.now()}`,
            createdAt: new Date(),
            changeLog: []
        });
        return this.quotationRepository.save(quotation);
    }

    async createFromEnquiry(enquiryId: string, userId: string): Promise<Quotation> {
        const enquiry = await this.enquiryRepository.findOneBy({ _id: new ObjectId(enquiryId) });
        if (!enquiry) throw new NotFoundException('Enquiry not found');

        const client = await this.clientRepository.findOneBy({ _id: new ObjectId(enquiry.clientId) });

        const quotationItems = await Promise.all(
            enquiry.items.map(async (item) => {
                const product = await this.productRepository.findOneBy({
                    _id: new ObjectId(item.productId)
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
            })
        );

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
            status: QuotationStatus.DRAFT,
            validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            organizationId: enquiry.organizationId,
            createdBy: userId,
            createdAt: new Date()
        });

        await this.enquiryRepository.update(
            { _id: new ObjectId(enquiryId) },
            { quotationId: quotation._id.toString(), status: EnquiryStatus.QUOTED, updatedAt: new Date() }
        );

        return quotation;
    }

    async update(id: string, data: Partial<Quotation>, userId?: string): Promise<Quotation> {
        const current = await this.findOne(id);
        const changeLog = current?.changeLog || [];
        
        if (userId) {
            const changes = [];
            const skipFields = ['updatedAt', 'updatedBy', 'changeLog', '_id'];
            for (const key in data) {
                if (skipFields.includes(key)) continue;
                if (JSON.stringify(current[key]) !== JSON.stringify(data[key])) {
                    changes.push(key);
                }
            }
            if (changes.length > 0) {
                changeLog.push({ userId, action: 'updated', timestamp: new Date(), details: `Updated: ${changes.join(', ')}` });
            }
        }

        await this.quotationRepository.update({ _id: new ObjectId(id) }, { 
            ...data, 
            updatedAt: new Date(),
            changeLog
        } as any);
        return this.findOne(id);
    }

    async submitForApproval(id: string): Promise<Quotation> {
        const quotation = await this.update(id, { status: QuotationStatus.PENDING_APPROVAL });

        // Notify admins about the pending approval
        try {
            const adminRoles = await this.roleRepository.find({
                where: { type: { $in: [RoleType.ADMIN, RoleType.SUPER_ADMIN] } as any }
            });
            const adminRoleIds = adminRoles.map(role => role._id);
            const admins = await this.userRepository.find({
                where: {
                    roleIds: { $in: adminRoleIds } as any,
                    organizationIds: { $in: [new ObjectId(quotation.organizationId)] } as any
                }
            });

            for (const admin of admins) {
                await this.notificationsService.createNotification(
                    admin._id,
                    'system',
                    'Quotation Pending Approval',
                    `Quotation ${quotation.quotationNumber} for ${quotation.clientName} requires your approval.`,
                    {
                        quotationId: quotation._id,
                        organizationId: new ObjectId(quotation.organizationId),
                        type: 'quotation_approval_request'
                    }
                );
            }
        } catch (error) {
            console.error('Failed to send quotation approval notifications:', error);
        }

        return quotation;
    }

    async approve(id: string, userId: string): Promise<Quotation> {
        const quotation = await this.update(id, {
            status: QuotationStatus.APPROVED,
            approvedBy: userId,
            approvedAt: new Date()
        });

        // Notify the creator about the approval
        try {
            if (quotation.createdBy) {
                await this.notificationsService.createNotification(
                    new ObjectId(quotation.createdBy),
                    'module_approved',
                    'Quotation Approved',
                    `Your quotation ${quotation.quotationNumber} has been approved.`,
                    {
                        quotationId: quotation._id,
                        organizationId: new ObjectId(quotation.organizationId),
                        type: 'quotation_approved'
                    }
                );
            }
        } catch (error) {
            console.error('Failed to send quotation approval notification:', error);
        }

        return quotation;
    }

    async sendQuotation(id: string, via: 'email' | 'whatsapp'): Promise<Quotation> {
        const quotation = await this.findOne(id);
        if (!quotation) throw new NotFoundException('Quotation not found');
        if (quotation.status !== QuotationStatus.APPROVED) {
            throw new Error('Only approved quotations can be sent');
        }

        // TODO: Implement actual email/whatsapp sending
        return this.update(id, {
            status: QuotationStatus.SENT,
            sentAt: new Date(),
            sentVia: via
        });
    }

    async delete(id: string, userId?: string): Promise<void> {
        const quotation = await this.findOne(id);
        if (quotation?.presentationId) {
            await this.presentationRepository.update(
                { _id: new ObjectId(quotation.presentationId) },
                { quotationId: null, updatedAt: new Date() }
            );
        }
        
        const changeLog = quotation?.changeLog || [];
        if (userId) {
            changeLog.push({ userId, action: 'deleted', timestamp: new Date(), details: 'Quotation soft-deleted' });
        }

        await this.quotationRepository.update(
            { _id: new ObjectId(id) },
            { 
                isDeleted: true, 
                deletedAt: new Date(), 
                deletedBy: userId,
                changeLog: changeLog
            } as any
        );
    }

    // Enquiries
    async findAllEnquiries(organizationId: string): Promise<Enquiry[]> {
        return this.enquiryRepository.find({ where: { organizationId, isDeleted: { $ne: true } } as any });
    }

    async findEnquiry(id: string): Promise<Enquiry> {
        return this.enquiryRepository.findOneBy({ _id: new ObjectId(id) });
    }

    async createEnquiry(data: Partial<Enquiry>, organizationId: string): Promise<Enquiry> {
        const enquiry = this.enquiryRepository.create({
            ...data,
            organizationId,
            enquiryNumber: `ENQ-${Date.now()}`,
            createdAt: new Date(),
            changeLog: []
        });
        return this.enquiryRepository.save(enquiry);
    }

    async createFromWebsiteCart(cartData: any, organizationId: string): Promise<Enquiry> {
        // Transform cart data to enquiry format
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
            source: EnquirySource.WEBSITE,
            status: EnquiryStatus.NEW,
            organizationId
        };

        return this.createEnquiry(enquiryData, organizationId);
    }

    async updateEnquiry(id: string, data: Partial<Enquiry>, userId?: string): Promise<Enquiry> {
        const current = await this.findEnquiry(id);
        const changeLog = current?.changeLog || [];
        
        if (userId) {
            const changes = [];
            const skipFields = ['updatedAt', 'updatedBy', 'changeLog', '_id'];
            for (const key in data) {
                if (skipFields.includes(key)) continue;
                if (JSON.stringify(current[key]) !== JSON.stringify(data[key])) {
                    changes.push(key);
                }
            }
            if (changes.length > 0) {
                changeLog.push({ userId, action: 'updated', timestamp: new Date(), details: `Updated: ${changes.join(', ')}` });
            }
        }

        await this.enquiryRepository.update({ _id: new ObjectId(id) }, { 
            ...data, 
            updatedAt: new Date(),
            changeLog
        } as any);
        return this.findEnquiry(id);
    }

    async deleteEnquiry(id: string, userId?: string): Promise<void> {
        const enquiry = await this.findEnquiry(id);
        const changeLog = enquiry?.changeLog || [];
        if (userId) {
            changeLog.push({ userId, action: 'deleted', timestamp: new Date(), details: 'Enquiry soft-deleted' });
        }

        await this.enquiryRepository.update(
            { _id: new ObjectId(id) },
            { 
                isDeleted: true, 
                deletedAt: new Date(), 
                deletedBy: userId,
                changeLog: changeLog
            } as any
        );
    }

    // Email Templates
    async findAllTemplates(): Promise<EmailTemplate[]> {
        return this.emailTemplateRepository.find();
    }

    async createTemplate(data: Partial<EmailTemplate>): Promise<EmailTemplate> {
        const template = this.emailTemplateRepository.create(data);
        return this.emailTemplateRepository.save(template);
    }

    // Presentations
    async findAllPresentations(organizationId: string): Promise<Presentation[]> {
        return this.presentationRepository.find({ where: { organizationId, isDeleted: { $ne: true } } as any });
    }

    async findPresentation(id: string): Promise<Presentation> {
        return this.presentationRepository.findOneBy({ _id: new ObjectId(id) });
    }

    async createPresentation(data: Partial<Presentation>, organizationId: string, userId: string): Promise<Presentation> {
        const presentation = this.presentationRepository.create({
            ...data,
            organizationId,
            presentationNumber: `PRES-${Date.now()}`,
            createdBy: userId,
            createdAt: new Date(),
            status: PresentationStatus.DRAFT,
            changeLog: [{ userId, action: 'created', timestamp: new Date(), details: 'Presentation created' }]
        });
        return this.presentationRepository.save(presentation);
    }

    async updatePresentation(id: string, data: Partial<Presentation>, userId?: string): Promise<Presentation> {
        const presentation = await this.findPresentation(id);
        if (!presentation) throw new NotFoundException('Presentation not found');

        if (presentation.status !== PresentationStatus.DRAFT) {
            throw new Error('Only draft presentations can be edited');
        }

        const changeLog = presentation?.changeLog || [];
        if (userId) {
            const changes = [];
            const skipFields = ['updatedAt', 'updatedBy', 'changeLog', '_id'];
            for (const key in data) {
                if (skipFields.includes(key)) continue;
                if (JSON.stringify(presentation[key]) !== JSON.stringify(data[key])) {
                    changes.push(key);
                }
            }
            if (changes.length > 0) {
                changeLog.push({ userId, action: 'updated', timestamp: new Date(), details: `Updated: ${changes.join(', ')}` });
            }
        }

        await this.presentationRepository.update({ _id: new ObjectId(id) }, { 
            ...data, 
            updatedAt: new Date(),
            changeLog
        } as any);
        return this.findPresentation(id);
    }

    async markPresentationFinal(id: string): Promise<Presentation> {
        const presentation = await this.findPresentation(id);
        if (!presentation) throw new NotFoundException('Presentation not found');

        if (presentation.status !== PresentationStatus.DRAFT) {
            throw new Error('Only draft presentations can be marked as final');
        }

        await this.presentationRepository.update(
            { _id: new ObjectId(id) },
            { status: PresentationStatus.FINAL, updatedAt: new Date() }
        );
        return this.findPresentation(id);
    }

    async sendPresentationToClient(id: string): Promise<Presentation> {
        const presentation = await this.findPresentation(id);
        if (!presentation) throw new NotFoundException('Presentation not found');

        if (presentation.status !== PresentationStatus.FINAL) {
            throw new Error('Only final presentations can be sent to client');
        }

        await this.presentationRepository.update(
            { _id: new ObjectId(id) },
            { status: PresentationStatus.SENT_TO_CLIENT, sentAt: new Date(), updatedAt: new Date() }
        );
        return this.findPresentation(id);
    }

    async deletePresentation(id: string, userId?: string): Promise<void> {
        const presentation = await this.findPresentation(id);
        const changeLog = presentation?.changeLog || [];
        if (userId) {
            changeLog.push({ userId, action: 'deleted', timestamp: new Date(), details: 'Presentation soft-deleted' });
        }

        await this.presentationRepository.update(
            { _id: new ObjectId(id) },
            { 
                isDeleted: true, 
                deletedAt: new Date(), 
                deletedBy: userId,
                changeLog: changeLog
            } as any
        );
    }

    async linkQuotationToPresentation(presentationId: string, quotationId: string): Promise<Presentation> {
        await this.presentationRepository.update(
            { _id: new ObjectId(presentationId) },
            { quotationId, updatedAt: new Date() }
        );
        return this.findPresentation(presentationId);
    }

    private downloadImage(url: string): Promise<Buffer> {
        return new Promise((resolve, reject) => {
            const protocol = url.startsWith('https') ? https : http;
            protocol.get(url, (response) => {
                if (response.statusCode !== 200) {
                    reject(new Error(`Failed to download image: ${response.statusCode}`));
                    return;
                }
                const chunks: Buffer[] = [];
                response.on('data', (chunk) => chunks.push(chunk));
                response.on('end', () => resolve(Buffer.concat(chunks)));
                response.on('error', reject);
            }).on('error', reject);
        });
    }

    private async getProductImageSource(product: Product): Promise<{ path?: string; data?: string } | null> {
        const imgUrl = product?.featuredImage?.trim() || product?.imageGallery?.[0]?.trim();
        if (!imgUrl) return null;
        
        if (imgUrl.startsWith('http')) {
            try {
                const buffer = await this.downloadImage(imgUrl);
                return { data: buffer.toString('base64') };
            } catch (e) {
                console.error(`Failed to download product image: ${imgUrl}`, e.message);
                return null;
            }
        } else {
            const imgPath = imgUrl.startsWith('/') ? `.${imgUrl}` : imgUrl;
            if (fs.existsSync(imgPath)) {
                return { path: imgPath };
            }
        }
        return null;
    }

    private resolveImagePath(imagePath: string): string | null {
        if (!imagePath) return null;
        if (imagePath.startsWith('http')) return imagePath;
        const localPath = imagePath.startsWith('/') ? `.${imagePath}` : imagePath;
        if (fs.existsSync(localPath)) return localPath;
        return null;
    }

    async generatePPTX(id: string): Promise<Buffer> {
        const presentation = await this.findPresentation(id);
        if (!presentation) throw new NotFoundException('Presentation not found');

        let displayClientName = presentation.clientName || 'Client';
        if (presentation.clientId) {
            try {
                const client = await this.clientRepository.findOneBy({ _id: new ObjectId(presentation.clientId) });
                if (client && client.contactPerson) {
                    displayClientName = client.contactPerson;
                }
            } catch (e) {
                console.error('Error fetching client for PPTX generation:', e);
            }
        }

        const pptx = new PptxGenJS();
        pptx.layout = 'LAYOUT_WIDE';
        pptx.defineLayout({ name: 'CUSTOM', width: 10, height: 5.625 });
        pptx.layout = 'CUSTOM';

        // Cover slide
        const coverSlide = pptx.addSlide();
        if (presentation.coverBackground) {
            const imagePath = this.resolveImagePath(presentation.coverBackground);
            if (imagePath) {
                try {
                    coverSlide.addImage({ path: imagePath, x: 0, y: 0, w: '100%', h: '100%', sizing: { type: 'cover', w: '100%', h: '100%' } });
                } catch (error) {
                    coverSlide.background = { color: 'FFFFFF' };
                }
            } else {
                coverSlide.background = { color: 'FFFFFF' };
            }
        } else {
            coverSlide.background = { color: 'FFFFFF' };
        }

        // Apply overlay if configured
        if (presentation.overlayColor && presentation.overlayTransparency) {
            const overlayColor = presentation.overlayColor.replace('#', '');
            const transparency = Math.round((presentation.overlayTransparency / 100) * 100);
            coverSlide.addShape(pptx.ShapeType.rect, {
                x: 0, y: 0, w: '100%', h: '100%',
                fill: { color: overlayColor, transparency }
            });
        }

        // Add brand logo (centered)
        try {
            coverSlide.addImage({ path: '../configs/assets/raccontixrm/icons/logo-racconti.png', x: 4.055, y: 1.5, w: 1.89, h: 0.2 });
        } catch (error) {
            console.error('Failed to load brand logo');
        }

        const textColor = presentation.textColor?.replace('#', '') || 'FFFFFF';
        coverSlide.addText('Design Concept For', { x: 3.5, y: 2.5, w: 3, h: 0.3, fontSize: 18, align: 'center', color: textColor });
        coverSlide.addText(displayClientName, { x: 3.5, y: 2.9, w: 3, h: 0.4, fontSize: 24, bold: true, align: 'center', color: textColor });

        // Layout slide (Slide 2)
        if (presentation.layoutImage) {
            const layoutSlide = pptx.addSlide();
            layoutSlide.background = { color: 'FFFFFF' };

            // Add brand logo (top right)
            try {
                layoutSlide.addImage({ path: '../configs/assets/raccontixrm/icons/logo-racconti.png', x: 8.555, y: 0.4, w: 0.945, h: 0.1 });
            } catch (error) {
                console.error('Failed to load brand logo');
            }

            // Add "Layout" title at top left
            layoutSlide.addText('Layout', { x: 0.2, y: 0.2, w: 2, h: 0.3, fontSize: 14, bold: true, color: '000000' });

            // Add layout image
            const layoutImagePath = this.resolveImagePath(presentation.layoutImage);
            if (layoutImagePath) {
                try {
                    layoutSlide.addImage({ path: layoutImagePath, x: 0.5, y: 0.8 });
                } catch (error) {
                    console.error('Failed to load layout image:', error);
                }
            }
        }

        // Product slides
        for (const slide of presentation.slides) {
            const products = await Promise.all(
                slide.productIds.map(pid => this.productRepository.findOneBy({ _id: new ObjectId(pid) }))
            );

            if (slide.layout === 'single' && products[0]) {
                const productSlide = pptx.addSlide();

                // Add brand logo (top right)
                try {
                    productSlide.addImage({ path: '../configs/assets/raccontixrm/icons/logo-racconti.png', x: 8.555, y: 0.4, w: 0.945, h: 0.1 });
                } catch (error) {
                    console.error('Failed to load brand logo');
                }

                // Add slide title if provided
                if (slide.slideTitle) {
                    productSlide.addText(slide.slideTitle, { x: 0.2, y: 0.2, w: 3, h: 0.3, fontSize: 14, bold: true, color: '000000' });
                }

                const product = products[0];
                const imageSource = await this.getProductImageSource(product);

                if (imageSource) {
                    try {
                        productSlide.addImage({ ...imageSource, x: 0.5, y: 1 });
                    } catch (error) {
                        console.error('Failed to load product image:', product.name, error.message);
                    }
                }

                productSlide.addText(product.name, { x: 1, y: 4.7, w: 8, h: 0.3, fontSize: 20, bold: true });
                productSlide.addText(`Code: ${product.productCode}`, { x: 1, y: 5.1, w: 8, h: 0.2, fontSize: 14, color: '666666' });
            } else {
                // Group products into chunks of 2 for multiple slides if needed
                const validProducts = products.filter(p => p);
                const productChunks = [];
                for (let i = 0; i < validProducts.length; i += 2) {
                    productChunks.push(validProducts.slice(i, i + 2));
                }

                for (const chunk of productChunks) {
                    const productSlide = pptx.addSlide();

                    // Add brand logo (top right)
                    try {
                        productSlide.addImage({ path: '../configs/assets/raccontixrm/icons/logo-racconti.png', x: 8.555, y: 0.4, w: 0.945, h: 0.1 });
                    } catch (error) {
                        console.error('Failed to load brand logo');
                    }

                    // Add slide title if provided
                    if (slide.slideTitle) {
                        productSlide.addText(slide.slideTitle, { x: 0.2, y: 0.2, w: 3, h: 0.3, fontSize: 14, bold: true, color: '000000' });
                    }

                    let yPos = 0.5;
                    for (const product of chunk) {
                        const imageSource = await this.getProductImageSource(product);

                        if (imageSource) {
                            try {
                                productSlide.addImage({ ...imageSource, x: 1, y: yPos });
                            } catch (error) {
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

        // Thank you slide
        const thankYouSlide = pptx.addSlide();
        thankYouSlide.background = { color: 'FFFFFF' };

        // Add brand logo (centered)
        try {
            thankYouSlide.addImage({ path: '../configs/assets/raccontixrm/icons/logo-racconti.png', x: 4.055, y: 1.5, w: 1.89, h: 0.2 });
        } catch (error) {
            console.error('Failed to load brand logo');
        }

        thankYouSlide.addText('Thank You', { x: 3, y: 2.5, w: 4, h: 0.6, fontSize: 36, bold: true, align: 'center', color: '000000' });
        thankYouSlide.addText('We look forward to working with you', { x: 2.5, y: 3.3, w: 5, h: 0.3, fontSize: 18, align: 'center', color: '666666' });

        return pptx.write({ outputType: 'nodebuffer' }) as Promise<Buffer>;
    }

    async convertPresentationToQuotation(presentationId: string): Promise<any> {
        const presentation = await this.findPresentation(presentationId);
        if (!presentation) throw new NotFoundException('Presentation not found');

        if (presentation.status !== PresentationStatus.FINAL && presentation.status !== PresentationStatus.SENT_TO_CLIENT) {
            throw new Error('Only final or sent presentations can be converted to quotation');
        }

        if (presentation.quotationId) {
            return { existingQuotationId: presentation.quotationId };
        }

        // Get all unique product IDs from all slides
        const productIds = [...new Set(presentation.slides.flatMap(slide => slide.productIds))];

        // Fetch all products
        const products = await Promise.all(
            productIds.map(pid => this.productRepository.findOneBy({ _id: new ObjectId(pid) }))
        );

        // Create quotation items from products
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


    async generateQuotationExcel(id: string): Promise<Buffer> {
        const quotation = await this.findOne(id);
        if (!quotation) throw new NotFoundException('Quotation not found');

        let clientName = 'CLIENT';
        try {
            if (quotation.clientId) {
                const client = await this.clientRepository.findOneBy({ _id: new ObjectId(quotation.clientId) });
                if (client) {
                    clientName = client.contactPerson || client.companyName || 'CLIENT';
                }
            }
            if (clientName === 'CLIENT' && quotation.clientName) {
                clientName = quotation.clientName;
            }
        } catch (error) {
            console.error('Error fetching client for Excel:', error);
            clientName = quotation.clientName || 'CLIENT';
        }

        // Helper function to download image from URL
        const downloadImage = (url: string): Promise<Buffer> => {
            return new Promise((resolve, reject) => {
                const protocol = url.startsWith('https') ? https : http;
                protocol.get(url, (response) => {
                    const chunks: Buffer[] = [];
                    response.on('data', (chunk) => chunks.push(chunk));
                    response.on('end', () => resolve(Buffer.concat(chunks)));
                    response.on('error', reject);
                }).on('error', reject);
            });
        };

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Quotation');

        // Build dynamic columns
        const columns: any[] = [
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

        // Title row
        const numCols = columns.length;
        const lastCol = String.fromCharCode(64 + numCols);
        worksheet.mergeCells(`A1:${lastCol}1`);
        const titleCell = worksheet.getCell('A1');
        titleCell.value = 'BOQ -' + clientName.toUpperCase();
        titleCell.font = { size: 18, bold: true, color: { argb: 'FFF1C40F' } };
        titleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF2C3E50' } };
        titleCell.alignment = { horizontal: 'center', vertical: 'middle' };
        worksheet.getRow(1).height = 40;

        // Header row styling
        const headerRow = worksheet.getRow(2);
        headerRow.values = columns.map(c => c.header);
        headerRow.font = { bold: true, color: { argb: 'FFF1C40F' } };
        headerRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF2C3E50' } };
        headerRow.alignment = { horizontal: 'center', vertical: 'middle' };
        headerRow.height = 30;

        // Group items by tags
        const groupedItems: any = {};
        for (const item of quotation.items) {
            const product = await this.productRepository.findOneBy({ _id: new ObjectId(item.productId) });
            const area = product?.tags?.[0] || 'ITEMS';
            if (!groupedItems[area]) groupedItems[area] = [];
            groupedItems[area].push({ ...item, product });
        }

        let sno = 1;
        let currentRow = 3;

        for (const [area, items] of Object.entries(groupedItems)) {
            // Area header
            worksheet.mergeCells(`A${currentRow}:${String.fromCharCode(64 + columns.length)}${currentRow}`);
            const areaCell = worksheet.getCell(`A${currentRow}`);
            areaCell.value = area.toUpperCase();
            areaCell.font = { bold: true, color: { argb: 'FFF1C40F' } };
            areaCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF34495E' } };
            areaCell.alignment = { horizontal: 'left', vertical: 'middle' };
            worksheet.getRow(currentRow).height = 20;
            currentRow++;

            // Items
            for (const item of items as any[]) {
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

                const rowData: any = {
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

                // Add image
                const imgUrl = product?.featuredImage?.trim() || product?.imageGallery?.[0]?.trim();
                if (imgUrl) {
                    try {
                        let imageBuffer: Buffer;

                        if (imgUrl.startsWith('http://') || imgUrl.startsWith('https://')) {
                            imageBuffer = await downloadImage(imgUrl);
                        } else {
                            const fs = require('fs');
                            const imgPath = imgUrl.startsWith('/') ? `.${imgUrl}` : imgUrl;
                            if (fs.existsSync(imgPath)) {
                                imageBuffer = fs.readFileSync(imgPath);
                            } else {
                                console.error('Excel image file does not exist:', imgPath);
                                imageBuffer = null as any;
                            }
                        }

                        if (imageBuffer) {
                            const imageId = workbook.addImage({
                                buffer: imageBuffer as any,
                                extension: 'jpeg',
                            });

                            worksheet.addImage(imageId, {
                                tl: { col: 3, row: currentRow - 1 },
                                ext: { width: 80, height: 60 }
                            });
                        }
                    } catch (e) {
                        console.error('Failed to add image:', e);
                    }
                }

                currentRow++;
            }
        }
        
        // Summary section
        currentRow++;
        const totalItems = quotation.items.reduce((sum, item) => sum + item.quantity, 0);
        const totalPrice = quotation.subtotal;
        const totalDiscountedPrice = quotation.subtotal - quotation.discountTotal;
        const gstAmount = totalDiscountedPrice * 0.18;
        const netValue = totalDiscountedPrice + gstAmount;

        // TOTAL row
        const totalRow = worksheet.getRow(currentRow);
        worksheet.mergeCells(`A${currentRow}:D${currentRow}`);
        totalRow.getCell(1).value = 'TOTAL';
        totalRow.getCell(1).font = { bold: true, color: { argb: 'FFF1C40F' } };
        totalRow.getCell(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF2C3E50' } };
        totalRow.getCell(1).alignment = { horizontal: 'center', vertical: 'middle' };
        totalRow.getCell(5).value = totalItems;
        totalRow.getCell(5).alignment = { horizontal: 'center', vertical: 'middle' };
        const totalPriceCol = quotation.discount ? columns.length - 2 : columns.length - 1;
        totalRow.getCell(totalPriceCol).value = totalPrice;
        totalRow.getCell(totalPriceCol).alignment = { horizontal: 'center', vertical: 'middle' };
        if (quotation.discount) {
            totalRow.getCell(totalPriceCol + 1).value = totalDiscountedPrice;
            totalRow.getCell(totalPriceCol + 1).alignment = { horizontal: 'center', vertical: 'middle' };
        }
        currentRow++;

        // PACKING & TRANSPORTATION CHARGES row
        const packingRow = worksheet.getRow(currentRow);
        worksheet.mergeCells(`A${currentRow}:D${currentRow}`);
        packingRow.getCell(1).value = 'PACKING & TRANSPORTATION CHARGES';
        packingRow.getCell(1).font = { bold: true, color: { argb: 'FFF1C40F' } };
        packingRow.getCell(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF2C3E50' } };
        packingRow.getCell(1).alignment = { horizontal: 'center', vertical: 'middle' };
        const extraCol = quotation.discount ? columns.length : columns.length - 1;
        packingRow.getCell(extraCol).value = 'EXTRA AS ACTUAL';
        packingRow.getCell(extraCol).alignment = { horizontal: 'center', vertical: 'middle' };
        currentRow++;

        // GST @ 18% row
        const gstRow = worksheet.getRow(currentRow);
        worksheet.mergeCells(`A${currentRow}:D${currentRow}`);
        gstRow.getCell(1).value = 'GST @ 18%';
        gstRow.getCell(1).font = { bold: true, color: { argb: 'FFF1C40F' } };
        gstRow.getCell(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF2C3E50' } };
        gstRow.getCell(1).alignment = { horizontal: 'center', vertical: 'middle' };
        gstRow.getCell(extraCol).value = Math.round(gstAmount);
        gstRow.getCell(extraCol).alignment = { horizontal: 'center', vertical: 'middle' };
        currentRow++;

        // NET VALUE row
        const netRow = worksheet.getRow(currentRow);
        worksheet.mergeCells(`A${currentRow}:D${currentRow}`);
        netRow.getCell(1).value = 'NET VALUE';
        netRow.getCell(1).font = { bold: true, color: { argb: 'FFF1C40F' } };
        netRow.getCell(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF2C3E50' } };
        netRow.getCell(1).alignment = { horizontal: 'center', vertical: 'middle' };
        netRow.getCell(extraCol).value = Math.round(netValue);
        netRow.getCell(extraCol).alignment = { horizontal: 'center', vertical: 'middle' };
        currentRow += 2;

        // Terms and Conditions
        const termsRow = worksheet.getRow(currentRow);
        worksheet.mergeCells(`A${currentRow}:B${currentRow}`);
        termsRow.getCell(1).value = 'Other Terms and Condition';
        termsRow.getCell(1).font = { bold: true, size: 12 };
        termsRow.getCell(1).alignment = { horizontal: 'left', vertical: 'middle' };
        termsRow.getCell(1).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        currentRow++;

        const terms = [
            'The above amount is subject to discount,which is applicable on above prices depends on final quantity of furniture.',
            'Delivery Period will be 16 weeks from the date of payment of the fabric and selection of Mood Board.',
            'Payment terms - 50 % Advance against order - 50% before delivery',
            'GST, Any other Taxes, Packing, unloading and Transportation charges will be extra at actual',
            'After selection of the material, 100% payment of material is to be done (Only after making the payment delivery period term will start)',
            'Fabrics, leather and leatherite cost will be extra after selection the material 100% payment is to be done',
            'Bed Hydraulic Charges will be Rs. 35000/- extra per bed.',
            'Embroidery, quilting and accent cushions charges will be extra',
            'Veneer cost is considerd as Rs. 200 Per SQFT if any other veneer will be selected cost will change accordingly',
            'The Parties agree that the cost of marble shall be considered an additional charge. Upon the Client`s selection of the material, full payment for the chosen marble is required to proceed.',
            'The Client acknowledges that the consideration of Matt/Gloss Gold as the PVD (Physical Vapor Deposition) color for the products is integral to the pricing, and understands that any deviation in PVD color selection may result incorresponding adjustments to the product cost. Black PVD cost would be additional.',
            'Above mention prices are provided as per above mention sizes. If size will change , prices may vary.',
            'Furniture installation charges for the FIRST VISIT will be included in the price. However, Due to any circumstances our team is not given workflow on the site and for any reason they must return the second visit will be chargeable.',
            'Any other Visit besides the installation will be chargable on per visit per day basis.',
            'Quotation will be valid for 30 days',
            'In Case of Upholestry:- If leather is selected price will increase as follows',
            'A. Sofa 6000 per Seat B. Dinning Chair 10000 per pcs C. Arm Chair 15000 per pcs',
            'In the event that the client fails to collect the order on the mutually agreed upon date, the buyer shall be held responsible for bearing the warehousing charges which can amount up to 40,000 Indian Rupees per day. Alternatively, the discount rate previously agreed upon shall be deducted from the payment owed to the buyer.',
            'This quotation is based upon and subject to the specific images and specifications provided by the customer as of the date hereof. Any alterations or deviations from the aforementioned specifications may result in adjustments to the quotation. The company reserves the right to amend this quotation upon receipt of any such changes.',
            '3 modifications are allowed in the Moodboard, post that it will be charged at 20000/- per modification.',
            '1 Modification is allowed post sending the Line Diagram and prior to approval.',
            'No Changes in the Drawings will be done after the Line Diagram is approved by the Client or Architect. Per change 25000/- would be charged.',
            '1 site visit for templating is complimentary, post that 40000/- will be charged per visit.'
        ];

        terms.forEach((term, index) => {
            const termRow = worksheet.getRow(currentRow);
            termRow.getCell(1).value = index + 1;
            termRow.getCell(1).alignment = { horizontal: 'center', vertical: 'top' };
            termRow.getCell(1).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
            worksheet.mergeCells(`B${currentRow}:L${currentRow}`);
            termRow.getCell(2).value = term;
            termRow.getCell(2).alignment = { horizontal: 'left', vertical: 'top', wrapText: true };
            termRow.getCell(2).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
            termRow.height = 30;
            currentRow++;
        });

        return workbook.xlsx.writeBuffer() as any;
    }
}
