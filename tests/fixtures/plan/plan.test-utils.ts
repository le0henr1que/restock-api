import { PrismaClient, StatusEnum } from '@prisma/client';

/**
 * Reverts Plan to their initial state by updating their data in the database.
 *
 * @param {PrismaClient} prisma - The PrismaClient instance.
 * @param {string} module_lcId - The id of the Plan to revert.
 */
export const revertPlanToInitialState = async (
  prisma: PrismaClient,
  module_lcId: string,
) => {
  await prisma.plan.update({
    where: { id: module_lcId },
    data: { deletedAt: null, status: StatusEnum.ACTIVE, version: 1 },
  });
};
