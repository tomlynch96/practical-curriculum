"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Beaker, Eye, EyeOff } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-slate-lab flex">
      <div className="hidden lg:flex lg:w-1/2 bg-ink flex-col justify-between p-12">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-8 h-8 bg-acid flex items-center justify-center">
            <Beaker size={16} className="text-ink" />
          </div>
          <span className="font-display text-xl text-chalk">SciSheet</span>
        </Link>
        <div>
          <blockquote className="font-display text-3xl text-chalk leading-snug mb-4">
            "Every practical. Every year group. Consistent."
          </blockquote>
          <p className="text-gray-500 text-sm">Skills-based worksheets for science departments.</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {["Graphing", "Statistics", "Evaluation", "Experimental Design"].map((d) => (
            <span key={d} className="tag text-gray-500 text-xs">{d}</span>
          ))}
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-8 py-12">
        <div className="w-full max-w-md">
          <Link href="/" className="flex items-center gap-3 mb-10 lg:hidden">
            <div className="w-8 h-8 bg-acid flex items-center justify-center">
              <Beaker size={16} className="text-ink" />
            </div>
            <span className="font-display text-xl text-ink">SciSheet</span>
          </Link>

          <h1 className="font-display text-4xl text-ink mb-2">Welcome back</h1>
          <p className="text-gray-500 text-sm mb-8">
            Don't have an account?{" "}
            <Link href="/signup" className="text-ink underline">Sign up</Link>
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="label">Email</label>
              <input className="input" type="email" value={email}
                onChange={e => setEmail(e.target.value)} required />
            </div>
            <div>
              <label className="label">Password</label>
              <div className="relative">
                <input className="input pr-10" type={showPassword ? "text" : "password"}
                  value={password} onChange={e => setPassword(e.target.value)} required />
                <button type="button" onClick={() => setShowPassword(p => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            {error && <p className="text-coral text-sm">{error}</p>}
            <button type="submit" className="btn-primary w-full" disabled={loading}>
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-400 mt-6">
            <Link href="/reset-password" className="underline">Forgot password?</Link>
          </p>
        </div>
      </div>
    </div>
  );
}