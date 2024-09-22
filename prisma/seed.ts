import {
  Prisma,
  RoleEnum,
  StatusEnum,
  Role,
  Assignment,
  AssignmentsEnum,
  PrismaClient,
} from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { create } from 'domain';

export const ADMIN_EMAIL = 'admin@admin.com';
export const ADMIN_PASSWORD = 'admin';

const prisma = new PrismaClient();

export interface IBaseDataSeed {
  roles: Role[];
  assignments: Assignment[];
}

const baseSeed = async (prisma: PrismaClient) => {
  console.log('Seeding base...');

  const baseData: IBaseDataSeed = { roles: [], assignments: [] };

  const roles = await seedRoles(prisma);
  const assignments = await seedAssignments(prisma);

  Object.assign(baseData, { roles }, { assignments });

  return baseData;
};

const seedAssignments = async (prisma: PrismaClient): Promise<Assignment[]> => {
  console.log('Seeding assignments...');

  return await prisma.$transaction(
    async (transaction: Prisma.TransactionClient) => {
      const operations = Object.entries(AssignmentsEnum).map(async ([name]) => {
        return await transaction.assignment.upsert({
          where: { name: name as AssignmentsEnum },
          create: { name: name as AssignmentsEnum, status: StatusEnum.ACTIVE },
          update: { name: name as AssignmentsEnum, status: StatusEnum.ACTIVE },
        });
      });

      return Promise.all(operations);
    },
    {
      maxWait: 30000,
      timeout: 30000,
    },
  );
};

const seedRoles = async (prisma: PrismaClient): Promise<Role[]> => {
  console.log('Seeding roles...');

  return await prisma.$transaction(
    async (transaction: Prisma.TransactionClient) => {
      const operations = Object.entries(RoleEnum).map(async ([name]) => {
        return await transaction.role.upsert({
          where: { name: name as RoleEnum },
          create: { name: name as RoleEnum, status: StatusEnum.ACTIVE },
          update: { name: name as RoleEnum, status: StatusEnum.ACTIVE },
        });
      });

      return Promise.all(operations);
    },
    {
      maxWait: 30000,
      timeout: 30000,
    },
  );
};

const seed = async (prisma: PrismaClient, baseDataSeed: IBaseDataSeed) => {
  console.log('Seeding...');

  await prisma.$transaction(async (transaction: Prisma.TransactionClient) => {
    const adminRole = baseDataSeed.roles.find(
      (role) => role.name === RoleEnum.ADMIN,
    ).id;

    console.log(`Admin role ID: ${adminRole}`);

    const user = await transaction.user.create({
      data: {
        email: ADMIN_EMAIL,
        name: 'Admin User',
        password: await bcrypt.hash(ADMIN_PASSWORD, 10),
        status: StatusEnum.ACTIVE,
        refreshToken: null,
        ip: null,
        blocked: false,
        deletedAt: null,
        version: 1,
        loginAttempts: 0,
      },
    });
    const organization = await transaction.organization.create({
      data: {
        name: 'Admin Organization',
        ownerId: user.id,
        status: StatusEnum.ACTIVE,
        version: 1,
      },
    });

    const organizationuser = await transaction.organizationUser.create({
      data: {
        organizationId: organization.id,
        userId: user.id,
        ...(baseDataSeed.assignments && {}),
      },
    });

    const userRole = await transaction.userRole.create({
      data: {
        role: {
          connect: {
            id: adminRole,
          },
        },
        organizationUserId: organizationuser.organizationId,
      },
    });

    await transaction.organizationUser.update({
      where: {
        organizationId_userId: {
          organizationId: organizationuser.organizationId,
          userId: user.id,
        },
      },
      data: {
        ...(baseDataSeed.assignments && {
          UserAssignment: {
            create: baseDataSeed.assignments.map((assignment) => ({
              create: true,
              read: true,
              update: true,
              delete: true,
              organizationUserId: organizationuser.organizationId,
              Assignment: {
                connect: {
                  id: assignment.id,
                },
              },
            })),
          },
        }),
        Roles: {
          connect: {
            id: userRole.id,
          },
        },
      },
    });
  });
};

(async () => {
  const baseData: IBaseDataSeed = await baseSeed(prisma);

  const isTestEnviroment = process.env.ENV == 'TEST';

  if (isTestEnviroment) {
    // await seedTests(prisma, baseData);
  } else {
    await seed(prisma, baseData);
  }
})();
