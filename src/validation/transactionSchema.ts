import { z } from "zod";

const transactionSchema = z.object({
  accountId: z.string().uuid({ message: "Account ID must be a valid UUID" }),
  amount: z.string().refine(
    (value) => {
      const parsed = parseInt(value, 10);
      return !isNaN(parsed) && parsed !== 0 && value === parsed.toString();
    },
    { message: "Amount must be an integer" },
  ),
});

export type TransactionForm = z.infer<typeof transactionSchema>;

export default transactionSchema;
