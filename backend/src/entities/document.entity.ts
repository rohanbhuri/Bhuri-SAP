import { Entity, ObjectIdColumn, ObjectId, Column, Index } from 'typeorm';

@Entity('documents.files')
export class DocumentFile {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column()
  filename: string;

  @Column()
  length: number; // bytes

  @Column()
  chunkSize: number;

  @Column()
  uploadDate: Date;

  @Column({ nullable: true })
  contentType?: string;

  @Column({ type: 'simple-json', nullable: true })
  metadata?: any;
}

@Entity('documents.chunks')
export class DocumentChunk {
  @ObjectIdColumn()
  _id: ObjectId;

  @Index()
  @Column({ type: String })
  files_id: ObjectId;

  @Column()
  n: number;

  @Column({ type: 'bytea' as any })
  data: Buffer;
}

@Entity('document-records')
export class DocumentRecord {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column()
  name: string;

  @Column()
  fileId: string; // reference to GridFS file id as string

  @Index()
  @Column({ type: String })
  employeeId: ObjectId;

  @Column({ nullable: true })
  type?: string; // contract, certificate, etc

  @Column({ type: String })
  organizationId: ObjectId;

  @Column()
  createdAt: Date;

  constructor() {
    this.createdAt = new Date();
  }
}