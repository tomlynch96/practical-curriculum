import Link from "next/link";
import { Beaker, ArrowLeft } from "lucide-react";

export default function FreePage() {
  return (
    <div className="min-h-screen bg-slate-lab">
      <nav className="flex items-center justify-between px-8 py-5 bg-chalk border-b border-gray-200">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-8 h-8 bg-acid flex items-center justify-center">
            <Beaker size={16} className="text-ink" />
          </div>
          <span className="font-display text-xl text-ink">SciSheet</span>
        </Link>
        <Link href="/signup" className="text-sm text-gray-500 hover:text-ink underline underline-offset-2">
          Set up your department →
        </Link>
      </nav>

      <div className="max-w-2xl mx-auto px-8 py-16">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-ink mb-8">
          <ArrowLeft size={14} /> Back
        </Link>
        <p className="text-xs font-mono text-gray-400 uppercase tracking-widest mb-3">
          Free worksheet generator
        </p>
        <h1 className="font-display text-5xl text-ink mb-3">Build a worksheet</h1>
        <p className="text-gray-500 text-sm mb-10">
          Select your skills, describe your practical, and get a ready-to-print worksheet. No account needed.{" "}
          <Link href="/signup" className="text-ink underline underline-offset-2">Sign up</Link>{" "}
          to unlock department features.
        </p>

        <div className="card border-dashed border-2 border-gray-300 text-center py-16">
          <p className="text-gray-400 font-mono text-sm">Worksheet generator coming in Phase 3</p>
        </div>
      </div>
    </div>
  );
}