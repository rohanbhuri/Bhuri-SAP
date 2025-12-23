import { Entity, ObjectIdColumn, ObjectId, Column } from 'typeorm';

export interface MenuItem {
    id: string;
    label: string;
    url?: string;
    pageId?: string; // Link to a CMS page
    blogId?: string; // Link to a blog post
    externalUrl?: string;
    children?: MenuItem[];
    order: number;
    icon?: string;
    target?: '_self' | '_blank';
}

@Entity('menus')
export class Menu {
    @ObjectIdColumn()
    _id: ObjectId;

    @Column()
    name: string; // e.g., "Main Navigation", "Footer Menu"

    @Column()
    location: string; // e.g., "header", "footer", "sidebar"

    @Column({ type: 'json', default: [] })
    items: MenuItem[];

    @Column({ default: true })
    isActive: boolean;

    @Column()
    createdAt: Date;

    @Column({ nullable: true })
    updatedAt: Date;

    constructor() {
        this.items = [];
        this.isActive = true;
        this.createdAt = new Date();
    }
}
