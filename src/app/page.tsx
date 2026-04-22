"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const handleSignIn = () => {
    router.push("/dashboard");
  };

  const handleSSOSignIn = () => {
    router.push("/dashboard");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #1A1A2E 0%, #0D0D1A 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        position: "relative",
        fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
      }}
    >
      {/* Above-card branding */}
      <div style={{ textAlign: "center", marginBottom: "32px" }}>
        <h1
          style={{
            fontSize: "36px",
            fontWeight: "800",
            color: "#FFFFFF",
            letterSpacing: "0.15em",
            margin: "0 0 8px 0",
            textTransform: "uppercase",
          }}
        >
          FORESIGHT 360
        </h1>
        <p
          style={{
            fontSize: "15px",
            color: "#9CA3AF",
            margin: "0 0 6px 0",
            letterSpacing: "0.04em",
          }}
        >
          Event-Driven Forecasting Platform
        </p>
        <p
          style={{
            fontSize: "11px",
            color: "#6B7280",
            margin: "0",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
          }}
        >
          Powered by Chryselys
        </p>
      </div>

      {/* Login card */}
      <div
        style={{
          width: "420px",
          maxWidth: "100%",
          backgroundColor: "#FFFFFF",
          borderRadius: "12px",
          boxShadow:
            "0 25px 60px rgba(0, 0, 0, 0.5), 0 4px 16px rgba(0, 0, 0, 0.3)",
          padding: "40px",
          boxSizing: "border-box",
        }}
      >
        {/* Card header */}
        <div style={{ marginBottom: "28px" }}>
          <h2
            style={{
              fontSize: "22px",
              fontWeight: "700",
              color: "#111827",
              margin: "0 0 4px 0",
            }}
          >
            Sign In
          </h2>
          <p style={{ fontSize: "13px", color: "#6B7280", margin: "0" }}>
            Access your forecasting workspace
          </p>
        </div>

        {/* Email field */}
        <div style={{ marginBottom: "16px" }}>
          <label
            style={{
              display: "block",
              fontSize: "13px",
              fontWeight: "500",
              color: "#374151",
              marginBottom: "6px",
            }}
          >
            Email Address
          </label>
          <input
            type="email"
            placeholder="user@gilead.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: "100%",
              padding: "10px 14px",
              fontSize: "14px",
              border: "1px solid #D1D5DB",
              borderRadius: "7px",
              outline: "none",
              boxSizing: "border-box",
              color: "#111827",
              backgroundColor: "#FAFAFA",
              transition: "border-color 0.15s",
            }}
            onFocus={(e) => (e.target.style.borderColor = "#C80037")}
            onBlur={(e) => (e.target.style.borderColor = "#D1D5DB")}
          />
        </div>

        {/* Password field */}
        <div style={{ marginBottom: "16px" }}>
          <label
            style={{
              display: "block",
              fontSize: "13px",
              fontWeight: "500",
              color: "#374151",
              marginBottom: "6px",
            }}
          >
            Password
          </label>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: "100%",
              padding: "10px 14px",
              fontSize: "14px",
              border: "1px solid #D1D5DB",
              borderRadius: "7px",
              outline: "none",
              boxSizing: "border-box",
              color: "#111827",
              backgroundColor: "#FAFAFA",
              transition: "border-color 0.15s",
            }}
            onFocus={(e) => (e.target.style.borderColor = "#C80037")}
            onBlur={(e) => (e.target.style.borderColor = "#D1D5DB")}
          />
        </div>

        {/* Remember me + Forgot password */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "24px",
          }}
        >
          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontSize: "13px",
              color: "#374151",
              cursor: "pointer",
              userSelect: "none",
            }}
          >
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              style={{
                width: "15px",
                height: "15px",
                accentColor: "#C80037",
                cursor: "pointer",
              }}
            />
            Remember me
          </label>
          <a
            href="#"
            style={{
              fontSize: "13px",
              color: "#C80037",
              textDecoration: "none",
              fontWeight: "500",
            }}
            onMouseEnter={(e) =>
              ((e.target as HTMLElement).style.textDecoration = "underline")
            }
            onMouseLeave={(e) =>
              ((e.target as HTMLElement).style.textDecoration = "none")
            }
          >
            Forgot password?
          </a>
        </div>

        {/* Sign In button */}
        <button
          onClick={handleSignIn}
          style={{
            width: "100%",
            padding: "12px",
            backgroundColor: "#C80037",
            color: "#FFFFFF",
            fontSize: "15px",
            fontWeight: "600",
            border: "none",
            borderRadius: "7px",
            cursor: "pointer",
            letterSpacing: "0.02em",
            transition: "background-color 0.15s, transform 0.1s",
            marginBottom: "20px",
          }}
          onMouseEnter={(e) =>
            ((e.target as HTMLButtonElement).style.backgroundColor = "#A8002E")
          }
          onMouseLeave={(e) =>
            ((e.target as HTMLButtonElement).style.backgroundColor = "#C80037")
          }
          onMouseDown={(e) =>
            ((e.target as HTMLButtonElement).style.transform = "scale(0.99)")
          }
          onMouseUp={(e) =>
            ((e.target as HTMLButtonElement).style.transform = "scale(1)")
          }
        >
          Sign In
        </button>

        {/* Divider */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "20px",
          }}
        >
          <div
            style={{ flex: 1, height: "1px", backgroundColor: "#E5E7EB" }}
          />
          <span style={{ fontSize: "12px", color: "#9CA3AF", fontWeight: "500" }}>
            or
          </span>
          <div
            style={{ flex: 1, height: "1px", backgroundColor: "#E5E7EB" }}
          />
        </div>

        {/* SSO button */}
        <button
          onClick={handleSSOSignIn}
          style={{
            width: "100%",
            padding: "11px",
            backgroundColor: "transparent",
            color: "#374151",
            fontSize: "14px",
            fontWeight: "500",
            border: "1.5px solid #D1D5DB",
            borderRadius: "7px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            transition: "border-color 0.15s, background-color 0.15s",
          }}
          onMouseEnter={(e) => {
            const btn = e.currentTarget as HTMLButtonElement;
            btn.style.borderColor = "#9CA3AF";
            btn.style.backgroundColor = "#F9FAFB";
          }}
          onMouseLeave={(e) => {
            const btn = e.currentTarget as HTMLButtonElement;
            btn.style.borderColor = "#D1D5DB";
            btn.style.backgroundColor = "transparent";
          }}
        >
          <Lock size={15} color="#6B7280" />
          Sign in with Gilead SSO
        </button>
      </div>

      {/* Footer */}
      <div style={{ marginTop: "28px", textAlign: "center" }}>
        <p style={{ fontSize: "11px", color: "#4B5563", margin: "0" }}>
          Foresight 360 v2.0&nbsp;&nbsp;|&nbsp;&nbsp;Gilead Sciences x Chryselys&nbsp;&nbsp;|&nbsp;&nbsp;2026
        </p>
      </div>

      {/* Bottom-right help link */}
      <div
        style={{
          position: "fixed",
          bottom: "20px",
          right: "24px",
        }}
      >
        <a
          href="#"
          style={{
            fontSize: "12px",
            color: "#6B7280",
            textDecoration: "none",
          }}
          onMouseEnter={(e) => {
            (e.target as HTMLElement).style.color = "#9CA3AF";
            (e.target as HTMLElement).style.textDecoration = "underline";
          }}
          onMouseLeave={(e) => {
            (e.target as HTMLElement).style.color = "#6B7280";
            (e.target as HTMLElement).style.textDecoration = "none";
          }}
        >
          Need help?
        </a>
      </div>
    </div>
  );
}
