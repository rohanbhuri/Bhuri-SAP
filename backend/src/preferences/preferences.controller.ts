import { Controller, Get, Post, Body, UseGuards, Request, ValidationPipe } from '@nestjs/common';
import { PreferencesService } from './preferences.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { IsOptional, IsString, IsArray } from 'class-validator';

class UserPreferencesDto {
  @IsOptional()
  @IsString()
  theme?: string;
  
  @IsOptional()
  @IsString()
  primaryColor?: string;
  
  @IsOptional()
  @IsString()
  accentColor?: string;
  
  @IsOptional()
  @IsString()
  secondaryColor?: string;
  
  @IsOptional()
  @IsString()
  currency?: string;
  
  @IsOptional()
  @IsString()
  currencySymbol?: string;
  
  @IsOptional()
  @IsArray()
  pinnedModules?: string[];
  
  @IsOptional()
  dashboardPreferences?: any;
}

@Controller('preferences')
@UseGuards(JwtAuthGuard)
export class PreferencesController {
  constructor(private preferencesService: PreferencesService) {}

  @Get()
  async getUserPreferences(@Request() req) {
    if (!req.user?.userId) {
      return null;
    }
    return this.preferencesService.getUserPreferences(req.user.userId);
  }

  @Post()
  async saveUserPreferences(@Request() req, @Body(ValidationPipe) preferencesDto: UserPreferencesDto) {
    if (!req.user?.userId) {
      throw new Error('User not authenticated');
    }
    console.log('Saving preferences for user:', req.user.userId, 'Data:', preferencesDto);
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