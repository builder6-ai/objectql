import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.enableCors({
      origin: ['http://localhost:5173', 'http://localhost:3000'],
      credentials: true
  });
  
  // NestJS by default listens on 3000
  await app.listen(3000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
