import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { Page } from '../entities/page.entity';
import { BlogPost } from '../entities/blog-post.entity';
import { Menu } from '../entities/menu.entity';
import { ObjectId } from 'mongodb';

@Injectable()
export class CmsService {
    constructor(
        @InjectRepository(Page)
        private pageRepository: MongoRepository<Page>,
        @InjectRepository(BlogPost)
        private blogRepository: MongoRepository<BlogPost>,
        @InjectRepository(Menu)
        private menuRepository: MongoRepository<Menu>,
    ) { }

    // ===== PAGE METHODS =====
    async findAllPages(): Promise<Page[]> {
        return this.pageRepository.find();
    }

    async findOnePage(id: string): Promise<Page> {
        return this.pageRepository.findOneBy({ _id: new ObjectId(id) });
    }

    async findPageBySlug(slug: string): Promise<Page> {
        return this.pageRepository.findOneBy({ slug });
    }

    async createPage(data: Partial<Page>): Promise<Page> {
        const page = this.pageRepository.create(data);
        return this.pageRepository.save(page);
    }

    async updatePage(id: string, data: Partial<Page>): Promise<Page> {
        data.updatedAt = new Date();
        await this.pageRepository.update(id, data as any);
        return this.findOnePage(id);
    }

    async deletePage(id: string): Promise<void> {
        await this.pageRepository.delete(id);
    }

    // ===== BLOG METHODS =====
    async findAllBlogs(): Promise<BlogPost[]> {
        return this.blogRepository.find({ order: { createdAt: 'DESC' } });
    }

    async findOneBlog(id: string): Promise<BlogPost> {
        return this.blogRepository.findOneBy({ _id: new ObjectId(id) });
    }

    async findBlogBySlug(slug: string): Promise<BlogPost> {
        return this.blogRepository.findOneBy({ slug });
    }

    async createBlog(data: Partial<BlogPost>): Promise<BlogPost> {
        const blog = this.blogRepository.create(data);
        return this.blogRepository.save(blog);
    }

    async updateBlog(id: string, data: Partial<BlogPost>): Promise<BlogPost> {
        data.updatedAt = new Date();
        await this.blogRepository.update(id, data as any);
        return this.findOneBlog(id);
    }

    async deleteBlog(id: string): Promise<void> {
        await this.blogRepository.delete(id);
    }

    // ===== MENU METHODS =====
    async findAllMenus(): Promise<Menu[]> {
        return this.menuRepository.find();
    }

    async findOneMenu(id: string): Promise<Menu> {
        return this.menuRepository.findOneBy({ _id: new ObjectId(id) });
    }

    async findMenuByLocation(location: string): Promise<Menu> {
        return this.menuRepository.findOneBy({ location, isActive: true });
    }

    async createMenu(data: Partial<Menu>): Promise<Menu> {
        const menu = this.menuRepository.create(data);
        return this.menuRepository.save(menu);
    }

    async updateMenu(id: string, data: Partial<Menu>): Promise<Menu> {
        data.updatedAt = new Date();
        await this.menuRepository.update(id, data as any);
        return this.findOneMenu(id);
    }

    async deleteMenu(id: string): Promise<void> {
        await this.menuRepository.delete(id);
    }

    // Legacy methods for backward compatibility
    async findAll(): Promise<Page[]> {
        return this.findAllPages();
    }

    async findOne(id: string): Promise<Page> {
        return this.findOnePage(id);
    }

    async findBySlug(slug: string): Promise<Page> {
        return this.findPageBySlug(slug);
    }

    async create(data: Partial<Page>): Promise<Page> {
        return this.createPage(data);
    }

    async update(id: string, data: Partial<Page>): Promise<Page> {
        return this.updatePage(id, data);
    }

    async delete(id: string): Promise<void> {
        return this.deletePage(id);
    }
}
