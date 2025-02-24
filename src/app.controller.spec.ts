import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  it('debe estar definido', () => {
    expect(appController).toBeDefined();
  });

  it('debe retornar la información de la API correctamente', () => {
    const apiInfo = appController.getApiInfo();
    
    expect(apiInfo).toHaveProperty('name', 'Vehicle Access Control API');
    expect(apiInfo).toHaveProperty('description', 'API for managing vehicle access control in UTB');
    expect(apiInfo).toHaveProperty('version', '1.0.0');
    expect(apiInfo).toHaveProperty('status');
    expect(apiInfo).toHaveProperty('uptime');
    expect(apiInfo).toHaveProperty('documentation', '/docs');
    expect(typeof apiInfo.uptime).toBe('number');
  });
});