export interface BrandConfig {
    brand: {
        name: string;
        logo: string;
        logoDark?: string;
        icon: string;
    };
    app: {
        name: string;
        apiUrl: string;
        port: number;
        description: string;
        version: string;
    };
    colors: {
        primary: string;
        accent: string;
        secondary: string;
    };
}

export const getBrandConfig = (): BrandConfig => {
    if (typeof window !== 'undefined' && (window as any).brandConfig) {
        return (window as any).brandConfig;
    }

    // Fallback for SSR
    return {
        brand: {
            name: 'Racconti XRM',
            logo: '/assets/logo.png',
            icon: '/assets/icon.png'
        },
        app: {
            name: 'Racconti XRM',
            apiUrl: 'http://localhost:3002/api',
            port: 4202,
            description: 'Racconti XRM System',
            version: '1.0.0'
        },
        colors: {
            primary: '#000000',
            accent: '#ffffff',
            secondary: '#cccccc'
        }
    };
};
