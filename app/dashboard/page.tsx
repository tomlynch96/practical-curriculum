"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { FileText, LayoutGrid, BookOpen, Users } from "lucide-react";

export default function DashboardPage() {
  const supabase = createClient();
  const [profile, setProfile] = useState<any>(null);
  const [worksheetCount, setWorksheetCount] = useState(0);

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: p } = await supabase
        .from("profiles")
        .select("*, departments(*)")
        .eq("id", user.id)
        .single();

      setProfile(p);

      if (p?.department_id) {
        const { count } = await supabase
          .from("worksheets")
          .select("*", { count: "exact", head: true })
          .eq("department_id", p.department_id);
        setWorksheetCount(count ?? 0);
      }
    }
    load();
  }, []);

  if (!profile) return null;

  const isHod = profile.role === "hod";
  const department = profile.departments;

  return (
    <div className="max-w-5xl">
      <div className="mb-10">
        <p className="text-xs font-mono text-gray-400 uppercase tracking-widest mb-2">
          {department?.school ?? "No department"}
        </p>
        <h1 className="font-display text-5xl text-ink">
          Good to see you, {profile.full_name?.split(" ")[0]}.
        </h1>
        {isHod && department?.join_code && (
          <div className="mt-4 inline-flex items-center gap-3 bg-chalk border border-gray-200 px-4 py-2">
            <span className="text-xs text-gray-500 uppercase tracking-widest">Department join code</span>
            <span className="font-mono font-medium text-ink tracking-widest">{department.join_code}</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <Link href="/dashboard/generate" className="card hover:border-ink transition-colors group">
          <div className="w-10 h-10 bg-acid flex items-center justify-center mb-4 group-hover:bg-acid-dark transition-colors">
            <FileText size={18} className="text-ink" />
          </div>
          <h3 className="font-display text-xl mb-1">Generate worksheet</h3>
          <p className="text-sm text-gray-500">Describe a practical and build a skills-based worksheet.</p>
        </Link>

        <Link href="/dashboard/library" className="card hover:border-ink transition-colors group">
          <div className="w-10 h-10 bg-slate-lab flex items-center justify-center mb-4 border border-gray-200">
            <BookOpen size={18} className="text-ink" />
          </div>
          <h3 className="font-display text-xl mb-1">Library</h3>
          <p className="text-sm text-gray-500">Browse and reuse worksheets saved by your department.</p>
        </Link>

        {isHod && (
          <>
            <Link href="/dashboard/matrix" className="card hover:border-ink transition-colors group">
              <div className="w-10 h-10 bg-slate-lab flex items-center justify-center mb-4 border border-gray-200">
                <LayoutGrid size={18} className="text-ink" />
              </div>
              <h3 className="font-display text-xl mb-1">Skill matrix</h3>
              <p className="text-sm text-gray-500">Set which skills each year group will practise and master.</p>
            </Link>

            <Link href="/dashboard/team" className="card hover:border-ink transition-colors group">
              <div className="w-10 h-10 bg-slate-lab flex items-center justify-center mb-4 border border-gray-200">
                <Users size={18} className="text-ink" />
              </div>
              <h3 className="font-display text-xl mb-1">Team</h3>
              <p className="text-sm text-gray-500">View your department members and manage access.</p>
            </Link>
          </>
        )}
      </div>

      <div className="bg-ink text-chalk px-6 py-5 flex items-center gap-10">
        <div>
          <div className="font-display text-3xl text-acid">{worksheetCount}</div>
          <div className="text-xs text-gray-400 mt-1">Worksheets saved</div>
        </div>
        <div className="w-px h-8 bg-ink-light" />
        <div>
          <div className="font-display text-3xl text-chalk">{department?.name ?? "—"}</div>
          <div className="text-xs text-gray-400 mt-1">Department</div>
        </div>
        <div className="w-px h-8 bg-ink-light" />
        <div>
          <div className="font-display text-3xl text-chalk">{profile.role === "hod" ? "HoD" : "Teacher"}</div>
          <div className="text-xs text-gray-400 mt-1">Your role</div>
        </div>
      </div>
    </div>
  );
}