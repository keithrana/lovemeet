import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma, ensureDb } from "@/lib/prisma";
import ProfileEditor from "./profile-editor";
import SignOutButton from "./sign-out-button";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/login");
  }

  let user;
  try {
    await ensureDb();
    user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { id: true, name: true, email: true, age: true, bio: true },
    });
  } catch (err) {
    console.error("failed to load profile:", err);
    return (
      <main className="mx-auto flex min-h-screen max-w-sm flex-col items-center justify-center gap-4 px-6 py-12 text-center">
        <h1 className="text-2xl font-bold text-brand">Something went wrong</h1>
        <p className="text-gray-600">
          We couldn&apos;t load your profile right now. Please try again in a moment.
        </p>
      </main>
    );
  }

  if (!user) {
    redirect("/login");
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-sm flex-col justify-center gap-6 px-6 py-12">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-brand">Your profile</h1>
        <SignOutButton />
      </div>
      <p className="text-sm text-gray-500">
        {user.email} &middot; Age {user.age}
      </p>
      <ProfileEditor initialName={user.name} initialBio={user.bio} />
    </main>
  );
}
