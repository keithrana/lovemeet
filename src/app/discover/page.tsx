import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";

export default async function DiscoverPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/login");
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-sm flex-col items-center justify-center gap-4 px-6 py-12 text-center">
      <h1 className="text-2xl font-bold text-brand">You're all set!</h1>
      <p className="text-gray-600">
        Your profile is saved. Browsing other members isn't built yet — that's next on the
        roadmap.
      </p>
      <Link
        href="/profile"
        className="rounded-lg bg-brand px-4 py-3 font-semibold text-white transition hover:bg-brand-dark"
      >
        Back to your profile
      </Link>
    </main>
  );
}
