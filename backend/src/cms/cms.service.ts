import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { Page } from '../entities/page.entity';
import { BlogPost } from '../entities/blog-post.entity';
import { Menu } from '../entities/menu.entity';
import { NewsMedia } from '../entities/news-media.entity';
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
        @InjectRepository(NewsMedia)
        private newsMediaRepository: MongoRepository<NewsMedia>,
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

    async createBlog(data: Partial<BlogPost>, userId?: string): Promise<BlogPost> {
        const blog = this.blogRepository.create({
            ...data,
            createdBy: userId,
            updatedBy: userId,
            changeLog: userId ? [{ userId, action: 'created', timestamp: new Date(), details: 'Initial creation' }] : []
        });
        return this.blogRepository.save(blog);
    }

    async updateBlog(id: string, data: Partial<BlogPost>, userId?: string): Promise<BlogPost> {
        const current = await this.findOneBlog(id);
        const changeLog = current?.changeLog || [];
        
        if (userId) {
            const changes = [];
            const skipFields = ['updatedAt', 'updatedBy', 'changeLog', '_id'];
            
            for (const key in data) {
                if (!skipFields.includes(key) && current && (current as any)[key] !== (data as any)[key]) {
                    changes.push(key);
                }
            }
            
            const details = changes.length > 0 ? `Updated: ${changes.join(', ')}` : 'No significant changes';
            changeLog.push({ userId, action: 'updated', timestamp: new Date(), details });
        }

        data.updatedAt = new Date();
        await this.blogRepository.update(id, {
            ...data,
            updatedAt: new Date(),
            updatedBy: userId,
            changeLog
        } as any);
        return this.findOneBlog(id);
    }

    async deleteBlog(id: string, userId?: string): Promise<void> {
        const current = await this.findOneBlog(id);
        const changeLog = current?.changeLog || [];
        
        if (userId) {
            changeLog.push({ userId, action: 'deleted', timestamp: new Date(), details: 'Blog soft-deleted' });
        }
        
        await this.blogRepository.delete(id);
    }

    async toggleBlogFeatured(id: string): Promise<BlogPost> {
        const blog = await this.findOneBlog(id);
        if (!blog) {
            throw new Error('Blog not found');
        }
        blog.isFeatured = !blog.isFeatured;
        blog.updatedAt = new Date();
        await this.blogRepository.save(blog);
        return blog;
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

    // ===== NEWS & MEDIA METHODS =====
    async findAllNewsMedia(): Promise<NewsMedia[]> {
        return this.newsMediaRepository.find({ order: { createdAt: 'DESC' } });
    }

    async findOneNewsMedia(id: string): Promise<NewsMedia> {
        return this.newsMediaRepository.findOneBy({ _id: new ObjectId(id) });
    }

    async findNewsMediaBySlug(slug: string): Promise<NewsMedia> {
        return this.newsMediaRepository.findOneBy({ slug });
    }

    async createNewsMedia(data: Partial<NewsMedia>, userId?: string): Promise<NewsMedia> {
        const newsMedia = this.newsMediaRepository.create({
            ...data,
            createdBy: userId,
            updatedBy: userId,
            changeLog: userId ? [{ userId, action: 'created', timestamp: new Date(), details: 'Initial creation' }] : []
        });
        return this.newsMediaRepository.save(newsMedia);
    }

    async updateNewsMedia(id: string, data: Partial<NewsMedia>, userId?: string): Promise<NewsMedia> {
        const current = await this.findOneNewsMedia(id);
        const changeLog = current?.changeLog || [];
        
        if (userId) {
            const changes = [];
            const skipFields = ['updatedAt', 'updatedBy', 'changeLog', '_id'];
            
            for (const key in data) {
                if (!skipFields.includes(key) && current && (current as any)[key] !== (data as any)[key]) {
                    changes.push(key);
                }
            }
            
            const details = changes.length > 0 ? `Updated: ${changes.join(', ')}` : 'No significant changes';
            changeLog.push({ userId, action: 'updated', timestamp: new Date(), details });
        }

        data.updatedAt = new Date();
        await this.newsMediaRepository.update(id, {
            ...data,
            updatedAt: new Date(),
            updatedBy: userId,
            changeLog
        } as any);
        return this.findOneNewsMedia(id);
    }

    async deleteNewsMedia(id: string, userId?: string): Promise<void> {
        const current = await this.findOneNewsMedia(id);
        const changeLog = current?.changeLog || [];
        
        if (userId) {
            changeLog.push({ userId, action: 'deleted', timestamp: new Date(), details: 'News media soft-deleted' });
        }
        
        await this.newsMediaRepository.delete(id);
    }

    async toggleNewsMediaFeatured(id: string): Promise<NewsMedia> {
        const newsMedia = await this.findOneNewsMedia(id);
        if (!newsMedia) {
            throw new Error('News media not found');
        }
        newsMedia.isFeatured = !newsMedia.isFeatured;
        newsMedia.updatedAt = new Date();
        await this.newsMediaRepository.save(newsMedia);
        return newsMedia;
    }

    // Analytics
    async getAnalytics() {
        const blogs = await this.blogRepository.find();
        const newsMedia = await this.newsMediaRepository.find();

        // Blog Analytics
        const publishedBlogs = blogs.filter(b => b.status === 'published').length;
        const draftBlogs = blogs.filter(b => b.status === 'draft').length;
        const featuredBlogs = blogs.filter(b => b.isFeatured).length;
        
        // Calculate blog tags distribution
        const blogTagsMap = new Map();
        blogs.forEach(blog => {
            blog.tags?.forEach(tag => {
                blogTagsMap.set(tag, (blogTagsMap.get(tag) || 0) + 1);
            });
        });
        const topBlogTags = Array.from(blogTagsMap.entries())
            .map(([tag, count]) => ({ tag, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 10);

        // News Media Analytics
        const publishedNews = newsMedia.filter(n => n.status === 'published').length;
        const draftNews = newsMedia.filter(n => n.status === 'draft').length;
        const featuredNews = newsMedia.filter(n => n.isFeatured).length;

        // Calculate news tags distribution
        const newsTagsMap = new Map();
        newsMedia.forEach(news => {
            news.tags?.forEach(tag => {
                newsTagsMap.set(tag, (newsTagsMap.get(tag) || 0) + 1);
            });
        });
        const topNewsTags = Array.from(newsTagsMap.entries())
            .map(([tag, count]) => ({ tag, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 10);

        // Calculate recent changes (last 7 days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        
        const recentChanges = {
            blogs: blogs.filter(b => b.updatedAt && new Date(b.updatedAt) >= sevenDaysAgo).length,
            newsMedia: newsMedia.filter(n => n.updatedAt && new Date(n.updatedAt) >= sevenDaysAgo).length
        };

        // Calculate content by month (last 6 months)
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
        
        const blogsByMonth = this.groupByMonth(blogs.filter(b => new Date(b.createdAt) >= sixMonthsAgo));
        const newsByMonth = this.groupByMonth(newsMedia.filter(n => new Date(n.createdAt) >= sixMonthsAgo));

        return {
            // Blog Stats
            totalBlogs: blogs.length,
            publishedBlogs,
            draftBlogs,
            featuredBlogs,
            archivedBlogs: blogs.filter(b => b.status === 'archived').length,
            
            // News Media Stats
            totalNewsMedia: newsMedia.length,
            publishedNews,
            draftNews,
            featuredNews,
            archivedNews: newsMedia.filter(n => n.status === 'archived').length,
            
            // Tags
            topBlogTags,
            topNewsTags,
            
            // Trends
            blogsByMonth,
            newsByMonth,
            recentChanges
        };
    }

    private groupByMonth(items: any[]): any[] {
        const monthMap = new Map();
        items.forEach(item => {
            const date = new Date(item.createdAt);
            const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            monthMap.set(monthKey, (monthMap.get(monthKey) || 0) + 1);
        });
        
        return Array.from(monthMap.entries())
            .map(([month, count]) => ({ month, count }))
            .sort((a, b) => a.month.localeCompare(b.month));
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
