import { Controller, Get, Post, Patch, Delete, Param, Query, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { Public } from '../decorators/public.decorator';
import { NotificationsService } from './notifications.service';
import { MailService } from './mail.service';
import { NotificationType } from '../entities/notification.entity';

@Controller('notifications')
export class NotificationsController {
  constructor(
    private readonly notificationsService: NotificationsService,
    private readonly mailService: MailService,
  ) {}

  // Test endpoint for email (public - no auth required)
  @Get('test-email')
  @Public()
  async testEmail() {
    try {
      await this.mailService.sendContactUsNotification({
        name: 'Test User',
        email: 'test@example.com',
        subject: 'Test Email',
        message: 'This is a test email to verify SMTP configuration.'
      });
      return { success: true, message: 'Test email sent successfully!' };
    } catch (error: any) {
      return { success: false, error: error.message || String(error) };
    }
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getNotifications(
    @Request() req,
    @Query('limit') limit?: string,
    @Query('skip') skip?: string,
    @Query('unreadOnly') unreadOnly?: string,
    @Query('type') type?: NotificationType
  ) {
    const userId = req.user.id || req.user.userId || req.user._id;
    console.log('getNotifications - User from JWT:', req.user);
    console.log('getNotifications - userId:', userId);
    
    const limitNum = limit ? parseInt(limit, 10) : 50;
    const skipNum = skip ? parseInt(skip, 10) : 0;
    const unreadOnlyBool = unreadOnly === 'true';

    if (type) {
      return this.notificationsService.getNotificationsByType(userId, type, limitNum);
    }

    const results = await this.notificationsService.getUserNotifications(userId, limitNum, skipNum, unreadOnlyBool);
    console.log('getNotifications - results count:', results.length);
    return results;
  }

  @Get('count')
  @UseGuards(JwtAuthGuard)
  async getUnreadCount(@Request() req) {
    const userId = req.user.id || req.user.userId || req.user._id;
    const count = await this.notificationsService.getUnreadCount(userId);
    return { count };
  }

  @Get('messages')
  @UseGuards(JwtAuthGuard)
  async getMessageNotifications(
    @Request() req,
    @Query('conversationId') conversationId?: string
  ) {
    const userId = req.user.id;
    return this.notificationsService.getMessageNotifications(userId, conversationId);
  }

  @Patch(':id/read')
  @UseGuards(JwtAuthGuard)
  async markAsRead(@Param('id') id: string) {
    const notification = await this.notificationsService.markAsRead(id);
    return { success: true, notification };
  }

  @Patch('read-all')
  @UseGuards(JwtAuthGuard)
  async markAllAsRead(@Request() req) {
    const userId = req.user.id;
    const result = await this.notificationsService.markAllAsRead(userId);
    return { success: true, ...result };
  }

  @Patch('conversation/:conversationId/read')
  @UseGuards(JwtAuthGuard)
  async markConversationAsRead(
    @Request() req,
    @Param('conversationId') conversationId: string
  ) {
    try {
      const userId = req.user.id;
      const result = await this.notificationsService.markConversationNotificationsAsRead(
        userId,
        conversationId
      );
      return { success: true, ...result };
    } catch (error: any) {
      if (error.message.includes('Invalid')) {
        return {
          success: false,
          error: error.message,
          modifiedCount: 0
        };
      }
      throw error;
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deleteNotification(@Param('id') id: string) {
    const success = await this.notificationsService.deleteNotification(id);
    return { success };
  }

  @Delete('cleanup/old')
  @UseGuards(JwtAuthGuard)
  async cleanupOldNotifications(@Query('days') days?: string) {
    const daysNum = days ? parseInt(days, 10) : 30;
    const result = await this.notificationsService.deleteOldNotifications(daysNum);
    return { success: true, ...result };
  }
}