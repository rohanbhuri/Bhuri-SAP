import { Entity, ObjectIdColumn, ObjectId, Column } from 'typeorm';

@Entity('inventory-items')
export class InventoryItem {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column()
  name: string;

  @Column()
  sku: string;

  @Column()
  category: string;

  @Column()
  quantity: number;

  @Column()
  unitPrice: number;

  @Column()
  minStockLevel: number;

  @Column()
  supplier: string;

  @Column()
  status: string; // in-stock, low-stock, out-of-stock

  @Column('objectId')
  organizationId: ObjectId;

  @Column()
  createdAt: Date;

  constructor() {
    this.status = 'in-stock';
    this.createdAt = new Date();
  }
}