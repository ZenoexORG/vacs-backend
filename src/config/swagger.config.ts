import { DocumentBuilder } from '@nestjs/swagger';

export const swaggerConfig = new DocumentBuilder()
  .setTitle('Vehicle Access Control API')
  .setDescription('API Documentation for Vehicle Access Control')
  .setVersion('1.0')
  .addBearerAuth()
  .build();
