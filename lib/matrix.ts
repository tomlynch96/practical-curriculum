import { createClient } from "@/lib/supabase/client";

export type SkillLevel = "introduced" | "practised" | "mastered";

export interface Skill {
  id: string;
  name: string;
  description: string;
  domain: string;
  suggested_year_from: string;
}

export interface MatrixEntry {
  skill_id: string;
  year_group: string;
  level: SkillLevel;
}

export async function getSkills(): Promise<Skill[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("skills")
    .select("id, name, description, domain, suggested_year_from")
    .eq("is_global", true)
    .order("domain")
    .order("suggested_year_from");
  if (error) throw error;
  return data ?? [];
}

export async function getMatrixEntries(departmentId: string): Promise<MatrixEntry[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("matrix_entries")
    .select("skill_id, year_group, level")
    .eq("department_id", departmentId);
  if (error) throw error;
  return data ?? [];
}

export async function upsertMatrixEntry(
  departmentId: string,
  skillId: string,
  yearGroup: string,
  level: SkillLevel | null
) {
  const supabase = createClient();
  if (level === null) {
    await supabase
      .from("matrix_entries")
      .delete()
      .eq("department_id", departmentId)
      .eq("skill_id", skillId)
      .eq("year_group", yearGroup);
  } else {
    await supabase
      .from("matrix_entries")
      .upsert(
        { department_id: departmentId, skill_id: skillId, year_group: yearGroup, level },
        { onConflict: "department_id,skill_id,year_group" }
      );
  }
}

export async function getMatrixForYearGroup(
  departmentId: string,
  yearGroup: string
): Promise<{ skill: Skill; level: SkillLevel }[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("matrix_entries")
    .select("level, skills(id, name, description, domain, suggested_year_from)")
    .eq("department_id", departmentId)
    .eq("year_group", yearGroup);
  if (error) throw error;
  return (data ?? []).map((row: any) => ({
    skill: row.skills,
    level: row.level,
  }));
}