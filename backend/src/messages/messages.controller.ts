import { Controller, Get, Post, Delete, Param, Body, Query, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { PermissionsGuard } from '../guards/permissions.guard';
import { MessagesService } from './messages.service';

@Controller('messages')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Get('org-members')
  async getOrganizationsWithMembers(@Request() req) {
    return this.messagesService.listOrganizationsWithMembers(req.user.userId);
  }

  @Post('dm/:organizationId/:otherUserId')
  async getOrCreateDM(@Request() req, @Param('organizationId') organizationId: string, @Param('otherUserId') otherUserId: string) {
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
    return this.messagesService.sendMessage(conversationId, req.user.userId, body.content);
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

  @Get('search')
  async searchMessages(@Request() req, @Query('q') query: string, @Query('conversationId') conversationId?: string) {
    return this.messagesService.searchMessages(req.user.userId, query, conversationId);
  }
}