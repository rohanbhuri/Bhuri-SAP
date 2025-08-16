import { Entity, Column, ObjectIdColumn, ObjectId } from 'typeorm';

@Entity('user-preferences')
export class UserPreferences {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column({ unique: true })
  userId: string;

  @Column({ default: 'light' })
  theme: string;

  @Column({ default: '#1976d2' })
  primaryColor: string;

  @Column({ default: '#ff4081' })
  accentColor: string;

  @Column({ default: '#424242' })
  secondaryColor: string;

  @Column({ default: [] })
  pinnedModules: string[];

  @Column({ default: {} })
  dashboardPreferences: {
    widgets?: {
      id: string;
      size: 's' | 'm' | 'l';
      position: number;
    }[];
  };
}