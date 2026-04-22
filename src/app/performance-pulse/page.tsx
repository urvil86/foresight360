"use client";

import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import {
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  LabelList,
} from "recharts";
import {
  TrendingDown,
  AlertCircle,
  Send,
} from "lucide-react";

// ── Recovery chart (cumulative monthly revenue, $M) ───────────────────────────
// plan       = straight-line trajectory to $2.41B annual target
// actuals    = Q1 actual ($598M) + current run-rate projection ($2.34B FY)
// recovery   = projected path after what-if actions close the gap by Dec
const RECOVERY_DATA = [
  { month: "Jan", plan: 201,  actuals: 199 },
  { month: "Feb", plan: 402,  actuals: 396 },
  { month: "Mar", plan: 603,  actuals: 598,  recovery: 598  },
  { month: "Apr", plan: 804,  actuals: 793,  recovery: 795  },
  { month: "May", plan: 1005, actuals: 988,  recovery: 994  },
  { month: "Jun", plan: 1206, actuals: 1183, recovery: 1197 },
  { month: "Jul", plan: 1407, actuals: 1378, recovery: 1403 },
  { month: "Aug", plan: 1608, actuals: 1573, recovery: 1612 },
  { month: "Sep", plan: 1809, actuals: 1768, recovery: 1824 },
  { month: "Oct", plan: 2010, actuals: 1963, recovery: 2031 },
  { month: "Nov", plan: 2211, actuals: 2158, recovery: 2226 },
  { month: "Dec", plan: 2410, actuals: 2340, recovery: 2408 },
];

// ── Waterfall data ────────────────────────────────────────────────────────────
// Each bar: transparent "spacer" stacked below the visible colored portion.
// Running total: 612 − 8 − 6 − 4 − 3 + 4 + 3 = 598 ✓
const WATERFALL_DATA = [
  { name: "Q1 Forecast",  spacer: 0,   bar: 612, type: "total",     label: "$612M" },
  { name: "Rx Ramp",      spacer: 604, bar: 8,   type: "negative",  label: "−$8M"  },
  { name: "ES Tier",      spacer: 598, bar: 6,   type: "negative",  label: "−$6M"  },
  { name: "G2N",          spacer: 594, bar: 4,   type: "negative",  label: "−$4M"  },
  { name: "Stockout",     spacer: 591, bar: 3,   type: "negative",  label: "−$3M"  },
  { name: "Aetna Win",    spacer: 591, bar: 4,   type: "positive",  label: "+$4M"  },
  { name: "DTC Lift",     spacer: 595, bar: 3,   type: "positive",  label: "+$3M"  },
  { name: "Q1 Actuals",   spacer: 0,   bar: 598, type: "total-end", label: "$598M" },
];

function waterfallColor(type: string) {
  if (type === "positive")   return "#28A745";
  if (type === "negative")   return "#C80037";
  if (type === "total-end")  return "#C80037";
  return "#646569";
}

// ── Driver detail cards ───────────────────────────────────────────────────────
const DRIVERS = [
  {
    title: "Slower Rx Ramp — Treatment-Naive",
    tag: "Marketing / Sales", positive: false,
    impact: "−$8M", pct: "−1.3%",
    cause: "Q1 HCP detailing fell 12% below plan in 3 territories. NRx starts in treatment-naive patients tracking 6% below model assumption.",
    status: "Action Planned", statusColor: "#FFC107",
  },
  {
    title: "Express Scripts Tier Change",
    tag: "Market Access", positive: false,
    impact: "−$6M", pct: "−1.0%",
    cause: "Jan 1 formulary update moved Biktarvy from Tier 1 to Tier 2 for ESI commercial lives. Patient cost share increased $15, impacting new starts.",
    status: "Identified", statusColor: "#646569",
  },
  {
    title: "Higher Gross-to-Net Erosion",
    tag: "Finance", positive: false,
    impact: "−$4M", pct: "−0.7%",
    cause: "Rebate accruals came in 40bps higher than modeled due to payer mix shift toward Medicaid-managed care.",
    status: "Identified", statusColor: "#646569",
  },
  {
    title: "Southern Region Stockout (Feb)",
    tag: "Supply Chain", positive: false,
    impact: "−$3M", pct: "−0.5%",
    cause: "Distribution center shortage in Feb caused 8-day supply gap in TX/LA territories, resulting in lost scripts.",
    status: "Mitigated", statusColor: "#28A745",
  },
  {
    title: "Aetna Formulary Win",
    tag: "Market Access", positive: true,
    impact: "+$4M", pct: "+0.7%",
    cause: "Formulary placement secured 3 weeks ahead of modeled date. Covered lives onboarded faster than assumption.",
    status: "Mitigated", statusColor: "#28A745",
  },
  {
    title: "DTC Campaign Lift",
    tag: "Marketing", positive: true,
    impact: "+$3M", pct: "+0.5%",
    cause: "Q1 digital DTC campaign exceeded response rate targets by 18%. New-patient inquiry volume 14% above plan.",
    status: "Mitigated", statusColor: "#28A745",
  },
];

// ── What-If pre-built conversation ────────────────────────────────────────────
const CHAT = [
  {
    role: "user",
    text: "If we increase HCP detailing frequency by 20% in the underperforming Southern and Midwest territories for Q2–Q3, what happens to our full-year number?",
  },
  {
    role: "ai",
    text: "Increasing detailing frequency by 20% in Southern + Midwest is projected to recover 40–55% of the treatment-naive ramp gap.",
    bullets: [
      "Estimated recovery: +$3.2M to +$4.4M over Q2–Q3",
      "Revised FY run rate: $2.37B (vs $2.34B current, vs $2.41B plan)",
      "Remaining gap: $40M–$37M",
      "Confidence: Medium — assumes rep capacity available.",
    ],
    note: "This alone won't close the gap. A co-pay card for ESI Tier 2 patients could add another $2M–$3M.",
    actions: ["Model This as Scenario", "Add to Event Modeler", "See Assumptions"],
  },
  {
    role: "user",
    text: "What if we also run a 90-day co-pay assistance program for patients on Express Scripts plans?",
  },
  {
    role: "ai",
    text: "A 90-day co-pay card for ESI Tier 2 patients is modeled to offset 60–70% of the tier change impact.",
    bullets: [
      "Estimated recovery: +$3.6M to +$4.2M over Q2–Q3",
      "Combined with detailing increase: FY run rate moves to $2.40B–$2.41B",
      "Gap to forecast: effectively closed at midpoint estimate.",
    ],
    note: "Key risk: Gross-to-net impact reduces net revenue by ~$1.1M. Finance should model the net-net.",
    actions: ["Build Combined Scenario", "Route to Finance for G2N Review", "Generate Action Brief"],
  },
];

const QUICK_WHATS = [
  "What if we win the CVS formulary slot in Q3?",
  "What if competitor launch is delayed 6 months?",
  "What if we increase WAC by 3% in July?",
  "What if Southern region stockout recurs in Q3?",
];

const ROLES = ["All", "Marketing", "Sales / Field", "Market Access", "Finance", "Supply Chain"];

function RecoveryTooltip({ active, payload, label }: { active?: boolean; payload?: { color: string; name: string; value: number }[]; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-xl p-3 text-xs min-w-[160px]">
      <p className="font-semibold text-[#2D2D2D] mb-2">{label} 2026</p>
      {payload.map((p, i) => (
        <div key={i} className="flex items-center justify-between gap-4 py-0.5">
          <span className="flex items-center gap-1.5">
            <span className="inline-block w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
            <span className="text-gray-500">{p.name}</span>
          </span>
          <span className="font-semibold text-[#2D2D2D]">${p.value.toLocaleString()}M</span>
        </div>
      ))}
    </div>
  );
}

function WaterfallTooltip({ active, payload, label }: { active?: boolean; payload?: unknown[]; label?: string }) {
  if (!active || !payload?.length) return null;
  const entry = WATERFALL_DATA.find((d) => d.name === label);
  if (!entry) return null;
  const isTotal = entry.type === "total" || entry.type === "total-end";
  const color = waterfallColor(entry.type);
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-xl p-3 text-xs">
      <p className="font-semibold text-[#2D2D2D] mb-1">{label}</p>
      <p className="font-bold" style={{ color }}>{entry.label}</p>
      {!isTotal && (
        <p className="text-gray-400 mt-1">Running total: ${entry.spacer + entry.bar}M</p>
      )}
    </div>
  );
}

export default function PerformancePulse() {
  const [selectedRole, setSelectedRole] = useState("All");
  const [chatInput, setChatInput] = useState("");

  return (
    <DashboardLayout breadcrumb={["Dashboard", "Performance Pulse"]}>
      <div className="space-y-5">

        {/* ── Page header + filters ──────────────────────────────────── */}
        <div className="space-y-3">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-xl font-bold text-[#2D2D2D]">Performance Pulse</h1>
              <p className="text-sm text-[#646569] mt-1">
                Track performance gaps and simulate actions to close them
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs text-[#646569] bg-white border border-gray-200 rounded-lg px-3 py-2">
              <span className="font-semibold text-[#2D2D2D]">Urvil Shah</span>
              <span>| Commercial Strategy</span>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {["Biktarvy", "United States", "Q1 2026"].map((f) => (
              <button key={f} className="bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-xs text-[#646569] hover:border-gray-300 transition-colors">
                {f} ▾
              </button>
            ))}
            <div className="w-px h-5 bg-gray-200 mx-1" />
            {ROLES.map((r) => (
              <button
                key={r}
                onClick={() => setSelectedRole(r)}
                className="rounded-full px-3 py-1 text-xs font-medium transition-colors"
                style={{
                  background: selectedRole === r ? "#C80037" : "#fff",
                  color: selectedRole === r ? "#fff" : "#646569",
                  border: `1px solid ${selectedRole === r ? "#C80037" : "#e5e7eb"}`,
                }}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* ── KPI Cards ─────────────────────────────────────────────── */}
        <div className="grid grid-cols-5 gap-4">
          {[
            { label: "Actual Revenue (Q1)", value: "$598M", sub: "through March 31", subColor: "#646569" },
            { label: "Forecasted Revenue (Q1)", value: "$612M", sub: "original plan", subColor: "#646569" },
            { label: "Variance", value: "−$14M", sub: "−2.3% vs plan", subColor: "#C80037", valueColor: "#C80037" },
            { label: "Run Rate Forecast (FY)", value: "$2.34B", sub: "vs $2.41B plan", subColor: "#FFC107" },
            { label: "Gap to Close", value: "$70M", sub: "to hit annual target", subColor: "#C80037", valueColor: "#C80037", accent: true },
          ].map((k) => (
            <div
              key={k.label}
              className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              style={k.accent ? { borderTop: "3px solid #C80037" } : {}}
            >
              <p className="text-xs font-semibold text-[#646569] uppercase tracking-wider mb-2">{k.label}</p>
              <p className="text-2xl font-bold leading-none" style={{ color: k.valueColor ?? "#2D2D2D" }}>{k.value}</p>
              <p className="text-xs mt-2 font-medium" style={{ color: k.subColor }}>{k.sub}</p>
            </div>
          ))}
        </div>

        {/* ── TOP: Recovery Chart (left 55%) + What-If Simulator (right 45%) ── */}
        <div className="grid gap-4" style={{ gridTemplateColumns: "55% 45%" }}>

          {/* Path to Forecast Recovery */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className="mb-4">
              <h2 className="text-sm font-bold text-[#2D2D2D]">Path to Forecast Recovery</h2>
              <p className="text-xs text-[#646569] mt-0.5">Cumulative revenue through Dec 2026 — three paths</p>
            </div>
            <ResponsiveContainer width="100%" height={270}>
              <ComposedChart data={RECOVERY_DATA} margin={{ top: 4, right: 8, left: -8, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#646569" }} axisLine={false} tickLine={false} />
                <YAxis
                  domain={[0, 2600]}
                  tick={{ fontSize: 11, fill: "#646569" }}
                  axisLine={false} tickLine={false}
                  tickFormatter={(v) => `$${(v / 1000).toFixed(1)}B`}
                />
                <Tooltip content={<RecoveryTooltip />} />
                <Line type="monotone" dataKey="plan" stroke="#9ca3af" strokeWidth={2} strokeDasharray="6 3" dot={false} name="Annual Plan" />
                <Line type="monotone" dataKey="actuals" stroke="#C80037" strokeWidth={2.5} dot={(p: { index: number; cx: number; cy: number }) => p.index <= 2 ? <circle key={p.index} cx={p.cx} cy={p.cy} r={3} fill="#C80037" /> : <g key={p.index} />} name="Actuals / Trajectory" />
                <Line type="monotone" dataKey="recovery" stroke="#28A745" strokeWidth={2.5} dot={false} name="Recovery Path" />
              </ComposedChart>
            </ResponsiveContainer>
            <div className="flex gap-5 mt-3 flex-wrap">
              {[
                { color: "#9ca3af", dash: true,  label: "Annual Plan ($2.41B)" },
                { color: "#C80037", dash: false, label: "Actuals / Trajectory" },
                { color: "#28A745", dash: false, label: "Recovery Path" },
              ].map((l) => (
                <div key={l.label} className="flex items-center gap-1.5">
                  <svg width={22} height={10}>
                    <line x1={0} y1={5} x2={22} y2={5} stroke={l.color} strokeWidth={2} strokeDasharray={l.dash ? "5 3" : undefined} />
                  </svg>
                  <span className="text-xs text-[#646569]">{l.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* What-If Simulator */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col">
            <div className="mb-3">
              <h2 className="text-sm font-bold text-[#2D2D2D]">What-If Simulator</h2>
              <p className="text-xs text-[#646569] mt-0.5">Explore which actions can recover the variance</p>
            </div>

            {/* Chat history */}
            <div className="flex-1 overflow-y-auto flex flex-col gap-2.5 max-h-[300px] pr-1">
              {CHAT.map((msg, i) => (
                msg.role === "user" ? (
                  <div key={i} className="self-end bg-[#F5F5F5] rounded-xl px-3 py-2 text-xs text-[#2D2D2D] max-w-[88%]">
                    {msg.text}
                  </div>
                ) : (
                  <div key={i} className="border-l-2 border-[#C80037] bg-[#FAFAFA] rounded-r-xl px-3 py-2.5 text-xs text-[#2D2D2D]">
                    <p className="mb-1.5 leading-relaxed">{msg.text}</p>
                    <ul className="list-disc pl-4 space-y-1 mb-2">
                      {msg.bullets?.map((b, j) => <li key={j} className="leading-snug">{b}</li>)}
                    </ul>
                    {msg.note && <p className="text-[#646569] italic mb-2 leading-snug">{msg.note}</p>}
                    <div className="flex flex-wrap gap-1.5">
                      {msg.actions?.map((a) => (
                        <button key={a} className="text-[10px] font-semibold text-[#C80037] bg-[#C80037]/8 border border-[#C80037]/20 rounded px-2 py-1 hover:bg-[#C80037]/15 transition-colors cursor-pointer">
                          {a}
                        </button>
                      ))}
                    </div>
                  </div>
                )
              ))}
            </div>

            {/* Quick what-ifs */}
            <div className="flex flex-wrap gap-1.5 mt-3">
              {QUICK_WHATS.map((q) => (
                <button
                  key={q}
                  onClick={() => setChatInput(q)}
                  className="text-[10px] text-[#646569] bg-[#F5F5F5] border border-gray-200 rounded-full px-2.5 py-1 hover:border-gray-300 transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>

            {/* Input */}
            <div className="flex items-center gap-2 mt-3">
              <input
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ask: 'If we do X, where do we land?'"
                className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-xs text-[#2D2D2D] outline-none focus:border-[#C80037] transition-colors"
              />
              <button className="bg-[#C80037] hover:bg-[#A00029] rounded-lg p-2 transition-colors flex-shrink-0">
                <Send size={13} className="text-white" />
              </button>
            </div>
          </div>
        </div>

        {/* ── BOTTOM: Variance Waterfall (left 55%) + Driver Cards (right 45%) ── */}
        <div className="grid gap-4" style={{ gridTemplateColumns: "55% 45%" }}>

          {/* Variance Waterfall */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className="mb-4">
              <h2 className="text-sm font-bold text-[#2D2D2D]">Q1 Variance Walk: Forecast to Actuals — Biktarvy (US)</h2>
              <p className="text-xs text-[#646569] mt-0.5">Bridge from Q1 plan to Q1 actuals ($M)</p>
            </div>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={WATERFALL_DATA} margin={{ top: 20, right: 12, left: -8, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#646569" }} axisLine={false} tickLine={false} />
                <YAxis domain={[585, 618]} tick={{ fontSize: 10, fill: "#646569" }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}M`} />
                <Tooltip content={<WaterfallTooltip />} />
                <Bar dataKey="spacer" stackId="a" fill="transparent" />
                <Bar dataKey="bar" stackId="a" radius={[3, 3, 0, 0]}>
                  {WATERFALL_DATA.map((entry, i) => (
                    <Cell key={i} fill={waterfallColor(entry.type)} />
                  ))}
                  <LabelList dataKey="label" position="top" style={{ fontSize: 10, fill: "#2D2D2D", fontWeight: 600 }} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div className="flex gap-5 mt-3">
              {[["#646569", "Total"], ["#C80037", "Negative driver"], ["#28A745", "Positive offset"]].map(([c, l]) => (
                <div key={l} className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-sm" style={{ background: c }} />
                  <span className="text-xs text-[#646569]">{l}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Driver Detail Cards */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col">
            <h2 className="text-sm font-bold text-[#2D2D2D] mb-4">Driver Detail</h2>
            <div className="overflow-y-auto flex flex-col gap-3 max-h-[320px] pr-1">
              {DRIVERS.map((d, i) => (
                <div
                  key={i}
                  className="rounded-r-xl px-3 py-2.5"
                  style={{
                    borderLeft: `3px solid ${d.positive ? "#28A745" : "#C80037"}`,
                    background: d.positive ? "#F0FFF4" : "#FFF8FA",
                    border: `1px solid ${d.positive ? "#28A74520" : "#C8003720"}`,
                    borderLeftWidth: 3,
                    borderLeftColor: d.positive ? "#28A745" : "#C80037",
                  }}
                >
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <span className="text-xs font-semibold text-[#2D2D2D] leading-snug flex-1">{d.title}</span>
                    <span className="text-xs font-bold flex-shrink-0" style={{ color: d.positive ? "#28A745" : "#C80037" }}>{d.impact}</span>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] font-medium px-1.5 py-0.5 rounded" style={{ background: d.positive ? "#28A74518" : "#C8003718", color: d.positive ? "#28A745" : "#C80037" }}>{d.tag}</span>
                    <span className="text-[10px] font-medium px-1.5 py-0.5 rounded" style={{ background: `${d.statusColor}18`, color: d.statusColor }}>{d.status}</span>
                  </div>
                  <p className="text-xs text-[#646569] leading-snug mb-2">{d.cause}</p>
                  <button className="text-[10px] font-semibold text-[#C80037] hover:text-[#A00029] transition-colors">
                    {d.positive ? "View in Event Modeler →" : "Create Corrective Scenario →"}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}
