"use client";

import { useState, useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { NumericKeypad } from "@/components/numeric-keypad";

interface User {
  id: string;
  name: string;
  email: string;
}

export default function LoginPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<string>("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const router = useRouter();

  // Fetch all users for the dropdown
  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await fetch("/api/users");
        if (response.ok) {
          const data = await response.json();
          setUsers(data.users || []);
        }
      } catch (err) {
        console.error("Failed to fetch users:", err);
      } finally {
        setLoadingUsers(false);
      }
    }

    fetchUsers();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!selectedUser) {
      setError("Please select a user");
      return;
    }

    if (!password) {
      setError("Please enter your password");
      return;
    }

    setLoading(true);

    try {
      const user = users.find((u) => u.id === selectedUser);
      if (!user) {
        throw new Error("User not found");
      }

      await authClient.signIn.email({
        email: user.email,
        password,
      });

      // Redirect to main app after successful login
      router.push("/");
    } catch (err) {
      setError("Invalid password. Please try again.");
      setPassword(""); // Clear password on error
    } finally {
      setLoading(false);
    }
  };

  const selectedUserData = users.find((u) => u.id === selectedUser);

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black px-4 py-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Kassa Terrass
          </h1>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Select your name and enter your PIN
          </p>
        </div>

        <form onSubmit={handleLogin} className="mt-8 space-y-6">
          <div className="space-y-6 rounded-lg bg-white dark:bg-zinc-900 px-6 py-8 shadow-sm border border-zinc-200 dark:border-zinc-800">
            {error && (
              <div className="rounded-md bg-red-50 dark:bg-red-900/20 p-4">
                <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
              </div>
            )}

            {/* User Selection Dropdown */}
            <div>
              <label htmlFor="user" className="block text-sm font-medium text-zinc-900 dark:text-zinc-50 mb-2">
                Select User
              </label>
              {loadingUsers ? (
                <div className="text-center py-4 text-zinc-500 dark:text-zinc-400">
                  Loading users...
                </div>
              ) : users.length === 0 ? (
                <div className="text-center py-4">
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
                    No users found. Please create an account first.
                  </p>
                  <a
                    href="/signup"
                    className="text-sm font-medium text-zinc-900 dark:text-zinc-50 hover:underline"
                  >
                    Go to Sign Up
                  </a>
                </div>
              ) : (
                <select
                  id="user"
                  required
                  value={selectedUser}
                  onChange={(e) => {
                    setSelectedUser(e.target.value);
                    setPassword("");
                    setError("");
                  }}
                  className="block w-full rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-3 text-base text-zinc-900 dark:text-zinc-50 focus:border-zinc-900 dark:focus:border-zinc-50 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:focus:ring-zinc-50"
                >
                  <option value="">Choose your name...</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* PIN Entry with Numeric Keypad */}
            {selectedUser && (
              <div>
                <label className="block text-sm font-medium text-zinc-900 dark:text-zinc-50 mb-4 text-center">
                  Enter PIN for {selectedUserData?.name}
                </label>
                <NumericKeypad
                  value={password}
                  onChange={setPassword}
                  maxLength={6}
                />
              </div>
            )}

            {/* Submit Button */}
            {selectedUser && (
              <button
                type="submit"
                disabled={loading || !password}
                className="w-full rounded-md bg-zinc-900 dark:bg-zinc-50 px-4 py-3 text-base font-medium text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-50 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed mt-6"
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>
            )}
          </div>

          <div className="text-center text-sm">
            <span className="text-zinc-600 dark:text-zinc-400">Need to create an account? </span>
            <a
              href="/signup"
              className="font-medium text-zinc-900 dark:text-zinc-50 hover:underline"
            >
              Sign up
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
