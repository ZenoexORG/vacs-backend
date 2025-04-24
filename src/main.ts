import { LocalToUTCInterceptor } from './shared/interceptors/local-to-utc.interceptor';
import { UTCToLocalInterceptor } from './shared/interceptors/utc-to-loca.interceptor';
import { swaggerConfig } from './config/swagger.config';
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

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, document);

  app.use(cookieParser(process.env.COOKIE_SECRET || 'super_safe_secret'));
  app.useGlobalInterceptors(new LocalToUTCInterceptor(), new UTCToLocalInterceptor());

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
