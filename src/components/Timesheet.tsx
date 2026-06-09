import type { Student } from "../lib/students";
import type { PayPeriod } from "../data/payPeriods";
import { getPayPeriodDays, formatRangeFull } from "../data/payPeriods";

interface Props {
  student: Student;
  period: PayPeriod;
}

const lbl: React.CSSProperties = {
  fontSize: "5.5pt",
  fontWeight: "bold",
  textTransform: "uppercase",
  letterSpacing: "0.06em",
  color: "#666",
  lineHeight: 1,
  marginBottom: "2px",
};

const fieldVal: React.CSSProperties = {
  borderBottom: "1px solid #000",
  paddingBottom: "1px",
  fontSize: "8pt",
  fontWeight: "bold",
  minHeight: "11pt",
};

export function Timesheet({ student, period }: Props) {
  const { week1, week2 } = getPayPeriodDays(period);

  return (
    <div className="ts-page">

      {/* ── Header: black bg, white text ── */}
      <div style={{
        backgroundColor: "#000",
        WebkitPrintColorAdjust: "exact",
        printColorAdjust: "exact",
        color: "#fff",
        textAlign: "center",
        padding: "5px 8px",
        marginBottom: "6px",
      }}>
        <div style={{ fontSize: "12pt", fontWeight: "900", letterSpacing: "0.02em", lineHeight: 1.2 }}>
          CT STATE NAUGATUCK VALLEY COMMUNITY COLLEGE
        </div>
        <div style={{ fontSize: "8pt", fontWeight: "400", marginTop: "2px" }}>
          FOR EMPLOYEES PAID WITH FUNDS FROM FEDERAL GRANTS
        </div>
      </div>

      {/* ── Row 1: Employee Name | Department | Pay Period ── */}
      <div style={{ display: "flex", gap: "12px", marginBottom: "4px", paddingBottom: "4px", borderBottom: "1px solid #000" }}>
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

      {/* ── Row 2: Type of Employee checkboxes + Employee ID ── */}
      <div style={{ display: "flex", alignItems: "center", marginBottom: "5px", paddingBottom: "5px", borderBottom: "2px solid #000" }}>
        <div style={{ flex: 1, display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" }}>
          <span style={{ fontSize: "6pt", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Type of Employee:
          </span>
          <span style={{ fontSize: "9pt", lineHeight: 1 }}>■</span>
          <span style={{ fontSize: "7.5pt", marginRight: "6px" }}>Student</span>
          <span style={{ fontSize: "9pt", lineHeight: 1 }}>□</span>
          <span style={{ fontSize: "7.5pt", marginRight: "6px" }}>Educational Assistant</span>
          <span style={{ fontSize: "9pt", lineHeight: 1 }}>□</span>
          <span style={{ fontSize: "7.5pt" }}>Full Time / Part Time</span>
        </div>
        <div style={{ minWidth: "130px" }}>
          <div style={lbl}>Employee ID:</div>
          <div style={fieldVal}>{student.studentId}</div>
        </div>
      </div>

      {/* ── Time entry table ── */}
      <table className="ts-table" style={{ marginBottom: "4px" }}>
        <thead>
          <tr>
            <th style={{ width: "8%" }}>Date</th>
            <th style={{ width: "8%" }}>Day</th>
            <th style={{ width: "7%" }}>AM In</th>
            <th style={{ width: "7%" }}>AM Out</th>
            <th style={{ width: "6%" }}>Meal</th>
            <th style={{ width: "7%" }}>PM In</th>
            <th style={{ width: "7%" }}>PM Out</th>
            <th>Comments</th>
          </tr>
        </thead>
        <tbody>
          {week1.map((day, i) => (
            <tr key={`w1-${i}`} className="ts-row">
              <td style={{ textAlign: "center", fontWeight: "bold", fontSize: "7.5pt" }}>{day.formatted}</td>
              <td style={{ textAlign: "center", fontWeight: "bold", fontSize: "7.5pt" }}>{day.dayName}</td>
              <td /><td /><td /><td /><td /><td />
            </tr>
          ))}
          <tr className="ts-subtotal">
            <td colSpan={5} style={{ textAlign: "left", paddingLeft: "4px", fontSize: "6.5pt", letterSpacing: "0.05em" }}>
              WEEK 1 — SUB TOTAL
            </td>
            <td colSpan={3} />
          </tr>
          {week2.map((day, i) => (
            <tr key={`w2-${i}`} className="ts-row">
              <td style={{ textAlign: "center", fontWeight: "bold", fontSize: "7.5pt" }}>{day.formatted}</td>
              <td style={{ textAlign: "center", fontWeight: "bold", fontSize: "7.5pt" }}>{day.dayName}</td>
              <td /><td /><td /><td /><td /><td />
            </tr>
          ))}
          <tr className="ts-subtotal">
            <td colSpan={5} style={{ textAlign: "left", paddingLeft: "4px", fontSize: "6.5pt", letterSpacing: "0.05em" }}>
              WEEK 2 — SUB TOTAL
            </td>
            <td colSpan={3} />
          </tr>
        </tbody>
      </table>

      {/* ── Grant section ── */}
      <div style={{ border: "1px solid #000", marginBottom: "5px" }}>
        <div style={{ display: "flex" }}>
          <div style={{ flex: 1, borderRight: "1px solid #000", borderBottom: "1px solid #000", padding: "2px 5px" }}>
            <div style={lbl}>Account No.</div>
            <div style={{ fontSize: "8pt", fontWeight: "bold" }}>HB 3500</div>
          </div>
          <div style={{ flex: 3, borderRight: "1px solid #000", borderBottom: "1px solid #000", padding: "2px 5px" }}>
            <div style={lbl}>Grant Title and/or Department: *</div>
            <div style={{ fontSize: "8pt", fontWeight: "bold" }}>WIOA Out Of School</div>
          </div>
          <div style={{ flex: 1, borderBottom: "1px solid #000", padding: "2px 5px" }}>
            <div style={lbl}>Percentage of Effort: **</div>
            <div style={{ fontSize: "8pt", fontWeight: "bold" }}>100%</div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", padding: "3px 5px", gap: "12px" }}>
          <div style={{ flex: 1, fontSize: "5pt", fontStyle: "italic", color: "#555", lineHeight: 1.3 }}>
            *Effort devoted to more than one project must be broken out individually.&nbsp;
            ** Percentages should add up to 100%.
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", whiteSpace: "nowrap" }}>
            <span style={{ fontSize: "7pt", fontWeight: "bold" }}>Total Hours:</span>
            <div style={{ borderBottom: "1px solid #000", width: "90px" }}>&nbsp;</div>
          </div>
        </div>
      </div>

      {/* ── 4 Signature lines ── */}
      {(["Employee Signature", "Supervisor Signature", "Educational Assistant Signature", "WAVE Coordinator Signature"] as const).map((label) => (
        <div key={label} style={{ display: "flex", alignItems: "flex-end", gap: "6px", marginBottom: "9px" }}>
          <span style={{ fontSize: "6.5pt", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.04em", whiteSpace: "nowrap" }}>
            {label}
          </span>
          <div style={{ flex: 1, borderBottom: "1px solid #000" }}>&nbsp;</div>
          <span style={{ fontSize: "6.5pt", fontWeight: "bold", textTransform: "uppercase", whiteSpace: "nowrap" }}>Date</span>
          <div style={{ width: "80px", borderBottom: "1px solid #000" }}>&nbsp;</div>
        </div>
      ))}

      {/* ── Bottom: certify text left + FOR PAYROLL OFFICE ONLY right ── */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: "5.5pt", fontStyle: "italic", lineHeight: 1.4, margin: 0 }}>
            I certify under penalty of law that this declaration of time and effort represents a reasonable
            estimate of the effort expended by me during the period covered by this report.
          </p>
        </div>
        <div style={{ border: "1px solid #000", minWidth: "195px" }}>
          <div style={{
            backgroundColor: "#000",
            WebkitPrintColorAdjust: "exact",
            printColorAdjust: "exact",
            color: "#fff",
            textAlign: "center",
            padding: "2px 5px",
            fontSize: "6pt",
            fontWeight: "900",
            textTransform: "uppercase",
            letterSpacing: "0.07em",
          }}>
            For Payroll Office Only
          </div>
          <div style={{ padding: "3px 6px 5px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "4px", marginBottom: "4px" }}>
              <span style={{ fontSize: "6pt" }}>Hours</span>
              <div style={{ width: "26px", borderBottom: "1px solid #000" }}>&nbsp;</div>
              <span style={{ fontSize: "6pt" }}>@</span>
              <div style={{ width: "26px", borderBottom: "1px solid #000" }}>&nbsp;</div>
              <span style={{ fontSize: "6pt" }}>= $</span>
              <div style={{ flex: 1, borderBottom: "1px solid #000" }}>&nbsp;</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "4px", marginBottom: "4px" }}>
              <span style={{ fontSize: "6pt", whiteSpace: "nowrap" }}>Checked by</span>
              <div style={{ flex: 1, borderBottom: "1px solid #000" }}>&nbsp;</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <span style={{ fontSize: "6pt" }}>Date</span>
              <div style={{ flex: 1, borderBottom: "1px solid #000" }}>&nbsp;</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Nova Systems footer ── */}
      <div style={{ textAlign: "right", fontSize: "4.5pt", color: "#ccc", marginTop: "2px" }}>
        Nova Systems
      </div>

    </div>
  );
}
