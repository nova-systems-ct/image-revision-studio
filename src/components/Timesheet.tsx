import type { Student } from "../lib/students";
import type { PayPeriod } from "../data/payPeriods";
import { getPayPeriodDays, formatRangeFull } from "../data/payPeriods";

export interface TimeEntry {
  amIn?: string;
  amOut?: string;
  meal?: string;
  pmIn?: string;
  pmOut?: string;
}

interface Props {
  student: Student;
  period: PayPeriod;
  entries?: TimeEntry[];
}

const lbl: React.CSSProperties = {
  fontSize: "5.5pt",
  fontWeight: 400,
  textTransform: "uppercase",
  letterSpacing: "0.06em",
  color: "#666",
  lineHeight: 1,
  marginBottom: "3px",
};

const fieldVal: React.CSSProperties = {
  borderBottom: "1px solid #000",
  paddingBottom: "2px",
  fontSize: "9pt",
  fontWeight: 400,
  minHeight: "14pt",
};

const cellTxt: React.CSSProperties = {
  textAlign: "center",
  fontSize: "8pt",
  fontWeight: 400,
};

/* ── Signature line: label + long write line + DATE + short date line ── */
function SigLine({ label }: { label: string }) {
  const writeLine: React.CSSProperties = {
    borderBottom: "1px solid #000",
    minHeight: "24px",
    flex: 1,
  };
  const dateLine: React.CSSProperties = {
    borderBottom: "1px solid #000",
    minHeight: "24px",
    width: "80px",
  };
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: "8px", marginBottom: "11px" }}>
      <span style={{ fontSize: "7pt", fontWeight: 400, textTransform: "uppercase", letterSpacing: "0.04em", whiteSpace: "nowrap", paddingBottom: "2px" }}>
        {label}
      </span>
      <div style={writeLine} />
      <span style={{ fontSize: "7pt", fontWeight: 400, textTransform: "uppercase", whiteSpace: "nowrap", paddingBottom: "2px" }}>Date</span>
      <div style={dateLine} />
    </div>
  );
}

export function Timesheet({ student, period, entries }: Props) {
  const { week1, week2 } = getPayPeriodDays(period);

  return (
    <div className="ts-page">

      {/* ── Full-width black header ── */}
      <div style={{
        backgroundColor: "#000",
        WebkitPrintColorAdjust: "exact",
        printColorAdjust: "exact",
        color: "#fff",
        textAlign: "center",
        padding: "7px 16px",
      }}>
        <div style={{ fontSize: "13pt", fontWeight: 900, letterSpacing: "0.02em", lineHeight: 1.25 }}>
          CT STATE NAUGATUCK VALLEY COMMUNITY COLLEGE
        </div>
        <div style={{ fontSize: "8.5pt", fontWeight: 400, marginTop: "3px" }}>
          FOR EMPLOYEES PAID WITH FUNDS FROM FEDERAL GRANTS
        </div>
      </div>

      {/* ── Padded content area ── */}
      <div style={{ padding: "12px 16px 14px 16px" }}>

        {/* ── Row 1: Employee Name | Department | Pay Period ── */}
        <div style={{ display: "flex", gap: "14px", marginBottom: "8px", paddingBottom: "6px", borderBottom: "1px solid #000" }}>
          <div style={{ flex: 2 }}>
            <div style={lbl}>Employee Name</div>
            <div style={fieldVal}>{student.name}</div>
          </div>
          <div style={{ flex: 2 }}>
            <div style={lbl}>Department:</div>
            <div style={fieldVal}>{student.department}</div>
          </div>
          <div style={{ flex: 1.5 }}>
            <div style={lbl}>Pay Period:</div>
            <div style={fieldVal}>{formatRangeFull(period)}</div>
          </div>
        </div>

        {/* ── Row 2: Type of Employee + Employee ID ── */}
        <div style={{ display: "flex", alignItems: "center", marginBottom: "8px", paddingBottom: "6px", borderBottom: "2px solid #000" }}>
          <div style={{ flex: 1, display: "flex", alignItems: "center", gap: "7px", flexWrap: "wrap" }}>
            <span style={{ fontSize: "6.5pt", fontWeight: 400, textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Type of Employee:
            </span>
            <span style={{ fontSize: "10pt", lineHeight: 1 }}>■</span>
            <span style={{ fontSize: "8pt", fontWeight: 400, marginRight: "8px" }}>Student</span>
            <span style={{ fontSize: "10pt", lineHeight: 1 }}>□</span>
            <span style={{ fontSize: "8pt", fontWeight: 400, marginRight: "8px" }}>Educational Assistant</span>
            <span style={{ fontSize: "10pt", lineHeight: 1 }}>□</span>
            <span style={{ fontSize: "8pt", fontWeight: 400 }}>Full Time / Part Time</span>
          </div>
          <div style={{ minWidth: "140px" }}>
            <div style={lbl}>Employee ID:</div>
            <div style={fieldVal}>{student.studentId}</div>
          </div>
        </div>

        {/* ── Time entry table ── */}
        <table className="ts-table" style={{ marginBottom: "8px" }}>
          <thead>
            <tr>
              <th style={{ width: "8%" }}>Date</th>
              <th style={{ width: "8%" }}>Day</th>
              <th style={{ width: "8%" }}>AM In</th>
              <th style={{ width: "8%" }}>AM Out</th>
              <th style={{ width: "7%" }}>Meal</th>
              <th style={{ width: "8%" }}>PM In</th>
              <th style={{ width: "8%" }}>PM Out</th>
              <th>Comments</th>
            </tr>
          </thead>
          <tbody>
            {week1.map((day, i) => {
              const e = entries?.[i];
              return (
                <tr key={`w1-${i}`} className="ts-row">
                  <td style={cellTxt}>{day.formatted}</td>
                  <td style={cellTxt}>{day.dayName}</td>
                  <td style={cellTxt}>{e?.amIn ?? ""}</td>
                  <td style={cellTxt}>{e?.amOut ?? ""}</td>
                  <td style={cellTxt}>{e?.meal ?? ""}</td>
                  <td style={cellTxt}>{e?.pmIn ?? ""}</td>
                  <td style={cellTxt}>{e?.pmOut ?? ""}</td>
                  <td />
                </tr>
              );
            })}
            <tr className="ts-subtotal">
              <td colSpan={5} style={{ textAlign: "left", paddingLeft: "5px", fontSize: "7pt", letterSpacing: "0.04em", fontWeight: 400 }}>
                WEEK 1 — SUB TOTAL
              </td>
              <td colSpan={3} style={{ minHeight: "22px" }} />
            </tr>
            {week2.map((day, i) => {
              const e = entries?.[i + 7];
              return (
                <tr key={`w2-${i}`} className="ts-row">
                  <td style={cellTxt}>{day.formatted}</td>
                  <td style={cellTxt}>{day.dayName}</td>
                  <td style={cellTxt}>{e?.amIn ?? ""}</td>
                  <td style={cellTxt}>{e?.amOut ?? ""}</td>
                  <td style={cellTxt}>{e?.meal ?? ""}</td>
                  <td style={cellTxt}>{e?.pmIn ?? ""}</td>
                  <td style={cellTxt}>{e?.pmOut ?? ""}</td>
                  <td />
                </tr>
              );
            })}
            <tr className="ts-subtotal">
              <td colSpan={5} style={{ textAlign: "left", paddingLeft: "5px", fontSize: "7pt", letterSpacing: "0.04em", fontWeight: 400 }}>
                WEEK 2 — SUB TOTAL
              </td>
              <td colSpan={3} style={{ minHeight: "22px" }} />
            </tr>
          </tbody>
        </table>

        {/* ── Grant section ── */}
        <div style={{ border: "1px solid #000", marginBottom: "10px" }}>
          <div style={{ display: "flex" }}>
            <div style={{ flex: 1, borderRight: "1px solid #000", borderBottom: "1px solid #000", padding: "3px 6px" }}>
              <div style={lbl}>Account No.</div>
              <div style={{ fontSize: "8.5pt", fontWeight: 400 }}>HB 3500</div>
            </div>
            <div style={{ flex: 3, borderRight: "1px solid #000", borderBottom: "1px solid #000", padding: "3px 6px" }}>
              <div style={lbl}>Grant Title and/or Department: *</div>
              <div style={{ fontSize: "8.5pt", fontWeight: 400 }}>WIOA Out Of School</div>
            </div>
            <div style={{ flex: 1, borderBottom: "1px solid #000", padding: "3px 6px" }}>
              <div style={lbl}>Percentage of Effort: **</div>
              <div style={{ fontSize: "8.5pt", fontWeight: 400 }}>100%</div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", padding: "4px 6px", gap: "14px" }}>
            <div style={{ flex: 1, fontSize: "5.5pt", fontStyle: "italic", color: "#555", lineHeight: 1.35, fontWeight: 400 }}>
              *Effort devoted to more than one project must be broken out individually.
              &nbsp;** Percentages should add up to 100%.
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", whiteSpace: "nowrap" }}>
              <span style={{ fontSize: "7.5pt", fontWeight: 400 }}>Total Hours:</span>
              <div style={{ borderBottom: "1px solid #000", width: "100px", minHeight: "22px" }} />
            </div>
          </div>
        </div>

        {/* ── 4 Signature lines ── */}
        <div style={{ marginBottom: "10px" }}>
          <SigLine label="Employee Signature" />
          <SigLine label="Supervisor Signature" />
          <SigLine label="Educational Assistant Signature" />
          <SigLine label="WAVE Coordinator Signature" />
        </div>

        {/* ── Bottom: certify text left + FOR PAYROLL OFFICE ONLY right ── */}
        <div style={{ display: "flex", alignItems: "flex-start", gap: "14px" }}>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: "6pt", fontStyle: "italic", lineHeight: 1.5, margin: 0, fontWeight: 400 }}>
              I certify under penalty of law that this declaration of time and effort represents a reasonable
              estimate of the effort expended by me during the period covered by this report.
            </p>
          </div>
          <div style={{ border: "1px solid #000", minWidth: "200px" }}>
            <div style={{
              backgroundColor: "#000",
              WebkitPrintColorAdjust: "exact",
              printColorAdjust: "exact",
              color: "#fff",
              textAlign: "center",
              padding: "3px 6px",
              fontSize: "6.5pt",
              fontWeight: 900,
              textTransform: "uppercase",
              letterSpacing: "0.07em",
            }}>
              For Payroll Office Only
            </div>
            <div style={{ padding: "4px 8px 6px" }}>
              <div style={{ display: "flex", alignItems: "flex-end", gap: "4px", marginBottom: "6px" }}>
                <span style={{ fontSize: "6.5pt", fontWeight: 400 }}>Hours</span>
                <div style={{ width: "28px", borderBottom: "1px solid #000", minHeight: "18px" }} />
                <span style={{ fontSize: "6.5pt", fontWeight: 400 }}>@</span>
                <div style={{ width: "28px", borderBottom: "1px solid #000", minHeight: "18px" }} />
                <span style={{ fontSize: "6.5pt", fontWeight: 400 }}>= $</span>
                <div style={{ flex: 1, borderBottom: "1px solid #000", minHeight: "18px" }} />
              </div>
              <div style={{ display: "flex", alignItems: "flex-end", gap: "4px", marginBottom: "6px" }}>
                <span style={{ fontSize: "6.5pt", fontWeight: 400, whiteSpace: "nowrap" }}>Checked by</span>
                <div style={{ flex: 1, borderBottom: "1px solid #000", minHeight: "18px" }} />
              </div>
              <div style={{ display: "flex", alignItems: "flex-end", gap: "4px" }}>
                <span style={{ fontSize: "6.5pt", fontWeight: 400 }}>Date</span>
                <div style={{ flex: 1, borderBottom: "1px solid #000", minHeight: "18px" }} />
              </div>
            </div>
          </div>
        </div>

        {/* ── Nova Systems footer ── */}
        <div style={{ textAlign: "right", fontSize: "5pt", color: "#bbb", marginTop: "4px", fontWeight: 400 }}>
          Nova Systems
        </div>

      </div>{/* end padded content area */}
    </div>
  );
}
