import { api } from "~/trpc/server";
import { TransactionForm } from "./_components/TransactionForm";

export default async function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
        <header className="flex flex-col  gap-2 text-center">
          <h1 className="text-5xl font-extrabold leading-tight tracking-tight sm:text-[5rem]">
            Typesafe{" "}
            <span className="inline-block">
              <span className="text-purple-400">Next.js</span> +{" "}
              <span className="text-blue-400">tRPC</span>
            </span>
          </h1>
          <div>
            <p className="text-2xl">
              Made by{" "}
              <a
                href="https://landor.dev"
                className="text-blue-400 hover:underline"
              >
                landor.dev
              </a>
            </p>
            <p className="text-[1.11rem]">
              powered by{" "}
              <a
                href="https://create.t3.gg/"
                className="text-blue-400 hover:underline"
              >
                create-t3-app
              </a>
            </p>
          </div>
        </header>
        <main>
          <CrudShowcase />
        </main>
      </div>
    </div>
  );
}

const CrudShowcase = async () => {
  const latestTransaction = await api.transaction.getLatest.query();
  const account = latestTransaction
    ? await api.account.get.query({
        id: latestTransaction.accountId,
      })
    : null;

  return (
    <div className="w-full max-w-md">
      <div className="pb-2">
        {latestTransaction ? (
          <>
            <p>
              Your most recent transaction: <br />
              <span className="font-bold">
                {latestTransaction.amount}$
              </span>{" "}
              {latestTransaction.amount < 0 ? "from" : "to"}{" "}
              {latestTransaction.accountId}
            </p>
            <p>
              {account ? (
                <>
                  current balance:{" "}
                  <span className="font-bold">{account?.balance}$</span>
                </>
              ) : null}
            </p>
          </>
        ) : (
          <p>You haven't made any transactions yet</p>
        )}
      </div>

      <TransactionForm />
    </div>
  );
};
