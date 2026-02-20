export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#f8fafc] px-4 py-8 sm:px-6 sm:py-12">
      <main className="mx-auto flex w-full max-w-4xl flex-col items-center gap-4 text-center sm:gap-6">
        <h1 className="text-3xl font-bold text-slate-800 sm:text-4xl">Kid Chore Tracker</h1>
        <p className="text-lg text-slate-600 sm:text-xl">Friendly chore tracker for families</p>
        <div className="flex w-full min-h-[48px] max-w-sm flex-col gap-3 sm:max-w-none sm:flex-row sm:gap-6">
          <a
            href="/setup"
            className="min-h-[48px] w-full rounded-xl bg-[#22c55e] px-6 py-3 text-base font-medium text-white hover:bg-[#16a34a] focus:outline-none focus:ring-2 focus:ring-[#22c55e] focus:ring-offset-2 sm:w-auto sm:px-8 sm:text-lg"
          >
            Parent Setup →
          </a>
          <a
            href="/checklist"
            className="min-h-[48px] w-full rounded-xl bg-[#3b82f6] px-6 py-3 text-base font-medium text-white hover:bg-[#2563eb] focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:ring-offset-2 sm:w-auto sm:px-8 sm:text-lg"
          >
            Checklist →
          </a>
        </div>
      </main>
    </div>
  );
}
