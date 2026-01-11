import { Entity, ObjectIdColumn, Column } from 'typeorm';
import { ObjectId } from 'mongodb';

@Entity('api_keys')
export class ApiKey {
    @ObjectIdColumn()
    _id: ObjectId;

    @Column()
    name: string;

    @Column({ unique: true })
    token: string;

    @Column()
    userId: string;

    @Column()
    organizationId: string;

    @Column()
    expiresAt: Date;

    @Column({ default: true })
    isActive: boolean;

    @Column({ type: 'array', default: [] })
    allowedDomains: string[];

    @Column({ default: 0 })
    usageCount: number;

    @Column()
    createdAt: Date;

    @Column()
    lastUsedAt: Date;
}
