import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ObjectQLModule } from './objectql/objectql.module';
import { AuthModule } from './auth/auth.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ObjectQLModule, 
    AuthModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../../../ui/dist'),
      serveRoot: '/assets/ui',
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
