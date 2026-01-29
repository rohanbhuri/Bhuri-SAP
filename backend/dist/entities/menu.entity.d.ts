import { ObjectId } from 'typeorm';
export interface MenuItem {
    id: string;
    label: string;
    url?: string;
    pageId?: string;
    blogId?: string;
    externalUrl?: string;
    children?: MenuItem[];
    order: number;
    icon?: string;
    target?: '_self' | '_blank';
}
export declare class Menu {
    _id: ObjectId;
    name: string;
    location: string;
    items: MenuItem[];
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    constructor();
}
