import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { Quotation, QuotationStatus } from '../entities/quotation.entity';
import { Enquiry, EnquiryStatus } from '../entities/enquiry.entity';
import { EmailTemplate } from '../entities/email-template.entity';
import { Presentation, PresentationStatus } from '../entities/presentation.entity';
import { Product } from '../entities/product.entity';
import { Client } from '../entities/client.entity';
import { ObjectId } from 'mongodb';
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
    ) { }

    // Quotations
    async findAll(organizationId: string): Promise<Quotation[]> {
        return this.quotationRepository.find({ where: { organizationId } });
    }

    async findOne(id: string): Promise<Quotation> {
        return this.quotationRepository.findOneBy({ _id: new ObjectId(id) });
    }

    async findByClient(clientId: string): Promise<Quotation[]> {
        return this.quotationRepository.find({ where: { clientId } });
    }

    async create(data: Partial<Quotation>, organizationId: string): Promise<Quotation> {
        const quotation = this.quotationRepository.create({
            ...data,
            organizationId,
            quotationNumber: `Q-${Date.now()}`,
            createdAt: new Date()
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
            clientName: client?.companyName || enquiry.customerName,
            clientEmail: client?.email || enquiry.customerEmail,
            enquiryId,
            items: quotationItems,
            subtotal,
            taxTotal,
            discountTotal: 0,
            grandTotal,
            currency: 'USD',
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

    async update(id: string, data: Partial<Quotation>): Promise<Quotation> {
        await this.quotationRepository.update({ _id: new ObjectId(id) }, { ...data, updatedAt: new Date() });
        return this.findOne(id);
    }

    async submitForApproval(id: string): Promise<Quotation> {
        return this.update(id, { status: QuotationStatus.PENDING_APPROVAL });
    }

    async approve(id: string, userId: string): Promise<Quotation> {
        return this.update(id, { 
            status: QuotationStatus.APPROVED, 
            approvedBy: userId,
            approvedAt: new Date()
        });
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

    async delete(id: string): Promise<void> {
        await this.quotationRepository.delete({ _id: new ObjectId(id) });
    }

    // Enquiries
    async findAllEnquiries(organizationId: string): Promise<Enquiry[]> {
        return this.enquiryRepository.find({ where: { organizationId } });
    }

    async findEnquiry(id: string): Promise<Enquiry> {
        return this.enquiryRepository.findOneBy({ _id: new ObjectId(id) });
    }

    async createEnquiry(data: Partial<Enquiry>, organizationId: string): Promise<Enquiry> {
        const enquiry = this.enquiryRepository.create({
            ...data,
            organizationId,
            enquiryNumber: `ENQ-${Date.now()}`,
            createdAt: new Date()
        });
        return this.enquiryRepository.save(enquiry);
    }

    async updateEnquiry(id: string, data: Partial<Enquiry>): Promise<Enquiry> {
        await this.enquiryRepository.update({ _id: new ObjectId(id) }, { ...data, updatedAt: new Date() });
        return this.findEnquiry(id);
    }

    async deleteEnquiry(id: string): Promise<void> {
        await this.enquiryRepository.delete({ _id: new ObjectId(id) });
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
        return this.presentationRepository.find({ where: { organizationId } });
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
            status: PresentationStatus.DRAFT
        });
        return this.presentationRepository.save(presentation);
    }

    async updatePresentation(id: string, data: Partial<Presentation>): Promise<Presentation> {
        await this.presentationRepository.update({ _id: new ObjectId(id) }, { ...data, updatedAt: new Date() });
        return this.findPresentation(id);
    }

    async deletePresentation(id: string): Promise<void> {
        await this.presentationRepository.delete({ _id: new ObjectId(id) });
    }

    async generatePPTX(id: string): Promise<Buffer> {
        const presentation = await this.findPresentation(id);
        if (!presentation) throw new NotFoundException('Presentation not found');

        const pptx = new PptxGenJS();
        pptx.layout = 'LAYOUT_WIDE';
        pptx.defineLayout({ name: 'CUSTOM', width: 10, height: 5.625 });
        pptx.layout = 'CUSTOM';

        // Cover slide
        const coverSlide = pptx.addSlide();
        if (presentation.coverBackground) {
            const imagePath = presentation.coverBackground.startsWith('/') 
                ? `.${presentation.coverBackground}` 
                : presentation.coverBackground;
            try {
                coverSlide.background = { path: imagePath, sizing: 'cover' };
            } catch (error) {
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

        // Add brand logo
        try {
            coverSlide.addImage({ path: '../configs/assets/raccontixrm/icons/racconti-logo.svg', x: 9, y: 0.2, w: 0.8, h: 0.4 });
        } catch (error) {
            console.error('Failed to load brand logo');
        }

        const textColor = presentation.textColor?.replace('#', '') || 'FFFFFF';
        coverSlide.addText('Design Concept For', { x: 3.5, y: 2.5, w: 3, h: 0.3, fontSize: 18, align: 'center', color: textColor });
        coverSlide.addText(presentation.clientName || 'Client', { x: 3.5, y: 2.9, w: 3, h: 0.4, fontSize: 24, bold: true, align: 'center', color: textColor });

        // Product slides
        for (const slide of presentation.slides) {
            const productSlide = pptx.addSlide();

            // Add brand logo to each slide
            try {
                productSlide.addImage({ path: '../configs/assets/raccontixrm/icons/racconti-logo.svg', x: 9, y: 0.2, w: 0.8, h: 0.4 });
            } catch (error) {
                console.error('Failed to load brand logo');
            }

            const products = await Promise.all(
                slide.productIds.map(pid => this.productRepository.findOneBy({ _id: new ObjectId(pid) }))
            );

            if (slide.layout === 'single' && products[0]) {
                const product = products[0];
                const productImage = product.featuredImage || product.imageGallery?.[0];
                
                if (productImage) {
                    const imgPath = productImage.startsWith('/') ? `.${productImage}` : productImage;
                    try {
                        productSlide.addImage({ path: imgPath, x: 1, y: 1, w: 8, h: 3.5, sizing: { type: 'cover' } });
                    } catch (error) {
                        console.error('Failed to load image:', imgPath);
                    }
                }
                
                productSlide.addText(product.name, { x: 1, y: 4.7, w: 8, h: 0.3, fontSize: 20, bold: true });
                productSlide.addText(`Code: ${product.productCode}`, { x: 1, y: 5.1, w: 8, h: 0.2, fontSize: 14, color: '666666' });
            } else {
                let yPos = 0.5;
                products.forEach((product) => {
                    if (product) {
                        const productImage = product.featuredImage || product.imageGallery?.[0];
                        
                        if (productImage) {
                            const imgPath = productImage.startsWith('/') ? `.${productImage}` : productImage;
                            try {
                                productSlide.addImage({ path: imgPath, x: 1, y: yPos, w: 3, h: 2, sizing: { type: 'cover' } });
                            } catch (error) {
                                console.error('Failed to load image:', imgPath);
                            }
                        }
                        
                        productSlide.addText(product.name, { x: 4.5, y: yPos, w: 5, h: 0.3, fontSize: 16, bold: true });
                        productSlide.addText(`Code: ${product.productCode}`, { x: 4.5, y: yPos + 0.4, w: 5, h: 0.2, fontSize: 12, color: '666666' });
                        yPos += 2.5;
                    }
                });
            }
        }

        // Thank you slide
        const thankYouSlide = pptx.addSlide();
        thankYouSlide.background = { color: 'FFFFFF' };
        
        // Add brand logo
        try {
            thankYouSlide.addImage({ path: '../configs/assets/raccontixrm/icons/racconti-logo.svg', x: 9, y: 0.2, w: 0.8, h: 0.4 });
        } catch (error) {
            console.error('Failed to load brand logo');
        }
        
        thankYouSlide.addText('Thank You', { x: 3, y: 2, w: 4, h: 0.6, fontSize: 36, bold: true, align: 'center', color: '000000' });
        thankYouSlide.addText('We look forward to working with you', { x: 2.5, y: 2.8, w: 5, h: 0.3, fontSize: 18, align: 'center', color: '666666' });

        return pptx.write({ outputType: 'nodebuffer' }) as Promise<Buffer>;
    }

    async convertPresentationToQuotation(presentationId: string): Promise<any> {
        const presentation = await this.findPresentation(presentationId);
        if (!presentation) throw new NotFoundException('Presentation not found');

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
            currency: 'USD'
        };
    }
}
