import { swaggerConfig } from './config/swagger.config';
import { SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, document);
  app.use(cookieParser(process.env.COOKIE_SECRET || 'super_safe_secret'));
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
