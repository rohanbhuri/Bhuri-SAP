import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderManagementController } from './order-management.controller';
import { OrderManagementService } from './order-management.service';
import { Order, OrderStatusHistory } from '../entities/order.entity';
import { Contact } from '../entities/contact.entity';
import { User } from '../entities/user.entity';
import { Organization } from '../entities/organization.entity';
import { AuthModule } from '../auth/auth.module';
import { MessagesModule } from '../messages/messages.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Order,
      OrderStatusHistory,
      Contact,
      User,
      Organization,
    ]),
    AuthModule,
    MessagesModule,
  ],
  controllers: [OrderManagementController],
  providers: [OrderManagementService],
  exports: [OrderManagementService],
})
export class OrderManagementModule {}
