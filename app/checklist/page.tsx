"use client";

import { useEffect, useState } from "react";
import { getSetupData, setSetupData } from "@/lib/setup-storage";
import type { StoredChore, StoredCompletion } from "@/lib/setup-storage";

export default function ChecklistPage() {
  const [kids, setKids] = useState<{ id: string; name: string }[]>([]);
  const [chores, setChores] = useState<StoredChore[]>([]);
  const [assignments, setAssignments] = useState<{ kidId: string; choreId: string }[]>([]);
  const [completions, setCompletions] = useState<StoredCompletion[]>([]);
  const [selectedKidId, setSelectedKidId] = useState<string>("");

  useEffect(() => {
    const data = getSetupData();
    setKids(data.kids);
    setChores(data.chores);
    setAssignments(data.assignments);
    setCompletions(data.completions);
    if (data.kids.length > 0) {
      setSelectedKidId((prev) => (data.kids.some((k) => k.id === prev) ? prev : data.kids[0].id));
    }
  }, []);

  const assignedChores =
    selectedKidId === ""
      ? []
      : assignments
          .filter((a) => a.kidId === selectedKidId)
          .map((a) => {
            const chore = chores.find((c) => c.id === a.choreId);
            const comp = completions.find(
              (c) => c.kidId === selectedKidId && c.choreId === a.choreId
            );
            const count = comp?.count ?? 0;
            return chore ? { chore, count } : null;
          })
          .filter((x): x is { chore: StoredChore; count: number } => x !== null);

  function incrementCount(choreId: string, requiredCount: number) {
    const existing = completions.find(
      (c) => c.kidId === selectedKidId && c.choreId === choreId
    );
    const current = existing?.count ?? 0;
    const nextCount = Math.min(current + 1, requiredCount);
    const next: StoredCompletion[] = existing
      ? completions.map((c) =>
          c.kidId === selectedKidId && c.choreId === choreId
            ? { ...c, count: nextCount }
            : c
        )
      : [...completions, { kidId: selectedKidId, choreId, count: nextCount }];
    setCompletions(next);
    setSetupData({ ...getSetupData(), completions: next });
  }

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
            {selectedKidId === "" ? (
              <p className="text-sm text-zinc-500">Select a kid to see their chores.</p>
            ) : assignedChores.length === 0 ? (
              <p className="text-sm text-zinc-500">
                No chores assigned. Assign chores in Setup.
              </p>
            ) : (
              <ul className="space-y-2" role="list">
                {assignedChores.map(({ chore, count }) => {
                  const atMax = count >= chore.requiredCount;
                  return (
                    <li
                      key={chore.id}
                      className="flex items-center justify-between gap-4 rounded bg-zinc-50 px-3 py-2 text-sm"
                    >
                      <span className="font-medium text-zinc-800">{chore.name}</span>
                      <span className="text-zinc-500">
                        {count}/{chore.requiredCount}
                      </span>
                      <button
                        type="button"
                        onClick={() => incrementCount(chore.id, chore.requiredCount)}
                        disabled={atMax}
                        aria-label={`+1 for ${chore.name}`}
                        className="rounded bg-zinc-700 px-3 py-1 text-xs font-medium text-white hover:bg-zinc-600 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2"
                      >
                        +1
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
