"use client";

import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  LabelList,
} from "recharts";
import { Lock, ArrowDown, AlertTriangle, ChevronDown, ChevronUp, Send } from "lucide-react";

// ─── Color palette ────────────────────────────────────────────────────────────
const C = {
  red: "#C80037",
  gray: "#646569",
  navy: "#1A1A2E",
  bg: "#F5F5F5",
  success: "#28A745",
  warning: "#FFC107",
  text: "#2D2D2D",
};

// ─── Types ────────────────────────────────────────────────────────────────────
interface DriverCard {
  id: string;
  name: string;
  direction: "NEGATIVE" | "POSITIVE";
  functions: string[];
  magnitude: string;
  pct: string;
  rootCause: string;
  status: "Identified" | "Action Planned" | "Mitigated";
}

// ─── Waterfall data ───────────────────────────────────────────────────────────
// Y axis scale-breaks at $580M. Endpoint bars float from 580 to their total
// so deltas in the $3M–$8M range remain clearly visible.
const Y_BREAK = 580;
const WATERFALL_DATA = [
  { label: "Q1 Forecast",       chartBase: Y_BREAK, chartValue: 612 - Y_BREAK, total: 612, impact: 0,  color: C.gray,    isEndpoint: true  },
  { label: "Rx Ramp Shortfall", chartBase: 604,     chartValue: 8,              total: 604, impact: -8, color: C.red,     isEndpoint: false },
  { label: "ESI Tier Change",   chartBase: 598,     chartValue: 6,              total: 598, impact: -6, color: C.red,     isEndpoint: false },
  { label: "G2N Erosion",       chartBase: 594,     chartValue: 4,              total: 594, impact: -4, color: C.red,     isEndpoint: false },
  { label: "Stockout Impact",   chartBase: 591,     chartValue: 3,              total: 591, impact: -3, color: C.red,     isEndpoint: false },
  { label: "Aetna Win",         chartBase: 591,     chartValue: 4,              total: 595, impact: +4, color: C.success, isEndpoint: false },
  { label: "DTC Lift",          chartBase: 595,     chartValue: 3,              total: 598, impact: +3, color: C.success, isEndpoint: false },
  { label: "Q1 Actuals",        chartBase: Y_BREAK, chartValue: 598 - Y_BREAK, total: 598, impact: 0,  color: C.red,     isEndpoint: true  },
];

// ─── Driver cards ─────────────────────────────────────────────────────────────
const DRIVERS: DriverCard[] = [
  {
    id: "d1",
    name: "Slower Rx Ramp — Treatment-Naive",
    direction: "NEGATIVE",
    functions: ["Marketing", "Sales / Field"],
    magnitude: "-$8M",
    pct: "-1.3%",
    rootCause:
      "Q1 HCP detailing fell 12% below plan in 3 territories. NRx starts in treatment-naive patients tracking 6% below model assumption.",
    status: "Action Planned",
  },
  {
    id: "d2",
    name: "Express Scripts Tier Change",
    direction: "NEGATIVE",
    functions: ["Market Access"],
    magnitude: "-$6M",
    pct: "-1.0%",
    rootCause:
      "Jan 1 formulary update moved Biktarvy from Tier 1 to Tier 2 for ESI commercial lives. Patient cost share increased $15, impacting new starts.",
    status: "Identified",
  },
  {
    id: "d3",
    name: "Higher Gross-to-Net Erosion",
    direction: "NEGATIVE",
    functions: ["Finance"],
    magnitude: "-$4M",
    pct: "-0.7%",
    rootCause:
      "Rebate accruals running 180bps above forecast assumption due to Medicaid mix shift and higher-than-expected 340B utilization.",
    status: "Identified",
  },
  {
    id: "d4",
    name: "Southern Region Stockout (Feb)",
    direction: "NEGATIVE",
    functions: ["Supply Chain"],
    magnitude: "-$3M",
    pct: "-0.5%",
    rootCause:
      "Distribution center allocation gap in Atlanta hub led to 11-day stockout across 340 pharmacies in Feb. Recovery completed mid-March.",
    status: "Mitigated",
  },
  {
    id: "d5",
    name: "Aetna Formulary Win",
    direction: "POSITIVE",
    functions: ["Market Access"],
    magnitude: "+$4M",
    pct: "+0.7%",
    rootCause:
      "Formulary placement secured 3 weeks ahead of modeled date. Covered lives onboarded faster than assumption.",
    status: "Mitigated",
  },
  {
    id: "d6",
    name: "DTC Campaign Lift",
    direction: "POSITIVE",
    functions: ["Marketing"],
    magnitude: "+$3M",
    pct: "+0.5%",
    rootCause:
      "Q1 DTC campaign outperformed benchmark by 22%. Attributed NRx lift above model in 5 key DMAs.",
    status: "Mitigated",
  },
];

// ─── Path-to-recovery chart data ──────────────────────────────────────────────
const RECOVERY_DATA = [
  { month: "Jan", forecast: 195, actual: 195,  simulated: 195  },
  { month: "Feb", forecast: 197, actual: 198,  simulated: 198  },
  { month: "Mar", forecast: 200, actual: 205,  simulated: 205  },
  { month: "Apr", forecast: 201, actual: 197,  simulated: 199  },
  { month: "May", forecast: 202, actual: 196,  simulated: 200  },
  { month: "Jun", forecast: 203, actual: 195,  simulated: 201  },
  { month: "Jul", forecast: 204, actual: 194,  simulated: 202  },
  { month: "Aug", forecast: 205, actual: 194,  simulated: 204  },
  { month: "Sep", forecast: 206, actual: 193,  simulated: 205  },
  { month: "Oct", forecast: 207, actual: null, simulated: 206  },
  { month: "Nov", forecast: 208, actual: null, simulated: 207  },
  { month: "Dec", forecast: 210, actual: null, simulated: 210  },
];

// ─── Shared label style ───────────────────────────────────────────────────────
const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: "11px",
  fontWeight: 600,
  color: C.gray,
  textTransform: "uppercase",
  letterSpacing: "0.06em",
  marginBottom: "5px",
};

// ─── Custom waterfall tooltip ─────────────────────────────────────────────────
function WaterfallTooltip({ active, payload, label }: {
  active?: boolean;
  payload?: Array<{ value: number; dataKey: string; payload: typeof WATERFALL_DATA[0] }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  const d = payload[0]?.payload;
  const displayLabel = label ?? "";
  return (
    <div
      style={{
        backgroundColor: "#FFFFFF",
        border: "1px solid #E5E7EB",
        borderRadius: "8px",
        padding: "10px 14px",
        fontSize: "12px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.10)",
        minWidth: "140px",
      }}
    >
      <p style={{ margin: "0 0 4px 0", fontWeight: 700, color: C.navy }}>{displayLabel}</p>
      <p style={{ margin: 0, color: d.color, fontWeight: 600 }}>${d.total}M</p>
      {!d.isEndpoint && (
        <p style={{ margin: "2px 0 0 0", color: C.gray, fontSize: "11px" }}>
          Impact: {d.impact > 0 ? "+" : ""}${d.impact}M
        </p>
      )}
    </div>
  );
}

// ─── Driver Card Component ────────────────────────────────────────────────────
function DriverCardItem({
  driver,
  expanded,
  onToggle,
}: {
  driver: DriverCard;
  expanded: boolean;
  onToggle: () => void;
}) {
  const isPositive = driver.direction === "POSITIVE";
  const statusColor =
    driver.status === "Mitigated"
      ? C.success
      : driver.status === "Action Planned"
      ? C.warning
      : C.gray;
  const statusBg =
    driver.status === "Mitigated"
      ? "#F0FFF4"
      : driver.status === "Action Planned"
      ? "#FFFBEB"
      : "#F5F5F5";

  return (
    <div
      style={{
        backgroundColor: "#FFFFFF",
        border: "1px solid #E5E7EB",
        borderRadius: "10px",
        overflow: "hidden",
        marginBottom: "10px",
        boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
        transition: "box-shadow 0.2s",
      }}
    >
      {/* Card header — always visible */}
      <button
        onClick={onToggle}
        style={{
          width: "100%",
          background: "none",
          border: "none",
          padding: "14px 16px",
          cursor: "pointer",
          textAlign: "left",
          display: "flex",
          flexDirection: "column",
          gap: "8px",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div style={{ flex: 1, marginRight: "12px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap", marginBottom: "5px" }}>
              <span
                style={{
                  fontSize: "10px",
                  fontWeight: 700,
                  padding: "2px 8px",
                  borderRadius: "20px",
                  backgroundColor: isPositive ? "#F0FFF4" : "#FFF5F7",
                  color: isPositive ? C.success : C.red,
                  border: `1px solid ${isPositive ? "#C3E6CB" : "#FFC0C9"}`,
                  letterSpacing: "0.06em",
                }}
              >
                {driver.direction}
              </span>
              {driver.functions.map((fn) => (
                <span
                  key={fn}
                  style={{
                    fontSize: "10px",
                    fontWeight: 600,
                    padding: "2px 8px",
                    borderRadius: "20px",
                    backgroundColor: "#F0F4FF",
                    color: "#3B52A0",
                    border: "1px solid #C7D2FE",
                  }}
                >
                  {fn}
                </span>
              ))}
            </div>
            <span style={{ fontSize: "13px", fontWeight: 700, color: C.navy }}>{driver.name}</span>
          </div>
          <div style={{ textAlign: "right", flexShrink: 0, display: "flex", alignItems: "center", gap: "8px" }}>
            <div>
              <div style={{ fontSize: "14px", fontWeight: 800, color: isPositive ? C.success : C.red }}>
                {driver.magnitude}
              </div>
              <div style={{ fontSize: "11px", color: C.gray, fontWeight: 600 }}>{driver.pct}</div>
            </div>
            <div style={{ color: C.gray, marginTop: "2px" }}>
              {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </div>
          </div>
        </div>
      </button>

      {/* Expanded detail */}
      {expanded && (
        <div
          style={{
            padding: "0 16px 16px 16px",
            borderTop: "1px solid #F0F0F0",
          }}
        >
          <p style={{ fontSize: "12px", color: C.gray, lineHeight: 1.6, margin: "12px 0 12px 0" }}>
            {driver.rootCause}
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px", flexWrap: "wrap" }}>
            <span style={{ fontSize: "11px", fontWeight: 600, color: C.gray }}>Status:</span>
            <span
              style={{
                fontSize: "11px",
                fontWeight: 700,
                padding: "3px 10px",
                borderRadius: "20px",
                backgroundColor: statusBg,
                color: statusColor,
                border: `1px solid ${statusColor}33`,
              }}
            >
              {driver.status}
            </span>
          </div>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            <button
              style={{
                fontSize: "12px",
                fontWeight: 600,
                padding: "6px 14px",
                borderRadius: "6px",
                cursor: "pointer",
                border: "1.5px solid #3B52A0",
                backgroundColor: "transparent",
                color: "#3B52A0",
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#F0F4FF"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent"; }}
            >
              View in Event Modeler
            </button>
            <button
              style={{
                fontSize: "12px",
                fontWeight: 600,
                padding: "6px 14px",
                borderRadius: "6px",
                cursor: "pointer",
                border: "1.5px solid #3B52A0",
                backgroundColor: "transparent",
                color: "#3B52A0",
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#F0F4FF"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent"; }}
            >
              Create Corrective Scenario
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function PerformancePulsePage() {
  const [activeRole, setActiveRole] = useState<string>("All");
  const [expandedDriver, setExpandedDriver] = useState<string | null>(null);
  const [whatIfInput, setWhatIfInput] = useState<string>("");
  const [showSimResult] = useState<boolean>(true);

  const roles = ["All", "Marketing", "Sales / Field", "Market Access", "Finance", "Supply Chain"];

  const functionMatchMap: Record<string, string[]> = {
    "Marketing": ["Marketing"],
    "Sales / Field": ["Sales / Field"],
    "Market Access": ["Market Access"],
    "Finance": ["Finance"],
    "Supply Chain": ["Supply Chain"],
    "All": [],
  };

  const filteredDrivers =
    activeRole === "All"
      ? DRIVERS
      : DRIVERS.filter((d) =>
          d.functions.some((fn) => functionMatchMap[activeRole]?.includes(fn))
        );

  const toggleDriver = (id: string) => {
    setExpandedDriver((prev) => (prev === id ? null : id));
  };

  return (
    <DashboardLayout breadcrumb={["Performance Pulse", "Biktarvy", "Q1 2026"]}>

      {/* ── Page Header + Role Indicator ── */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "18px",
        }}
      >
        <div>
          <h1
            style={{
              fontSize: "22px",
              fontWeight: 700,
              color: C.navy,
              margin: "0 0 4px 0",
              letterSpacing: "-0.01em",
            }}
          >
            Performance Pulse
          </h1>
          <p style={{ fontSize: "13px", color: C.gray, margin: 0 }}>
            Variance tracking, root cause attribution &amp; agentic recovery simulation — Biktarvy US
          </p>
        </div>

        {/* Role indicator pill */}
        <div style={{ position: "relative", display: "inline-block" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "7px",
              padding: "7px 14px",
              backgroundColor: "#FFFFFF",
              border: "1.5px solid #E5E7EB",
              borderRadius: "20px",
              fontSize: "12px",
              fontWeight: 600,
              color: C.navy,
              cursor: "default",
              boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
              userSelect: "none",
            }}
            title="Your role determines which variance drivers and actions are surfaced by default."
          >
            <Lock size={12} color={C.gray} />
            <span>Urvil Shah</span>
            <span style={{ color: C.gray, fontWeight: 400 }}>|</span>
            <span style={{ color: C.gray, fontWeight: 500 }}>Commercial Strategy</span>
          </div>
        </div>
      </div>

      {/* ── Filters Row ── */}
      <div
        style={{
          display: "flex",
          gap: "16px",
          alignItems: "flex-end",
          backgroundColor: "#FFFFFF",
          border: "1px solid #E5E7EB",
          borderRadius: "10px",
          padding: "14px 20px",
          marginBottom: "16px",
          flexWrap: "wrap",
        }}
      >
        {/* Dropdowns */}
        {[
          { label: "Brand", value: "Biktarvy" },
          { label: "Market", value: "United States" },
          { label: "Period", value: "Q1 2026 — Actuals through March" },
        ].map(({ label, value }) => (
          <div key={label} style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <label style={labelStyle}>{label}</label>
            <select
              defaultValue={value}
              style={{
                padding: "7px 28px 7px 12px",
                fontSize: "13px",
                fontWeight: 500,
                color: C.navy,
                backgroundColor: "#FFFFFF",
                border: "1.5px solid #E5E7EB",
                borderRadius: "7px",
                cursor: "pointer",
                appearance: "auto",
                minWidth: label === "Period" ? "240px" : "170px",
                fontFamily: "inherit",
              }}
            >
              <option>{value}</option>
            </select>
          </div>
        ))}

        {/* Divider */}
        <div
          style={{
            width: "1px",
            height: "44px",
            backgroundColor: "#E5E7EB",
            alignSelf: "flex-end",
            marginBottom: "2px",
          }}
        />

        {/* Role view toggle */}
        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          <label style={labelStyle}>Role View</label>
          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
            {roles.map((role) => {
              const isActive = activeRole === role;
              return (
                <button
                  key={role}
                  onClick={() => setActiveRole(role)}
                  style={{
                    padding: "6px 13px",
                    fontSize: "12px",
                    fontWeight: 600,
                    borderRadius: "20px",
                    cursor: "pointer",
                    border: isActive ? "none" : "1.5px solid #D1D5DB",
                    backgroundColor: isActive ? C.red : "transparent",
                    color: isActive ? "#FFFFFF" : C.gray,
                    transition: "all 0.15s",
                    letterSpacing: "0.01em",
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) (e.currentTarget as HTMLButtonElement).style.borderColor = "#9CA3AF";
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) (e.currentTarget as HTMLButtonElement).style.borderColor = "#D1D5DB";
                  }}
                >
                  {role}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── SECTION 2 — KPI Cards ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(5, 1fr)",
          gap: "12px",
          marginBottom: "20px",
        }}
      >
        {/* Card 1 — Actual Revenue */}
        <div
          style={{
            backgroundColor: "#FFFFFF",
            border: "1px solid #E5E7EB",
            borderRadius: "10px",
            padding: "18px 16px",
            boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
            transition: "transform 0.15s, box-shadow 0.15s",
            cursor: "default",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)";
            (e.currentTarget as HTMLDivElement).style.boxShadow = "0 6px 16px rgba(0,0,0,0.10)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
            (e.currentTarget as HTMLDivElement).style.boxShadow = "0 1px 4px rgba(0,0,0,0.05)";
          }}
        >
          <p style={{ fontSize: "11px", fontWeight: 600, color: C.gray, textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 10px 0" }}>
            Actual Revenue (Q1)
          </p>
          <p style={{ fontSize: "26px", fontWeight: 800, color: C.navy, margin: "0 0 4px 0", letterSpacing: "-0.02em" }}>
            $598M
          </p>
          <p style={{ fontSize: "11px", color: C.gray, margin: 0 }}>through March 31</p>
        </div>

        {/* Card 2 — Forecasted Revenue */}
        <div
          style={{
            backgroundColor: "#FFFFFF",
            border: "1px solid #E5E7EB",
            borderRadius: "10px",
            padding: "18px 16px",
            boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
            transition: "transform 0.15s, box-shadow 0.15s",
            cursor: "default",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)";
            (e.currentTarget as HTMLDivElement).style.boxShadow = "0 6px 16px rgba(0,0,0,0.10)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
            (e.currentTarget as HTMLDivElement).style.boxShadow = "0 1px 4px rgba(0,0,0,0.05)";
          }}
        >
          <p style={{ fontSize: "11px", fontWeight: 600, color: C.gray, textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 10px 0" }}>
            Forecasted Revenue (Q1)
          </p>
          <p style={{ fontSize: "26px", fontWeight: 800, color: C.navy, margin: "0 0 4px 0", letterSpacing: "-0.02em" }}>
            $612M
          </p>
          <p style={{ fontSize: "11px", color: C.gray, margin: 0 }}>as of Q1 model lock</p>
        </div>

        {/* Card 3 — Variance */}
        <div
          style={{
            backgroundColor: "#FFF5F7",
            border: "1px solid #FFC0C9",
            borderRadius: "10px",
            padding: "18px 16px",
            boxShadow: "0 1px 4px rgba(200,0,55,0.08)",
            transition: "transform 0.15s, box-shadow 0.15s",
            cursor: "default",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)";
            (e.currentTarget as HTMLDivElement).style.boxShadow = "0 6px 16px rgba(200,0,55,0.14)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
            (e.currentTarget as HTMLDivElement).style.boxShadow = "0 1px 4px rgba(200,0,55,0.08)";
          }}
        >
          <p style={{ fontSize: "11px", fontWeight: 600, color: C.red, textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 10px 0" }}>
            Variance
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px" }}>
            <ArrowDown size={18} color={C.red} strokeWidth={2.5} />
            <p style={{ fontSize: "26px", fontWeight: 800, color: C.red, margin: 0, letterSpacing: "-0.02em" }}>
              -$14M
            </p>
          </div>
          <p style={{ fontSize: "12px", color: C.red, fontWeight: 600, margin: 0 }}>−2.3% vs forecast</p>
        </div>

        {/* Card 4 — Run Rate */}
        <div
          style={{
            backgroundColor: "#FFFFFF",
            border: "1px solid #E5E7EB",
            borderRadius: "10px",
            padding: "18px 16px",
            boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
            transition: "transform 0.15s, box-shadow 0.15s",
            cursor: "default",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)";
            (e.currentTarget as HTMLDivElement).style.boxShadow = "0 6px 16px rgba(0,0,0,0.10)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
            (e.currentTarget as HTMLDivElement).style.boxShadow = "0 1px 4px rgba(0,0,0,0.05)";
          }}
        >
          <p style={{ fontSize: "11px", fontWeight: 600, color: C.gray, textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 10px 0" }}>
            Run Rate Forecast (FY)
          </p>
          <p style={{ fontSize: "26px", fontWeight: 800, color: C.navy, margin: "0 0 4px 0", letterSpacing: "-0.02em" }}>
            $2.34B
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            <AlertTriangle size={12} color={C.warning} />
            <p style={{ fontSize: "11px", color: C.gray, margin: 0 }}>vs $2.41B plan</p>
          </div>
        </div>

        {/* Card 5 — Gap to Close */}
        <div
          style={{
            backgroundColor: "#FFF5F7",
            border: "1px solid #FFC0C9",
            borderRadius: "10px",
            padding: "18px 16px",
            boxShadow: "0 1px 4px rgba(200,0,55,0.08)",
            transition: "transform 0.15s, box-shadow 0.15s",
            cursor: "default",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)";
            (e.currentTarget as HTMLDivElement).style.boxShadow = "0 6px 16px rgba(200,0,55,0.14)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
            (e.currentTarget as HTMLDivElement).style.boxShadow = "0 1px 4px rgba(200,0,55,0.08)";
          }}
        >
          <p style={{ fontSize: "11px", fontWeight: 600, color: C.red, textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 10px 0" }}>
            Gap to Close
          </p>
          <p style={{ fontSize: "26px", fontWeight: 800, color: C.red, margin: "0 0 4px 0", letterSpacing: "-0.02em" }}>
            $70M
          </p>
          <p style={{ fontSize: "11px", color: C.red, fontWeight: 600, margin: 0 }}>to hit annual target</p>
        </div>
      </div>

      {/* ── SECTION 3 — Two Columns ── */}
      <div style={{ display: "flex", gap: "16px", marginBottom: "20px", alignItems: "flex-start" }}>

        {/* LEFT 55% — Waterfall Chart */}
        <div
          style={{
            flex: "0 0 55%",
            backgroundColor: "#FFFFFF",
            border: "1px solid #E5E7EB",
            borderRadius: "10px",
            padding: "20px",
            boxSizing: "border-box",
            boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
          }}
        >
          <div style={{ marginBottom: "16px" }}>
            <h2 style={{ fontSize: "14px", fontWeight: 700, color: C.navy, margin: "0 0 3px 0" }}>
              Variance Waterfall
            </h2>
            <p style={{ fontSize: "12px", color: C.gray, margin: 0 }}>
              Q1 Variance Walk: Forecast to Actuals — Biktarvy (US)
            </p>
          </div>

          <div style={{ position: "relative" }}>
            <ResponsiveContainer width="100%" height={340}>
              <BarChart
                data={WATERFALL_DATA}
                margin={{ top: 28, right: 20, left: 8, bottom: 70 }}
                barSize={36}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" vertical={false} />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 10.5, fill: C.gray }}
                  axisLine={{ stroke: "#E5E7EB" }}
                  tickLine={false}
                  interval={0}
                  angle={-28}
                  textAnchor="end"
                  height={70}
                />
                <YAxis
                  domain={[Y_BREAK, 618]}
                  allowDataOverflow
                  tick={{ fontSize: 11, fill: C.gray }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v: number) => `$${v}M`}
                  ticks={[Y_BREAK, 590, 600, 610, 618]}
                />
                <Tooltip content={<WaterfallTooltip />} cursor={{ fill: "rgba(0,0,0,0.03)" }} />
                {/* invisible base bar */}
                <Bar dataKey="chartBase" stackId="a" fill="transparent" />
                {/* visible value bar with per-cell colors + value labels */}
                <Bar dataKey="chartValue" stackId="a" radius={[3, 3, 0, 0]}>
                  {WATERFALL_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                  <LabelList
                    dataKey="impact"
                    position="top"
                    style={{ fontSize: 11, fontWeight: 600 }}
                    content={(props: {
                      x?: number | string;
                      y?: number | string;
                      width?: number | string;
                      index?: number;
                    }) => {
                      const { x, y, width, index } = props;
                      if (index === undefined) return null;
                      const d = WATERFALL_DATA[index];
                      const cx = Number(x ?? 0) + Number(width ?? 0) / 2;
                      const cy = Number(y ?? 0) - 6;
                      if (d.isEndpoint) {
                        return (
                          <text x={cx} y={cy} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.navy}>
                            ${d.total}M
                          </text>
                        );
                      }
                      const sign = d.impact > 0 ? "+" : "";
                      return (
                        <text x={cx} y={cy} textAnchor="middle" fontSize={10.5} fontWeight={600} fill={d.color}>
                          {sign}${d.impact}M
                        </text>
                      );
                    }}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>

            {/* Scale-break indicator on Y axis */}
            <div
              style={{
                position: "absolute",
                left: 28,
                bottom: 72,
                width: "18px",
                height: "14px",
                pointerEvents: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg width="18" height="14" viewBox="0 0 18 14">
                {/* two short zigzag lines on the axis to indicate scale break */}
                <path d="M2 4 L7 2 L11 6 L16 4" stroke="#FFFFFF" strokeWidth="3" fill="none" />
                <path d="M2 10 L7 8 L11 12 L16 10" stroke="#FFFFFF" strokeWidth="3" fill="none" />
                <path d="M2 4 L7 2 L11 6 L16 4" stroke={C.gray} strokeWidth="1.2" fill="none" />
                <path d="M2 10 L7 8 L11 12 L16 10" stroke={C.gray} strokeWidth="1.2" fill="none" />
              </svg>
            </div>
          </div>

          {/* Legend + scale note */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "4px", paddingLeft: "8px", flexWrap: "wrap", gap: "12px" }}>
            <div style={{ display: "flex", gap: "18px", flexWrap: "wrap" }}>
              {[
                { color: C.gray, label: "Endpoint / Baseline" },
                { color: C.red, label: "Negative Driver" },
                { color: C.success, label: "Positive Driver" },
              ].map(({ color, label }) => (
                <div key={label} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <div style={{ width: "10px", height: "10px", borderRadius: "2px", backgroundColor: color }} />
                  <span style={{ fontSize: "11px", color: C.gray }}>{label}</span>
                </div>
              ))}
            </div>
            <span style={{ fontSize: "10.5px", color: C.gray, fontStyle: "italic" }}>
              Scale break: Y-axis starts at ${Y_BREAK}M to highlight driver detail
            </span>
          </div>
        </div>

        {/* RIGHT 45% — Driver Cards */}
        <div
          style={{
            flex: "1",
            minWidth: 0,
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
            <div>
              <h2 style={{ fontSize: "14px", fontWeight: 700, color: C.navy, margin: "0 0 2px 0" }}>
                Driver Detail Cards
              </h2>
              <p style={{ fontSize: "12px", color: C.gray, margin: 0 }}>
                {filteredDrivers.length} driver{filteredDrivers.length !== 1 ? "s" : ""} shown
                {activeRole !== "All" ? ` — ${activeRole}` : ""}
              </p>
            </div>
            {activeRole !== "All" && (
              <button
                onClick={() => setActiveRole("All")}
                style={{
                  fontSize: "11px",
                  fontWeight: 600,
                  padding: "4px 10px",
                  borderRadius: "6px",
                  cursor: "pointer",
                  border: "1.5px solid #E5E7EB",
                  backgroundColor: "transparent",
                  color: C.gray,
                }}
              >
                Show All
              </button>
            )}
          </div>

          {/* Scrollable cards */}
          <div style={{ maxHeight: "360px", overflowY: "auto", paddingRight: "2px" }}>
            {filteredDrivers.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "32px",
                  color: C.gray,
                  fontSize: "13px",
                  backgroundColor: "#FFFFFF",
                  border: "1px solid #E5E7EB",
                  borderRadius: "10px",
                }}
              >
                No drivers assigned to <strong>{activeRole}</strong> for this period.
              </div>
            ) : (
              filteredDrivers.map((driver) => (
                <DriverCardItem
                  key={driver.id}
                  driver={driver}
                  expanded={expandedDriver === driver.id}
                  onToggle={() => toggleDriver(driver.id)}
                />
              ))
            )}
          </div>
        </div>
      </div>

      {/* ── SECTION 4 — Agentic What-If Engine ── */}
      <div
        style={{
          backgroundColor: "#FFFFFF",
          border: "1px solid #E5E7EB",
          borderTopWidth: "3px",
          borderTopColor: C.red,
          borderRadius: "10px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
          overflow: "hidden",
        }}
      >
        {/* Engine header */}
        <div
          style={{
            padding: "18px 24px 14px 24px",
            borderBottom: "1px solid #F0F0F0",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <div>
            <h2 style={{ fontSize: "16px", fontWeight: 800, color: C.navy, margin: "0 0 4px 0", letterSpacing: "-0.01em" }}>
              Close the Gap — What-If Simulator
            </h2>
            <p style={{ fontSize: "12px", color: C.gray, margin: 0 }}>
              Explore which actions can recover the variance and get back to forecast
            </p>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              backgroundColor: "#FFF5F7",
              border: "1px solid #FFC0C9",
              borderRadius: "6px",
              padding: "5px 12px",
            }}
          >
            <div
              style={{
                width: "7px",
                height: "7px",
                borderRadius: "50%",
                backgroundColor: C.success,
                boxShadow: "0 0 0 2px #C3E6CB",
              }}
            />
            <span style={{ fontSize: "11px", fontWeight: 700, color: C.red }}>Agentic Engine Active</span>
          </div>
        </div>

        {/* Engine body — split left/right */}
        <div style={{ display: "flex", minHeight: "560px" }}>

          {/* LEFT 65% — Chat interface */}
          <div
            style={{
              flex: "0 0 65%",
              borderRight: "1px solid #F0F0F0",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Conversation area */}
            <div
              style={{
                flex: 1,
                overflowY: "auto",
                padding: "20px 24px",
                display: "flex",
                flexDirection: "column",
                gap: "16px",
              }}
            >
              {showSimResult && (
                <>
                  {/* User message 1 */}
                  <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <div
                      style={{
                        maxWidth: "75%",
                        backgroundColor: "#F0F0F0",
                        borderRadius: "12px 12px 2px 12px",
                        padding: "12px 16px",
                        fontSize: "13px",
                        color: C.navy,
                        lineHeight: 1.55,
                      }}
                    >
                      If we increase HCP detailing frequency by 20% in the underperforming Southern and Midwest territories for Q2-Q3, what happens to our full-year number?
                    </div>
                  </div>

                  {/* AI response 1 */}
                  <div style={{ display: "flex", justifyContent: "flex-start" }}>
                    <div
                      style={{
                        maxWidth: "85%",
                        backgroundColor: "#FFFFFF",
                        border: "1px solid #E5E7EB",
                        borderLeft: `3px solid ${C.red}`,
                        borderRadius: "2px 12px 12px 12px",
                        padding: "14px 18px",
                        fontSize: "13px",
                        color: C.text,
                        lineHeight: 1.65,
                        boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
                      }}
                    >
                      <p style={{ margin: "0 0 10px 0" }}>
                        Increasing detailing frequency by 20% in Southern + Midwest territories is projected to recover <strong>40–55%</strong> of the treatment-naive ramp gap.
                      </p>
                      <div
                        style={{
                          backgroundColor: "#F8FAFF",
                          border: "1px solid #E0E7FF",
                          borderRadius: "8px",
                          padding: "10px 14px",
                          marginBottom: "10px",
                        }}
                      >
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px 16px" }}>
                          {[
                            { label: "Estimated recovery", value: "+$3.2M to +$4.4M" },
                            { label: "Revised FY run rate", value: "$2.37B" },
                            { label: "Remaining gap to forecast", value: "$40M–$37M" },
                            { label: "Confidence", value: "Medium" },
                          ].map(({ label, value }) => (
                            <div key={label}>
                              <div style={{ fontSize: "10px", color: C.gray, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</div>
                              <div style={{ fontSize: "13px", fontWeight: 700, color: C.navy }}>{value}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                      <p style={{ margin: "0 0 12px 0", fontSize: "12px", color: C.gray }}>
                        This alone won&apos;t close the gap. Combining with a co-pay card enhancement for ESI Tier 2 patients could add another $2M–$3M.
                      </p>
                      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                        {["Model This as Scenario", "Add to Event Modeler", "See Assumptions"].map((btn) => (
                          <button
                            key={btn}
                            style={{
                              fontSize: "11px",
                              fontWeight: 600,
                              padding: "5px 12px",
                              borderRadius: "6px",
                              cursor: "pointer",
                              border: "1.5px solid #3B52A0",
                              backgroundColor: "transparent",
                              color: "#3B52A0",
                              transition: "background 0.15s",
                            }}
                            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#F0F4FF"; }}
                            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent"; }}
                          >
                            {btn}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* User message 2 */}
                  <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <div
                      style={{
                        maxWidth: "75%",
                        backgroundColor: "#F0F0F0",
                        borderRadius: "12px 12px 2px 12px",
                        padding: "12px 16px",
                        fontSize: "13px",
                        color: C.navy,
                        lineHeight: 1.55,
                      }}
                    >
                      What if we also run a 90-day co-pay assistance program for patients on Express Scripts plans where Biktarvy moved to Tier 2?
                    </div>
                  </div>

                  {/* AI response 2 */}
                  <div style={{ display: "flex", justifyContent: "flex-start" }}>
                    <div
                      style={{
                        maxWidth: "85%",
                        backgroundColor: "#FFFFFF",
                        border: "1px solid #E5E7EB",
                        borderLeft: `3px solid ${C.red}`,
                        borderRadius: "2px 12px 12px 12px",
                        padding: "14px 18px",
                        fontSize: "13px",
                        color: C.text,
                        lineHeight: 1.65,
                        boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
                      }}
                    >
                      <p style={{ margin: "0 0 10px 0" }}>
                        A 90-day co-pay card for ESI Tier 2 patients is modeled to offset <strong>60–70%</strong> of the tier change impact by reducing patient abandonment at the pharmacy counter.
                      </p>
                      <div
                        style={{
                          backgroundColor: "#F0FFF4",
                          border: "1px solid #C3E6CB",
                          borderRadius: "8px",
                          padding: "10px 14px",
                          marginBottom: "10px",
                        }}
                      >
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px 16px" }}>
                          {[
                            { label: "Estimated recovery", value: "+$3.6M to +$4.2M" },
                            { label: "Combined FY run rate", value: "$2.40B–$2.41B" },
                            { label: "Gap to forecast", value: "Effectively closed" },
                            { label: "G2N headwind", value: "-$1.1M net" },
                          ].map(({ label, value }) => (
                            <div key={label}>
                              <div style={{ fontSize: "10px", color: C.gray, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</div>
                              <div style={{ fontSize: "13px", fontWeight: 700, color: C.navy }}>{value}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                      <p style={{ margin: "0 0 12px 0", fontSize: "12px", color: "#92400E", backgroundColor: "#FFFBEB", border: "1px solid #FDE68A", padding: "8px 12px", borderRadius: "6px" }}>
                        <strong>Key risk:</strong> Gross-to-net impact of the co-pay program reduces net revenue by an estimated $1.1M. Finance should model the net-net.
                      </p>
                      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                        {["Build Combined Scenario", "Route to Finance for G2N Review", "Generate Action Brief"].map((btn) => (
                          <button
                            key={btn}
                            style={{
                              fontSize: "11px",
                              fontWeight: 600,
                              padding: "5px 12px",
                              borderRadius: "6px",
                              cursor: "pointer",
                              border: "1.5px solid #3B52A0",
                              backgroundColor: "transparent",
                              color: "#3B52A0",
                              transition: "background 0.15s",
                            }}
                            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#F0F4FF"; }}
                            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent"; }}
                          >
                            {btn}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Input bar */}
            <div
              style={{
                padding: "14px 20px",
                borderTop: "1px solid #F0F0F0",
                backgroundColor: "#FAFAFA",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  backgroundColor: "#FFFFFF",
                  border: "1.5px solid #E5E7EB",
                  borderRadius: "8px",
                  padding: "8px 12px",
                  marginBottom: "10px",
                }}
              >
                <input
                  value={whatIfInput}
                  onChange={(e) => setWhatIfInput(e.target.value)}
                  placeholder="Ask: 'If we do X, where do we land?'"
                  style={{
                    flex: 1,
                    border: "none",
                    outline: "none",
                    fontSize: "13px",
                    color: C.navy,
                    backgroundColor: "transparent",
                    fontFamily: "inherit",
                  }}
                />
                <button
                  style={{
                    padding: "6px 14px",
                    backgroundColor: C.red,
                    color: "#FFFFFF",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    fontSize: "12px",
                    fontWeight: 600,
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#A8002E"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = C.red; }}
                >
                  <Send size={13} />
                  Run
                </button>
              </div>

              {/* Quick What-If pills */}
              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                {[
                  { label: "What if we win CVS formulary in Q3?", custom: false },
                  { label: "What if competitor launch delays 6 months?", custom: false },
                  { label: "What if we increase WAC by 3% in July?", custom: false },
                  { label: "What if Southern stockout recurs in Q3?", custom: false },
                  { label: "+ Custom What-If", custom: true },
                ].map(({ label, custom }) => (
                  <button
                    key={label}
                    onClick={() => !custom && setWhatIfInput(label)}
                    style={{
                      fontSize: "11px",
                      fontWeight: 600,
                      padding: "5px 12px",
                      borderRadius: "20px",
                      cursor: "pointer",
                      border: custom ? `1.5px solid ${C.red}` : "1.5px solid #D1D5DB",
                      backgroundColor: "transparent",
                      color: custom ? C.red : C.gray,
                      transition: "all 0.15s",
                    }}
                    onMouseEnter={(e) => {
                      const b = e.currentTarget as HTMLButtonElement;
                      b.style.backgroundColor = custom ? "#FFF5F7" : "#F5F5F5";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent";
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT 35% — Recovery chart */}
          <div
            style={{
              flex: 1,
              padding: "20px 20px 16px 20px",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div style={{ marginBottom: "14px" }}>
              <h3 style={{ fontSize: "13px", fontWeight: 700, color: C.navy, margin: "0 0 2px 0" }}>
                Path to Forecast Recovery
              </h3>
              <p style={{ fontSize: "11px", color: C.gray, margin: 0 }}>
                Monthly revenue trajectory — Biktarvy US, FY 2026 ($M)
              </p>
            </div>

            <div style={{ flex: 1, minHeight: 0 }}>
              <ResponsiveContainer width="100%" height={340}>
                <LineChart
                  data={RECOVERY_DATA}
                  margin={{ top: 8, right: 12, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" />
                  <XAxis
                    dataKey="month"
                    tick={{ fontSize: 10, fill: C.gray }}
                    axisLine={{ stroke: "#E5E7EB" }}
                    tickLine={false}
                  />
                  <YAxis
                    domain={[185, 215]}
                    tick={{ fontSize: 10, fill: C.gray }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v: number) => `$${v}M`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#FFFFFF",
                      border: "1px solid #E5E7EB",
                      borderRadius: "8px",
                      fontSize: "11px",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                    }}
                    formatter={(value, name) => {
                      const labels: Record<string, string> = {
                        forecast: "Original Forecast",
                        actual: "Current Trajectory",
                        simulated: "Simulated Recovery",
                      };
                      return [value ? `$${value}M` : "—", labels[name as string] ?? name];
                    }}
                  />
                  <Legend
                    iconType="circle"
                    iconSize={8}
                    wrapperStyle={{ fontSize: "11px", color: C.gray, paddingBottom: "4px" }}
                    formatter={(value: string) => {
                      const labels: Record<string, string> = {
                        forecast: "Original Forecast",
                        actual: "Current Trajectory",
                        simulated: "Simulated Recovery",
                      };
                      return labels[value] ?? value;
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="forecast"
                    stroke={C.gray}
                    strokeWidth={1.5}
                    strokeDasharray="6 4"
                    dot={false}
                    activeDot={{ r: 4, strokeWidth: 0, fill: C.gray }}
                    connectNulls
                  />
                  <Line
                    type="monotone"
                    dataKey="actual"
                    stroke={C.red}
                    strokeWidth={2.5}
                    dot={{ r: 3, fill: C.red, strokeWidth: 0 }}
                    activeDot={{ r: 5, strokeWidth: 0 }}
                    connectNulls={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="simulated"
                    stroke={C.success}
                    strokeWidth={2}
                    strokeDasharray="4 3"
                    dot={false}
                    activeDot={{ r: 4, strokeWidth: 0, fill: C.success }}
                    connectNulls
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Summary callout */}
            <div
              style={{
                marginTop: "12px",
                padding: "10px 14px",
                backgroundColor: "#F0FFF4",
                border: "1px solid #C3E6CB",
                borderRadius: "8px",
              }}
            >
              <p style={{ fontSize: "11px", color: "#1A5C2A", margin: "0 0 4px 0", fontWeight: 700 }}>
                Simulated outcome — combined actions
              </p>
              <p style={{ fontSize: "11px", color: "#2D6A3F", margin: 0, lineHeight: 1.5 }}>
                Detailing increase + co-pay program closes FY gap to <strong>$0–$3M</strong>, bringing trajectory to <strong>$2.40B–$2.41B</strong> vs. $2.41B plan target.
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
