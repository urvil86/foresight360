"use client";

import DashboardLayout from "@/components/DashboardLayout";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  ResponsiveContainer,
} from "recharts";

// ─── Waterfall Data ──────────────────────────────────────────────────────────
// Each bar: base (invisible stack) + value (visible colored bar)
// Running total for waterfall positioning
const waterfallData = [
  { name: "Base Forecast", base: 0, value: 398, total: 398, type: "base" },
  { name: "Formulary Win", base: 398, value: 8, total: 406, type: "positive" },
  { name: "Pricing Adjustment", base: 406, value: 6, total: 412, type: "positive" },
  { name: "Competitor Launch", base: 407, value: -5, total: 402, type: "negative" },
  { name: "Patient Switching", base: 400, value: -2, total: 398, type: "negative" },
  { name: "Seasonal Trend", base: 398, value: 7, total: 405, type: "positive_blue" },
  { name: "Adjusted Forecast", base: 0, value: 412, total: 412, type: "adjusted" },
];

// For negative bars, base = total (lower edge), value = abs(delta)
const chartData = waterfallData.map((d) => {
  if (d.type === "negative") {
    return { ...d, chartBase: d.total, chartValue: Math.abs(d.value) };
  }
  return { ...d, chartBase: d.base, chartValue: d.value };
});

const BAR_COLORS: Record<string, string> = {
  base: "#646569",
  positive: "#28A745",
  positive_blue: "#3B82F6",
  negative: "#C80037",
  adjusted: "#C80037",
};

// ─── Assumption Log Data ─────────────────────────────────────────────────────
const assumptions = [
  {
    assumption: "Market growth rate",
    value: "3.2%",
    source: "Axtria Baseline",
    appliedBy: "System",
    date: "Apr 1",
    confidence: "High",
  },
  {
    assumption: "Sunlenca generic entry",
    value: "-1.2% share impact",
    source: "CI Feed",
    appliedBy: "Urvil Shah",
    date: "Apr 10",
    confidence: "Medium",
  },
  {
    assumption: "Aetna formulary add",
    value: "+45K scripts/yr",
    source: "Event Modeler",
    appliedBy: "Sarah Chen",
    date: "Apr 8",
    confidence: "High",
  },
  {
    assumption: "WAC pricing change",
    value: "+4.5%",
    source: "Pricing Team",
    appliedBy: "Urvil Shah",
    date: "Apr 12",
    confidence: "High",
  },
  {
    assumption: "Patient switching estimate",
    value: "4.2%",
    source: "Market Research",
    appliedBy: "System",
    date: "Apr 3",
    confidence: "Medium",
  },
];

// ─── Version History Data ────────────────────────────────────────────────────
const versions = [
  {
    version: "v4",
    label: "Current",
    date: "Apr 14",
    description: "Added Q2 pricing event",
    author: "Urvil Shah",
    current: true,
  },
  {
    version: "v3",
    label: "",
    date: "Apr 10",
    description: "Incorporated competitor launch scenario",
    author: "Sarah Chen",
    current: false,
  },
  {
    version: "v2",
    label: "",
    date: "Apr 5",
    description: "Updated formulary assumptions",
    author: "System",
    current: false,
  },
  {
    version: "v1",
    label: "",
    date: "Apr 1",
    description: "Initial baseline from Axtria",
    author: "System",
    current: false,
  },
];

// ─── Confidence Badge ────────────────────────────────────────────────────────
function ConfidenceBadge({ level }: { level: string }) {
  const isHigh = level === "High";
  return (
    <span
      className="inline-flex items-center gap-1 text-[10px] font-semibold px-2.5 py-0.5 rounded-full border"
      style={{
        color: isHigh ? "#28A745" : "#B45309",
        backgroundColor: isHigh ? "#F0FFF4" : "#FFFBEB",
        borderColor: isHigh ? "#28A74530" : "#FFC10730",
      }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full inline-block"
        style={{ backgroundColor: isHigh ? "#28A745" : "#FFC107" }}
      />
      {level}
    </span>
  );
}

// ─── Custom Waterfall Tooltip ────────────────────────────────────────────────
function WaterfallTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { payload: (typeof chartData)[0] }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  const isEndpoint = d.type === "base" || d.type === "adjusted";
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-xl p-3 text-xs min-w-[160px]">
      <p className="font-semibold text-[#2D2D2D] mb-1.5 text-sm">{label}</p>
      {isEndpoint ? (
        <p className="text-[#646569]">
          Total:{" "}
          <span className="font-bold text-[#2D2D2D]">${d.value}M</span>
        </p>
      ) : (
        <>
          <p className="text-[#646569]">
            Impact:{" "}
            <span
              className="font-bold"
              style={{ color: d.value >= 0 ? "#28A745" : "#C80037" }}
            >
              {d.value >= 0 ? "+" : ""}
              {d.value}M
            </span>
          </p>
          <p className="text-[#646569] mt-0.5">
            Running total:{" "}
            <span className="font-bold text-[#2D2D2D]">${d.total}M</span>
          </p>
        </>
      )}
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────
export default function ForecastDriversPage() {
  return (
    <DashboardLayout
      breadcrumb={["Forecast Drivers", "Biktarvy", "US", "June 2026"]}
    >
      <div className="space-y-6">

        {/* ── Page Header ───────────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl px-6 py-5 shadow-sm border border-gray-100">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h1 className="text-lg font-bold text-[#2D2D2D] leading-tight">
                Forecast Drivers — Biktarvy (US) — June 2026
              </h1>
              <p className="text-sm text-[#646569] mt-1">
                <span className="font-semibold text-[#2D2D2D]">
                  Adjusted Forecast: $412M
                </span>
                &nbsp;·&nbsp; Base: $398M &nbsp;·&nbsp;
                <span className="text-[#28A745] font-semibold">
                  Net Adjustment: +$14M (+3.5%)
                </span>
              </p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold bg-[#F0FFF4] text-[#28A745] border border-[#28A74530] rounded-full px-3 py-1 uppercase tracking-wide">
                <span className="w-1.5 h-1.5 rounded-full bg-[#28A745] inline-block" />
                High Confidence
              </span>
              <span className="text-[10px] text-[#646569] font-medium">
                Last updated Apr 14, 2026
              </span>
            </div>
          </div>
        </div>

        {/* ── Section 1: Waterfall Chart ─────────────────────────────────── */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-start justify-between mb-5">
            <div>
              <h2 className="text-sm font-bold text-[#2D2D2D]">
                Forecast Bridge — Base to Adjusted
              </h2>
              <p className="text-xs text-[#646569] mt-0.5">
                Contribution of each driver to the final adjusted forecast
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs text-[#646569]">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm inline-block bg-[#646569]" />
                Endpoint
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm inline-block bg-[#28A745]" />
                Positive
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm inline-block bg-[#C80037]" />
                Negative
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm inline-block bg-[#3B82F6]" />
                Seasonal
              </span>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={320}>
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 16, left: 0, bottom: 0 }}
              barCategoryGap="20%"
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" vertical={false} />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 11, fill: "#646569" }}
                axisLine={false}
                tickLine={false}
                interval={0}
                angle={-12}
                textAnchor="end"
                height={48}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "#646569" }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `$${v}M`}
                domain={[370, 430]}
              />
              <Tooltip content={<WaterfallTooltip />} cursor={{ fill: "#F5F5F5" }} />

              {/* Invisible base bar for waterfall offset */}
              <Bar dataKey="chartBase" stackId="waterfall" fill="transparent" />

              {/* Visible colored bar */}
              <Bar dataKey="chartValue" stackId="waterfall" radius={[4, 4, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={BAR_COLORS[entry.type]}
                    fillOpacity={entry.type === "adjusted" ? 1 : 0.85}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>

          {/* Summary row */}
          <div className="mt-4 pt-4 border-t border-gray-100 flex flex-wrap gap-4 text-xs">
            {[
              { label: "Base Forecast", value: "$398M", color: "#646569" },
              { label: "Total Positive", value: "+$21M", color: "#28A745" },
              { label: "Total Negative", value: "-$7M", color: "#C80037" },
              { label: "Net Adjustment", value: "+$14M", color: "#3B82F6" },
              { label: "Adjusted Forecast", value: "$412M", color: "#C80037" },
            ].map((s) => (
              <div key={s.label} className="flex flex-col gap-0.5">
                <span className="text-[#646569] uppercase tracking-wide font-semibold text-[10px]">
                  {s.label}
                </span>
                <span className="font-bold text-base" style={{ color: s.color }}>
                  {s.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Section 2: Assumption Log ──────────────────────────────────── */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <div>
              <h2 className="text-sm font-bold text-[#2D2D2D]">Assumption Log</h2>
              <p className="text-xs text-[#646569] mt-0.5">
                All assumptions applied to this forecast version
              </p>
            </div>
            <span className="text-[10px] bg-[#F5F5F5] text-[#646569] rounded-full px-2.5 py-1 font-semibold border border-gray-200">
              {assumptions.length} assumptions
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#FAFAFA] border-b border-gray-100">
                  {[
                    "Assumption",
                    "Value",
                    "Source",
                    "Applied By",
                    "Date",
                    "Confidence",
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
                {assumptions.map((row, i) => (
                  <tr
                    key={i}
                    className="border-b border-gray-50 hover:bg-[#FFF8FA] group transition-colors duration-100 cursor-default"
                  >
                    <td className="px-6 py-3.5">
                      <span className="font-semibold text-[#2D2D2D] group-hover:text-[#C80037] transition-colors">
                        {row.assumption}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 font-mono text-xs text-[#2D2D2D] tabular-nums">
                      {row.value}
                    </td>
                    <td className="px-6 py-3.5">
                      <span className="text-xs text-[#646569] bg-[#F5F5F5] rounded-md px-2 py-0.5 border border-gray-200">
                        {row.source}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 text-xs text-[#2D2D2D]">
                      {row.appliedBy === "System" ? (
                        <span className="flex items-center gap-1.5">
                          <span className="w-5 h-5 rounded-full bg-[#F5F5F5] border border-gray-200 flex items-center justify-center text-[8px] font-bold text-[#646569]">
                            S
                          </span>
                          System
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5">
                          <span
                            className="w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-bold text-white flex-shrink-0"
                            style={{ backgroundColor: "#C80037" }}
                          >
                            {row.appliedBy.charAt(0)}
                          </span>
                          {row.appliedBy}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-3.5 text-xs text-[#646569]">{row.date}</td>
                    <td className="px-6 py-3.5">
                      <ConfidenceBadge level={row.confidence} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── Section 3: Version History ─────────────────────────────────── */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-sm font-bold text-[#2D2D2D]">Version History</h2>
              <p className="text-xs text-[#646569] mt-0.5">
                Audit trail of forecast changes
              </p>
            </div>
            <span className="text-[10px] bg-[#F5F5F5] text-[#646569] rounded-full px-2.5 py-1 font-semibold border border-gray-200">
              4 versions
            </span>
          </div>

          {/* Timeline */}
          <div className="relative">
            {/* Vertical connector line */}
            <div className="absolute left-[19px] top-6 bottom-6 w-0.5 bg-gray-200" />

            <div className="flex flex-col gap-0">
              {versions.map((v, i) => (
                <div
                  key={i}
                  className={`relative flex gap-4 pb-6 last:pb-0 group ${
                    v.current ? "cursor-default" : "cursor-default"
                  }`}
                >
                  {/* Dot */}
                  <div
                    className="relative z-10 flex-shrink-0 w-10 h-10 rounded-full border-2 flex items-center justify-center shadow-sm transition-transform duration-150 group-hover:scale-110"
                    style={{
                      borderColor: v.current ? "#C80037" : "#D1D5DB",
                      backgroundColor: v.current ? "#FFF0F3" : "#FAFAFA",
                    }}
                  >
                    <span
                      className="text-[10px] font-bold"
                      style={{ color: v.current ? "#C80037" : "#646569" }}
                    >
                      {v.version}
                    </span>
                  </div>

                  {/* Content card */}
                  <div
                    className={`flex-1 rounded-xl p-4 border transition-all duration-150 group-hover:shadow-sm ${
                      v.current
                        ? "border-[#C8003730] bg-[#FFF8FA]"
                        : "border-gray-100 bg-[#FAFAFA]"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span
                            className="text-sm font-bold"
                            style={{ color: v.current ? "#C80037" : "#2D2D2D" }}
                          >
                            {v.version}
                          </span>
                          {v.current && (
                            <span className="inline-flex items-center text-[10px] font-semibold bg-[#C80037] text-white rounded-full px-2 py-0.5 uppercase tracking-wide">
                              Current
                            </span>
                          )}
                          <span className="text-xs text-[#646569]">·</span>
                          <span className="text-xs text-[#646569]">{v.date}</span>
                        </div>
                        <p
                          className="text-xs font-medium leading-snug"
                          style={{ color: v.current ? "#2D2D2D" : "#646569" }}
                        >
                          {v.description}
                        </p>
                      </div>
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        {v.author === "System" ? (
                          <span className="w-6 h-6 rounded-full bg-[#F5F5F5] border border-gray-200 flex items-center justify-center text-[9px] font-bold text-[#646569]">
                            S
                          </span>
                        ) : (
                          <span
                            className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold text-white"
                            style={{ backgroundColor: "#C80037" }}
                          >
                            {v.author.charAt(0)}
                          </span>
                        )}
                        <span className="text-xs text-[#646569]">{v.author}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="mt-6 pt-5 border-t border-gray-100 flex items-center gap-3">
            <button className="flex items-center gap-2 text-xs font-semibold text-white bg-[#C80037] hover:bg-[#A00029] rounded-lg px-4 py-2 transition-colors shadow-sm">
              <svg
                className="w-3.5 h-3.5"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M8 1v9M4 7l4 4 4-4M2 14h12" />
              </svg>
              Export Audit Trail
            </button>
            <button className="flex items-center gap-2 text-xs font-semibold text-[#646569] hover:text-[#2D2D2D] border border-gray-200 rounded-lg px-4 py-2 hover:bg-gray-50 transition-colors">
              <svg
                className="w-3.5 h-3.5"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M2 4h12M2 8h8M2 12h5" />
                <path d="M11 10l3 3-3 3" />
              </svg>
              Compare Versions
            </button>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}
