import { PreferencesService } from './preferences.service';
declare class UserPreferencesDto {
    theme?: string;
    primaryColor?: string;
    accentColor?: string;
    secondaryColor?: string;
    currency?: string;
    currencySymbol?: string;
    pinnedModules?: string[];
    dashboardPreferences?: any;
}
export declare class PreferencesController {
    private preferencesService;
    constructor(preferencesService: PreferencesService);
    getUserPreferences(req: any): Promise<import("../entities/user-preferences.entity").UserPreferences>;
    saveUserPreferences(req: any, preferencesDto: UserPreferencesDto): Promise<import("../entities/user-preferences.entity").UserPreferences | import("../entities/user-preferences.entity").UserPreferences[]>;
    togglePinnedModule(req: any, body: {
        moduleId: string;
    }): Promise<import("../entities/user-preferences.entity").UserPreferences | import("../entities/user-preferences.entity").UserPreferences[]>;
    saveDashboardPreferences(req: any, dashboardPreferences: any): Promise<import("../entities/user-preferences.entity").UserPreferences | import("../entities/user-preferences.entity").UserPreferences[]>;
}
export {};
