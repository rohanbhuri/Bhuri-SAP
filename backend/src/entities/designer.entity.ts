import { Entity, ObjectIdColumn, ObjectId, Column } from 'typeorm';

@Entity('designers')
export class Designer {
    @ObjectIdColumn()
    _id: ObjectId;

    @Column()
    name: string;

    @Column({ nullable: true })
    bio?: string;

    @Column({ nullable: true })
    description?: string;

    @Column({ nullable: true })
    profileImage?: string;

    @Column('array')
    portfolioImages: string[];

    @Column({ nullable: true })
    email?: string;

    @Column({ nullable: true })
    phone?: string;

    @Column({ nullable: true })
    website?: string;

    @Column()
    isActive: boolean;

    @Column()
    createdAt: Date;

    @Column({ nullable: true })
    updatedAt: Date;

    @Column({ nullable: true })
    createdBy?: string;

    @Column({ nullable: true })
    updatedBy?: string;

    @Column({ type: 'json', default: [] })
    changeLog: Array<{
        userId: string;
        action: string;
        timestamp: Date;
    }>;

    constructor() {
        this.portfolioImages = [];
        this.isActive = true;
        this.createdAt = new Date();
        this.changeLog = [];
    }
}
