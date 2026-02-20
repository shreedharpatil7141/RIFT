"use client";

import { useRouter } from "next/navigation";

export default function GuidelinesPage() {
  const router = useRouter();

  return (
    <main className="relative min-h-screen bg-[#0F303C] text-slate-200 overflow-hidden">

      {/* SAME BACKGROUND AS HOME */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-[#0F303C] via-[#0C2630] to-[#091E25]" />

      {/* NAVBAR */}
      <header className="bg-[#0C2630]/80 backdrop-blur-md border-b border-slate-700 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-teal-500 p-2 rounded-md text-white text-sm font-bold">
              PG
            </div>
            <span className="font-bold text-teal-300">
              PharmaGuard
            </span>
          </div>

          <nav className="hidden md:flex gap-6 text-sm text-slate-400">
            <span
              onClick={() => router.push("/")}
              className="hover:text-teal-300 cursor-pointer"
            >
              Dashboard
            </span>

            <span className="text-teal-300 border-b-2 border-teal-300 pb-1">
              Guidelines
            </span>
          </nav>
        </div>
      </header>

      {/* CONTENT */}
      <div className="max-w-4xl mx-auto px-6 py-16">

        <button
          onClick={() => router.push("/")}
          className="mb-8 px-4 py-2 border border-teal-400 text-teal-300 rounded-md hover:bg-teal-500 hover:text-white transition"
        >
          ← Back to Dashboard
        </button>

        <div className="bg-[#0C2630]/80 backdrop-blur-md border border-slate-700 rounded-xl shadow-xl p-10">

          <h1 className="text-3xl font-extrabold text-teal-300 mb-6">
            Clinical Guidelines & Disclaimer
          </h1>

          <div className="space-y-6 text-slate-300 leading-relaxed">

            <p>
              PharmaGuard is a research and educational prototype developed for
              hackathon demonstration purposes only.
            </p>

            <p>
              The analysis is based on predefined pharmacogenomic rules and a
              limited set of genes and drugs. While inspired by established
              clinical guidelines, the results provided by this system are not a
              substitute for professional medical advice, diagnosis, or treatment.
            </p>

            <p>
              Clinical decisions should always be made by qualified healthcare
              professionals using validated clinical tests and official CPIC or
              regulatory guidelines.
            </p>

            <p className="text-amber-400 font-semibold">
              The developers assume no responsibility for any use of this system
              beyond demonstration or educational contexts.
            </p>

          </div>
        </div>
      </div>
    </main>
  );
}