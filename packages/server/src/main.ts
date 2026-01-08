import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { Liquid } from 'liquidjs';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  
  const engine = new Liquid();
  app.engine('liquid', engine.express());
  app.setViewEngine('liquid');
  app.setBaseViewsDir(join(__dirname, '..', 'views'));

  // NestJS by default listens on 3000
  await app.listen(3000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
