import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PreferencesController } from './preferences.controller';
import { PreferencesService } from './preferences.service';
import { UserPreferences } from '../entities/user-preferences.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserPreferences])
  ],
  controllers: [PreferencesController],
  providers: [PreferencesService],
})
export class PreferencesModule {}