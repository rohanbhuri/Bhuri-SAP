import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CrmController } from './crm.controller';
import { CrmService } from './crm.service';
import { CrmFunnelController } from './crm-funnel.controller';
import { CrmFunnelService } from './crm-funnel.service';
import { Contact } from '../entities/contact.entity';
import { Lead } from '../entities/lead.entity';
import { Deal } from '../entities/deal.entity';
import { Task } from '../entities/task.entity';
import { User } from '../entities/user.entity';
import { Organization } from '../entities/organization.entity';
import { Role } from '../entities/role.entity';
import { Permission } from '../entities/permission.entity';
import { ClientRequest } from '../entities/client-request.entity';
import { Enquiry } from '../entities/enquiry.entity';
import { Presentation } from '../entities/presentation.entity';
import { Quotation } from '../entities/quotation.entity';
import { Order } from '../entities/order.entity';
import { Invoice } from '../entities/invoice.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Contact, Lead, Deal, Task, User, Organization, Role, Permission,
      ClientRequest, Enquiry, Presentation, Quotation, Order, Invoice
    ]),
    AuthModule
  ],
  controllers: [CrmController, CrmFunnelController],
  providers: [CrmService, CrmFunnelService],
  exports: [CrmService, CrmFunnelService]
})
export class CrmModule {}