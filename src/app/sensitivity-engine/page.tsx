"use client";

import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
  AreaChart,
  Area,
  Cell,
} from "recharts";

// ─── Types ──────────────────────────────────────────────────────────────────

type DiscreteLevel = "None" | "Low" | "Medium" | "High";
type SpeedLevel = "Slow" | "Medium" | "Fast";

interface ContinuousParam {
  kind: "continuous";
  id: string;
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  format: (v: number) => string;
  default: number;
}

interface DiscreteParam {
  kind: "discrete";
  id: string;
  label: string;
  options: string[];
  value: string;
  default: string;
}

type Param = ContinuousParam | DiscreteParam;

// ─── Default parameters ──────────────────────────────────────────────────────

const defaultParams: Param[] = [
  {
    kind: "continuous",
    id: "marketGrowth",
    label: "Market Growth Rate",
    value: 3.2,
    min: 0,
    max: 8,
    step: 0.1,
    format: (v) => `${v.toFixed(1)}%`,
    default: 3.2,
  },
  {
    kind: "discrete",
    id: "competitorUptake",
    label: "Competitor Uptake Speed",
    options: ["Slow", "Medium", "Fast"],
    value: "Medium",
    default: "Medium",
  },
  {
    kind: "continuous",
    id: "pricingErosion",
    label: "Pricing Erosion",
    value: -1.5,
    min: -5,
    max: 0,
    step: 0.1,
    format: (v) => `${v.toFixed(1)}%`,
    default: -1.5,
  },
  {
    kind: "continuous",
    id: "formularyCoverage",
    label: "Formulary Coverage",
    value: 78,
    min: 50,
    max: 100,
    step: 1,
    format: (v) => `${v}%`,
    default: 78,
  },
  {
    kind: "continuous",
    id: "patientSwitching",
    label: "Patient Switching Rate",
    value: 4.2,
    min: 0,
    max: 15,
    step: 0.1,
    format: (v) => `${v.toFixed(1)}%`,
    default: 4.2,
  },
  {
    kind: "discrete",
    id: "stockout",
    label: "Stockout Probability",
    options: ["None", "Low", "Medium", "High"],
    value: "Low",
    default: "Low",
  },
];

// ─── Tornado chart data ───────────────────────────────────────────────────────

const tornadoData = [
  { driver: "Formulary Coverage", low: -320, high: 280 },
  { driver: "Market Growth Rate", low: -260, high: 310 },
  { driver: "Pricing Erosion", low: -290, high: 80 },
  { driver: "Competitor Uptake", low: -210, high: 190 },
  { driver: "Patient Switching", low: -150, high: 130 },
  { driver: "Stockout Prob.", low: -90, high: 60 },
];

// ─── Monte Carlo histogram data ───────────────────────────────────────────────

const monteCarloData = [
  { bin: 2.0, freq: 8 },
  { bin: 2.05, freq: 18 },
  { bin: 2.1, freq: 34 },
  { bin: 2.15, freq: 55 },
  { bin: 2.18, freq: 72 },
  { bin: 2.2, freq: 95 },
  { bin: 2.25, freq: 118 },
  { bin: 2.3, freq: 138 },
  { bin: 2.35, freq: 152 },
  { bin: 2.41, freq: 160 },
  { bin: 2.45, freq: 148 },
  { bin: 2.5, freq: 132 },
  { bin: 2.55, freq: 112 },
  { bin: 2.6, freq: 88 },
  { bin: 2.63, freq: 68 },
  { bin: 2.65, freq: 50 },
  { bin: 2.7, freq: 33 },
  { bin: 2.75, freq: 19 },
  { bin: 2.8, freq: 9 },
  { bin: 2.85, freq: 3 },
];

// ─── Scenario table data ──────────────────────────────────────────────────────

const scenarios = [
  {
    name: "Best Case",
    revenue: "$2.78B",
    units: "4.12M",
    share: "38.4%",
    keyDriver: "Expanded formulary + low competition",
    probability: 15,
    probLabel: "15%",
    probColor: "#28A745",
    rowBg: "#F0FFF4",
  },
  {
    name: "Expected",
    revenue: "$2.41B",
    units: "3.57M",
    share: "33.1%",
    keyDriver: "Base assumptions",
    probability: 55,
    probLabel: "55%",
    probColor: "#28A745",
    rowBg: "#FFFFFF",
  },
  {
    name: "Downside",
    revenue: "$2.03B",
    units: "3.01M",
    share: "27.8%",
    keyDriver: "Increased competitor uptake + pricing pressure",
    probability: 22,
    probLabel: "22%",
    probColor: "#E8A000",
    rowBg: "#FFFBF0",
  },
  {
    name: "Severe Downside",
    revenue: "$1.61B",
    units: "2.38M",
    share: "21.2%",
    keyDriver: "Formulary exclusion + fast generic entry",
    probability: 8,
    probLabel: "8%",
    probColor: "#C80037",
    rowBg: "#FFF5F7",
  },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function ContinuousSlider({
  param,
  onChange,
}: {
  param: ContinuousParam;
  onChange: (id: string, value: number) => void;
}) {
  const pct = ((param.value - param.min) / (param.max - param.min)) * 100;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
        <span style={{ fontSize: "12px", fontWeight: "600", color: "#374151" }}>
          {param.label}
        </span>
        <span
          style={{
            fontSize: "12px",
            fontWeight: "700",
            color: "#C80037",
            minWidth: "52px",
            textAlign: "right",
          }}
        >
          {param.format(param.value)}
        </span>
      </div>
      <div style={{ position: "relative", marginBottom: "4px" }}>
        <input
          type="range"
          min={param.min}
          max={param.max}
          step={param.step}
          value={param.value}
          onChange={(e) => onChange(param.id, parseFloat(e.target.value))}
          style={{
            width: "100%",
            accentColor: "#C80037",
            cursor: "pointer",
            height: "4px",
          }}
        />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <span style={{ fontSize: "10px", color: "#9CA3AF" }}>{param.format(param.min)}</span>
        <span style={{ fontSize: "10px", color: "#9CA3AF" }}>{param.format(param.max)}</span>
      </div>
    </div>
  );
}

function DiscreteSlider({
  param,
  onChange,
}: {
  param: DiscreteParam;
  onChange: (id: string, value: string) => void;
}) {
  const idx = param.options.indexOf(param.value);
  const steps = param.options.length - 1;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
        <span style={{ fontSize: "12px", fontWeight: "600", color: "#374151" }}>
          {param.label}
        </span>
        <span
          style={{
            fontSize: "12px",
            fontWeight: "700",
            color: "#C80037",
            minWidth: "52px",
            textAlign: "right",
          }}
        >
          {param.value}
        </span>
      </div>
      <div style={{ marginBottom: "4px" }}>
        <input
          type="range"
          min={0}
          max={steps}
          step={1}
          value={idx}
          onChange={(e) => onChange(param.id, param.options[parseInt(e.target.value)])}
          style={{
            width: "100%",
            accentColor: "#C80037",
            cursor: "pointer",
            height: "4px",
          }}
        />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        {param.options.map((opt) => (
          <span
            key={opt}
            style={{
              fontSize: "10px",
              color: opt === param.value ? "#C80037" : "#9CA3AF",
              fontWeight: opt === param.value ? "600" : "400",
            }}
          >
            {opt}
          </span>
        ))}
      </div>
    </div>
  );
}

// Custom tooltip for tornado chart
function TornadoTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: "#1F2937",
        border: "none",
        borderRadius: "6px",
        padding: "8px 12px",
        fontSize: "12px",
        color: "#F9FAFB",
      }}
    >
      <p style={{ margin: "0 0 4px", fontWeight: "600" }}>{label}</p>
      {payload.map((p: any) => (
        <p key={p.name} style={{ margin: "2px 0", color: p.fill }}>
          {p.name === "low" ? "Downside" : "Upside"}: {p.value > 0 ? "+" : ""}
          {p.value}M
        </p>
      ))}
    </div>
  );
}

// Custom tooltip for MC chart
function MCTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: "#1F2937",
        border: "none",
        borderRadius: "6px",
        padding: "8px 12px",
        fontSize: "12px",
        color: "#F9FAFB",
      }}
    >
      <p style={{ margin: "0 0 2px", fontWeight: "600" }}>
        ${payload[0].payload.bin.toFixed(2)}B
      </p>
      <p style={{ margin: 0, color: "#9CA3AF" }}>Simulations: {payload[0].value}</p>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function SensitivityEnginePage() {
  const [params, setParams] = useState<Param[]>(defaultParams);
  const [simRan, setSimRan] = useState(false);

  function handleContinuousChange(id: string, value: number) {
    setParams((prev) =>
      prev.map((p) => (p.id === id && p.kind === "continuous" ? { ...p, value } : p))
    );
  }

  function handleDiscreteChange(id: string, value: string) {
    setParams((prev) =>
      prev.map((p) => (p.id === id && p.kind === "discrete" ? { ...p, value } : p))
    );
  }

  function handleReset() {
    setParams(
      defaultParams.map((p) =>
        p.kind === "continuous"
          ? { ...p, value: p.default }
          : { ...p, value: p.default }
      )
    );
    setSimRan(false);
  }

  const sectionCard: React.CSSProperties = {
    backgroundColor: "#FFFFFF",
    borderRadius: "8px",
    border: "1px solid #E5E7EB",
    padding: "24px",
    marginBottom: "20px",
  };

  const sectionTitle: React.CSSProperties = {
    fontSize: "13px",
    fontWeight: "700",
    color: "#111827",
    textTransform: "uppercase",
    letterSpacing: "0.06em",
    marginBottom: "18px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  };

  const pill: React.CSSProperties = {
    fontSize: "10px",
    fontWeight: "600",
    color: "#646569",
    backgroundColor: "#F3F4F6",
    borderRadius: "4px",
    padding: "2px 7px",
    letterSpacing: "0.04em",
  };

  return (
    <DashboardLayout breadcrumb={["Sensitivity Engine", "Biktarvy", "United States"]}>
      <div style={{ fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif", maxWidth: "1400px" }}>

        {/* Page header */}
        <div style={{ marginBottom: "24px" }}>
          <h1
            style={{
              fontSize: "22px",
              fontWeight: "700",
              color: "#111827",
              margin: "0 0 4px 0",
            }}
          >
            Simulation &amp; Sensitivity Analysis
          </h1>
          <p style={{ fontSize: "13px", color: "#646569", margin: 0 }}>
            Vary key assumptions and drivers to evaluate forecast resilience
          </p>
        </div>

        {/* ── Section 1: Assumption Drivers ─────────────────────────────── */}
        <div style={sectionCard}>
          <div style={sectionTitle}>
            <span>Assumption Drivers</span>
            <span style={pill}>6 Parameters</span>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "28px 40px",
              marginBottom: "24px",
            }}
          >
            {params.map((p) =>
              p.kind === "continuous" ? (
                <ContinuousSlider
                  key={p.id}
                  param={p}
                  onChange={handleContinuousChange}
                />
              ) : (
                <DiscreteSlider
                  key={p.id}
                  param={p}
                  onChange={handleDiscreteChange}
                />
              )
            )}
          </div>

          {/* Action buttons */}
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <button
              onClick={() => setSimRan(true)}
              style={{
                padding: "10px 24px",
                backgroundColor: "#C80037",
                color: "#FFFFFF",
                fontSize: "13px",
                fontWeight: "600",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                letterSpacing: "0.02em",
              }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLButtonElement).style.backgroundColor = "#A8002E")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLButtonElement).style.backgroundColor = "#C80037")
              }
            >
              Run Simulation
            </button>
            <button
              onClick={handleReset}
              style={{
                padding: "10px 16px",
                backgroundColor: "transparent",
                color: "#646569",
                fontSize: "13px",
                fontWeight: "500",
                border: "none",
                cursor: "pointer",
                textDecoration: "underline",
              }}
            >
              Reset to Defaults
            </button>
            {simRan && (
              <span
                style={{
                  fontSize: "12px",
                  color: "#28A745",
                  fontWeight: "600",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                ✓ Simulation complete — 1,000 runs
              </span>
            )}
          </div>
        </div>

        {/* ── Section 2: Charts row ─────────────────────────────────────── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "20px",
            marginBottom: "20px",
          }}
        >
          {/* Left: Tornado chart */}
          <div style={sectionCard}>
            <div style={sectionTitle}>
              <span>Revenue Sensitivity to Key Drivers</span>
            </div>
            <p style={{ fontSize: "11px", color: "#9CA3AF", margin: "0 0 16px 0" }}>
              Impact on revenue ($M) vs. base case — bars extend left (downside) and right (upside)
            </p>

            {/* Legend */}
            <div style={{ display: "flex", gap: "16px", marginBottom: "12px" }}>
              <span style={{ fontSize: "11px", color: "#646569", display: "flex", alignItems: "center", gap: "5px" }}>
                <span style={{ width: "12px", height: "10px", backgroundColor: "#C80037", display: "inline-block", borderRadius: "2px" }} />
                Downside impact
              </span>
              <span style={{ fontSize: "11px", color: "#646569", display: "flex", alignItems: "center", gap: "5px" }}>
                <span style={{ width: "12px", height: "10px", backgroundColor: "#28A745", display: "inline-block", borderRadius: "2px" }} />
                Upside impact
              </span>
            </div>

            <ResponsiveContainer width="100%" height={280}>
              <BarChart
                data={tornadoData}
                layout="vertical"
                margin={{ top: 4, right: 24, left: 8, bottom: 4 }}
                barSize={14}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#F3F4F6" />
                <XAxis
                  type="number"
                  domain={[-350, 350]}
                  tickCount={7}
                  tickFormatter={(v) => (v === 0 ? "0" : `${v > 0 ? "+" : ""}${v}M`)}
                  tick={{ fontSize: 10, fill: "#9CA3AF" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  type="category"
                  dataKey="driver"
                  width={110}
                  tick={{ fontSize: 11, fill: "#374151" }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<TornadoTooltip />} />
                <ReferenceLine x={0} stroke="#D1D5DB" strokeWidth={1.5} />
                <Bar dataKey="low" name="low" fill="#C80037" radius={[0, 2, 2, 0]} />
                <Bar dataKey="high" name="high" fill="#28A745" radius={[2, 0, 0, 2]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Right: Monte Carlo distribution */}
          <div style={sectionCard}>
            <div style={sectionTitle}>
              <span>Forecast Distribution (1,000 simulations)</span>
            </div>

            {/* Stats row */}
            <div
              style={{
                display: "flex",
                gap: "0",
                marginBottom: "16px",
                border: "1px solid #E5E7EB",
                borderRadius: "6px",
                overflow: "hidden",
              }}
            >
              {[
                { label: "Mean", value: "$2.41B", color: "#C80037" },
                { label: "P10", value: "$2.18B", color: "#646569" },
                { label: "P90", value: "$2.63B", color: "#646569" },
              ].map((stat, i) => (
                <div
                  key={stat.label}
                  style={{
                    flex: 1,
                    padding: "10px 14px",
                    borderLeft: i > 0 ? "1px solid #E5E7EB" : "none",
                    backgroundColor: i === 0 ? "#FFF5F7" : "#FAFAFA",
                    textAlign: "center",
                  }}
                >
                  <div
                    style={{
                      fontSize: "10px",
                      fontWeight: "600",
                      color: "#9CA3AF",
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                      marginBottom: "3px",
                    }}
                  >
                    {stat.label}
                  </div>
                  <div style={{ fontSize: "16px", fontWeight: "700", color: stat.color }}>
                    {stat.value}
                  </div>
                </div>
              ))}
            </div>

            <ResponsiveContainer width="100%" height={240}>
              <AreaChart
                data={monteCarloData}
                margin={{ top: 4, right: 16, left: 8, bottom: 4 }}
              >
                <defs>
                  <linearGradient id="mcFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#C80037" stopOpacity={0.18} />
                    <stop offset="95%" stopColor="#C80037" stopOpacity={0.02} />
                  </linearGradient>
                  {/* P10–P90 band highlight */}
                  <linearGradient id="bandFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#646569" stopOpacity={0.08} />
                    <stop offset="100%" stopColor="#646569" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
                <XAxis
                  dataKey="bin"
                  tickFormatter={(v) => `$${v.toFixed(2)}B`}
                  tick={{ fontSize: 10, fill: "#9CA3AF" }}
                  axisLine={false}
                  tickLine={false}
                  interval={3}
                />
                <YAxis
                  tick={{ fontSize: 10, fill: "#9CA3AF" }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `${v}`}
                />
                <Tooltip content={<MCTooltip />} />
                {/* P10 line */}
                <ReferenceLine
                  x={2.18}
                  stroke="#646569"
                  strokeDasharray="4 3"
                  strokeWidth={1.5}
                  label={{ value: "P10", position: "top", fontSize: 9, fill: "#646569" }}
                />
                {/* Mean line */}
                <ReferenceLine
                  x={2.41}
                  stroke="#C80037"
                  strokeWidth={2}
                  label={{ value: "Mean", position: "top", fontSize: 9, fill: "#C80037" }}
                />
                {/* P90 line */}
                <ReferenceLine
                  x={2.63}
                  stroke="#646569"
                  strokeDasharray="4 3"
                  strokeWidth={1.5}
                  label={{ value: "P90", position: "top", fontSize: 9, fill: "#646569" }}
                />
                <Area
                  type="monotone"
                  dataKey="freq"
                  stroke="#C80037"
                  strokeWidth={2}
                  fill="url(#mcFill)"
                  dot={false}
                  activeDot={{ r: 4, fill: "#C80037" }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ── Section 3: Scenario Stress Test table ─────────────────────── */}
        <div style={sectionCard}>
          <div style={sectionTitle}>
            <span>Scenario Stress Test</span>
            <span style={pill}>4 Scenarios</span>
          </div>

          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
            <thead>
              <tr style={{ borderBottom: "2px solid #E5E7EB" }}>
                {["Scenario", "Revenue", "Units", "Market Share", "Key Driver", "Probability"].map(
                  (col) => (
                    <th
                      key={col}
                      style={{
                        padding: "8px 12px",
                        textAlign: col === "Scenario" || col === "Key Driver" ? "left" : "center",
                        fontSize: "10px",
                        fontWeight: "700",
                        color: "#646569",
                        textTransform: "uppercase",
                        letterSpacing: "0.06em",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {col}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {scenarios.map((row, i) => (
                <tr
                  key={row.name}
                  style={{
                    backgroundColor: row.rowBg,
                    borderBottom: i < scenarios.length - 1 ? "1px solid #F3F4F6" : "none",
                  }}
                >
                  {/* Scenario name */}
                  <td style={{ padding: "12px 12px", fontWeight: "600", color: "#111827" }}>
                    {row.name}
                  </td>
                  {/* Revenue */}
                  <td style={{ padding: "12px 12px", textAlign: "center", fontWeight: "700", color: "#111827" }}>
                    {row.revenue}
                  </td>
                  {/* Units */}
                  <td style={{ padding: "12px 12px", textAlign: "center", color: "#374151" }}>
                    {row.units}
                  </td>
                  {/* Market Share */}
                  <td style={{ padding: "12px 12px", textAlign: "center", color: "#374151" }}>
                    {row.share}
                  </td>
                  {/* Key Driver */}
                  <td style={{ padding: "12px 12px", color: "#646569", fontSize: "12px" }}>
                    {row.keyDriver}
                  </td>
                  {/* Probability pill */}
                  <td style={{ padding: "12px 12px", textAlign: "center" }}>
                    <span
                      style={{
                        display: "inline-block",
                        padding: "3px 12px",
                        borderRadius: "12px",
                        fontSize: "12px",
                        fontWeight: "700",
                        color: "#FFFFFF",
                        backgroundColor: row.probColor,
                        minWidth: "44px",
                      }}
                    >
                      {row.probLabel}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Footer note */}
          <p style={{ fontSize: "11px", color: "#9CA3AF", marginTop: "14px", marginBottom: 0 }}>
            Probabilities are expert-calibrated estimates. Revenue in USD billions. Units in thousands of patient-years.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}
