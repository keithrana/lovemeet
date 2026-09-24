"use client";

import { useState, FormEvent } from "react";

export default function ProfileEditor({
  initialName,
  initialBio,
}: {
  initialName: string;
  initialBio: string;
}) {
  const [name, setName] = useState(initialName);
  const [bio, setBio] = useState(initialBio);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("saving");

    const res = await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, bio }),
    });

    setStatus(res.ok ? "saved" : "error");
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label htmlFor="name" className="mb-1 block text-sm font-medium">
          Name
        </label>
        <input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={80}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-brand focus:outline-none"
        />
      </div>

      <div>
        <label htmlFor="bio" className="mb-1 block text-sm font-medium">
          About you
        </label>
        <textarea
          id="bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          maxLength={500}
          rows={4}
          placeholder="Tell people a bit about yourself..."
          className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-brand focus:outline-none"
        />
      </div>

      <button
        type="submit"
        disabled={status === "saving"}
        className="rounded-lg bg-brand px-4 py-3 font-semibold text-white transition hover:bg-brand-dark disabled:opacity-60"
      >
        {status === "saving" ? "Saving..." : "Save changes"}
      </button>

      {status === "saved" && <p className="text-sm text-green-600">Saved.</p>}
      {status === "error" && <p className="text-sm text-red-600">Couldn't save. Try again.</p>}
    </form>
  );
}
