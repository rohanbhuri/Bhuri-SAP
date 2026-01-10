import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getRoot() {
    return {
      message: 'Bhuri SAP API Server',
      status: 'Running',
      brand: process.env.BRAND || 'beax-rm',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      endpoints: {
        health: '/api/health',
        auth: '/api/auth',
        users: '/api/users',
        organizations: '/api/organizations',
        modules: '/api/modules'
      }
    };
  }

  @Get('api')
  getApiRoot() {
    return this.getRoot();
  }
}