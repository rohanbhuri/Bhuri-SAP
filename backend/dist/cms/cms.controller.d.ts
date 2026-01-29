import { CmsService } from './cms.service';
import { Page } from '../entities/page.entity';
import { BlogPost } from '../entities/blog-post.entity';
import { Menu } from '../entities/menu.entity';
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
    createBlog(data: Partial<BlogPost>): Promise<BlogPost>;
    updateBlog(id: string, data: Partial<BlogPost>): Promise<BlogPost>;
    deleteBlog(id: string): Promise<void>;
    getAllMenus(): Promise<Menu[]>;
    getMenu(id: string): Promise<Menu>;
    getMenuByLocation(location: string): Promise<Menu>;
    createMenu(data: Partial<Menu>): Promise<Menu>;
    updateMenu(id: string, data: Partial<Menu>): Promise<Menu>;
    deleteMenu(id: string): Promise<void>;
}
