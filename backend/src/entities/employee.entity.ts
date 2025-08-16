import { Entity, ObjectIdColumn, ObjectId, Column } from 'typeorm';

@Entity('employees')
export class Employee {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column()
  employeeId: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  email: string;

  @Column()
  phone: string;

  @Column()
  department: string;

  @Column()
  position: string;

  @Column()
  salary: number;

  @Column()
  hireDate: Date;

  @Column()
  status: string; // active, inactive, terminated

  @Column({ type: String })
  organizationId: ObjectId;

  @Column({ type: String })
  managerId: ObjectId;

  @Column()
  createdAt: Date;

  constructor() {
    this.status = 'active';
    this.createdAt = new Date();
  }
}