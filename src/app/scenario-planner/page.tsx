"use client";

import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Plus, Edit2, BarChart2, Download, Presentation } from "lucide-react";

// ─── Chart data ──────────────────────────────────────────────────────────────
const chartData = [
  { month: "Jan", base: 195, competitive: 185, formulary: 208 },
  { month: "Feb", base: 198, competitive: 182, formulary: 212 },
  { month: "Mar", base: 201, competitive: 178, formulary: 217 },
  { month: "Apr", base: 200, competitive: 180, formulary: 215 },
  { month: "May", base: 203, competitive: 176, formulary: 220 },
  { month: "Jun", base: 205, competitive: 174, formulary: 223 },
  { month: "Jul", base: 202, competitive: 190, formulary: 218 },
  { month: "Aug", base: 204, competitive: 188, formulary: 221 },
  { month: "Sep", base: 207, competitive: 186, formulary: 225 },
  { month: "Oct", base: 206, competitive: 184, formulary: 224 },
  { month: "Nov", base: 209, competitive: 182, formulary: 228 },
  { month: "Dec", base: 211, competitive: 180, formulary: 231 },
];

// ─── Scenario card data ───────────────────────────────────────────────────────
const scenarios = [
  {
    id: "base",
    label: "Base Case",
    dotColor: "#646569",
    description: "No event adjustments. Trend extrapolation only.",
    total: "$2.41B",
    color: "#646569",
  },
  {
    id: "competitive",
    label: "Competitive Pressure",
    dotColor: "#C80037",
    description: "Sunlenca generic launch + 2 biosimilar entries.",
    total: "$2.28B",
    color: "#C80037",
  },
  {
    id: "formulary",
    label: "Formulary Upside",
    dotColor: "#28A745",
    description: "3 major formulary wins + pricing hold.",
    total: "$2.58B",
    color: "#28A745",
  },
];

// ─── Comparison table data ────────────────────────────────────────────────────
const tableRows = [
  {
    metric: "Revenue",
    base: "$2.41B",
    competitive: "$2.28B",
    formulary: "$2.58B",
    delta_competitive: "−$130M",
    delta_competitive_positive: false,
    delta_formulary: "+$170M",
    delta_formulary_positive: true,
  },
  {
    metric: "Units",
    base: "18.4M",
    competitive: "17.1M",
    formulary: "19.8M",
    delta_competitive: "−1.3M",
    delta_competitive_positive: false,
    delta_formulary: "+1.4M",
    delta_formulary_positive: true,
  },
  {
    metric: "Market Share",
    base: "38.2%",
    competitive: "34.7%",
    formulary: "41.1%",
    delta_competitive: "−3.5pp",
    delta_competitive_positive: false,
    delta_formulary: "+2.9pp",
    delta_formulary_positive: true,
  },
  {
    metric: "Events Applied",
    base: "0",
    competitive: "3",
    formulary: "4",
    delta_competitive: "+3",
    delta_competitive_positive: false,
    delta_formulary: "+4",
    delta_formulary_positive: false,
  },
  {
    metric: "Confidence Score",
    base: "91%",
    competitive: "78%",
    formulary: "84%",
    delta_competitive: "−13pp",
    delta_competitive_positive: false,
    delta_formulary: "−7pp",
    delta_formulary_positive: false,
  },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function FilterBar() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
        padding: "14px 20px",
        backgroundColor: "#FFFFFF",
        borderRadius: "10px",
        border: "1px solid #E5E7EB",
        flexWrap: "wrap",
      }}
    >
      {/* Label */}
      <span
        style={{ fontSize: "13px", fontWeight: "600", color: "#374151", whiteSpace: "nowrap" }}
      >
        Filters:
      </span>

      {/* Brand */}
      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
        <span style={{ fontSize: "12px", color: "#6B7280", fontWeight: "500" }}>Brand</span>
        <select
          defaultValue="Biktarvy"
          style={{
            padding: "5px 10px",
            fontSize: "13px",
            border: "1px solid #D1D5DB",
            borderRadius: "6px",
            color: "#111827",
            backgroundColor: "#F9FAFB",
            cursor: "pointer",
            outline: "none",
          }}
        >
          <option>Biktarvy</option>
        </select>
      </div>

      {/* Divider */}
      <div style={{ width: "1px", height: "20px", backgroundColor: "#E5E7EB" }} />

      {/* Market */}
      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
        <span style={{ fontSize: "12px", color: "#6B7280", fontWeight: "500" }}>Market</span>
        <select
          defaultValue="United States"
          style={{
            padding: "5px 10px",
            fontSize: "13px",
            border: "1px solid #D1D5DB",
            borderRadius: "6px",
            color: "#111827",
            backgroundColor: "#F9FAFB",
            cursor: "pointer",
            outline: "none",
          }}
        >
          <option>United States</option>
        </select>
      </div>

      {/* Divider */}
      <div style={{ width: "1px", height: "20px", backgroundColor: "#E5E7EB" }} />

      {/* Forecast Period */}
      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
        <span style={{ fontSize: "12px", color: "#6B7280", fontWeight: "500" }}>Forecast Period</span>
        <select
          defaultValue="2026"
          style={{
            padding: "5px 10px",
            fontSize: "13px",
            border: "1px solid #D1D5DB",
            borderRadius: "6px",
            color: "#111827",
            backgroundColor: "#F9FAFB",
            cursor: "pointer",
            outline: "none",
          }}
        >
          <option>2026</option>
          <option>2025</option>
          <option>2027</option>
        </select>
      </div>
    </div>
  );
}

function ScenarioCard({
  scenario,
}: {
  scenario: (typeof scenarios)[number];
}) {
  return (
    <div
      style={{
        width: "280px",
        minWidth: "280px",
        backgroundColor: "#FFFFFF",
        borderRadius: "10px",
        border: "1px solid #E5E7EB",
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <div
          style={{
            width: "10px",
            height: "10px",
            borderRadius: "50%",
            backgroundColor: scenario.dotColor,
            flexShrink: 0,
          }}
        />
        <span style={{ fontSize: "14px", fontWeight: "700", color: "#111827" }}>
          {scenario.label}
        </span>
      </div>

      {/* Description */}
      <p style={{ fontSize: "12px", color: "#6B7280", margin: 0, lineHeight: "1.5" }}>
        {scenario.description}
      </p>

      {/* Total */}
      <div
        style={{
          backgroundColor: "#F5F5F5",
          borderRadius: "7px",
          padding: "10px 14px",
          display: "flex",
          flexDirection: "column",
          gap: "2px",
        }}
      >
        <span style={{ fontSize: "11px", color: "#9CA3AF", fontWeight: "500", textTransform: "uppercase", letterSpacing: "0.05em" }}>
          2026 Total Revenue
        </span>
        <span style={{ fontSize: "22px", fontWeight: "800", color: "#111827" }}>
          {scenario.total}
        </span>
      </div>

      {/* Buttons */}
      <div style={{ display: "flex", gap: "8px", marginTop: "4px" }}>
        <button
          style={{
            flex: 1,
            padding: "7px 0",
            fontSize: "12px",
            fontWeight: "600",
            border: "1.5px solid #D1D5DB",
            borderRadius: "6px",
            backgroundColor: "transparent",
            color: "#374151",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "5px",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.borderColor = "#9CA3AF";
            (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#F9FAFB";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.borderColor = "#D1D5DB";
            (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent";
          }}
        >
          <Edit2 size={12} />
          Edit
        </button>
        <button
          style={{
            flex: 1,
            padding: "7px 0",
            fontSize: "12px",
            fontWeight: "600",
            border: "1.5px solid " + scenario.color,
            borderRadius: "6px",
            backgroundColor: "transparent",
            color: scenario.color,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "5px",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor = scenario.color + "10";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent";
          }}
        >
          <BarChart2 size={12} />
          Compare
        </button>
      </div>
    </div>
  );
}

function NewScenarioCard() {
  return (
    <div
      style={{
        width: "280px",
        minWidth: "280px",
        backgroundColor: "transparent",
        borderRadius: "10px",
        border: "2px dashed #D1D5DB",
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "12px",
        cursor: "pointer",
        transition: "border-color 0.15s, background-color 0.15s",
        minHeight: "190px",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.borderColor = "#C80037";
        (e.currentTarget as HTMLDivElement).style.backgroundColor = "#FFF5F7";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.borderColor = "#D1D5DB";
        (e.currentTarget as HTMLDivElement).style.backgroundColor = "transparent";
      }}
    >
      <div
        style={{
          width: "40px",
          height: "40px",
          borderRadius: "50%",
          backgroundColor: "#F5F5F5",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Plus size={20} color="#9CA3AF" />
      </div>
      <div style={{ textAlign: "center" }}>
        <p style={{ fontSize: "14px", fontWeight: "600", color: "#374151", margin: "0 0 4px 0" }}>
          + New Scenario
        </p>
        <p style={{ fontSize: "12px", color: "#9CA3AF", margin: 0 }}>
          Define custom assumptions
        </p>
      </div>
    </div>
  );
}

function ComparisonChart() {
  const [hidden, setHidden] = useState<Record<string, boolean>>({});

  const toggleLine = (key: string) => {
    setHidden((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const lines = [
    { key: "base", label: "Base Case", color: "#646569" },
    { key: "competitive", label: "Competitive Pressure", color: "#C80037" },
    { key: "formulary", label: "Formulary Upside", color: "#28A745" },
  ];

  return (
    <div
      style={{
        backgroundColor: "#FFFFFF",
        borderRadius: "10px",
        border: "1px solid #E5E7EB",
        padding: "24px",
        boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
      }}
    >
      {/* Chart header */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          marginBottom: "20px",
          flexWrap: "wrap",
          gap: "12px",
        }}
      >
        <div>
          <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#111827", margin: "0 0 3px 0" }}>
            Scenario Comparison — Biktarvy (US)
          </h3>
          <p style={{ fontSize: "12px", color: "#9CA3AF", margin: 0 }}>
            Monthly revenue by scenario · 2026 · USD millions
          </p>
        </div>

        {/* Legend toggles */}
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          {lines.map((l) => (
            <button
              key={l.key}
              onClick={() => toggleLine(l.key)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "5px 10px",
                borderRadius: "20px",
                border: "1.5px solid " + (hidden[l.key] ? "#D1D5DB" : l.color),
                backgroundColor: hidden[l.key] ? "#F5F5F5" : l.color + "15",
                cursor: "pointer",
                fontSize: "12px",
                fontWeight: "600",
                color: hidden[l.key] ? "#9CA3AF" : l.color,
                transition: "all 0.15s",
              }}
            >
              <div
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  backgroundColor: hidden[l.key] ? "#D1D5DB" : l.color,
                }}
              />
              {l.label}
            </button>
          ))}
        </div>
      </div>

      {/* Recharts */}
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 11, fill: "#9CA3AF" }}
            axisLine={{ stroke: "#E5E7EB" }}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "#9CA3AF" }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v: number) => `$${v}M`}
            domain={[160, 240]}
          />
          <Tooltip
            contentStyle={{
              borderRadius: "8px",
              border: "1px solid #E5E7EB",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              fontSize: "12px",
            }}
            formatter={(value) => [`$${value}M`, ""]}
          />
          <Line
            type="monotone"
            dataKey="base"
            stroke="#646569"
            strokeWidth={2.5}
            dot={false}
            hide={!!hidden["base"]}
            activeDot={{ r: 5 }}
          />
          <Line
            type="monotone"
            dataKey="competitive"
            stroke="#C80037"
            strokeWidth={2.5}
            dot={false}
            hide={!!hidden["competitive"]}
            activeDot={{ r: 5 }}
            strokeDasharray="5 3"
          />
          <Line
            type="monotone"
            dataKey="formulary"
            stroke="#28A745"
            strokeWidth={2.5}
            dot={false}
            hide={!!hidden["formulary"]}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

function DeltaBadge({ value, positive }: { value: string; positive: boolean }) {
  const isNeutral = !value.startsWith("+") && !value.startsWith("−") && !value.startsWith("-");
  return (
    <span
      style={{
        display: "inline-block",
        padding: "2px 8px",
        borderRadius: "12px",
        fontSize: "12px",
        fontWeight: "600",
        backgroundColor: isNeutral
          ? "#F3F4F6"
          : positive
          ? "#DCFCE7"
          : "#FEE2E2",
        color: isNeutral ? "#6B7280" : positive ? "#16A34A" : "#DC2626",
      }}
    >
      {value}
    </span>
  );
}

function ComparisonTable() {
  return (
    <div
      style={{
        backgroundColor: "#FFFFFF",
        borderRadius: "10px",
        border: "1px solid #E5E7EB",
        overflow: "hidden",
        boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
      }}
    >
      {/* Table header */}
      <div style={{ padding: "20px 24px 0" }}>
        <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#111827", margin: "0 0 3px 0" }}>
          Scenario Comparison Table
        </h3>
        <p style={{ fontSize: "12px", color: "#9CA3AF", margin: "0 0 16px 0" }}>
          Full-year 2026 · Delta measured against Base Case
        </p>
      </div>

      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ backgroundColor: "#F5F5F5", borderBottom: "1px solid #E5E7EB" }}>
              <th
                style={{
                  padding: "10px 24px",
                  textAlign: "left",
                  fontSize: "12px",
                  fontWeight: "600",
                  color: "#6B7280",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  whiteSpace: "nowrap",
                }}
              >
                Metric
              </th>
              {/* Base Case */}
              <th
                style={{
                  padding: "10px 20px",
                  textAlign: "center",
                  fontSize: "12px",
                  fontWeight: "600",
                  color: "#646569",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  whiteSpace: "nowrap",
                  borderLeft: "1px solid #E5E7EB",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
                  <div style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#646569" }} />
                  Base Case
                </div>
              </th>
              {/* Competitive */}
              <th
                style={{
                  padding: "10px 20px",
                  textAlign: "center",
                  fontSize: "12px",
                  fontWeight: "600",
                  color: "#C80037",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  whiteSpace: "nowrap",
                  borderLeft: "1px solid #E5E7EB",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
                  <div style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#C80037" }} />
                  Competitive Pressure
                </div>
              </th>
              {/* Delta Competitive */}
              <th
                style={{
                  padding: "10px 16px",
                  textAlign: "center",
                  fontSize: "12px",
                  fontWeight: "600",
                  color: "#9CA3AF",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  whiteSpace: "nowrap",
                  borderLeft: "1px solid #E5E7EB",
                  backgroundColor: "#FAFAFA",
                }}
              >
                Delta
              </th>
              {/* Formulary */}
              <th
                style={{
                  padding: "10px 20px",
                  textAlign: "center",
                  fontSize: "12px",
                  fontWeight: "600",
                  color: "#28A745",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  whiteSpace: "nowrap",
                  borderLeft: "1px solid #E5E7EB",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
                  <div style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#28A745" }} />
                  Formulary Upside
                </div>
              </th>
              {/* Delta Formulary */}
              <th
                style={{
                  padding: "10px 16px",
                  textAlign: "center",
                  fontSize: "12px",
                  fontWeight: "600",
                  color: "#9CA3AF",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  whiteSpace: "nowrap",
                  borderLeft: "1px solid #E5E7EB",
                  backgroundColor: "#FAFAFA",
                }}
              >
                Delta
              </th>
            </tr>
          </thead>
          <tbody>
            {tableRows.map((row, i) => (
              <tr
                key={row.metric}
                style={{
                  borderBottom: i < tableRows.length - 1 ? "1px solid #F3F4F6" : "none",
                  backgroundColor: i % 2 === 0 ? "#FFFFFF" : "#FAFAFA",
                }}
              >
                <td
                  style={{
                    padding: "13px 24px",
                    fontSize: "13px",
                    fontWeight: "600",
                    color: "#111827",
                    whiteSpace: "nowrap",
                  }}
                >
                  {row.metric}
                </td>
                <td
                  style={{
                    padding: "13px 20px",
                    textAlign: "center",
                    fontSize: "13px",
                    color: "#374151",
                    borderLeft: "1px solid #F3F4F6",
                  }}
                >
                  {row.base}
                </td>
                <td
                  style={{
                    padding: "13px 20px",
                    textAlign: "center",
                    fontSize: "13px",
                    color: "#374151",
                    borderLeft: "1px solid #F3F4F6",
                  }}
                >
                  {row.competitive}
                </td>
                <td
                  style={{
                    padding: "13px 16px",
                    textAlign: "center",
                    borderLeft: "1px solid #F3F4F6",
                    backgroundColor: i % 2 === 0 ? "#FAFAFA" : "#F5F5F5",
                  }}
                >
                  <DeltaBadge
                    value={row.delta_competitive}
                    positive={row.delta_competitive_positive}
                  />
                </td>
                <td
                  style={{
                    padding: "13px 20px",
                    textAlign: "center",
                    fontSize: "13px",
                    color: "#374151",
                    borderLeft: "1px solid #F3F4F6",
                  }}
                >
                  {row.formulary}
                </td>
                <td
                  style={{
                    padding: "13px 16px",
                    textAlign: "center",
                    borderLeft: "1px solid #F3F4F6",
                    backgroundColor: i % 2 === 0 ? "#FAFAFA" : "#F5F5F5",
                  }}
                >
                  <DeltaBadge
                    value={row.delta_formulary}
                    positive={row.delta_formulary_positive}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function ScenarioPlannerPage() {
  return (
    <DashboardLayout breadcrumb={["Scenario Planner", "Biktarvy", "2026"]}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "24px",
          fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
          maxWidth: "1400px",
        }}
      >
        {/* ── Page header ── */}
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
          <div>
            <h1
              style={{
                fontSize: "24px",
                fontWeight: "800",
                color: "#111827",
                margin: "0 0 4px 0",
                letterSpacing: "-0.01em",
              }}
            >
              Scenario Planning &amp; Comparison
            </h1>
            <p style={{ fontSize: "14px", color: "#6B7280", margin: 0 }}>
              Create, compare, and evaluate multiple forecast scenarios
            </p>
          </div>
        </div>

        {/* ── Filter bar ── */}
        <FilterBar />

        {/* ── Section 1: Scenario Cards ── */}
        <div>
          <h2
            style={{
              fontSize: "13px",
              fontWeight: "700",
              color: "#9CA3AF",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              margin: "0 0 14px 0",
            }}
          >
            Scenarios
          </h2>
          <div
            style={{
              display: "flex",
              gap: "16px",
              overflowX: "auto",
              paddingBottom: "4px",
            }}
          >
            {scenarios.map((s) => (
              <ScenarioCard key={s.id} scenario={s} />
            ))}
            <NewScenarioCard />
          </div>
        </div>

        {/* ── Section 2: Comparison Chart ── */}
        <div>
          <h2
            style={{
              fontSize: "13px",
              fontWeight: "700",
              color: "#9CA3AF",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              margin: "0 0 14px 0",
            }}
          >
            Comparison Chart
          </h2>
          <ComparisonChart />
        </div>

        {/* ── Section 3: Comparison Table ── */}
        <div>
          <h2
            style={{
              fontSize: "13px",
              fontWeight: "700",
              color: "#9CA3AF",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              margin: "0 0 14px 0",
            }}
          >
            Comparison Table
          </h2>
          <ComparisonTable />
        </div>

        {/* ── Bottom action bar ── */}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "12px",
            paddingBottom: "8px",
          }}
        >
          <button
            style={{
              padding: "10px 20px",
              fontSize: "13px",
              fontWeight: "600",
              border: "1.5px solid #D1D5DB",
              borderRadius: "7px",
              backgroundColor: "transparent",
              color: "#374151",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "7px",
              transition: "border-color 0.15s, background-color 0.15s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = "#9CA3AF";
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#F9FAFB";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = "#D1D5DB";
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent";
            }}
          >
            <Download size={14} />
            Export Comparison
          </button>

          <button
            style={{
              padding: "10px 20px",
              fontSize: "13px",
              fontWeight: "600",
              border: "none",
              borderRadius: "7px",
              backgroundColor: "#C80037",
              color: "#FFFFFF",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "7px",
              transition: "background-color 0.15s, transform 0.1s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#A8002E";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#C80037";
            }}
            onMouseDown={(e) => {
              (e.currentTarget as HTMLButtonElement).style.transform = "scale(0.99)";
            }}
            onMouseUp={(e) => {
              (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)";
            }}
          >
            <Presentation size={14} />
            Present to Stakeholders
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}
