import { Entity, ObjectIdColumn, ObjectId, Column } from 'typeorm';

@Entity('email_templates')
export class EmailTemplate {
    @ObjectIdColumn()
    _id: ObjectId;

    @Column()
    name: string;

    @Column()
    subject: string;

    @Column()
    body: string; // HTML content or text with variables

    @Column('array')
    variables: string[]; // List of available variables for this template

    @Column({ default: true })
    isActive: boolean;

    @Column()
    createdAt: Date;

    @Column({ nullable: true })
    updatedAt: Date;

    constructor() {
        this.isActive = true;
        this.variables = [];
        this.createdAt = new Date();
    }
}
