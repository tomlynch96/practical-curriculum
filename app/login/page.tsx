"use client";

import Link from "next/link";
import { ArrowRight, Beaker, LayoutGrid, BookOpen } from "lucide-react";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-ink text-chalk flex flex-col">
      <nav className="flex items-center justify-between px-8 py-6 border-b border-ink-light">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-acid flex items-center justify-center">
            <Beaker size={16} className="text-ink" />
          </div>
          <span className="font-display text-xl text-chalk">SciSheet</span>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="text-sm text-gray-400 hover:text-chalk transition-colors"
          >
            Log in
          </Link>
          <Link href="/signup" className="btn-acid text-sm px-4 py-2">
            Get started
          </Link>
        </div>
      </nav>

      <section className="flex-1 flex flex-col items-center justify-center px-8 py-24 text-center max-w-4xl mx-auto">
        <div className="tag-acid mb-8 text-xs tracking-widest uppercase">
          Built for science departments
        </div>
        <h1 className="font-display text-6xl md:text-7xl leading-tight mb-6 text-balance">
          Consistent worksheets.
          <br />
          <span className="text-acid">Every practical.</span>
        </h1>
        <p className="text-gray-400 text-lg max-w-xl mb-12 leading-relaxed">
          Set your department's skill matrix once. Teachers generate
          skills-based worksheets in seconds — formulaic, recognisable, and
          perfectly levelled.
        </p>
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Link href="/generate" className="btn-acid flex items-center gap-2">
            Try free — no login needed
            <ArrowRight size={16} />
          </Link>
          <Link
            href="/signup"
            className="btn-secondary border-gray-600 text-gray-300 hover:bg-ink-light hover:text-chalk"
          >
            Set up your department
          </Link>
        </div>
      </section>

      <section className="border-t border-ink-light px-8 py-16">
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-px bg-ink-light">
          {[
            {
              icon: <LayoutGrid size={20} />,
              title: "Skill Matrix",
              body: "HoDs define which skills are introduced, practised, and mastered at each year group. One setup, department-wide consistency.",
            },
            {
              icon: <Beaker size={20} />,
              title: "Smart Generation",
              body: "Describe the practical. AI generates plausible data at the right precision, then builds a structured worksheet from your matrix.",
            },
            {
              icon: <BookOpen size={20} />,
              title: "Shared Library",
              body: "Every worksheet saves to a shared departmental library. Duplicate, adapt, and build on each other's work.",
            },
          ].map((f) => (
            <div key={f.title} className="bg-ink p-8">
              <div className="w-10 h-10 bg-ink-light flex items-center justify-center text-acid mb-4">
                {f.icon}
              </div>
              <h3 className="font-display text-xl mb-3">{f.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="px-8 py-6 border-t border-ink-light flex items-center justify-between">
        <span className="text-xs text-gray-600 font-mono">© 2025 SciSheet</span>
        <span className="text-xs text-gray-600">Built for science departments</span>
      </footer>
    </main>
  );
}