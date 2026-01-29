export declare class AppController {
    getApiRoot(): {
        message: string;
        status: string;
        brand: string;
        version: string;
        timestamp: string;
        endpoints: {
            health: string;
            auth: string;
            users: string;
            organizations: string;
            modules: string;
        };
    };
}
