import {
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  Res,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { RequestModel } from 'src/auth/models/Request';
import { ApiExceptionResponse } from 'src/utils/swagger-schemas/SwaggerSchema';

import { IsPublic } from 'src/auth/decorators/is-public.decorator';
import { StripeService } from './stripe.service';

@Controller('stripe')
@ApiTags('Stripe')
@IsPublic()
export class StripeController {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor(protected readonly service: StripeService) {
    this.service = service;
  }

  @ApiOperation({ summary: 'Webhook for stripe' })
  @HttpCode(HttpStatus.OK)
  @ApiExceptionResponse()
  @Post('webhook')
  protected async findByIdAsync(
    @Res() response: Response,
    @Request() request: RequestModel,
  ) {
    const body: { type: string } = request.body as any;

    const mappedEvent = {
      'plan.created': async () => {
        await this.service.createPlanAsync(request.body);
      },
      'plan.updated': async () => {
        await this.service.updatePlanAsync(request.body);
      },
      'plan.deleted': async () => {
        await this.service.deletePlanAsync(request.body);
      },
      'checkout.session.completed': async () => {
        await this.service.finalizeCheckoutSessionAsync(request.body);
      },
    };

    const eventType = body?.type;
    if (mappedEvent[eventType]) {
      mappedEvent[eventType]();
    }
    return response.status(HttpStatus.OK).send();
  }

  @ApiOperation({ summary: 'Generate Checkout' })
  @HttpCode(HttpStatus.OK)
  @ApiExceptionResponse()
  @Post('checkout')
  protected async createCheckout(
    @Res() response: Response,
    @Request() request: RequestModel,
  ) {
    const { planId, userId } = request.body as any;

    const session = await this.service.generateCheckoutSessionAsync({
      planId,
      userId,
    });

    return response.status(HttpStatus.OK).send({ session });
  }
}
