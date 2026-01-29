import { ObjectId } from 'typeorm';
export declare class UserPreferences {
    _id: ObjectId;
    userId: string;
    theme: string;
    primaryColor: string;
    accentColor: string;
    secondaryColor: string;
    pinnedModules: string[];
    dashboardPreferences: {
        widgets?: {
            id: string;
            size: 's' | 'm' | 'l';
            position: number;
        }[];
    };
    currency: string;
    currencySymbol: string;
}
