import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FinanceController } from './finance.controller';
import { FinanceService } from './finance.service';
import { Invoice, Receipt, Payment } from '../entities/invoice.entity';
import { Contact } from '../entities/contact.entity';
import { User } from '../entities/user.entity';
import { Organization } from '../entities/organization.entity';
import { Order } from '../entities/order.entity';
import { AuthModule } from '../auth/auth.module';
import { MessagesModule } from '../messages/messages.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Invoice,
      Receipt,
      Payment,
      Contact,
      User,
      Organization,
      Order,
    ]),
    AuthModule,
    MessagesModule,
  ],
  controllers: [FinanceController],
  providers: [FinanceService],
  exports: [FinanceService],
})
export class FinanceModule {}
