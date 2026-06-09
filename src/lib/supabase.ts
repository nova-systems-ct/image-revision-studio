import { createClient } from "@supabase/supabase-js";

const url = (import.meta.env.VITE_SUPABASE_URL as string) ?? "";
const key = (import.meta.env.VITE_SUPABASE_ANON_KEY as string) ?? "";

export const supabase = url && key ? createClient(url, key) : null;

export type DbStudent = {
  id: string;
  name: string;
  department: string;
  student_id: string;
  work_location: string;
  created_at: string;
};

export async function fetchStudentCount(): Promise<number | null> {
  if (!supabase) return null;
  try {
    const { count, error } = await supabase
      .from("students")
      .select("*", { count: "exact", head: true });
    if (error) return null;
    return count;
  } catch {
    return null;
  }
}

export async function upsertStudent(s: {
  name: string;
  department: string;
  studentId: string;
  workLocation: string;
}): Promise<void> {
  if (!supabase) return;
  try {
    await supabase.from("students").upsert({
      name: s.name,
      department: s.department,
      student_id: s.studentId,
      work_location: s.workLocation,
    }, { onConflict: "student_id" });
  } catch { /* silent */ }
}

export async function removeStudent(studentId: string): Promise<void> {
  if (!supabase) return;
  try {
    await supabase.from("students").delete().eq("student_id", studentId);
  } catch { /* silent */ }
}

export async function logTimesheetGenerated(payload: {
  student_name: string;
  pay_period_id: number;
  generated_at: string;
}): Promise<void> {
  if (!supabase) return;
  try {
    await supabase.from("timesheets_generated").insert(payload);
  } catch { /* silent */ }
}
