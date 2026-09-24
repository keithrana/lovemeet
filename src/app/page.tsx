import Link from "next/link";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center gap-6 px-6 text-center">
      <h1 className="text-4xl font-bold text-brand">LoveMeet</h1>
      <p className="text-gray-600">
        A simple, honest place to make a profile and start real conversations.
      </p>
      <div className="flex w-full flex-col gap-3">
        <Link
          href="/signup"
          className="rounded-lg bg-brand px-4 py-3 font-semibold text-white transition hover:bg-brand-dark"
        >
          Create your profile
        </Link>
        <Link
          href="/login"
          className="rounded-lg border border-gray-300 px-4 py-3 font-semibold text-gray-700 transition hover:bg-gray-50"
        >
          Log in
        </Link>
      </div>
      <p className="text-xs text-gray-400">You must be 18 or older to join.</p>
    </main>
  );
}
