"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";

export default function SignupPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const payload = {
      name: String(form.get("name") ?? ""),
      email: String(form.get("email") ?? ""),
      password: String(form.get("password") ?? ""),
      age: Number(form.get("age") ?? 0),
    };

    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Something went wrong. Please try again.");
        setLoading(false);
        return;
      }

      const signInResult = await signIn("credentials", {
        redirect: false,
        email: payload.email,
        password: payload.password,
      });

      if (signInResult?.error) {
        router.push("/login");
        return;
      }

      router.push("/profile");
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-sm flex-col justify-center px-6 py-12">
      <h1 className="mb-1 text-2xl font-bold text-brand">Create your profile</h1>
      <p className="mb-6 text-sm text-gray-500">You must be 18 or older to join.</p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label htmlFor="name" className="mb-1 block text-sm font-medium">
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            maxLength={80}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-brand focus:outline-none"
          />
        </div>

        <div>
          <label htmlFor="age" className="mb-1 block text-sm font-medium">
            Age
          </label>
          <input
            id="age"
            name="age"
            type="number"
            min={18}
            max={120}
            required
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-brand focus:outline-none"
          />
        </div>

        <div>
          <label htmlFor="email" className="mb-1 block text-sm font-medium">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-brand focus:outline-none"
          />
        </div>

        <div>
          <label htmlFor="password" className="mb-1 block text-sm font-medium">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            minLength={8}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-brand focus:outline-none"
          />
          <p className="mt-1 text-xs text-gray-400">At least 8 characters.</p>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="mt-2 rounded-lg bg-brand px-4 py-3 font-semibold text-white transition hover:bg-brand-dark disabled:opacity-60"
        >
          {loading ? "Creating your profile..." : "Sign up"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-500">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-brand">
          Log in
        </Link>
      </p>
    </main>
  );
}
