export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#f8fafc] px-6 py-12">
      <main className="mx-auto flex max-w-4xl flex-col items-center gap-6 text-center">
        <h1 className="text-4xl font-bold text-slate-800">Kid Chore Tracker</h1>
        <p className="text-xl text-slate-600">Friendly chore tracker for families</p>
        <div className="flex min-h-[48px] flex-col gap-4 sm:flex-row sm:gap-6">
          <a
            href="/setup"
            className="min-h-[48px] rounded-xl bg-[#22c55e] px-8 py-3 text-lg font-medium text-white hover:bg-[#16a34a] focus:outline-none focus:ring-2 focus:ring-[#22c55e] focus:ring-offset-2"
          >
            Parent Setup →
          </a>
          <a
            href="/checklist"
            className="min-h-[48px] rounded-xl bg-[#3b82f6] px-8 py-3 text-lg font-medium text-white hover:bg-[#2563eb] focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:ring-offset-2"
          >
            Checklist →
          </a>
        </div>
      </main>
    </div>
  );
}
