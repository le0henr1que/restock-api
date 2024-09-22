import { PlanModule } from './modules/plan/plan.module';
import { OrganizationModule } from './modules/organization/organization.module';
import { classes } from '@automapper/classes';
import {
  CamelCaseNamingConvention,
  SnakeCaseNamingConvention,
} from '@automapper/core';
import { AutomapperModule } from '@automapper/nestjs';
import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { ThrottlerModule } from '@nestjs/throttler';

import { AuthModule } from './auth/auth.module';
import { AtGuard } from './auth/guards';
import { AssignmentsGuard } from './auth/guards/assignments.guard';
import { RolesGuard } from './auth/guards/roles.guard';
import { PrismaModule } from './database/prisma/prisma.module';
import { AllExceptionsFilter } from './middlewares/exception.filter';
import { HTTPLoggerMiddleware } from './middlewares/logger.middleware';
import { RequestIpMiddleware } from './middlewares/request.ip.middleware';
import { UserDisabledMiddleware } from './middlewares/user-disabled.middleware';
import { EmailModule } from './modules/email/email.module';
import { HealthCheckModule } from './modules/healthCheck/healthCheck.module';
import { LogModule } from './modules/log/log.module';
import { MongoService } from './modules/mongo/mongo.service';
import { UserModule } from './modules/user/user.module';
import { WebsocketModule } from './modules/websocket/websocket.module';
import { StripeModule } from './modules/stripe/stripe.module';

export const THROTTLER_LIMIT = 10;

@Module({
  controllers: [],
  providers: [
    { provide: APP_GUARD, useClass: AtGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
    { provide: APP_GUARD, useClass: AssignmentsGuard },
    { provide: APP_GUARD, useClass: RequestIpMiddleware },
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
    MongoService,
  ],
  imports: [
    EmailModule,
    ConfigModule.forRoot(),
    ThrottlerModule.forRoot([
      {
        limit: THROTTLER_LIMIT,
        ttl: 30000,
      },
    ]),
    AutomapperModule.forRoot({
      strategyInitializer: classes(),
      namingConventions: {
        source: new CamelCaseNamingConvention(),
        destination: new SnakeCaseNamingConvention(),
      },
    }),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
    }),
    MongooseModule.forRoot(process.env.MONGODB_URI),
    AuthModule,
    LogModule,
    HealthCheckModule,
    PrismaModule,
    WebsocketModule,
    UserModule,
    EmailModule,
    OrganizationModule,
    PlanModule,
    StripeModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(UserDisabledMiddleware)
      .exclude(
        { path: '/api/auth/login', method: RequestMethod.ALL },
        { path: '/api/auth/register/logout', method: RequestMethod.ALL },
        { path: '/api/auth/me', method: RequestMethod.ALL },
        { path: '/api/auth/resend', method: RequestMethod.ALL },
        { path: '/api/auth/email/availability', method: RequestMethod.ALL },
        { path: '/api/auth/forgot/password', method: RequestMethod.ALL },
        { path: '/api/auth/register/account', method: RequestMethod.ALL },
        { path: '/api/plan', method: RequestMethod.ALL },
      )
      .forRoutes('*');

    consumer
      .apply(RequestIpMiddleware)
      .exclude({ path: '/api/plan', method: RequestMethod.ALL })
      .forRoutes('*');

    consumer
      .apply(HTTPLoggerMiddleware)
      .exclude({ path: '/api/plan', method: RequestMethod.ALL })
      .forRoutes('*');
  }
}
