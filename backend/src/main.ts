import 'reflect-metadata';
require('../load-config');
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './filters/global-exception.filter';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import { Response } from 'express';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Add middleware to handle HTML entity decoding
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));
  
  // Middleware to decode HTML entities in request body
  app.use((req, res, next) => {
    if (req.body && typeof req.body === 'string') {
      try {
        // Decode HTML entities
        const decoded = req.body
          .replace(/&quot;/g, '"')
          .replace(/&amp;/g, '&')
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>')
          .replace(/&#x27;/g, "'")
          .replace(/&#x2F;/g, '/');
        
        // Try to parse as JSON
        req.body = JSON.parse(decoded);
      } catch (e) {
        // If parsing fails, keep original body
      }
    }
    next();
  });

  // Global exception filter for better error handling
  app.useGlobalFilters(new GlobalExceptionFilter());

  // Global validation pipe with better error messages
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    transformOptions: {
      enableImplicitConversion: true,
    },
  }));

  // Enable CORS for cross-domain access
  app.enableCors({
    origin: true, // Allow all domains
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'X-API-Key'],
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