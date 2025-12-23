import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CmsController } from './cms.controller';
import { CmsService } from './cms.service';
import { Page } from '../entities/page.entity';
import { BlogPost } from '../entities/blog-post.entity';
import { Menu } from '../entities/menu.entity';

import { MediaController } from './media.controller';

@Module({
    imports: [
        TypeOrmModule.forFeature([Page, BlogPost, Menu])
    ],
    controllers: [CmsController, MediaController],
    providers: [CmsService],
    exports: [CmsService]
})
export class CmsModule { }
