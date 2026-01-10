import 'reflect-metadata';
require('../load-config');
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './filters/global-exception.filter';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import { Response } from 'express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Global exception filter for better error handling
  app.useGlobalFilters(new GlobalExceptionFilter());

  // Global validation pipe with better error messages
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
    transformOptions: {
      enableImplicitConversion: true,
    },
  }));

  // Enable CORS for frontend communication
  app.enableCors({
    origin: [
      'http://localhost:4200',
      'http://localhost:4201',
      'http://localhost:4202',
      'http://13.126.228.247:4200',
      'http://13.126.228.247:4201',
      'http://13.126.228.247:4202',
      'http://13.126.228.247:4202',
      'http://3.111.139.181:4200',
      'http://3.111.139.181:4201',
      'http://68.178.171.103:4202',
      'http://68.178.171.103:3002'
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  // Serve static files for uploaded avatars
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });

  // Handle root route before setting global prefix
  app.getHttpAdapter().get('/', (req, res: Response) => {
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