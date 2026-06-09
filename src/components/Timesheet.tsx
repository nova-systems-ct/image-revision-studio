import ctstateLogo from "../assets/ctstate-logo.png";
import type { Student } from "../lib/students";
import type { PayPeriod } from "../data/payPeriods";
import { getPayPeriodDays, formatRangeFull } from "../data/payPeriods";

const NAVY = "#1B3A6B";
const BLUE_TINT = "#d0dff0";

interface Props {
  student: Student;
  period: PayPeriod;
}

/* ── Shared style objects ── */
const cell: React.CSSProperties = { border: "1px solid #000", padding: "2px 4px", verticalAlign: "middle" };
const lbl: React.CSSProperties = { fontSize: "5.5pt", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.06em", color: "#666", lineHeight: 1 };
const val: React.CSSProperties = { fontSize: "8pt", fontWeight: "bold", lineHeight: 1.2, marginTop: "2px" };
const blankLine: React.CSSProperties = { ...val, borderBottom: "1px solid #000", display: "block", minWidth: "60px" };
const subCell: React.CSSProperties = { border: "1px solid #000", padding: "2px 4px", verticalAlign: "middle", backgroundColor: BLUE_TINT, WebkitPrintColorAdjust: "exact", printColorAdjust: "exact" };

function Val({ v }: { v: string }) {
  return v ? <div style={val}>{v}</div> : <div style={blankLine}>&nbsp;</div>;
}

/* ── Single signature row ── */
function SigRow({ title, showTotalHours }: { title: string; showTotalHours?: boolean }) {
  const lineStyle: React.CSSProperties = { borderBottom: "1px solid #000", flex: 1 };
  const lineLbl: React.CSSProperties = { fontSize: "5pt", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.05em", color: "#777", marginTop: "1px", whiteSpace: "nowrap" };
  const fieldWrap: React.CSSProperties = { display: "flex", flexDirection: "column", flex: 1, minWidth: 0 };

  return (
    <div style={{ borderTop: "1px solid #bbb", padding: "3px 5px" }}>
      <div style={{ fontSize: "6pt", fontWeight: "900", textTransform: "uppercase", letterSpacing: "0.08em", color: NAVY, marginBottom: "3px" }}>
        {title}
      </div>
      <div style={{ display: "flex", gap: "10px", alignItems: "flex-end" }}>
        <div style={fieldWrap}>
          <div style={lineStyle}>&nbsp;</div>
          <div style={lineLbl}>Name</div>
        </div>
        <div style={fieldWrap}>
          <div style={lineStyle}>&nbsp;</div>
          <div style={lineLbl}>Signature</div>
        </div>
        <div style={{ ...fieldWrap, maxWidth: "80px" }}>
          <div style={lineStyle}>&nbsp;</div>
          <div style={lineLbl}>Date</div>
        </div>
        {showTotalHours && (
          <div style={{ ...fieldWrap, maxWidth: "100px" }}>
            <div style={lineStyle}>&nbsp;</div>
            <div style={lineLbl}>Total Hours</div>
          </div>
        )}
      </div>
    </div>
  );
}

export function Timesheet({ student, period }: Props) {
  const { week1, week2 } = getPayPeriodDays(period);

  return (
    <div className="ts-page">
      <div className="ts-content">

        {/* ── Header ── */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px", borderBottom: `3px solid ${NAVY}`, paddingBottom: "4px", marginBottom: "3px" }}>
          <img
            src={ctstateLogo}
            alt="CT State Community College"
            style={{ height: "34px", width: "auto", flexShrink: 0 }}
          />
          <div style={{ flex: 1, textAlign: "center" }}>
            <div style={{ fontSize: "10pt", fontWeight: "900", letterSpacing: "0.03em", color: NAVY, lineHeight: 1.2 }}>
              NAUGATUCK VALLEY COMMUNITY COLLEGE
            </div>
            <div style={{ fontSize: "6.5pt", fontWeight: "700", letterSpacing: "0.07em", marginTop: "2px", color: "#222" }}>
              FOR EMPLOYEES PAID WITH FUNDS FROM FEDERAL GRANTS
            </div>
          </div>
          <div style={{ textAlign: "right", fontSize: "7pt", minWidth: "56px", lineHeight: 1.4, flexShrink: 0 }}>
            <div style={{ fontWeight: "bold", fontSize: "8.5pt", color: NAVY }}>FY 2027</div>
            <div style={{ color: "#444" }}>PP {period.id} / 26</div>
          </div>
        </div>

        {/* ── Employee info ── */}
        <table className="ts-table" style={{ marginBottom: "2px" }}>
          <tbody>
            <tr>
              <td style={{ ...cell, width: "36%" }}><div style={lbl}>Employee Name</div><Val v={student.name} /></td>
              <td style={{ ...cell, width: "36%" }}><div style={lbl}>Department / Program</div><Val v={student.department} /></td>
              <td style={{ ...cell, width: "28%" }}><div style={lbl}>Work Location / School</div><Val v={student.workLocation} /></td>
            </tr>
            <tr>
              <td style={cell} colSpan={3}><div style={lbl}>Pay Period</div><div style={val}>{formatRangeFull(period)}</div></td>
            </tr>
            <tr>
              <td style={cell} colSpan={3}>
                <span style={{ fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.05em", marginRight: "8px", fontSize: "6pt" }}>
                  Type of Employee:
                </span>
                <span style={{ marginRight: "2px", fontSize: "9pt" }}>☑</span>
                <span style={{ fontWeight: "bold", marginRight: "14px", fontSize: "7.5pt" }}>Student</span>
                <span style={{ marginRight: "2px", fontSize: "9pt" }}>☐</span>
                <span style={{ marginRight: "14px", fontSize: "7.5pt" }}>Educational Assistant</span>
                <span style={{ marginRight: "2px", fontSize: "9pt" }}>☐</span>
                <span style={{ marginRight: "14px", fontSize: "7.5pt" }}>Full Time</span>
                <span style={{ marginRight: "2px", fontSize: "9pt" }}>☐</span>
                <span style={{ fontSize: "7.5pt" }}>Part Time</span>
              </td>
            </tr>
          </tbody>
        </table>

        {/* ── Time entry table ── */}
        <table className="ts-table" style={{ marginBottom: "2px" }}>
          <thead>
            <tr>
              <th style={{ width: "7%" }}>Date</th>
              <th style={{ width: "7%" }}>Day</th>
              <th style={{ width: "8%" }}>In</th>
              <th style={{ width: "8%" }}>Out</th>
              <th style={{ width: "7%" }}>Meal</th>
              <th style={{ width: "8%" }}>In</th>
              <th style={{ width: "8%" }}>Out</th>
              <th style={{ width: "10%" }}>Total Hrs</th>
              <th style={{ width: "37%" }}>Comments</th>
            </tr>
          </thead>
          <tbody>
            {week1.map((day, i) => (
              <tr key={`w1-${i}`} className="ts-row">
                <td style={{ ...cell, textAlign: "center", fontWeight: "bold", fontSize: "7.5pt" }}>{day.formatted}</td>
                <td style={{ ...cell, textAlign: "center", fontWeight: "bold", fontSize: "7.5pt" }}>{day.dayName}</td>
                <td style={cell} /><td style={cell} /><td style={cell} /><td style={cell} /><td style={cell} /><td style={cell} /><td style={cell} />
              </tr>
            ))}
            <tr className="ts-subtotal">
              <td colSpan={7} style={{ ...subCell, textAlign: "right", paddingRight: "5px", fontSize: "6pt", letterSpacing: "0.05em" }}>
                WEEK 1 SUB TOTAL:
              </td>
              <td style={subCell} />
              <td style={subCell} />
            </tr>
            {week2.map((day, i) => (
              <tr key={`w2-${i}`} className="ts-row ts-week2">
                <td style={{ ...cell, textAlign: "center", fontWeight: "bold", fontSize: "7.5pt" }}>{day.formatted}</td>
                <td style={{ ...cell, textAlign: "center", fontWeight: "bold", fontSize: "7.5pt" }}>{day.dayName}</td>
                <td style={cell} /><td style={cell} /><td style={cell} /><td style={cell} /><td style={cell} /><td style={cell} /><td style={cell} />
              </tr>
            ))}
            <tr className="ts-subtotal">
              <td colSpan={7} style={{ ...subCell, textAlign: "right", paddingRight: "5px", fontSize: "6pt", letterSpacing: "0.05em" }}>
                WEEK 2 SUB TOTAL:
              </td>
              <td style={subCell} />
              <td style={subCell} />
            </tr>
          </tbody>
        </table>

        {/* ── Activities row ── */}
        <div style={{ border: "1px solid #000", padding: "3px 5px", marginBottom: "2px", fontSize: "7.5pt" }}>
          <span style={{ fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.07em", fontSize: "5.5pt", marginRight: "12px" }}>
            Activities:
          </span>
          <span style={{ marginRight: "16px" }}>
            <span style={{ fontSize: "5.5pt", fontWeight: "bold", textTransform: "uppercase", color: "#555" }}>Account No.:</span>{" "}
            <strong>HB 3500</strong>
          </span>
          <span style={{ marginRight: "16px" }}>
            <span style={{ fontSize: "5.5pt", fontWeight: "bold", textTransform: "uppercase", color: "#555" }}>Grant Title:</span>{" "}
            <strong>WIOA Out Of School</strong>
          </span>
          <span>
            <span style={{ fontSize: "5.5pt", fontWeight: "bold", textTransform: "uppercase", color: "#555" }}>Percentage:</span>{" "}
            <strong>100%</strong>
          </span>
        </div>

        {/* ── Total hours for pay period ── */}
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "3px" }}>
          <div style={{ border: `2px solid ${NAVY}`, padding: "3px 8px", display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "7pt", fontWeight: "900", textTransform: "uppercase", letterSpacing: "0.07em", color: NAVY }}>
              Total Hours For Pay Period:
            </span>
            <div style={{ borderBottom: "1.5px solid #000", width: "72px" }}>&nbsp;</div>
          </div>
        </div>

        {/* ── Certification text ── */}
        <div style={{ border: "1px solid #000", borderBottom: "none", padding: "4px 5px 2px" }}>
          <p style={{ fontSize: "6pt", fontStyle: "italic", lineHeight: 1.35, margin: 0 }}>
            I certify that the above time record is correct and that I worked the hours stated herein in the performance
            of my official duties. I further certify that I did not receive payment from any other source for these hours.
          </p>
        </div>

        {/* ── Signature blocks — stacked vertically ── */}
        <div style={{ border: "1px solid #000", borderTop: "none", marginBottom: "3px" }}>
          <SigRow title="Employee" />
          <SigRow title="Supervisor" />
          <SigRow title="Educational Assistant" />
          <SigRow title="WAVE Coordinator" showTotalHours />
        </div>

        {/* ── FOR PAYROLL OFFICE ONLY ── */}
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <div style={{ border: `2px solid ${NAVY}`, minWidth: "220px" }}>
            <div style={{
              backgroundColor: NAVY,
              WebkitPrintColorAdjust: "exact",
              printColorAdjust: "exact",
              color: "white",
              fontSize: "6pt",
              fontWeight: "900",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              textAlign: "center",
              padding: "2px 6px",
            }}>
              For Payroll Office Only
            </div>
            <div style={{ display: "flex", gap: "8px", padding: "3px 6px 4px" }}>
              <div style={{ flex: 1 }}>
                <div style={{ borderBottom: "1px solid #000", marginBottom: "1px" }}>&nbsp;</div>
                <div style={{ fontSize: "5pt", fontWeight: "bold", textTransform: "uppercase", color: "#777" }}>Date Received</div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ borderBottom: "1px solid #000", marginBottom: "1px" }}>&nbsp;</div>
                <div style={{ fontSize: "5pt", fontWeight: "bold", textTransform: "uppercase", color: "#777" }}>Processed By</div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Footer ── */}
        <div style={{ textAlign: "right", fontSize: "4.5pt", color: "#ccc", marginTop: "2px" }}>
          Nova Systems
        </div>

      </div>
    </div>
  );
}
