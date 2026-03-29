export type Role = "hod" | "teacher";

export type SkillLevel = "introduced" | "practised" | "mastered";

export type YearGroup =
  | "Year 7"
  | "Year 8"
  | "Year 9"
  | "Year 10"
  | "Year 11"
  | "Year 12"
  | "Year 13";

export const YEAR_GROUPS: YearGroup[] = [
  "Year 7",
  "Year 8",
  "Year 9",
  "Year 10",
  "Year 11",
  "Year 12",
  "Year 13",
];

export type SkillDomain =
  | "Graphing"
  | "Statistics"
  | "Experimental Design"
  | "Evaluation"
  | "Measurement & Accuracy";

export interface Department {
  id: string;
  name: string;
  school: string;
  join_code: string;
  created_at: string;
}

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  role: Role;
  department_id: string | null;
  created_at: string;
}

export interface Skill {
  id: string;
  name: string;
  description: string;
  domain: SkillDomain;
  suggested_year_from: YearGroup;
  suggested_year_to: YearGroup;
  is_global: boolean; // true = built-in, false = department custom
  department_id: string | null;
}

export interface MatrixEntry {
  id: string;
  department_id: string;
  skill_id: string;
  year_group: YearGroup;
  level: SkillLevel;
  skill?: Skill;
}

export interface Worksheet {
  id: string;
  department_id: string;
  created_by: string;
  title: string;
  year_group: YearGroup;
  practical_description: string;
  practical_type: string;
  skills_used: string[]; // skill ids
  content: WorksheetContent;
  mark_scheme: MarkSchemeContent | null;
  is_free_tier: boolean;
  created_at: string;
  updated_at: string;
}

export interface WorksheetContent {
  context: string;
  data_table: DataTable | null;
  graph_instructions: string | null;
  analysis_questions: Question[];
  evaluation_questions: Question[];
}

export interface DataTable {
  independent_variable: string;
  dependent_variable: string;
  units: { independent: string; dependent: string };
  rows: { x: number; y: number }[];
  anomaly_index?: number;
}

export interface Question {
  id: string;
  skill_id: string;
  question: string;
  marks: number;
  answer_lines: number;
}

export interface MarkSchemeContent {
  analysis_answers: Answer[];
  evaluation_answers: Answer[];
}

export interface Answer {
  question_id: string;
  mark_points: string[];
}

export interface CheatSheet {
  id: string;
  department_id: string;
  year_group: YearGroup;
  content: CheatSheetContent;
  generated_at: string;
}

export interface CheatSheetContent {
  domains: {
    domain: SkillDomain;
    skills: {
      name: string;
      how_to: string;
      example: string;
    }[];
  }[];
}