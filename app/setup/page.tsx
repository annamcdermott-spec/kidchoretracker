"use client";

import { useEffect, useState } from "react";
import { getSetupData, setSetupData } from "@/lib/setup-storage";

type Kid = { id: string; name: string };
type Chore = { id: string; name: string; requiredCount: number };
type Assignment = { kidId: string; choreId: string };

export default function SetupPage() {
  const [kids, setKids] = useState<Kid[]>([]);
  const [kidName, setKidName] = useState("");
  const [selectedKidId, setSelectedKidId] = useState<string | null>(null);

  const [chores, setChores] = useState<Chore[]>([]);
  const [choreName, setChoreName] = useState("");
  const [choreRequiredCount, setChoreRequiredCount] = useState(1);

  const [assignments, setAssignments] = useState<Assignment[]>([]);

  useEffect(() => {
    const data = getSetupData();
    setKids(data.kids);
    setChores(data.chores);
    setAssignments(data.assignments);
  }, []);

  useEffect(() => {
    setSetupData({ kids, chores, assignments });
  }, [kids, chores, assignments]);

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

  function assignChore(kidId: string, choreId: string) {
    setAssignments((prev) =>
      prev.some((a) => a.kidId === kidId && a.choreId === choreId)
        ? prev
        : [...prev, { kidId, choreId }]
    );
  }

  const assignedChoreIdsForSelectedKid =
    selectedKidId == null
      ? []
      : assignments
          .filter((a) => a.kidId === selectedKidId)
          .map((a) => a.choreId);
  const selectedKid = kids.find((k) => k.id === selectedKidId);

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <header className="border-b border-zinc-200 bg-white px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-semibold">Parent Setup</h1>
          <a
            href="/checklist"
            className="text-sm font-medium text-zinc-600 hover:text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 rounded px-2 py-1"
          >
            Go to Checklist →
          </a>
        </div>
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
            {selectedKid && (
              <div className="mt-4 border-t border-zinc-200 pt-4">
                <h3 className="mb-2 text-xs font-medium uppercase tracking-wide text-zinc-500">
                  Assigned to {selectedKid.name}
                </h3>
                {assignedChoreIdsForSelectedKid.length === 0 ? (
                  <p className="text-sm text-zinc-500">No chores assigned yet.</p>
                ) : (
                  <ul className="space-y-1 text-sm text-zinc-700" role="list">
                    {assignedChoreIdsForSelectedKid.map((choreId) => {
                      const chore = chores.find((c) => c.id === choreId);
                      return chore ? <li key={choreId}>{chore.name} (×{chore.requiredCount})</li> : null;
                    })}
                  </ul>
                )}
              </div>
            )}
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
                    className="flex items-center justify-between gap-2 rounded bg-zinc-50 px-3 py-2 text-sm text-zinc-700"
                  >
                    <span className="flex-1">{chore.name}</span>
                    <span className="text-zinc-500">×{chore.requiredCount}</span>
                    <button
                      type="button"
                      onClick={() => selectedKidId && assignChore(selectedKidId, chore.id)}
                      disabled={!selectedKidId}
                      className="rounded bg-zinc-700 px-2 py-1 text-xs font-medium text-white hover:bg-zinc-600 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2"
                      aria-label={`Assign ${chore.name} to selected kid`}
                    >
                      Assign
                    </button>
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
