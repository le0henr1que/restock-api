import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'log', 'warn', 'debug'],
  });

  app.enableCors();
  app.use(helmet());

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: false,
    }),
  );

  app.setGlobalPrefix('api');

  const configDefault = new DocumentBuilder()
    .setTitle('nest-api api')
    .setVersion('0.1')
    .addBearerAuth({
      type: 'http',
      bearerFormat: 'JWT',
      description:
        'Enter JWT token in format "{TOKEN}" without "Bearer/bearer"',
      scheme: 'bearer',
      in: 'header',
      name: 'Authorization',
      openIdConnectUrl: null,
      flows: {
        implicit: {
          authorizationUrl: '/api/auth/login',
          tokenUrl: '/api/auth/login',
          refreshUrl: '/api/auth/refresh',
          scopes: {},
        },
      },
    })
    .build();

  const documentDefault = SwaggerModule.createDocument(app, configDefault);

  documentDefault.components.parameters = {
    'x-forwarded-for': {
      in: 'header',
      name: 'x-forwarded-for',
      schema: {
        type: 'string',
      },
      required: true,
      description: 'O endereço IP original do cliente conectadoP',
    },
  };

  documentDefault.components.parameters = {
    'accept-language': {
      in: 'header',
      name: 'accept-language',
      schema: {
        type: 'string',
        enum: ['en-US', 'pt-BR'],
        default: 'pt',
      },
      required: true,
      description: 'Linguagem de preferência do usuário',
    },
  };

  SwaggerModule.setup('api/docs', app, documentDefault);

  await app.listen(process.env.APP_PORT || 3333);
}

bootstrap();
