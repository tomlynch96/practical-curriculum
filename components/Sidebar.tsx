"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Beaker,
  FileText,
  BookOpen,
  LayoutGrid,
  Users,
  LogOut,
  ChevronRight,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface SidebarProps {
  profile: {
    full_name: string;
    role: string;
    departments: {
      name: string;
      school: string;
      join_code: string;
    } | null;
  };
}

const teacherNav = [
  { href: "/dashboard", label: "Dashboard", icon: ChevronRight },
  { href: "/dashboard/generate", label: "Generate", icon: FileText },
  { href: "/dashboard/library", label: "Library", icon: BookOpen },
];

const hodNav = [
  { href: "/dashboard", label: "Dashboard", icon: ChevronRight },
  { href: "/dashboard/generate", label: "Generate", icon: FileText },
  { href: "/dashboard/library", label: "Library", icon: BookOpen },
  { href: "/dashboard/matrix", label: "Skill Matrix", icon: LayoutGrid },
  { href: "/dashboard/team", label: "Team", icon: Users },
];

export default function Sidebar({ profile }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const nav = profile.role === "hod" ? hodNav : teacherNav;

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-ink flex flex-col z-40">
      {/* Logo */}
      <div className="px-6 py-6 border-b border-ink-light">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="w-8 h-8 bg-acid flex items-center justify-center flex-shrink-0">
            <Beaker size={16} className="text-ink" />
          </div>
          <span className="font-display text-xl text-chalk">SciSheet</span>
        </Link>
      </div>

      {/* Department info */}
      {profile.departments && (
        <div className="px-6 py-4 border-b border-ink-light">
          <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">
            Department
          </p>
          <p className="text-sm text-chalk font-medium truncate">
            {profile.departments.name}
          </p>
          <p className="text-xs text-gray-500 truncate">
            {profile.departments.school}
          </p>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {nav.map((item) => {
          const Icon = item.icon;
          const active =
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 text-sm transition-all ${
                active
                  ? "bg-acid text-ink font-medium"
                  : "text-gray-400 hover:text-chalk hover:bg-ink-light"
              }`}
            >
              <Icon size={16} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* User + sign out */}
      <div className="px-6 py-5 border-t border-ink-light">
        <div className="flex items-center justify-between">
          <div className="min-w-0">
            <p className="text-sm text-chalk font-medium truncate">
              {profile.full_name}
            </p>
            <p className="text-xs text-gray-500 capitalize">
              {profile.role === "hod" ? "Head of Department" : "Teacher"}
            </p>
          </div>
          <button
            onClick={handleSignOut}
            className="text-gray-500 hover:text-coral transition-colors ml-3 flex-shrink-0"
            title="Sign out"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
}