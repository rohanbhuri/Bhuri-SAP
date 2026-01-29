export declare class HealthController {
    getHealth(): {
        status: string;
        timestamp: string;
        uptime: number;
        environment: string;
        brand: string;
        port: string;
        version: string;
    };
    getDatabaseHealth(): {
        status: string;
        database: string;
        connection: string;
    };
}
