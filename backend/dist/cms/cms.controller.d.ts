import { CmsService } from './cms.service';
import { Page } from '../entities/page.entity';
import { BlogPost } from '../entities/blog-post.entity';
import { Menu } from '../entities/menu.entity';
import { NewsMedia } from '../entities/news-media.entity';
export declare class CmsController {
    private readonly cmsService;
    constructor(cmsService: CmsService);
    getAllPages(): Promise<Page[]>;
    getPage(id: string): Promise<Page>;
    getPageBySlug(slug: string): Promise<Page>;
    createPage(data: Partial<Page>): Promise<Page>;
    updatePage(id: string, data: Partial<Page>): Promise<Page>;
    deletePage(id: string): Promise<void>;
    getAllBlogs(): Promise<BlogPost[]>;
    getBlog(id: string): Promise<BlogPost>;
    getBlogBySlug(slug: string): Promise<BlogPost>;
    createBlog(data: Partial<BlogPost>, req: any): Promise<BlogPost>;
    updateBlog(id: string, data: Partial<BlogPost>, req: any): Promise<BlogPost>;
    deleteBlog(id: string, req: any): Promise<void>;
    toggleBlogFeatured(id: string): Promise<BlogPost>;
    getAllMenus(): Promise<Menu[]>;
    getMenu(id: string): Promise<Menu>;
    getMenuByLocation(location: string): Promise<Menu>;
    createMenu(data: Partial<Menu>): Promise<Menu>;
    updateMenu(id: string, data: Partial<Menu>): Promise<Menu>;
    deleteMenu(id: string): Promise<void>;
    getAllNewsMedia(): Promise<NewsMedia[]>;
    getNewsMedia(id: string): Promise<NewsMedia>;
    getNewsMediaBySlug(slug: string): Promise<NewsMedia>;
    createNewsMedia(data: Partial<NewsMedia>, req: any): Promise<NewsMedia>;
    updateNewsMedia(id: string, data: Partial<NewsMedia>, req: any): Promise<NewsMedia>;
    deleteNewsMedia(id: string, req: any): Promise<void>;
    toggleNewsMediaFeatured(id: string): Promise<NewsMedia>;
    getAnalytics(): Promise<{
        totalBlogs: number;
        publishedBlogs: number;
        draftBlogs: number;
        featuredBlogs: number;
        archivedBlogs: number;
        totalNewsMedia: number;
        publishedNews: number;
        draftNews: number;
        featuredNews: number;
        archivedNews: number;
        topBlogTags: {
            tag: any;
            count: any;
        }[];
        topNewsTags: {
            tag: any;
            count: any;
        }[];
        blogsByMonth: any[];
        newsByMonth: any[];
        recentChanges: {
            blogs: number;
            newsMedia: number;
        };
    }>;
}
