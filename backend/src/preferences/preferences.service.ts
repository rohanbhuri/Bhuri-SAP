import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserPreferences } from '../entities/user-preferences.entity';

@Injectable()
export class PreferencesService {
  constructor(
    @InjectRepository(UserPreferences)
    private userPreferencesRepository: Repository<UserPreferences>
  ) {}

  async getUserPreferences(userId: string) {
    if (!userId) return null;
    const prefs = await this.userPreferencesRepository.findOne({ where: { userId } as any });
    return prefs || null;
  }

  async saveUserPreferences(userId: string, preferences: any) {
    if (!userId) throw new Error('User ID is required');
    
    const existing = await this.userPreferencesRepository.findOne({ where: { userId } as any });
    
    if (existing) {
      await this.userPreferencesRepository.update({ userId } as any, preferences);
      return this.userPreferencesRepository.findOne({ where: { userId } as any });
    } else {
      const newPreferences = this.userPreferencesRepository.create({ userId, ...preferences });
      return this.userPreferencesRepository.save(newPreferences);
    }
  }

  async togglePinnedModule(userId: string, moduleId: string) {
    const prefs = await this.getUserPreferences(userId) || { userId, pinnedModules: [] };
    const pinnedModules = prefs.pinnedModules || [];
    
    const index = pinnedModules.indexOf(moduleId);
    if (index > -1) {
      pinnedModules.splice(index, 1);
    } else {
      pinnedModules.push(moduleId);
    }
    
    return this.saveUserPreferences(userId, { pinnedModules });
  }

  async saveDashboardPreferences(userId: string, dashboardPreferences: any) {
    return this.saveUserPreferences(userId, { dashboardPreferences });
  }
}