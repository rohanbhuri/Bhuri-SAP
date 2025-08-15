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
    return this.userPreferencesRepository.findOne({ where: { userId } });
  }

  async saveUserPreferences(userId: string, preferences: any) {
    const existing = await this.userPreferencesRepository.findOne({ where: { userId } });
    
    if (existing) {
      await this.userPreferencesRepository.update({ userId }, preferences);
      return this.userPreferencesRepository.findOne({ where: { userId } });
    } else {
      const newPreferences = this.userPreferencesRepository.create({ userId, ...preferences });
      return this.userPreferencesRepository.save(newPreferences);
    }
  }
}