import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { PreferencesService } from './preferences.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

class UserPreferencesDto {
  theme: string;
  primaryColor: string;
  accentColor: string;
  secondaryColor: string;
}

@Controller('preferences')
@UseGuards(JwtAuthGuard)
export class PreferencesController {
  constructor(private preferencesService: PreferencesService) {}

  @Get()
  async getUserPreferences(@Request() req) {
    return this.preferencesService.getUserPreferences(req.user.userId);
  }

  @Post()
  async saveUserPreferences(@Request() req, @Body() preferencesDto: UserPreferencesDto) {
    return this.preferencesService.saveUserPreferences(req.user.userId, preferencesDto);
  }

  @Post('toggle-pinned-module')
  async togglePinnedModule(@Request() req, @Body() body: { moduleId: string }) {
    return this.preferencesService.togglePinnedModule(req.user.userId, body.moduleId);
  }

  @Post('dashboard')
  async saveDashboardPreferences(@Request() req, @Body() dashboardPreferences: any) {
    return this.preferencesService.saveDashboardPreferences(req.user.userId, dashboardPreferences);
  }
}