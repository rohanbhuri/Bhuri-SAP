import { Controller, Get, Post, Param, Body, Query, UseGuards, Request } from '@nestjs/common';
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
  async createGroup(@Param('organizationId') organizationId: string, @Body() body: { name: string; memberIds: string[] }) {
    return this.messagesService.createGroup(organizationId, body.name, body.memberIds || []);
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
}