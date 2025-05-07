import { swaggerConfig } from './config/swagger.config';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true,
  })

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
    forbidNonWhitelisted: true,
    stopAtFirstError: true,
    transformOptions: {
      enableImplicitConversion: true,
    },
  }));

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: {
      securityDefinitions: {
        'X-API-KEY': {
          type: 'apiKey',
          name: 'X-API-KEY',
          in: 'header',
        },
      },
    }
  });

  app.use(cookieParser(process.env.COOKIE_SECRET || 'super_safe_secret'));
  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
