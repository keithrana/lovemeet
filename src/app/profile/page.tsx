import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import ProfileEditor from "./profile-editor";
import SignOutButton from "./sign-out-button";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, name: true, email: true, age: true, bio: true },
  });

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
