"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { api } from "~/trpc/react";
import transactionSchema, {
  type TransactionForm,
} from "~/validation/transactionSchema";

export function TransactionForm() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<TransactionForm>({
    resolver: zodResolver(transactionSchema),
  });

  const createTransaction = api.transaction.create.useMutation({
    onSuccess: () => {
      router.refresh();
      reset();
    },
  });

  return (
    <form
      onSubmit={handleSubmit(async (data) => {
        const { amount, accountId } = data;
        createTransaction.mutate({ amount, accountId });
      })}
      className="flex flex-col gap-2"
    >
      <label>
        Account ID
        <input
          {...register("accountId")}
          type="text"
          className="w-full rounded-full px-4 py-2 text-black"
          aria-describedby="accountId-message"
        />
      </label>
      {errors.accountId && (
        <p id="accountId-message" className="text-red-300">
          {errors.accountId.message}
        </p>
      )}
      <label>
        Amount ($ USD)
        <input
          {...register("amount")}
          type="number"
          className="w-full rounded-full px-4 py-2 text-black"
          aria-describedby="amount-message"
        />
      </label>
      {errors.amount && (
        <p id="amount-message" className="text-red-300">
          {errors.amount.message}
        </p>
      )}
      <button
        type="submit"
        className="mt-2 rounded-full bg-white/10 px-10 py-3 font-semibold transition hover:bg-white/20"
        disabled={createTransaction.isLoading}
      >
        {createTransaction.isLoading ? "Submitting..." : "Submit"}
      </button>
    </form>
  );
}
