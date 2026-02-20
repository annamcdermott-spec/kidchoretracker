"use client";

import { useState } from "react";

type Kid = { id: string; name: string };
type Chore = { id: string; name: string; requiredCount: number };

export default function SetupPage() {
  const [kids, setKids] = useState<Kid[]>([]);
  const [kidName, setKidName] = useState("");
  const [selectedKidId, setSelectedKidId] = useState<string | null>(null);

  const [chores, setChores] = useState<Chore[]>([]);
  const [choreName, setChoreName] = useState("");
  const [choreRequiredCount, setChoreRequiredCount] = useState(1);

  function addKid() {
    const name = kidName.trim();
    if (!name) return;
    setKids((prev) => [...prev, { id: crypto.randomUUID(), name }]);
    setKidName("");
  }

  function addChore() {
    const name = choreName.trim();
    if (!name) return;
    const count = Math.max(1, choreRequiredCount);
    setChores((prev) => [...prev, { id: crypto.randomUUID(), name, requiredCount: count }]);
    setChoreName("");
    setChoreRequiredCount(1);
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
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
              <input
                type="text"
                value={choreName}
                onChange={(e) => setChoreName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addChore()}
                placeholder="Chore name"
                className="flex-1 rounded border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500"
                aria-label="Chore name"
              />
              <label className="flex items-center gap-2 sm:flex-col sm:items-stretch">
                <span className="text-xs text-zinc-500 sm:order-2">Required</span>
                <input
                  type="number"
                  min={1}
                  value={choreRequiredCount}
                  onChange={(e) => setChoreRequiredCount(Math.max(1, parseInt(e.target.value, 10) || 1))}
                  className="w-20 rounded border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500"
                  aria-label="Required count"
                />
              </label>
              <button
                type="button"
                onClick={addChore}
                className="rounded bg-zinc-800 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2"
              >
                Add chore
              </button>
            </div>
            <ul className="mt-4 space-y-1" role="list">
              {chores.length === 0 ? (
                <li className="text-sm text-zinc-500">No chores yet.</li>
              ) : (
                chores.map((chore) => (
                  <li
                    key={chore.id}
                    className="flex items-center justify-between rounded bg-zinc-50 px-3 py-2 text-sm text-zinc-700"
                  >
                    <span>{chore.name}</span>
                    <span className="text-zinc-500">×{chore.requiredCount}</span>
                  </li>
                ))
              )}
            </ul>
          </section>
        </div>
      </main>
    </div>
  );
}
