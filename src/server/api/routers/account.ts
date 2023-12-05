import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const accountRouter = createTRPCRouter({
  get: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db.account.findUnique({
        where: { accountId: input.id },
      });
    }),
});
