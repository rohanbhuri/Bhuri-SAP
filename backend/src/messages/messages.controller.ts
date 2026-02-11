import { Controller, Get, Post, Delete, Param, Body, Query, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { PermissionsGuard } from '../guards/permissions.guard';
import { MessagesService } from './messages.service';
import { MessagesGateway } from './messages.gateway';

@Controller('messages')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class MessagesController {
  constructor(
    private readonly messagesService: MessagesService,
    private readonly messagesGateway: MessagesGateway,
  ) {}

  @Get('org-members')
  async getOrganizationsWithMembers(@Request() req) {
    return this.messagesService.listOrganizationsWithMembers(req.user.userId);
  }

  @Post('dm/:organizationId/:otherUserId')
  async getOrCreateDM(@Request() req, @Param('organizationId') organizationId: string, @Param('otherUserId') otherUserId: string) {
    if (req.user.userId === otherUserId) {
      throw new Error('Cannot create DM with yourself');
    }
    return this.messagesService.getOrCreateDM(organizationId, req.user.userId, otherUserId);
  }

  @Post('group/:organizationId')
  async createGroup(@Request() req, @Param('organizationId') organizationId: string, @Body() body: { name: string; memberIds: string[] }) {
    const memberIds = [...(body.memberIds || []), req.user.userId];
    return this.messagesService.createGroup(organizationId, body.name, memberIds);
  }

  @Get('conversations/:organizationId')
  async listConversations(@Request() req, @Param('organizationId') organizationId: string) {
    return this.messagesService.listConversations(organizationId, req.user.userId);
  }

  @Get('chat/:conversationId')
  async listMessages(@Param('conversationId') conversationId: string, @Query('limit') limit?: string, @Query('before') before?: string) {
    return this.messagesService.listMessages(conversationId, limit ? Number(limit) : 50, before);
  }

  @Post('chat/:conversationId')
  async sendMessage(@Request() req, @Param('conversationId') conversationId: string, @Body() body: { content: string }) {
    const message = await this.messagesService.sendMessage(conversationId, req.user.userId, body.content);
    
    console.log(`📤 Broadcasting message to conversation:${conversationId}`, {
      messageId: (message as any)._id,
      senderId: req.user.userId,
      content: body.content.substring(0, 50)
    });
    
    // Emit WebSocket event to ALL participants in the conversation (including sender for consistency)
    // This ensures the global notification service receives the event
    this.messagesGateway.server.to(`conversation:${conversationId}`).emit('message:new', message);
    
    // Also emit to sender's user room to ensure they receive it even if not in conversation room
    this.messagesGateway.server.to(`user:${req.user.userId}`).emit('message:new', message);
    
    // Update message counts for ALL participants (including sender)
    const conversation = await this.messagesService['conversationRepo'].findOne({
      where: { _id: new (require('mongodb').ObjectId)(conversationId) }
    });
    
    if (conversation) {
      const allMemberIds = (conversation as any).memberIds;
      
      for (const memberId of allMemberIds) {
        const unreadCounts = await this.messagesService.getUnreadMessageCount(String(memberId));
        const totalUnread = Object.values(unreadCounts).reduce((sum, count) => sum + (count as number), 0);
        const unreadConversations = Object.values(unreadCounts).filter(count => (count as number) > 0).length;
        
        console.log(`📊 Emitting counts to user:${memberId} - messages: ${totalUnread}, conversations: ${unreadConversations}`);
        this.messagesGateway.server.to(`user:${memberId}`).emit('message:count', { count: totalUnread });
        this.messagesGateway.server.to(`user:${memberId}`).emit('conversation:count', { count: unreadConversations });
      }
    }
    
    return message;
  }

  @Post('chat/:conversationId/read')
  async markAsRead(@Request() req, @Param('conversationId') conversationId: string) {
    return this.messagesService.markAsRead(conversationId, req.user.userId);
  }

  @Post('chat/:conversationId/typing')
  async setTyping(@Request() req, @Param('conversationId') conversationId: string, @Body() body: { isTyping: boolean }) {
    return this.messagesService.setTyping(conversationId, req.user.userId, body.isTyping);
  }

  @Post(':messageId/reactions')
  async addReaction(@Request() req, @Param('messageId') messageId: string, @Body() body: { emoji: string }) {
    return this.messagesService.addReaction(messageId, req.user.userId, body.emoji);
  }

  @Delete(':messageId/reactions/:emoji')
  async removeReaction(@Request() req, @Param('messageId') messageId: string, @Param('emoji') emoji: string) {
    return this.messagesService.removeReaction(messageId, req.user.userId, emoji);
  }

  @Get('unread-count')
  async getUnreadCount(@Request() req) {
    return this.messagesService.getUnreadMessageCount(req.user.userId);
  }
}