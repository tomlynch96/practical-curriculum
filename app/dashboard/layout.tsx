"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Sidebar from "@/components/Sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/login"); return; }

      const { data: profile } = await supabase
        .from("profiles")
        .select("*, departments(*)")
        .eq("id", user.id)
        .single();

      if (!profile) { router.push("/login"); return; }

      setProfile(profile);
      setLoading(false);
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-lab flex items-center justify-center">
        <div className="text-gray-400 font-mono text-sm">Loading…</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-lab">
      <Sidebar profile={profile} />
      <main className="flex-1 ml-64 p-8">{children}</main>
    </div>
  );
}