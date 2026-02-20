"use client";

import { useState } from "react";

type Kid = { id: string; name: string };

export default function SetupPage() {
  const [kids, setKids] = useState<Kid[]>([]);
  const [kidName, setKidName] = useState("");
  const [selectedKidId, setSelectedKidId] = useState<string | null>(null);

  function addKid() {
    const name = kidName.trim();
    if (!name) return;
    setKids((prev) => [...prev, { id: crypto.randomUUID(), name }]);
    setKidName("");
  }

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <header className="border-b border-zinc-200 bg-white px-6 py-4">
        <h1 className="text-lg font-semibold">Parent Setup</h1>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Left: Kids */}
          <section className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-base font-medium text-zinc-700">Kids</h2>
            <div className="flex gap-2">
              <input
                type="text"
                value={kidName}
                onChange={(e) => setKidName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addKid()}
                placeholder="Kid name"
                className="flex-1 rounded border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500"
                aria-label="Kid name"
              />
              <button
                type="button"
                onClick={addKid}
                className="rounded bg-zinc-800 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2"
              >
                Add kid
              </button>
            </div>
            <ul className="mt-4 space-y-1" role="list">
              {kids.length === 0 ? (
                <li className="text-sm text-zinc-500">No kids yet.</li>
              ) : (
                kids.map((kid) => (
                  <li key={kid.id}>
                    <button
                      type="button"
                      onClick={() => setSelectedKidId(kid.id)}
                      className={`w-full rounded px-3 py-2 text-left text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 ${
                        selectedKidId === kid.id
                          ? "bg-zinc-200 font-medium text-zinc-900"
                          : "bg-zinc-50 text-zinc-700 hover:bg-zinc-100"
                      }`}
                    >
                      {kid.name}
                    </button>
                  </li>
                ))
              )}
            </ul>
          </section>
          {/* Right: Chores */}
          <section className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-base font-medium text-zinc-700">Chores</h2>
            <p className="text-sm text-zinc-500">Chores list will go here.</p>
          </section>
        </div>
      </main>
    </div>
  );
}
