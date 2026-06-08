export const students = [
  { name: "Aisha Okafor",   id: "CSCC012478", program: "TRIO UB",            time: "8:03 AM", status: "in",  location: "Main Campus" },
  { name: "Marco Reyes",    id: "CSCC012415", program: "TRIO UB",            time: "8:04 AM", status: "in",  location: "Main Campus" },
  { name: "Priya Natarajan",id: "CSCC012399", program: "Academic Support",   time: "3:15 PM", status: "out", location: "East Wing"   },
  { name: "Jordan Park",    id: "CSCC012456", program: "Career Development", time: "8:07 AM", status: "in",  location: "Main Campus" },
  { name: "Sofía Mendoza",  id: "CSCC012501", program: "Leadership",         time: "8:09 AM", status: "in",  location: "Main Campus" },
  { name: "Daniel Chen",    id: "CSCC012522", program: "Community Eng.",     time: "9:12 AM", status: "late",location: "Annex B"     },
  { name: "Riley Thompson", id: "CSCC012548", program: "TRIO UB",            time: "—",       status: "abs", location: "—"           },
];

export const activity = [
  { name: "Aisha Okafor",   action: "Checked in",  time: "8:03 AM", kind: "in" },
  { name: "Marco Reyes",    action: "Checked in",  time: "8:04 AM", kind: "in" },
  { name: "Priya Natarajan",action: "Checked out", time: "3:15 PM", kind: "out" },
  { name: "Jordan Park",    action: "Checked in",  time: "8:07 AM", kind: "in" },
  { name: "Daniel Chen",    action: "Late arrival",time: "9:12 AM", kind: "late" },
];

export const programs = [
  { name: "TRIO Upward Bound", count: 109, pct: 88 },
  { name: "Academic Support",  count: 67,  pct: 62 },
  { name: "Career Development",count: 37,  pct: 42 },
  { name: "Leadership",        count: 24,  pct: 30 },
  { name: "Community Eng.",    count: 10,  pct: 14 },
];

export const attendanceTrend = [
  { day: "May 1", v: 58 }, { day: "May 4", v: 64 }, { day: "May 8", v: 71 },
  { day: "May 11", v: 67 }, { day: "May 15", v: 76 }, { day: "May 18", v: 72 },
  { day: "May 22", v: 81 }, { day: "May 25", v: 78 }, { day: "May 29", v: 88 },
];

export const demographics = [
  { name: "Male",            value: 42, color: "var(--navy)" },
  { name: "Female",          value: 51, color: "var(--gold)" },
  { name: "Non-Binary",      value: 4,  color: "oklch(0.62 0.10 250)" },
  { name: "Prefer Not Say",  value: 3,  color: "oklch(0.75 0.02 90)" },
];
