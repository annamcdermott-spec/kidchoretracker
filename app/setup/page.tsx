export default function SetupPage() {
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
            <p className="text-sm text-zinc-500">Kids list will go here.</p>
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
