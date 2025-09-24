"use client";

import { FormEvent, useActionState, useEffect, useTransition } from "react";
import { login } from "../actions/auth";
import { useAuth } from "@/contexts/AuthContext";

export default function LoginPage() {
  const [state, action] = useActionState(login, undefined);
  const { isLoggedIn } = useAuth()
  const [isPending, startTransition] = useTransition();

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    startTransition(() => {
      const formData = new FormData(event.currentTarget);
      action(formData);
    });
  };

  // useEffect(() => {
  //   console.log("LoginPage - isLoggedIn:", isLoggedIn);
  //   if (isLoggedIn) {
  //     // window.location.href = "/admin";
  //   }
  // }, [state]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-indigo-100 px-6 py-12 lg:px-8">
      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-md bg-white p-8 shadow-lg rounded-2xl">
        <form onSubmit={onSubmit} className="space-y-6">
          {state?.message && (
            <div className="m-2">
              <p className="text-center text-sm text-red-500 bg-red-100 py-2 rounded-md">
                {state?.message}
              </p>
            </div>
          )}

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email address
            </label>
            <div className="mt-2">
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                className="block w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
            {state?.errors?.email && (
              <p className="text-sm text-red-500 p-2">{state?.errors.email}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <div className="mt-2">
              <input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                className="block w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
            {state?.errors?.password && (
              <p className="text-sm text-red-500 p-2">
                {state?.errors.password}
              </p>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm">
              <a
                href="#"
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                Forgot your password?
              </a>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isPending}
              className={`w-full rounded-lg bg-indigo-600 px-4 py-2 text-white font-semibold shadow-md transition-all duration-300 ${
                isPending
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-indigo-700 hover:shadow-lg"
              }`}
            >
              {isPending ? "Signing in..." : "Sign in"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
