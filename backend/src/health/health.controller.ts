import { Controller, Get } from '@nestjs/common';

@Controller('health')
export class HealthController {
  @Get()
  getHealth() {
    return {
      status: 'OK',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV,
      brand: process.env.BRAND,
      port: process.env.PORT,
      version: '1.0.0',
    };
  }

  @Get('database')
  getDatabaseHealth() {
    return {
      status: 'OK',
      database: 'MongoDB',
      connection: process.env.MONGODB_URI ? 'Configured' : 'Not configured',
    };
  }
}