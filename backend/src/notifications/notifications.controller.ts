import { Controller, Get, Post, Patch, Delete, Param, Query, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { NotificationsService } from './notifications.service';
import { NotificationType } from '../entities/notification.entity';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  async getNotifications(
    @Request() req,
    @Query('limit') limit?: string,
    @Query('skip') skip?: string,
    @Query('unreadOnly') unreadOnly?: string,
    @Query('type') type?: NotificationType
  ) {
    const userId = req.user.id;
    const limitNum = limit ? parseInt(limit, 10) : 50;
    const skipNum = skip ? parseInt(skip, 10) : 0;
    const unreadOnlyBool = unreadOnly === 'true';

    if (type) {
      return this.notificationsService.getNotificationsByType(userId, type, limitNum);
    }

    return this.notificationsService.getUserNotifications(userId, limitNum, skipNum, unreadOnlyBool);
  }

  @Get('count')
  async getUnreadCount(@Request() req) {
    const userId = req.user.id;
    const count = await this.notificationsService.getUnreadCount(userId);
    return { count };
  }

  @Get('messages')
  async getMessageNotifications(
    @Request() req,
    @Query('conversationId') conversationId?: string
  ) {
    const userId = req.user.id;
    return this.notificationsService.getMessageNotifications(userId, conversationId);
  }

  @Patch(':id/read')
  async markAsRead(@Param('id') id: string) {
    const notification = await this.notificationsService.markAsRead(id);
    return { success: true, notification };
  }

  @Patch('read-all')
  async markAllAsRead(@Request() req) {
    const userId = req.user.id;
    const result = await this.notificationsService.markAllAsRead(userId);
    return { success: true, ...result };
  }

  @Patch('conversation/:conversationId/read')
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
    } catch (error) {
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
  async deleteNotification(@Param('id') id: string) {
    const success = await this.notificationsService.deleteNotification(id);
    return { success };
  }

  @Delete('cleanup/old')
  async cleanupOldNotifications(@Query('days') days?: string) {
    const daysNum = days ? parseInt(days, 10) : 30;
    const result = await this.notificationsService.deleteOldNotifications(daysNum);
    return { success: true, ...result };
  }
}