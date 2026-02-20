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
  const [rewardGoal, setRewardGoal] = useState(10);

  useEffect(() => {
    const data = getSetupData();
    setKids(data.kids);
    setChores(data.chores);
    setAssignments(data.assignments);
    setRewardGoal(data.rewardGoal);
  }, []);

  useEffect(() => {
    setSetupData({
      kids,
      chores,
      assignments,
      completions: getSetupData().completions,
      rewardGoal,
    });
  }, [kids, chores, assignments, rewardGoal]);

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
    <div className="min-h-screen bg-[#f8fafc] text-slate-700">
      <header className="border-b border-slate-200 bg-white shadow-sm">
        <div className="mx-auto flex max-w-4xl flex-col gap-4 px-4 py-4 sm:px-6 sm:py-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
            <h1 className="text-lg font-bold text-slate-800 sm:text-xl">Parent Setup</h1>
            <div className="flex flex-wrap items-center gap-3 sm:gap-4">
              <a
                href="/"
                className="min-h-[48px] shrink-0 rounded-xl border-2 border-slate-300 bg-white px-4 py-3 text-center text-base font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 sm:px-5 sm:text-lg"
              >
                ← Home
              </a>
              <a
                href="/checklist"
                className="min-h-[48px] shrink-0 rounded-xl bg-[#3b82f6] px-4 py-3 text-center text-base font-medium text-white hover:bg-[#2563eb] focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:ring-offset-2 sm:px-5 sm:text-lg"
              >
                Go to Kid Checklist →
              </a>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3 sm:gap-4">
            <label htmlFor="reward-goal" className="text-base font-medium text-slate-600 sm:text-lg">
              Reward goal (stars):
            </label>
            <input
              id="reward-goal"
              type="number"
              min={1}
              value={rewardGoal}
              onChange={(e) => setRewardGoal(Math.max(1, parseInt(e.target.value, 10) || 1))}
              className="h-12 min-w-0 w-20 rounded-xl border border-slate-300 px-3 py-2 text-base outline-none focus:border-[#22c55e] focus:ring-2 focus:ring-[#22c55e] sm:w-24 sm:px-4 sm:text-lg"
              aria-label="Reward goal in stars"
            />
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-4xl px-4 py-6 sm:px-6 sm:py-8">
        <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2">
          {/* Left: Kids */}
          <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
            <h2 className="mb-3 text-base font-bold text-slate-800 sm:mb-4 sm:text-lg">Kids</h2>
            <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
              <input
                type="text"
                value={kidName}
                onChange={(e) => setKidName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addKid()}
                placeholder="Kid name"
                className="min-h-[48px] min-w-0 flex-1 rounded-xl border border-slate-300 px-4 py-3 text-base outline-none focus:border-[#22c55e] focus:ring-2 focus:ring-[#22c55e] sm:text-lg"
                aria-label="Kid name"
              />
              <button
                type="button"
                onClick={addKid}
                className="min-h-[48px] shrink-0 rounded-xl bg-[#22c55e] px-4 py-3 text-base font-medium text-white hover:bg-[#16a34a] focus:outline-none focus:ring-2 focus:ring-[#22c55e] focus:ring-offset-2 sm:px-5 sm:text-lg"
              >
                Add kid
              </button>
            </div>
            <ul className="mt-4 space-y-2 sm:mt-6" role="list">
              {kids.length === 0 ? (
                <li className="py-6 text-center text-base text-slate-500 sm:text-lg">No kids yet.</li>
              ) : (
                kids.map((kid) => (
                  <li key={kid.id}>
                    <button
                      type="button"
                      onClick={() => setSelectedKidId(kid.id)}
                      className={`flex min-h-[48px] w-full min-w-0 items-center rounded-lg px-4 py-3 text-left text-base font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:ring-offset-2 sm:text-lg ${
                        selectedKidId === kid.id
                          ? "border-2 border-[#22c55e] bg-emerald-50 text-slate-800"
                          : "border border-transparent bg-slate-50 text-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      <span className="truncate">{kid.name}</span>
                    </button>
                  </li>
                ))
              )}
            </ul>
            {selectedKid && (
              <div className="mt-4 border-t border-slate-200 pt-4 sm:mt-6 sm:pt-6">
                <h3 className="mb-3 text-sm font-medium text-slate-600 sm:mb-4 sm:text-base">
                  Assigned to {selectedKid.name}
                </h3>
                {assignedChoreIdsForSelectedKid.length === 0 ? (
                  <p className="text-base text-slate-500 sm:text-lg">No chores assigned yet.</p>
                ) : (
                  <ul className="space-y-2 text-base text-slate-700 sm:text-lg" role="list">
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
          <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
            <h2 className="mb-3 text-base font-bold text-slate-800 sm:mb-4 sm:text-lg">Chores</h2>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:gap-4">
              <input
                type="text"
                value={choreName}
                onChange={(e) => setChoreName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addChore()}
                placeholder="Chore name"
                className="min-h-[48px] min-w-0 flex-1 rounded-xl border border-slate-300 px-4 py-3 text-base outline-none focus:border-[#22c55e] focus:ring-2 focus:ring-[#22c55e] sm:text-lg"
                aria-label="Chore name"
              />
              <label className="flex flex-col gap-2">
                <span className="text-sm font-medium text-slate-600 sm:text-base">Required</span>
                <input
                  type="number"
                  min={1}
                  value={choreRequiredCount}
                  onChange={(e) => setChoreRequiredCount(Math.max(1, parseInt(e.target.value, 10) || 1))}
                  className="min-h-[48px] w-20 min-w-0 rounded-xl border border-slate-300 px-3 py-3 text-base outline-none focus:border-[#22c55e] focus:ring-2 focus:ring-[#22c55e] sm:w-24 sm:px-4 sm:text-lg"
                  aria-label="Required count"
                />
              </label>
              <button
                type="button"
                onClick={addChore}
                className="min-h-[48px] shrink-0 rounded-xl bg-[#22c55e] px-4 py-3 text-base font-medium text-white hover:bg-[#16a34a] focus:outline-none focus:ring-2 focus:ring-[#22c55e] focus:ring-offset-2 sm:px-5 sm:text-lg"
              >
                Add chore
              </button>
            </div>
            <ul className="mt-4 space-y-2 sm:mt-6" role="list">
              {chores.length === 0 ? (
                <li className="py-6 text-center text-base text-slate-500 sm:text-lg">No chores yet.</li>
              ) : (
                chores.map((chore) => (
                  <li
                    key={chore.id}
                    className="flex min-h-[48px] flex-wrap items-center justify-between gap-2 rounded-lg bg-slate-50 px-3 py-3 text-base text-slate-700 transition-colors hover:bg-slate-100 sm:flex-nowrap sm:gap-4 sm:px-4 sm:text-lg"
                  >
                    <span className="min-w-0 flex-1 font-medium">{chore.name}</span>
                    <span className="shrink-0 text-slate-500">×{chore.requiredCount}</span>
                    <button
                      type="button"
                      onClick={() => selectedKidId && assignChore(selectedKidId, chore.id)}
                      disabled={!selectedKidId}
                      className="min-h-[44px] min-w-[80px] shrink-0 rounded-xl bg-[#3b82f6] px-3 py-2 text-sm font-medium text-white hover:bg-[#2563eb] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-[#3b82f6] focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:ring-offset-2 sm:min-h-[48px] sm:min-w-[90px] sm:px-4 sm:text-base"
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
