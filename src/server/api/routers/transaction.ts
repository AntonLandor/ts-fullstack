import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import transactionSchema from "~/validation/transactionSchema";

export const transactionRouter = createTRPCRouter({
  create: publicProcedure
    .input(transactionSchema)
    .mutation(async ({ ctx, input }) => {
      const amount = parseInt(input.amount);
      if (isNaN(amount) || amount === 0 || input.amount !== amount.toString()) {
        throw new Error("Amount must be an integer");
      }

      const [, transaction] = await ctx.db.$transaction([
        ctx.db.account.upsert({
          where: { accountId: input.accountId },
          update: {
            balance: {
              increment: amount,
            },
          },
          create: {
            accountId: input.accountId,
            balance: amount,
          },
        }),
        ctx.db.transaction.create({
          data: {
            amount: amount,
            account: {
              connect: {
                accountId: input.accountId,
              },
            },
          },
        }),
      ]);

      return transaction;
    }),

  getLatest: publicProcedure.query(({ ctx }) => {
    return ctx.db.transaction.findFirst({
      orderBy: { createdAt: "desc" },
    });
  }),
});
