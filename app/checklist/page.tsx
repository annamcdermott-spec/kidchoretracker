"use client";

import { useEffect, useState } from "react";
import { getSetupData, setSetupData } from "@/lib/setup-storage";
import type { StoredChore, StoredCompletion } from "@/lib/setup-storage";

export default function ChecklistPage() {
  const [kids, setKids] = useState<{ id: string; name: string }[]>([]);
  const [chores, setChores] = useState<StoredChore[]>([]);
  const [assignments, setAssignments] = useState<{ kidId: string; choreId: string }[]>([]);
  const [completions, setCompletions] = useState<StoredCompletion[]>([]);
  const [rewardGoal, setRewardGoal] = useState(10);
  const [selectedKidId, setSelectedKidId] = useState<string>("");
  const [justCompletedChoreId, setJustCompletedChoreId] = useState<string | null>(null);

  useEffect(() => {
    const data = getSetupData();
    setKids(data.kids);
    setChores(data.chores);
    setAssignments(data.assignments);
    setCompletions(data.completions);
    setRewardGoal(data.rewardGoal);
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

  const totalStars = assignedChores.reduce((sum, { count }) => sum + count, 0);

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
    if (nextCount >= requiredCount) {
      setJustCompletedChoreId(choreId);
      setTimeout(() => setJustCompletedChoreId(null), 500);
    }
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-700">
      <header className="border-b border-slate-200 bg-white shadow-sm">
        <div className="mx-auto flex max-w-4xl flex-row flex-wrap items-center justify-between gap-3 px-4 py-4 sm:gap-4 sm:px-6 sm:py-6">
          <h1 className="text-lg font-bold text-slate-800 sm:text-xl">Kid Checklist</h1>
          <div className="flex flex-wrap items-center gap-3 sm:gap-4">
            <a
              href="/"
              className="min-h-[48px] shrink-0 rounded-xl border-2 border-slate-300 bg-white px-4 py-3 text-center text-base font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 sm:px-5 sm:text-lg"
            >
              ← Home
            </a>
            <a
              href="/setup"
              className="min-h-[48px] shrink-0 rounded-xl bg-[#3b82f6] px-4 py-3 text-center text-base font-medium text-white hover:bg-[#2563eb] focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:ring-offset-2 sm:px-5 sm:text-lg"
            >
              ← Back to Setup
            </a>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-4xl px-4 py-6 sm:px-6 sm:py-8">
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
          <label htmlFor="kid-select" className="mb-3 block text-base font-medium text-slate-700 sm:mb-4 sm:text-lg">
            Select kid
          </label>
          <select
            id="kid-select"
            value={selectedKidId}
            onChange={(e) => setSelectedKidId(e.target.value)}
            className="min-h-[48px] w-full min-w-0 rounded-xl border border-slate-300 bg-white px-4 py-3 text-base outline-none focus:border-[#22c55e] focus:ring-2 focus:ring-[#22c55e] sm:text-lg"
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
          {selectedKidId !== "" && (
            <div className="mt-4 flex flex-wrap items-center gap-4 rounded-xl bg-emerald-50 px-4 py-3 sm:mt-6 sm:gap-6 sm:px-6 sm:py-4">
              <span
                className="text-xl font-bold text-[#22c55e] sm:text-2xl"
                aria-label="Stars earned"
              >
                ★ {totalStars}
              </span>
              <span className="text-base font-medium text-slate-700 sm:text-lg">
                {totalStars} / {rewardGoal} toward goal
              </span>
            </div>
          )}
          <div className="mt-4 border-t border-slate-200 pt-4 sm:mt-6 sm:pt-6">
            <h2 className="mb-3 text-base font-bold text-slate-800 sm:mb-4 sm:text-lg">Kid Checklist</h2>
            {selectedKidId === "" ? (
              <p className="text-base text-slate-500 sm:text-lg">Select a kid to see their chores.</p>
            ) : assignedChores.length === 0 ? (
              <p className="text-base text-slate-500 sm:text-lg">
                No chores assigned. Assign chores in Setup.
              </p>
            ) : (
              <ul className="space-y-2" role="list">
                {assignedChores.map(({ chore, count }) => {
                  const atMax = count >= chore.requiredCount;
                  const justCompleted = justCompletedChoreId === chore.id;
                  return (
                    <li
                      key={chore.id}
                      className={`flex min-h-[48px] flex-wrap items-center justify-between gap-2 rounded-lg bg-slate-50 px-3 py-3 text-base transition-colors hover:bg-slate-100 sm:flex-nowrap sm:gap-4 sm:px-4 sm:text-lg ${
                        justCompleted ? "animate-celebrate bg-emerald-50" : ""
                      }`}
                    >
                      <span className="min-w-0 flex-1 font-medium text-slate-800">{chore.name}</span>
                      <span className="shrink-0 text-slate-600">
                        {count}/{chore.requiredCount}
                      </span>
                      <button
                        type="button"
                        onClick={() => incrementCount(chore.id, chore.requiredCount)}
                        disabled={atMax}
                        aria-label={`+1 for ${chore.name}`}
                        className="min-h-[44px] min-w-[72px] shrink-0 rounded-xl bg-[#22c55e] px-3 py-2 text-base font-medium text-white hover:bg-[#16a34a] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-[#22c55e] focus:outline-none focus:ring-2 focus:ring-[#22c55e] focus:ring-offset-2 sm:min-h-[48px] sm:min-w-[80px] sm:px-4 sm:text-lg"
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
