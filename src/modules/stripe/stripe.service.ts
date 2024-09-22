import { Injectable, Logger } from '@nestjs/common';
import { Prisma, StatusEnum } from '@prisma/client';
import { config } from 'src/config/stipe';
import { PrismaService } from 'src/database/prisma/prisma.service';
import Stripe from 'stripe';
import { PlanRepository } from '../plan/plan.repository';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class StripeService {
  private logger = new Logger(StripeService.name);
  private readonly stripe: Stripe;
  constructor(
    private readonly planRepository: PlanRepository,
    private readonly prisma: PrismaService,
    private readonly authService: AuthService,
  ) {
    this.stripe = new Stripe(config.stripe.secretKey, {
      apiVersion: '2024-06-20',
    });
  }

  async generateCheckoutSessionAsync(data: { planId: string; userId: string }) {
    const { planId, userId } = data;

    const user = await this.prisma.user.findFirst({
      where: {
        id: userId,
      },
      include: {
        ownedOrganizations: true,
        organizationUser: {
          include: {
            UserAssignment: {
              where: {
                Assignment: {
                  status: StatusEnum.ACTIVE,
                  deletedAt: null,
                },
              },
              include: {
                Assignment: true,
              },
            },
            Roles: {
              where: {
                role: {
                  status: StatusEnum.ACTIVE,
                  deletedAt: null,
                },
              },
              include: {
                role: true,
              },
            },
          },
        },
      },
    });

    const token = await this.authService.getTokens(user as any);

    const objectCreateStripe: Stripe.Checkout.SessionCreateParams = {
      payment_method_types: ['card'],
      mode: 'subscription',
      client_reference_id: userId,
      success_url: `${process.env.APP_URL}/auth/redirect?success=true&token=${token?.accessToken}`,
      cancel_url: `${process.env.APP_URL}/auth/redirect?success=false`,
      metadata: {
        planId,
      },
      line_items: [
        {
          price: planId,
          quantity: 1,
        },
      ],
    };

    // TODO verificar se o usuario ja tem um customer no stripe
    // const existingCustomers = { data: [] };

    // if (existingCustomers.data.length === 0) {
    const customer = await this.stripe.customers.create({
      email: user?.email,
      name: user?.name,
    });
    objectCreateStripe.customer = customer.id;
    // }

    // objectCreateStripe.customer =
    //   existingCustomers.data.length > 0 && existingCustomers.data[0].email;

    const session =
      await this.stripe.checkout.sessions.create(objectCreateStripe);

    return {
      url: session.url,
    };
  }

  async createPlanAsync(data: any) {
    const isExist = await this.prisma.plan.findFirst({
      where: {
        planIdPlatform: data.data.object.id,
      },
    });

    if (isExist) {
      return;
    }

    const { nickname, amount, currency, id, active } = data.data.object ?? {};

    const status = active ? StatusEnum.ACTIVE : StatusEnum.INACTIVE;
    const adjustedAmount = amount / 100;

    await this.planRepository.createAsync({
      name: nickname,
      price: adjustedAmount,
      planIdPlatform: id,
      status: status,
      durationInDays: 30,
      userLimit: 2,
    });
  }
  async updatePlanAsync(data: any) {
    const isExist = await this.prisma.plan.findFirst({
      where: {
        planIdPlatform: data.data.object.id,
      },
    });

    if (!isExist) {
      return;
    }

    const { nickname, amount, currency, id, active } = data.data.object ?? {};

    const status = active ? StatusEnum.ACTIVE : StatusEnum.INACTIVE;
    const adjustedAmount = amount / 100;

    await this.prisma.plan.updateMany({
      where: {
        planIdPlatform: id,
      },
      data: {
        name: nickname,
        price: adjustedAmount,
        status: status,
      },
    });
  }
  async deletePlanAsync(data: any) {
    const { id } = data.data.object ?? {};

    const isExist = await this.prisma.plan.findFirst({
      where: {
        planIdPlatform: data.data.object.id,
      },
    });

    if (!isExist) {
      return;
    }

    await this.prisma.plan.deleteMany({
      where: {
        planIdPlatform: id,
      },
    });
  }
  async finalizeCheckoutSessionAsync(data: any) {
    const { client_reference_id } = data.data.object ?? {};
    console.log('client_reference_id:', client_reference_id);
    const executeCreate = async (transaction: Prisma.TransactionClient) => {
      const userInformation = await transaction.user.findUnique({
        where: { id: client_reference_id },
        select: {
          hasCompletedCheckout: true,
          organizationUser: {
            select: {
              organizationId: true,
            },
          },
        },
      });

      // if (
      //   !userInformation ||
      //   !userInformation.organizationUser ||
      //   !userInformation.organizationUser[0]
      // ) {
      //   throw new Error('User information or organization user is missing');
      // }

      await transaction.user.update({
        where: { id: client_reference_id },
        data: {
          hasCompletedCheckout: true,
        },
      });

      const getPlan = await transaction.plan.findFirst({
        where: { planIdPlatform: data.data.object.metadata.planId },
        select: {
          id: true,
        },
      });

      if (!getPlan) {
        throw new Error('Plan not found');
      }

      return await transaction.subscription.create({
        data: {
          planId: getPlan.id,
          startDate: new Date(),
          endDate: new Date(new Date().setDate(new Date().getDate() + 30)),
          organizationId: userInformation.organizationUser[0].organizationId,
          status: StatusEnum.ACTIVE,
          version: 1,
        },
      });
    };

    return await this.prisma.$transaction(async (newTransaction) => {
      console.log('Starting transaction');
      const result = await executeCreate(newTransaction);
      console.log('Transaction result:', result);
      return result;
    });
  }
}
