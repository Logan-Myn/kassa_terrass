"use client";

import { useSession, signOut } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/login");
    }
  }, [session, isPending, router]);

  if (isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
        <div className="text-center">
          <div className="text-lg text-zinc-600 dark:text-zinc-400">Loading...</div>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const handleSignOut = async () => {
    await signOut();
    router.push("/login");
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 dark:bg-black px-4">
      <main className="w-full max-w-3xl space-y-8 text-center">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Welcome to Kassa Terrass
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400">
            You are signed in as <span className="font-semibold text-zinc-900 dark:text-zinc-50">{session.user.name}</span>
          </p>
        </div>

        <div className="rounded-lg bg-white dark:bg-zinc-900 px-6 py-8 shadow-sm border border-zinc-200 dark:border-zinc-800">
          <div className="space-y-4">
            <div>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">Email</p>
              <p className="text-base font-medium text-zinc-900 dark:text-zinc-50">{session.user.email}</p>
            </div>
            <div>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">User ID</p>
              <p className="text-xs font-mono text-zinc-500 dark:text-zinc-400">{session.user.id}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
          <button
            onClick={handleSignOut}
            className="rounded-md bg-zinc-900 dark:bg-zinc-50 px-6 py-3 text-base font-medium text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-50 focus:ring-offset-2"
          >
            Sign Out
          </button>
        </div>

        <div className="pt-8">
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            This is the main page. The POS interface will be built here.
          </p>
        </div>
      </main>
    </div>
  );
}
