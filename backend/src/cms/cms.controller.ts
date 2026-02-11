import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { CmsService } from './cms.service';
import { Page } from '../entities/page.entity';
import { BlogPost } from '../entities/blog-post.entity';
import { Menu } from '../entities/menu.entity';
import { NewsMedia } from '../entities/news-media.entity';
import { ApiKeyGuard } from '../guards/api-key.guard';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@Controller('cms')
@UseGuards(ApiKeyGuard)
export class CmsController {
    constructor(private readonly cmsService: CmsService) { }

    @Get('pages')
    async getAllPages() {
        return this.cmsService.findAll();
    }

    @Get('pages/:id')
    async getPage(@Param('id') id: string) {
        return this.cmsService.findOne(id);
    }

    @Get('slug/:slug')
    async getPageBySlug(@Param('slug') slug: string) {
        return this.cmsService.findBySlug(slug);
    }

    @Post('pages')
    async createPage(@Body() data: Partial<Page>) {
        return this.cmsService.create(data);
    }

    @Put('pages/:id')
    async updatePage(@Param('id') id: string, @Body() data: Partial<Page>) {
        return this.cmsService.update(id, data);
    }

    @Delete('pages/:id')
    async deletePage(@Param('id') id: string) {
        return this.cmsService.delete(id);
    }

    // ===== BLOG ENDPOINTS =====
    @Get('blogs')
    async getAllBlogs() {
        return this.cmsService.findAllBlogs();
    }

    @Get('blogs/:id')
    async getBlog(@Param('id') id: string) {
        return this.cmsService.findOneBlog(id);
    }

    @Get('blog/slug/:slug')
    async getBlogBySlug(@Param('slug') slug: string) {
        return this.cmsService.findBlogBySlug(slug);
    }

    @Post('blogs')
    @UseGuards(JwtAuthGuard)
    async createBlog(@Body() data: Partial<BlogPost>, @Request() req) {
        return this.cmsService.createBlog(data, req.user?.userId);
    }

    @Put('blogs/:id')
    @UseGuards(JwtAuthGuard)
    async updateBlog(@Param('id') id: string, @Body() data: Partial<BlogPost>, @Request() req) {
        return this.cmsService.updateBlog(id, data, req.user?.userId);
    }

    @Delete('blogs/:id')
    @UseGuards(JwtAuthGuard)
    async deleteBlog(@Param('id') id: string, @Request() req) {
        return this.cmsService.deleteBlog(id, req.user?.userId);
    }

    @Put('blogs/:id/toggle-featured')
    async toggleBlogFeatured(@Param('id') id: string) {
        return this.cmsService.toggleBlogFeatured(id);
    }

    // ===== MENU ENDPOINTS =====
    @Get('menus')
    async getAllMenus() {
        return this.cmsService.findAllMenus();
    }

    @Get('menus/:id')
    async getMenu(@Param('id') id: string) {
        return this.cmsService.findOneMenu(id);
    }

    @Get('menu/location/:location')
    async getMenuByLocation(@Param('location') location: string) {
        return this.cmsService.findMenuByLocation(location);
    }

    @Post('menus')
    async createMenu(@Body() data: Partial<Menu>) {
        return this.cmsService.createMenu(data);
    }

    @Put('menus/:id')
    async updateMenu(@Param('id') id: string, @Body() data: Partial<Menu>) {
        return this.cmsService.updateMenu(id, data);
    }

    @Delete('menus/:id')
    async deleteMenu(@Param('id') id: string) {
        return this.cmsService.deleteMenu(id);
    }

    // ===== NEWS & MEDIA ENDPOINTS =====
    @Get('news-media')
    async getAllNewsMedia() {
        return this.cmsService.findAllNewsMedia();
    }

    @Get('news-media/:id')
    async getNewsMedia(@Param('id') id: string) {
        return this.cmsService.findOneNewsMedia(id);
    }

    @Get('news-media/slug/:slug')
    async getNewsMediaBySlug(@Param('slug') slug: string) {
        return this.cmsService.findNewsMediaBySlug(slug);
    }

    @Post('news-media')
    @UseGuards(JwtAuthGuard)
    async createNewsMedia(@Body() data: Partial<NewsMedia>, @Request() req) {
        return this.cmsService.createNewsMedia(data, req.user?.userId);
    }

    @Put('news-media/:id')
    @UseGuards(JwtAuthGuard)
    async updateNewsMedia(@Param('id') id: string, @Body() data: Partial<NewsMedia>, @Request() req) {
        return this.cmsService.updateNewsMedia(id, data, req.user?.userId);
    }

    @Delete('news-media/:id')
    @UseGuards(JwtAuthGuard)
    async deleteNewsMedia(@Param('id') id: string, @Request() req) {
        return this.cmsService.deleteNewsMedia(id, req.user?.userId);
    }

    @Put('news-media/:id/toggle-featured')
    async toggleNewsMediaFeatured(@Param('id') id: string) {
        return this.cmsService.toggleNewsMediaFeatured(id);
    }

    // Analytics
    @Get('analytics')
    async getAnalytics() {
        return this.cmsService.getAnalytics();
    }
}
