"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { getSkills, getMatrixEntries, upsertMatrixEntry } from "@/lib/matrix";
import type { Skill, MatrixEntry, SkillLevel } from "@/lib/matrix";
import { ChevronDown, ChevronRight, Wand2 } from "lucide-react";

const YEAR_GROUPS = [
  "Year 7", "Year 8", "Year 9", "Year 10", "Year 11", "Year 12", "Year 13",
];

const DOMAINS = [
  "Graphing",
  "Statistics",
  "Experimental Design",
  "Measurement & Accuracy",
  "Evaluation",
];

const LEVELS: SkillLevel[] = ["introduced", "practised", "mastered"];

const LEVEL_STYLES: Record<SkillLevel, string> = {
  introduced: "bg-sky/20 text-sky border-sky/40",
  practised: "bg-acid/30 text-ink border-acid/60",
  mastered: "bg-acid text-ink border-acid",
};

const LEVEL_LABELS: Record<SkillLevel, string> = {
  introduced: "I",
  practised: "P",
  mastered: "M",
};

export default function MatrixPage() {
  const router = useRouter();
  const [departmentId, setDepartmentId] = useState<string | null>(null);
  const [isHod, setIsHod] = useState(false);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [entries, setEntries] = useState<MatrixEntry[]>([]);
  const [openDomains, setOpenDomains] = useState<Record<string, boolean>>(
    Object.fromEntries(DOMAINS.map((d) => [d, true]))
  );
  const [saving, setSaving] = useState<string | null>(null);
  const [autofilling, setAutofilling] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/login"); return; }

      const { data: profile } = await supabase
        .from("profiles")
        .select("role, department_id")
        .eq("id", user.id)
        .single();

      if (!profile?.department_id) { router.push("/dashboard"); return; }

      setIsHod(profile.role === "hod");
      setDepartmentId(profile.department_id);

      const [skillsData, entriesData] = await Promise.all([
        getSkills(),
        getMatrixEntries(profile.department_id),
      ]);

      setSkills(skillsData);
      setEntries(entriesData);
      setLoading(false);
    }
    load();
  }, []);

  const getLevel = useCallback(
    (skillId: string, yearGroup: string): SkillLevel | null => {
      const entry = entries.find(
        (e) => e.skill_id === skillId && e.year_group === yearGroup
      );
      return entry?.level ?? null;
    },
    [entries]
  );

  async function handleCellClick(skillId: string, yearGroup: string, current: SkillLevel | null) {
    if (!isHod || !departmentId) return;

    const nextLevel: SkillLevel | null =
      current === null ? "introduced"
      : current === "introduced" ? "practised"
      : current === "practised" ? "mastered"
      : null;

    const key = `${skillId}-${yearGroup}`;
    setSaving(key);

    setEntries((prev) => {
      const without = prev.filter(
        (e) => !(e.skill_id === skillId && e.year_group === yearGroup)
      );
      if (nextLevel === null) return without;
      return [...without, { skill_id: skillId, year_group: yearGroup, level: nextLevel }];
    });

    await upsertMatrixEntry(departmentId, skillId, yearGroup, nextLevel);
    setSaving(null);
  }

  async function handleAutofill() {
    if (!isHod || !departmentId) return;
    setAutofilling(true);

    const newEntries: MatrixEntry[] = [];

    for (const skill of skills) {
      const fromIndex = YEAR_GROUPS.indexOf(skill.suggested_year_from);
      if (fromIndex === -1) continue;

      YEAR_GROUPS.forEach((yg, i) => {
        let level: SkillLevel | null = null;
        if (i === fromIndex) level = "introduced";
        else if (i === fromIndex + 1) level = "practised";
        else if (i >= fromIndex + 2) level = "mastered";

        if (level) {
          newEntries.push({ skill_id: skill.id, year_group: yg, level });
        }
      });
    }

    // Optimistic update
    setEntries(newEntries);

    // Persist all to Supabase
    await Promise.all(
      newEntries.map((e) =>
        upsertMatrixEntry(departmentId, e.skill_id, e.year_group, e.level)
      )
    );

    setAutofilling(false);
  }

  function toggleDomain(domain: string) {
    setOpenDomains((prev) => ({ ...prev, [domain]: !prev[domain] }));
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-400 font-mono text-sm">Loading matrix…</p>
      </div>
    );
  }

  const skillsByDomain = DOMAINS.reduce<Record<string, Skill[]>>((acc, domain) => {
    acc[domain] = skills.filter((s) => s.domain === domain);
    return acc;
  }, {});

  return (
    <div className="max-w-full">
      <div className="mb-8 flex items-start justify-between">
        <div>
          <p className="text-xs font-mono text-gray-400 uppercase tracking-widest mb-2">
            Configuration
          </p>
          <h1 className="font-display text-5xl text-ink mb-2">Skill Matrix</h1>
          <p className="text-sm text-gray-500">
            {isHod
              ? "Click a cell to cycle through: empty → introduced → practised → mastered."
              : "Your department's skill progression by year group."}
          </p>
        </div>
        {isHod && (
          <button
            onClick={handleAutofill}
            disabled={autofilling}
            className="btn-secondary flex items-center gap-2 mt-2 flex-shrink-0"
          >
            <Wand2 size={15} />
            {autofilling ? "Filling…" : "Autofill suggested"}
          </button>
        )}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mb-6">
        {LEVELS.map((level) => (
          <div key={level} className="flex items-center gap-2">
            <div className={`w-6 h-6 flex items-center justify-center text-xs font-mono font-bold border ${LEVEL_STYLES[level]}`}>
              {LEVEL_LABELS[level]}
            </div>
            <span className="text-xs text-gray-500 capitalize">{level}</span>
          </div>
        ))}
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 border border-gray-200 bg-chalk" />
          <span className="text-xs text-gray-500">Not assigned</span>
        </div>
      </div>

      {/* Matrix */}
      <div className="bg-chalk border border-gray-200 overflow-x-auto">
        {/* Header row */}
        <div className="flex border-b border-gray-200 bg-slate-lab sticky top-0 z-10">
          <div className="w-72 flex-shrink-0 px-4 py-3 text-xs font-mono uppercase tracking-widest text-gray-400">
            Skill
          </div>
          {YEAR_GROUPS.map((yg) => (
            <div
              key={yg}
              className="w-16 flex-shrink-0 text-center px-1 py-3 text-xs font-mono uppercase tracking-widest text-gray-400"
            >
              {yg.replace("Year ", "Y")}
            </div>
          ))}
        </div>

        {/* Domain accordion sections */}
        {DOMAINS.map((domain) => (
          <div key={domain} className="border-b border-gray-100 last:border-b-0">
            <button
              onClick={() => toggleDomain(domain)}
              className="w-full flex items-center gap-2 px-4 py-3 bg-ink text-chalk hover:bg-ink-light transition-colors text-left"
            >
              {openDomains[domain] ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
              <span className="text-xs font-mono uppercase tracking-widest">{domain}</span>
              <span className="ml-auto text-xs text-gray-400">
                {skillsByDomain[domain].length} skills
              </span>
            </button>

            {openDomains[domain] && skillsByDomain[domain].map((skill, i) => (
              <div
                key={skill.id}
                className={`flex items-center border-b border-gray-100 last:border-b-0 ${i % 2 === 0 ? "bg-chalk" : "bg-slate-lab/40"}`}
              >
                <div className="w-72 flex-shrink-0 px-4 py-3">
                  <p className="text-sm text-ink">{skill.name}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    From {skill.suggested_year_from}
                  </p>
                </div>
                {YEAR_GROUPS.map((yg) => {
                  const level = getLevel(skill.id, yg);
                  const key = `${skill.id}-${yg}`;
                  const isSaving = saving === key;
                  return (
                    <div
                      key={yg}
                      className="w-16 flex-shrink-0 flex items-center justify-center py-3"
                    >
                      <button
                        onClick={() => handleCellClick(skill.id, yg, level)}
                        disabled={!isHod || isSaving || autofilling}
                        title={level ?? "Not assigned"}
                        className={`w-8 h-8 flex items-center justify-center text-xs font-mono font-bold border transition-all ${
                          level
                            ? LEVEL_STYLES[level]
                            : "border-gray-200 bg-chalk text-gray-300 hover:border-gray-400"
                        } ${isHod ? "cursor-pointer hover:scale-110" : "cursor-default"} ${isSaving || autofilling ? "opacity-50" : ""}`}
                      >
                        {isSaving ? "·" : level ? LEVEL_LABELS[level] : ""}
                      </button>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        ))}
      </div>

      {isHod && (
        <p className="text-xs text-gray-400 mt-4 font-mono">
          Changes save automatically.
        </p>
      )}
    </div>
  );
}