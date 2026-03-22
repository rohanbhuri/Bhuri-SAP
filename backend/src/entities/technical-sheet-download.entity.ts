import { Entity, ObjectIdColumn, ObjectId, Column, CreateDateColumn } from 'typeorm';

@Entity('technical_sheet_downloads')
export class TechnicalSheetDownload {
    @ObjectIdColumn()
    _id: ObjectId;

    @Column()
    productId: string;

    @Column()
    productCode: string;

    @Column()
    productName: string;

    @Column({ nullable: true })
    technicalSheetUrl?: string;

    @Column()
    email: string;

    @Column()
    ipAddress: string;

    @Column({ nullable: true })
    userAgent?: string;

    @Column({ nullable: true })
    referrer?: string;

    @CreateDateColumn()
    downloadedAt: Date;
}
