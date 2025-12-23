import { Controller, Get, Post, Body, Param, Put } from '@nestjs/common';
import { EnquiryService } from './enquiry.service';
import { Enquiry, EnquiryStatus } from '../entities/enquiry.entity';

@Controller('enquiries')
export class EnquiryController {
    constructor(private readonly enquiryService: EnquiryService) {}

    @Post()
    async create(@Body() createEnquiryDto: Partial<Enquiry>) {
        return this.enquiryService.createEnquiry(createEnquiryDto);
    }

    @Get()
    async findAll() {
        return this.enquiryService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.enquiryService.findOne(id);
    }

    @Put(':id/status')
    async updateStatus(@Param('id') id: string, @Body('status') status: EnquiryStatus) {
        return this.enquiryService.updateStatus(id, status);
    }

    @Post(':id/generate-quotation')
    async generateQuotation(@Param('id') id: string, @Body('approvedBy') approvedBy: string) {
        return this.enquiryService.generateQuotation(id, approvedBy);
    }
}