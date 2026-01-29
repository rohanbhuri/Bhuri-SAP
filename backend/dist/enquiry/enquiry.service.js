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
exports.EnquiryService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const enquiry_entity_1 = require("../entities/enquiry.entity");
const quotation_entity_1 = require("../entities/quotation.entity");
const product_entity_1 = require("../entities/product.entity");
const mongodb_1 = require("mongodb");
const mail_service_1 = require("../notifications/mail.service");
let EnquiryService = class EnquiryService {
    constructor(enquiryRepository, quotationRepository, productRepository, mailService) {
        this.enquiryRepository = enquiryRepository;
        this.quotationRepository = quotationRepository;
        this.productRepository = productRepository;
        this.mailService = mailService;
    }
    async createEnquiry(data) {
        const enquiry = this.enquiryRepository.create({
            ...data,
            enquiryNumber: `ENQ-${Date.now()}`,
            createdAt: new Date()
        });
        const savedEnquiry = await this.enquiryRepository.save(enquiry);
        this.mailService.sendEnquiryNotification({
            enquiryNumber: savedEnquiry.enquiryNumber,
            customerName: savedEnquiry.customerName,
            customerEmail: savedEnquiry.customerEmail,
            itemsCount: savedEnquiry.items?.length || 0,
            message: savedEnquiry.message
        }).catch(err => console.error('Failed to send enquiry email:', err));
        return savedEnquiry;
    }
    async findAll() {
        return this.enquiryRepository.find({ order: { createdAt: -1 } });
    }
    async findOne(id) {
        return this.enquiryRepository.findOneBy({ _id: new mongodb_1.ObjectId(id) });
    }
    async updateStatus(id, status) {
        await this.enquiryRepository.update(id, {
            status,
            updatedAt: new Date()
        });
        return this.findOne(id);
    }
    async generateQuotation(enquiryId, approvedBy) {
        const enquiry = await this.findOne(enquiryId);
        if (!enquiry)
            throw new Error('Enquiry not found');
        const quotationItems = await Promise.all(enquiry.items.map(async (item) => {
            const product = await this.productRepository.findOneBy({
                _id: new mongodb_1.ObjectId(item.productId)
            });
            return {
                productId: item.productId,
                productName: item.productName,
                quantity: item.quantity,
                unitPrice: product?.basePrice || item.unitPrice,
                total: item.quantity * (product?.basePrice || item.unitPrice),
                description: item.specifications
            };
        }));
        const subtotal = quotationItems.reduce((sum, item) => sum + item.total, 0);
        const taxTotal = subtotal * 0.18;
        const grandTotal = subtotal + taxTotal;
        const quotation = this.quotationRepository.create({
            quotationNumber: `Q-${Date.now()}`,
            clientName: enquiry.customerName,
            clientEmail: enquiry.customerEmail,
            items: quotationItems,
            subtotal,
            taxTotal,
            grandTotal,
            currency: 'INR',
            status: quotation_entity_1.QuotationStatus.DRAFT,
            validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            createdBy: approvedBy,
            createdAt: new Date()
        });
        const savedQuotation = await this.quotationRepository.save(quotation);
        await this.enquiryRepository.update(enquiryId, {
            status: enquiry_entity_1.EnquiryStatus.QUOTED,
            quotationId: savedQuotation._id.toString(),
            updatedAt: new Date()
        });
        return savedQuotation;
    }
};
exports.EnquiryService = EnquiryService;
exports.EnquiryService = EnquiryService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(enquiry_entity_1.Enquiry)),
    __param(1, (0, typeorm_1.InjectRepository)(quotation_entity_1.Quotation)),
    __param(2, (0, typeorm_1.InjectRepository)(product_entity_1.Product)),
    __metadata("design:paramtypes", [typeorm_2.MongoRepository,
        typeorm_2.MongoRepository,
        typeorm_2.MongoRepository,
        mail_service_1.MailService])
], EnquiryService);
//# sourceMappingURL=enquiry.service.js.map