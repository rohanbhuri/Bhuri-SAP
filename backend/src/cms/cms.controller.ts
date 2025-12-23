import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { CmsService } from './cms.service';
import { Page } from '../entities/page.entity';
import { BlogPost } from '../entities/blog-post.entity';
import { Menu } from '../entities/menu.entity';

@Controller('cms')
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
    async createBlog(@Body() data: Partial<BlogPost>) {
        return this.cmsService.createBlog(data);
    }

    @Put('blogs/:id')
    async updateBlog(@Param('id') id: string, @Body() data: Partial<BlogPost>) {
        return this.cmsService.updateBlog(id, data);
    }

    @Delete('blogs/:id')
    async deleteBlog(@Param('id') id: string) {
        return this.cmsService.deleteBlog(id);
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
}
