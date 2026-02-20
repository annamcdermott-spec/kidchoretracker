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
      <header className="border-b border-slate-200 bg-white px-6 py-4 shadow-sm">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-slate-800">Parent Setup</h1>
          <a
            href="/checklist"
            className="min-h-[48px] rounded-xl bg-[#3b82f6] px-5 py-3 text-lg font-medium text-white hover:bg-[#2563eb] focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:ring-offset-2"
          >
            Go to Checklist →
          </a>
        </div>
        <div className="mt-4 flex items-center gap-3">
          <label htmlFor="reward-goal" className="text-lg font-medium text-slate-600">
            Reward goal (stars):
          </label>
          <input
            id="reward-goal"
            type="number"
            min={1}
            value={rewardGoal}
            onChange={(e) => setRewardGoal(Math.max(1, parseInt(e.target.value, 10) || 1))}
            className="w-24 rounded-xl border border-slate-300 px-3 py-2 text-lg outline-none focus:border-[#22c55e] focus:ring-2 focus:ring-[#22c55e]"
            aria-label="Reward goal in stars"
          />
        </div>
      </header>
      <main className="mx-auto max-w-4xl space-y-6 px-6 py-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Left: Kids */}
          <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-bold text-slate-800">Kids</h2>
            <div className="flex gap-3">
              <input
                type="text"
                value={kidName}
                onChange={(e) => setKidName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addKid()}
                placeholder="Kid name"
                className="min-h-[48px] flex-1 rounded-xl border border-slate-300 px-4 py-2 text-lg outline-none focus:border-[#22c55e] focus:ring-2 focus:ring-[#22c55e]"
                aria-label="Kid name"
              />
              <button
                type="button"
                onClick={addKid}
                className="min-h-[48px] rounded-xl bg-[#22c55e] px-5 py-3 text-lg font-medium text-white hover:bg-[#16a34a] focus:outline-none focus:ring-2 focus:ring-[#22c55e] focus:ring-offset-2"
              >
                Add kid
              </button>
            </div>
            <ul className="mt-4 space-y-2" role="list">
              {kids.length === 0 ? (
                <li className="py-4 text-lg text-slate-500">No kids yet.</li>
              ) : (
                kids.map((kid) => (
                  <li key={kid.id}>
                    <button
                      type="button"
                      onClick={() => setSelectedKidId(kid.id)}
                      className={`flex min-h-[48px] w-full items-center rounded-lg px-4 py-3 text-left text-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:ring-offset-2 ${
                        selectedKidId === kid.id
                          ? "border-2 border-[#22c55e] bg-emerald-50 text-slate-800"
                          : "border border-transparent bg-slate-50 text-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      {kid.name}
                    </button>
                  </li>
                ))
              )}
            </ul>
            {selectedKid && (
              <div className="mt-6 border-t border-slate-200 pt-4">
                <h3 className="mb-2 text-base font-medium text-slate-600">
                  Assigned to {selectedKid.name}
                </h3>
                {assignedChoreIdsForSelectedKid.length === 0 ? (
                  <p className="text-lg text-slate-500">No chores assigned yet.</p>
                ) : (
                  <ul className="space-y-1 text-lg text-slate-700" role="list">
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
          <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-bold text-slate-800">Chores</h2>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
              <input
                type="text"
                value={choreName}
                onChange={(e) => setChoreName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addChore()}
                placeholder="Chore name"
                className="min-h-[48px] flex-1 rounded-xl border border-slate-300 px-4 py-2 text-lg outline-none focus:border-[#22c55e] focus:ring-2 focus:ring-[#22c55e]"
                aria-label="Chore name"
              />
              <label className="flex flex-col gap-1">
                <span className="text-base font-medium text-slate-600">Required</span>
                <input
                  type="number"
                  min={1}
                  value={choreRequiredCount}
                  onChange={(e) => setChoreRequiredCount(Math.max(1, parseInt(e.target.value, 10) || 1))}
                  className="min-h-[48px] w-24 rounded-xl border border-slate-300 px-3 py-2 text-lg outline-none focus:border-[#22c55e] focus:ring-2 focus:ring-[#22c55e]"
                  aria-label="Required count"
                />
              </label>
              <button
                type="button"
                onClick={addChore}
                className="min-h-[48px] rounded-xl bg-[#22c55e] px-5 py-3 text-lg font-medium text-white hover:bg-[#16a34a] focus:outline-none focus:ring-2 focus:ring-[#22c55e] focus:ring-offset-2"
              >
                Add chore
              </button>
            </div>
            <ul className="mt-4 space-y-2" role="list">
              {chores.length === 0 ? (
                <li className="py-4 text-lg text-slate-500">No chores yet.</li>
              ) : (
                chores.map((chore) => (
                  <li
                    key={chore.id}
                    className="flex min-h-[48px] items-center justify-between gap-3 rounded-lg bg-slate-50 px-4 py-3 text-lg text-slate-700 transition-colors hover:bg-slate-100"
                  >
                    <span className="flex-1 font-medium">{chore.name}</span>
                    <span className="text-slate-500">×{chore.requiredCount}</span>
                    <button
                      type="button"
                      onClick={() => selectedKidId && assignChore(selectedKidId, chore.id)}
                      disabled={!selectedKidId}
                      className="min-h-[44px] rounded-xl bg-[#3b82f6] px-4 py-2 text-base font-medium text-white hover:bg-[#2563eb] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-[#3b82f6] focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:ring-offset-2"
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
