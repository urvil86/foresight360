"use client";

import DashboardLayout from "@/components/DashboardLayout";
import {
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// ─── Sample Data ────────────────────────────────────────────────────────────

const forecastData = [
  { month: "Jan", baseline: 198, adjusted: 198, low: 190, high: 206 },
  { month: "Feb", baseline: 202, adjusted: 204, low: 195, high: 213 },
  { month: "Mar", baseline: 207, adjusted: 210, low: 201, high: 219 },
  { month: "Apr", baseline: 210, adjusted: 208, low: 199, high: 217 },
  { month: "May", baseline: 214, adjusted: 215, low: 205, high: 225 },
  { month: "Jun", baseline: 218, adjusted: 220, low: 209, high: 231 },
  { month: "Jul", baseline: 221, adjusted: 219, low: 208, high: 230 },
  { month: "Aug", baseline: 225, adjusted: 228, low: 216, high: 240 },
  { month: "Sep", baseline: 229, adjusted: 233, low: 220, high: 246 },
  { month: "Oct", baseline: 233, adjusted: 237, low: 224, high: 250 },
  { month: "Nov", baseline: 237, adjusted: 241, low: 228, high: 254 },
  { month: "Dec", baseline: 241, adjusted: 246, low: 232, high: 260 },
];

const tableData = [
  {
    brand: "Biktarvy",
    base: "$2.40B",
    adjusted: "$2.51B",
    delta: "+4.6%",
    confidence: 87,
    lastUpdated: "Apr 14, 2026",
    deltaPos: true,
  },
  {
    brand: "Descovy",
    base: "$0.98B",
    adjusted: "$1.02B",
    delta: "+4.1%",
    confidence: 82,
    lastUpdated: "Apr 14, 2026",
    deltaPos: true,
  },
  {
    brand: "Veklury",
    base: "$1.15B",
    adjusted: "$1.09B",
    delta: "-5.2%",
    confidence: 74,
    lastUpdated: "Apr 13, 2026",
    deltaPos: false,
  },
  {
    brand: "Trodelvy",
    base: "$0.72B",
    adjusted: "$0.75B",
    delta: "+4.2%",
    confidence: 79,
    lastUpdated: "Apr 12, 2026",
    deltaPos: true,
  },
  {
    brand: "Yescarta",
    base: "$0.55B",
    adjusted: "$0.53B",
    delta: "-3.6%",
    confidence: 68,
    lastUpdated: "Apr 11, 2026",
    deltaPos: false,
  },
];

const events = [
  {
    label: "Competitor Launch — Sunlenca GenEq",
    impact: "-2.1%",
    color: "#C80037",
    bg: "#FFF0F3",
    positive: false,
    date: "Mar 15, 2026",
  },
  {
    label: "Formulary Win — Aetna",
    impact: "+1.4%",
    color: "#28A745",
    bg: "#F0FFF4",
    positive: true,
    date: "Feb 28, 2026",
  },
  {
    label: "Pricing Adjustment Q2",
    impact: "+0.8%",
    color: "#FFC107",
    bg: "#FFFBF0",
    positive: true,
    date: "Jan 10, 2026",
  },
];

// ─── Confidence Bar Component ────────────────────────────────────────────────

function ConfidenceBar({ value }: { value: number }) {
  const color =
    value >= 85 ? "#28A745" : value >= 75 ? "#FFC107" : "#C80037";
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${value}%`, backgroundColor: color }}
        />
      </div>
      <span className="text-xs font-semibold w-9 text-right" style={{ color }}>
        {value}%
      </span>
    </div>
  );
}

// ─── Circular Progress ───────────────────────────────────────────────────────

function CircularProgress({ value }: { value: number }) {
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;
  return (
    <svg width="72" height="72" className="-rotate-90">
      <circle
        cx="36"
        cy="36"
        r={radius}
        fill="none"
        stroke="#E5E7EB"
        strokeWidth="6"
      />
      <circle
        cx="36"
        cy="36"
        r={radius}
        fill="none"
        stroke="#28A745"
        strokeWidth="6"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transition: "stroke-dashoffset 0.8s ease" }}
      />
    </svg>
  );
}

// ─── Custom Tooltip ──────────────────────────────────────────────────────────

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { color: string; name: string; value: number }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-xl p-3 text-xs min-w-[140px]">
      <p className="font-semibold text-[#2D2D2D] mb-2 text-sm">{label} 2026</p>
      {payload.map((entry, i) => (
        <div key={i} className="flex items-center justify-between gap-4 py-0.5">
          <span className="flex items-center gap-1.5">
            <span
              className="inline-block w-2 h-2 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-gray-500">{entry.name}</span>
          </span>
          <span className="font-semibold text-[#2D2D2D]">${entry.value}M</span>
        </div>
      ))}
    </div>
  );
}

// ─── KPI Card ────────────────────────────────────────────────────────────────

function KpiCard({
  title,
  value,
  sub,
  badge,
  children,
}: {
  title: string;
  value: string;
  sub?: string;
  badge?: string;
  children?: React.ReactNode;
}) {
  return (
    <div
      className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100
                 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-default"
    >
      <p className="text-xs font-semibold text-[#646569] uppercase tracking-wider mb-3">
        {title}
      </p>
      <div className="flex items-end justify-between gap-3">
        <div>
          <p className="text-3xl font-bold text-[#2D2D2D] leading-none">{value}</p>
          {sub && (
            <p className="text-xs text-[#646569] mt-1.5 leading-snug">{sub}</p>
          )}
          {badge && (
            <span className="inline-block mt-2 text-[10px] font-semibold bg-[#F0FFF4] text-[#28A745] border border-[#28A745]/20 rounded-full px-2 py-0.5 uppercase tracking-wide">
              {badge}
            </span>
          )}
        </div>
        {children}
      </div>
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  return (
    <DashboardLayout breadcrumb={["Dashboard", "Biktarvy", "United States"]}>
      <div className="space-y-6">

        {/* ── KPI Cards ─────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">

          {/* Base Forecast */}
          <KpiCard
            title="Base Forecast"
            value="$2.4B"
            sub="+3.2% vs prior"
          >
            <div className="flex flex-col items-end gap-1">
              <svg
                className="w-8 h-8 text-[#28A745]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.5}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="18 15 12 9 6 15" />
              </svg>
              <span className="text-[10px] font-semibold text-[#28A745]">
                ▲ 3.2%
              </span>
            </div>
          </KpiCard>

          {/* Adjusted Forecast */}
          <KpiCard
            title="Adjusted Forecast"
            value="$2.51B"
            badge="event adjusted"
          />

          {/* Active Scenarios */}
          <KpiCard
            title="Active Scenarios"
            value="4"
            sub="2 pending review"
          >
            <div className="flex gap-1 items-end pb-1">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="w-2 rounded-sm"
                  style={{
                    height: `${14 + i * 6}px`,
                    backgroundColor: i <= 2 ? "#C80037" : "#E5E7EB",
                  }}
                />
              ))}
            </div>
          </KpiCard>

          {/* Forecast Confidence */}
          <div
            className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100
                       hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-default"
          >
            <p className="text-xs font-semibold text-[#646569] uppercase tracking-wider mb-3">
              Forecast Confidence
            </p>
            <div className="flex items-center justify-between gap-2">
              <div>
                <p className="text-3xl font-bold text-[#2D2D2D] leading-none">87%</p>
                <p className="text-xs text-[#28A745] mt-1.5 font-semibold">High confidence</p>
              </div>
              <div className="relative flex items-center justify-center">
                <CircularProgress value={87} />
                <span className="absolute text-[11px] font-bold text-[#28A745]">
                  87
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Main Content Row ───────────────────────────────────────── */}
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-4">

          {/* Left — Line Chart (60%) */}
          <div className="xl:col-span-3 bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-sm font-bold text-[#2D2D2D]">
                  Forecast Trend — Biktarvy (US)
                </h2>
                <p className="text-xs text-[#646569] mt-0.5">
                  Monthly revenue projection · FY 2026
                </p>
              </div>
              <div className="flex items-center gap-4 text-xs text-[#646569]">
                <span className="flex items-center gap-1.5">
                  <span className="w-4 h-0.5 bg-[#646569] inline-block rounded" />
                  Baseline
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-4 h-0.5 bg-[#C80037] inline-block rounded" />
                  Adjusted
                </span>
                <span className="flex items-center gap-1.5">
                  <span
                    className="w-4 h-2 inline-block rounded"
                    style={{ backgroundColor: "#C80037", opacity: 0.12 }}
                  />
                  95% CI
                </span>
              </div>
            </div>

            <ResponsiveContainer width="100%" height={260}>
              <ComposedChart data={forecastData} margin={{ top: 4, right: 8, left: -8, bottom: 0 }}>
                <defs>
                  <linearGradient id="ciGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#C80037" stopOpacity={0.15} />
                    <stop offset="100%" stopColor="#C80037" stopOpacity={0.03} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" vertical={false} />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 11, fill: "#646569" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "#646569" }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `$${v}M`}
                  domain={[180, 270]}
                />
                <Tooltip content={<CustomTooltip />} />
                {/* Confidence band */}
                <Area
                  type="monotone"
                  dataKey="high"
                  stroke="none"
                  fill="url(#ciGradient)"
                  name="CI High"
                  legendType="none"
                />
                <Area
                  type="monotone"
                  dataKey="low"
                  stroke="none"
                  fill="#F5F5F5"
                  name="CI Low"
                  legendType="none"
                />
                <Line
                  type="monotone"
                  dataKey="baseline"
                  stroke="#646569"
                  strokeWidth={2}
                  dot={false}
                  name="Baseline"
                  activeDot={{ r: 5, fill: "#646569" }}
                />
                <Line
                  type="monotone"
                  dataKey="adjusted"
                  stroke="#C80037"
                  strokeWidth={2.5}
                  dot={false}
                  name="Adjusted"
                  activeDot={{ r: 5, fill: "#C80037" }}
                  strokeDasharray="0"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          {/* Right — Events Timeline (40%) */}
          <div className="xl:col-span-2 bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-[#2D2D2D]">
                Recent Events Applied
              </h2>
              <span className="text-[10px] bg-[#F5F5F5] text-[#646569] rounded-full px-2.5 py-1 font-semibold border border-gray-200">
                3 events
              </span>
            </div>

            <div className="relative flex flex-col gap-0 flex-1">
              {/* Vertical line */}
              <div className="absolute left-[13px] top-3 bottom-3 w-px bg-gray-200" />

              {events.map((ev, i) => (
                <div
                  key={i}
                  className="relative flex gap-3 group pb-5 last:pb-0"
                >
                  {/* Dot */}
                  <div
                    className="relative z-10 mt-0.5 w-7 h-7 rounded-full border-2 flex items-center justify-center flex-shrink-0 shadow-sm transition-transform duration-150 group-hover:scale-110"
                    style={{
                      borderColor: ev.color,
                      backgroundColor: ev.bg,
                    }}
                  >
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: ev.color }}
                    />
                  </div>

                  {/* Content */}
                  <div
                    className="flex-1 rounded-xl p-3 border transition-all duration-150 group-hover:shadow-sm cursor-default"
                    style={{
                      backgroundColor: ev.bg,
                      borderColor: `${ev.color}28`,
                    }}
                  >
                    <p className="text-xs font-semibold text-[#2D2D2D] leading-snug">
                      {ev.label}
                    </p>
                    <div className="flex items-center justify-between mt-1.5">
                      <span className="text-[10px] text-[#646569]">{ev.date}</span>
                      <span
                        className="text-xs font-bold"
                        style={{ color: ev.color }}
                      >
                        {ev.impact}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-auto pt-4 border-t border-gray-100">
              <button className="w-full text-xs font-semibold text-[#C80037] hover:text-[#A00029] transition-colors py-1.5 text-center">
                View all events →
              </button>
            </div>
          </div>
        </div>

        {/* ── Market Snapshot Table ──────────────────────────────────── */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <div>
              <h2 className="text-sm font-bold text-[#2D2D2D]">Market Snapshot</h2>
              <p className="text-xs text-[#646569] mt-0.5">
                Portfolio overview · as of Apr 15, 2026
              </p>
            </div>
            <div className="flex gap-2">
              <button className="text-xs font-semibold text-[#646569] hover:text-[#2D2D2D] border border-gray-200 rounded-lg px-3 py-1.5 hover:bg-gray-50 transition-colors">
                Export
              </button>
              <button className="text-xs font-semibold text-white bg-[#C80037] hover:bg-[#A00029] rounded-lg px-3 py-1.5 transition-colors shadow-sm">
                Run Forecast
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#FAFAFA] border-b border-gray-100">
                  {[
                    "Brand",
                    "Base Forecast",
                    "Adjusted Forecast",
                    "Delta",
                    "Confidence",
                    "Last Updated",
                  ].map((h) => (
                    <th
                      key={h}
                      className="text-left text-[10px] font-semibold text-[#646569] uppercase tracking-wider px-6 py-3"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tableData.map((row, i) => (
                  <tr
                    key={i}
                    className="border-b border-gray-50 hover:bg-[#FFF8FA] group transition-colors duration-100 cursor-pointer"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2.5">
                        <div
                          className="w-2 h-2 rounded-full flex-shrink-0"
                          style={{
                            backgroundColor:
                              i === 0 ? "#C80037" : i === 1 ? "#646569" : i === 2 ? "#FFC107" : i === 3 ? "#28A745" : "#6366F1",
                          }}
                        />
                        <span className="font-semibold text-[#2D2D2D] group-hover:text-[#C80037] transition-colors">
                          {row.brand}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-[#2D2D2D] tabular-nums">{row.base}</td>
                    <td className="px-6 py-4 font-semibold text-[#2D2D2D] tabular-nums">
                      {row.adjusted}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full"
                        style={{
                          color: row.deltaPos ? "#28A745" : "#C80037",
                          backgroundColor: row.deltaPos ? "#F0FFF4" : "#FFF0F3",
                        }}
                      >
                        {row.deltaPos ? "▲" : "▼"} {row.delta}
                      </span>
                    </td>
                    <td className="px-6 py-4 w-40">
                      <ConfidenceBar value={row.confidence} />
                    </td>
                    <td className="px-6 py-4 text-xs text-[#646569]">{row.lastUpdated}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="px-6 py-3 bg-[#FAFAFA] border-t border-gray-100 flex items-center justify-between">
            <p className="text-xs text-[#646569]">Showing 5 of 14 brands</p>
            <button className="text-xs font-semibold text-[#C80037] hover:text-[#A00029] transition-colors">
              View all brands →
            </button>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}
