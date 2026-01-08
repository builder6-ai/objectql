import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ObjectQLModule } from './objectql/objectql.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [ObjectQLModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
