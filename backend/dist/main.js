"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
require('../load-config');
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const app_module_1 = require("./app.module");
const global_exception_filter_1 = require("./filters/global-exception.filter");
const path_1 = require("path");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.useGlobalFilters(new global_exception_filter_1.GlobalExceptionFilter());
    app.useGlobalPipes(new common_1.ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
        transformOptions: {
            enableImplicitConversion: true,
        },
    }));
    app.enableCors({
        origin: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'X-API-Key'],
        credentials: true,
    });
    app.useStaticAssets((0, path_1.join)(__dirname, '..', 'uploads'), {
        prefix: '/uploads/',
    });
    app.getHttpAdapter().get('/', (req, res) => {
        res.status(200).json({
            message: 'Bhuri SAP Server',
            status: 'Running',
            brand: process.env.BRAND || 'beax-rm',
            api: '/api',
            health: '/api/health'
        });
    });
    app.setGlobalPrefix('api');
    const port = process.env.PORT || 3000;
    await app.listen(port);
    console.log(`Backend running on port ${port}`);
    console.log(`Environment: ${process.env.NODE_ENV}`);
    console.log(`Brand: ${process.env.BRAND || 'beax-rm'}`);
}
bootstrap();
//# sourceMappingURL=main.js.map