import { useState, useEffect, useRef, type FormEvent } from "react";

const SESSION_KEY = "nvcc-auth";
const PASSWORD = import.meta.env.VITE_SUPERVISOR_PASSWORD || "WAVE2024";

export function LoginGate({ children }: { children: React.ReactNode }) {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem(SESSION_KEY) === "1");
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const [shake, setShake] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!authed) setTimeout(() => inputRef.current?.focus(), 80);
  }, [authed]);

  function submit(e: FormEvent) {
    e.preventDefault();
    if (input === PASSWORD) {
      sessionStorage.setItem(SESSION_KEY, "1");
      setAuthed(true);
    } else {
      setError("Incorrect password.");
      setShake(true);
      setInput("");
      setTimeout(() => { setShake(false); inputRef.current?.focus(); }, 600);
    }
  }

  if (authed) return <>{children}</>;

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(160deg, #0a0f1e 0%, #1B3A6B 100%)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "'Inter', system-ui, sans-serif",
      WebkitFontSmoothing: "antialiased",
      padding: "1.5rem",
    }}>

      {/* Logo */}
      <div style={{ marginBottom: "2rem", display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" }}>
        <svg width="52" height="54" viewBox="0 0 42 44" xmlns="http://www.w3.org/2000/svg">
          <path d="M2,2 L40,2 L40,28 L21,42 L2,28 Z" fill="rgba(255,255,255,0.08)" />
          <path d="M2,2 L40,2 L40,28 L21,42 L2,28 Z" fill="none" stroke="#D4A030" strokeWidth="1.5" />
          <rect x="2" y="17" width="38" height="2" fill="rgba(255,255,255,0.6)" />
          <text x="21" y="15.5" textAnchor="middle" fill="white" fontSize="10" fontWeight="900" fontFamily="Arial,sans-serif">CT</text>
          <text x="21" y="28.5" textAnchor="middle" fill="#D4A030" fontSize="6" fontWeight="700" fontFamily="Arial,sans-serif" letterSpacing="2">STATE</text>
        </svg>
        <div style={{ textAlign: "center" }}>
          <div style={{ color: "white", fontSize: "1.5rem", fontWeight: 800, letterSpacing: "-0.03em", fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif" }}>
            WAVE Program Portal
          </div>
          <div style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.8rem", marginTop: "0.25rem", letterSpacing: "0.06em", textTransform: "uppercase" }}>
            CT State Naugatuck Valley
          </div>
        </div>
      </div>

      {/* Gold rule */}
      <div style={{ width: "40px", height: "2px", background: "#D4A030", borderRadius: "2px", marginBottom: "2rem" }} />

      {/* Form */}
      <form onSubmit={submit} style={{ width: "100%", maxWidth: "320px" }}>
        <label style={{
          display: "block",
          fontSize: "0.7rem",
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.1em",
          color: "rgba(255,255,255,0.5)",
          marginBottom: "0.5rem",
        }}>
          Supervisor Password
        </label>
        <input
          id="pwd"
          ref={inputRef}
          type="password"
          value={input}
          onChange={(e) => { setInput(e.target.value); setError(""); }}
          placeholder="Enter password"
          autoComplete="current-password"
          style={{
            width: "100%",
            padding: "0.75rem 1rem",
            borderRadius: "8px",
            border: error ? "1.5px solid #ef4444" : "1.5px solid rgba(255,255,255,0.12)",
            background: "rgba(255,255,255,0.06)",
            color: "white",
            fontSize: "0.95rem",
            outline: "none",
            boxSizing: "border-box",
            animation: shake ? "shake 0.5s cubic-bezier(.36,.07,.19,.97)" : "none",
            transition: "border-color 0.15s, box-shadow 0.15s",
          }}
          onFocus={(e) => { (e.target as HTMLInputElement).style.borderColor = "#D4A030"; (e.target as HTMLInputElement).style.boxShadow = "0 0 0 3px rgba(212,160,48,0.15)"; }}
          onBlur={(e) => { (e.target as HTMLInputElement).style.borderColor = error ? "#ef4444" : "rgba(255,255,255,0.12)"; (e.target as HTMLInputElement).style.boxShadow = "none"; }}
        />
        {error && (
          <p style={{ color: "#fca5a5", fontSize: "0.78rem", marginTop: "0.4rem" }}>{error}</p>
        )}
        <button
          type="submit"
          style={{
            width: "100%",
            padding: "0.75rem",
            marginTop: "1rem",
            borderRadius: "8px",
            background: "#D4A030",
            color: "#0a0f1e",
            fontWeight: 800,
            fontSize: "0.9rem",
            border: "none",
            cursor: "pointer",
            letterSpacing: "0.04em",
            fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif",
            transition: "opacity 0.15s",
          }}
          onMouseOver={(e) => ((e.target as HTMLButtonElement).style.opacity = "0.88")}
          onMouseOut={(e) => ((e.target as HTMLButtonElement).style.opacity = "1")}
        >
          Sign In
        </button>
      </form>

      <p style={{ color: "rgba(255,255,255,0.2)", fontSize: "0.68rem", marginTop: "2.5rem", letterSpacing: "0.04em" }}>
        WIOA Out Of School · HB 3500 · FY 2027
      </p>

      <style>{`
        @keyframes shake {
          0%,100%{transform:translateX(0)}
          10%,50%,90%{transform:translateX(-5px)}
          30%,70%{transform:translateX(5px)}
        }
        input::placeholder { color: rgba(255,255,255,0.25); }
      `}</style>
    </div>
  );
}
