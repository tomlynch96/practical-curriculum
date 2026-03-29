"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Beaker, Eye, EyeOff } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type SignupStep = "details" | "role" | "department";

export default function SignupPage() {
  const router = useRouter();
  const supabase = createClient();

  const [step, setStep] = useState<SignupStep>("details");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<"hod" | "teacher" | null>(null);
  const [departmentName, setDepartmentName] = useState("");
  const [schoolName, setSchoolName] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSignup() {
    setLoading(true);
    setError(null);

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName, role } },
    });

    if (authError || !authData.user) {
      setError(authError?.message ?? "Signup failed");
      setLoading(false);
      return;
    }

    const userId = authData.user.id;

    if (role === "hod") {
      const code = Math.random().toString(36).substring(2, 8).toUpperCase();

      const { data: dept, error: deptError } = await supabase
        .from("departments")
        .insert({ name: departmentName, school: schoolName, join_code: code })
        .select()
        .single();

      if (deptError || !dept) {
        setError("Failed to create department");
        setLoading(false);
        return;
      }

      await supabase.from("profiles").insert({
        id: userId,
        email,
        full_name: fullName,
        role: "hod",
        department_id: dept.id,
      });
    } else {
      const { data: dept, error: deptError } = await supabase
        .from("departments")
        .select()
        .eq("join_code", joinCode.toUpperCase())
        .single();

      if (deptError || !dept) {
        setError("Department code not found. Check with your HoD.");
        setLoading(false);
        return;
      }

      await supabase.from("profiles").insert({
        id: userId,
        email,
        full_name: fullName,
        role: "teacher",
        department_id: dept.id,
      });
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-slate-lab flex items-center justify-center px-8 py-12">
      <div className="w-full max-w-md">
        <Link href="/" className="flex items-center gap-3 mb-10">
          <div className="w-8 h-8 bg-acid flex items-center justify-center">
            <Beaker size={16} className="text-ink" />
          </div>
          <span className="font-display text-xl text-ink">SciSheet</span>
        </Link>

        {step === "details" && (
          <>
            <h1 className="font-display text-4xl text-ink mb-2">Create account</h1>
            <p className="text-gray-500 text-sm mb-8">
              Already have one?{" "}
              <Link href="/login" className="text-ink underline underline-offset-2">Sign in</Link>
            </p>
            <div className="space-y-5">
              <div>
                <label className="label">Full name</label>
                <input type="text" className="input" placeholder="Dr. Jane Smith" value={fullName} onChange={(e) => setFullName(e.target.value)} />
              </div>
              <div>
                <label className="label">Email address</label>
                <input type="email" className="input" placeholder="you@school.ac.uk" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div>
                <label className="label">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="input pr-12"
                    placeholder="Min. 8 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-ink">
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              {error && <div className="bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">{error}</div>}
              <button onClick={() => { if (!fullName || !email || password.length < 8) { setError("Please complete all fields (min 8 char password)"); return; } setError(null); setStep("role"); }} className="btn-primary w-full">
                Continue
              </button>
            </div>
          </>
        )}

        {step === "role" && (
          <>
            <h1 className="font-display text-4xl text-ink mb-2">What's your role?</h1>
            <p className="text-gray-500 text-sm mb-8">This determines what you can set up.</p>
            <div className="space-y-3 mb-6">
              {[
                { value: "hod" as const, label: "Head of Department", desc: "Set up a new department, define the skill matrix, manage the library." },
                { value: "teacher" as const, label: "Teacher", desc: "Join an existing department with a code, generate and save worksheets." },
              ].map((r) => (
                <button key={r.value} onClick={() => setRole(r.value)} className={`w-full text-left border p-4 transition-all ${role === r.value ? "border-ink bg-ink text-chalk" : "border-gray-300 bg-chalk hover:border-ink"}`}>
                  <div className="font-medium text-sm mb-1">{r.label}</div>
                  <div className={`text-xs ${role === r.value ? "text-gray-400" : "text-gray-500"}`}>{r.desc}</div>
                </button>
              ))}
            </div>
            {error && <div className="mb-4 bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">{error}</div>}
            <button onClick={() => { if (!role) { setError("Please select a role"); return; } setError(null); setStep("department"); }} className="btn-primary w-full">
              Continue
            </button>
          </>
        )}

        {step === "department" && (
          <>
            <h1 className="font-display text-4xl text-ink mb-2">
              {role === "hod" ? "Create your department" : "Join a department"}
            </h1>
            <p className="text-gray-500 text-sm mb-8">
              {role === "hod" ? "You'll get a join code to share with your team." : "Ask your HoD for the department join code."}
            </p>
            <div className="space-y-5">
              {role === "hod" ? (
                <>
                  <div>
                    <label className="label">Department name</label>
                    <input type="text" className="input" placeholder="Science Department" value={departmentName} onChange={(e) => setDepartmentName(e.target.value)} />
                  </div>
                  <div>
                    <label className="label">School name</label>
                    <input type="text" className="input" placeholder="Parkside Academy" value={schoolName} onChange={(e) => setSchoolName(e.target.value)} />
                  </div>
                </>
              ) : (
                <div>
                  <label className="label">Department join code</label>
                  <input type="text" className="input uppercase tracking-widest font-mono" placeholder="e.g. XK39FP" value={joinCode} onChange={(e) => setJoinCode(e.target.value)} maxLength={6} />
                </div>
              )}
              {error && <div className="bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">{error}</div>}
              <button onClick={handleSignup} disabled={loading} className="btn-acid w-full disabled:opacity-50">
                {loading ? "Creating account…" : "Create account"}
              </button>
              <button onClick={() => setStep("role")} className="w-full text-center text-sm text-gray-400 hover:text-ink">
                ← Back
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}