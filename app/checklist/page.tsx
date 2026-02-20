"use client";

import { useEffect, useState } from "react";
import { getSetupData } from "@/lib/setup-storage";

export default function ChecklistPage() {
  const [kids, setKids] = useState<{ id: string; name: string }[]>([]);
  const [selectedKidId, setSelectedKidId] = useState<string>("");

  useEffect(() => {
    const data = getSetupData();
    setKids(data.kids);
    if (data.kids.length > 0) {
      setSelectedKidId((prev) => (data.kids.some((k) => k.id === prev) ? prev : data.kids[0].id));
    }
  }, []);

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <header className="border-b border-zinc-200 bg-white px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-semibold">Checklist</h1>
          <a
            href="/setup"
            className="rounded px-2 py-1 text-sm font-medium text-zinc-600 hover:text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2"
          >
            ← Back to Setup
          </a>
        </div>
      </header>
      <main className="mx-auto max-w-2xl px-6 py-8">
        <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
          <label htmlFor="kid-select" className="mb-2 block text-sm font-medium text-zinc-700">
            Select kid
          </label>
          <select
            id="kid-select"
            value={selectedKidId}
            onChange={(e) => setSelectedKidId(e.target.value)}
            className="w-full rounded border border-zinc-300 bg-white px-3 py-2 text-sm outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500"
            aria-label="Select kid"
          >
            {kids.length === 0 ? (
              <option value="">No kids — add kids in Setup</option>
            ) : (
              kids.map((kid) => (
                <option key={kid.id} value={kid.id}>
                  {kid.name}
                </option>
              ))
            )}
          </select>
          <div className="mt-6 border-t border-zinc-200 pt-6">
            <h2 className="mb-4 text-base font-medium text-zinc-700">Checklist</h2>
            <p className="text-sm text-zinc-500">Checklist content will go here.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
