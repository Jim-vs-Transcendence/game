import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { join } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';
import { GameGateway } from './game.gateway';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../..', 'client'),
    })
  ],
  controllers: [AppController],
  providers: [AppService, GameGateway],
})
export class AppModule { }
