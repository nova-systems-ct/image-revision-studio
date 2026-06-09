import { useState, useEffect, useRef, type FormEvent } from "react";

const SESSION_KEY = "nvcc-auth";
const PASSWORD = import.meta.env.VITE_SUPERVISOR_PASSWORD || "WAVE2024";

interface Props {
  children: React.ReactNode;
}

export function LoginGate({ children }: Props) {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem(SESSION_KEY) === "1");
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const [shake, setShake] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!authed) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [authed]);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (input === PASSWORD) {
      sessionStorage.setItem(SESSION_KEY, "1");
      setAuthed(true);
    } else {
      setError("Incorrect password. Please try again.");
      setShake(true);
      setInput("");
      setTimeout(() => {
        setShake(false);
        inputRef.current?.focus();
      }, 600);
    }
  }

  if (authed) return <>{children}</>;

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #1B3A6B 0%, #0f2347 100%)",
        padding: "1rem",
      }}
    >
      {/* CT State Logo */}
      <div style={{ marginBottom: "1.5rem" }}>
        <svg width="56" height="58" viewBox="0 0 42 44" xmlns="http://www.w3.org/2000/svg">
          <path d="M2,2 L40,2 L40,28 L21,42 L2,28 Z" fill="white" opacity="0.12" />
          <path d="M2,2 L40,2 L40,28 L21,42 L2,28 Z" fill="none" stroke="white" strokeWidth="1.5" />
          <rect x="2" y="17" width="38" height="2.5" fill="white" opacity="0.8" />
          <text x="21" y="16" textAnchor="middle" fill="white" fontSize="10" fontWeight="900" fontFamily="Arial,sans-serif">CT</text>
          <text x="21" y="29" textAnchor="middle" fill="#C5A028" fontSize="6.5" fontWeight="700" fontFamily="Arial,sans-serif" letterSpacing="1.5">STATE</text>
        </svg>
      </div>

      <div
        style={{
          background: "white",
          borderRadius: "16px",
          padding: "2.5rem 2rem",
          width: "100%",
          maxWidth: "380px",
          boxShadow: "0 25px 60px rgba(0,0,0,0.35)",
        }}
      >
        <h1
          style={{
            color: "#1B3A6B",
            fontSize: "1.35rem",
            fontWeight: 800,
            letterSpacing: "-0.02em",
            marginBottom: "0.25rem",
            fontFamily: "'Plus Jakarta Sans', Inter, sans-serif",
          }}
        >
          WAVE Program Portal
        </h1>
        <p
          style={{
            color: "#6b7280",
            fontSize: "0.85rem",
            marginBottom: "1.75rem",
          }}
        >
          CT State Naugatuck Valley · WIOA Out Of School
        </p>

        <form onSubmit={handleSubmit}>
          <label
            htmlFor="pwd"
            style={{
              display: "block",
              fontSize: "0.75rem",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.07em",
              color: "#374151",
              marginBottom: "0.4rem",
            }}
          >
            Supervisor Password
          </label>
          <input
            id="pwd"
            ref={inputRef}
            type="password"
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              setError("");
            }}
            placeholder="Enter password"
            autoComplete="current-password"
            style={{
              width: "100%",
              padding: "0.65rem 0.875rem",
              borderRadius: "8px",
              border: error ? "2px solid #dc2626" : "1.5px solid #d1d5db",
              fontSize: "0.95rem",
              outline: "none",
              marginBottom: "0.5rem",
              boxSizing: "border-box",
              animation: shake ? "shake 0.5s cubic-bezier(.36,.07,.19,.97)" : "none",
              transition: "border-color 0.15s",
            }}
          />
          {error && (
            <p
              style={{
                color: "#dc2626",
                fontSize: "0.78rem",
                marginBottom: "0.75rem",
                marginTop: "-0.1rem",
              }}
            >
              {error}
            </p>
          )}
          <button
            type="submit"
            style={{
              width: "100%",
              padding: "0.7rem",
              borderRadius: "8px",
              background: "#1B3A6B",
              color: "white",
              fontWeight: 700,
              fontSize: "0.9rem",
              border: "none",
              cursor: "pointer",
              marginTop: error ? "0" : "0.5rem",
              letterSpacing: "0.03em",
              transition: "background 0.15s",
            }}
            onMouseOver={(e) => ((e.target as HTMLButtonElement).style.background = "#2a5298")}
            onMouseOut={(e) => ((e.target as HTMLButtonElement).style.background = "#1B3A6B")}
          >
            Sign In
          </button>
        </form>
      </div>

      <p
        style={{
          color: "rgba(255,255,255,0.35)",
          fontSize: "0.72rem",
          marginTop: "1.5rem",
        }}
      >
        Naugatuck Valley Community College · CT State
      </p>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 50%, 90% { transform: translateX(-6px); }
          30%, 70% { transform: translateX(6px); }
        }
      `}</style>
    </div>
  );
}
