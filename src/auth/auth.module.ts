import { Module, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { PrismaModule } from 'src/database/prisma/prisma.module';
import { EmailService } from 'src/modules/email/email.service';
import { LogModule } from 'src/modules/log/log.module';
import { MongoService } from 'src/modules/mongo/mongo.service';
import {
  WebsocketSchema,
  WebsocketSchemaName,
} from 'src/modules/mongo/websocket.model';
import { UserRepository } from 'src/modules/user/user.repository';
import { UserService } from 'src/modules/user/user.service';
import { WebsocketModule } from 'src/modules/websocket/websocket.module';

import { StripeModule } from 'src/modules/stripe/stripe.module';
import { StripeService } from 'src/modules/stripe/stripe.service';
import { AuthController } from './auth.controller';
import { AuthRepository } from './auth.repository';
import { AuthService } from './auth.service';
import { AtStrategy } from './strategies/at.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { RtStrategy } from './strategies/rt.strategy';
import { PlanModule } from 'src/modules/plan/plan.module';

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    AuthRepository,
    LocalStrategy,
    AtStrategy,
    RtStrategy,
    UserService,
    UserRepository,
    EmailService,
    MongoService,
  ],
  imports: [
    PrismaModule,
    JwtModule,
    LogModule,
    PlanModule,
    WebsocketModule,
    MongooseModule.forFeature([
      { name: WebsocketSchemaName, schema: WebsocketSchema },
    ]),
  ],
  exports: [AuthService, AuthRepository],
})
export class AuthModule {}
