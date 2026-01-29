import { Repository } from 'typeorm';
import { UserPreferences } from '../entities/user-preferences.entity';
export declare class PreferencesService {
    private userPreferencesRepository;
    constructor(userPreferencesRepository: Repository<UserPreferences>);
    getUserPreferences(userId: string): Promise<UserPreferences>;
    saveUserPreferences(userId: string, preferences: any): Promise<UserPreferences | UserPreferences[]>;
    togglePinnedModule(userId: string, moduleId: string): Promise<UserPreferences | UserPreferences[]>;
    saveDashboardPreferences(userId: string, dashboardPreferences: any): Promise<UserPreferences | UserPreferences[]>;
}
