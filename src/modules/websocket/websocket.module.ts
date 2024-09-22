import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PrismaModule } from 'src/database/prisma/prisma.module';

import { LogModule } from '../log/log.module';
import { MongoService } from '../mongo/mongo.service';
import { WebsocketSchemaName, WebsocketSchema } from '../mongo/websocket.model';
import { WebsocketRepository } from './websocket.repository';
import { WebsocketService } from './websocket.service';

@Module({
  imports: [
    LogModule,
    PrismaModule,
    MongooseModule.forFeature([
      { name: WebsocketSchemaName, schema: WebsocketSchema },
    ]),
  ],
  controllers: [],
  providers: [WebsocketService, LogModule, WebsocketRepository, MongoService],
  exports: [WebsocketService, WebsocketRepository],
})
export class WebsocketModule {}
