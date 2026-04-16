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

// ─── Types ───────────────────────────────────────────────────────────────────

interface GanttEvent {
  id: string;
  name: string;
  color: string;
  startCol: number; // 0-indexed (May=0 … Sep=4)
  spanCols: number;
}

// ─── Constants ───────────────────────────────────────────────────────────────

const MONTHS = ["May", "Jun", "Jul", "Aug", "Sep"];

const GANTT_EVENTS: GanttEvent[] = [
  { id: "1", name: "Competitor Launch: Sunlenca Generic", color: "#C80037", startCol: 1, spanCols: 3 },
  { id: "2", name: "Formulary Expansion: Aetna + Cigna",  color: "#28A745", startCol: 2, spanCols: 3 },
  { id: "3", name: "Pricing Adjustment: WAC +4.5%",        color: "#FFC107", startCol: 0, spanCols: 1 },
  { id: "4", name: "Stockout Recovery: Southern Region",   color: "#3B82F6", startCol: 1, spanCols: 1 },
];

const IMPACT_DATA = [
  { month: "Apr", baseline: 100, adjusted: 100 },
  { month: "May", baseline: 102, adjusted: 101.5 },
  { month: "Jun", baseline: 104, adjusted: 101.8 },
  { month: "Jul", baseline: 106, adjusted: 103.2 },
  { month: "Aug", baseline: 108, adjusted: 105.4 },
  { month: "Sep", baseline: 110, adjusted: 108.1 },
];

const SEGMENTS = ["Retail", "Hospital", "340B", "VA/DoD"];

// ─── Sub-components ──────────────────────────────────────────────────────────

function FilterDropdown({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
      <label style={{ fontSize: "11px", fontWeight: 600, color: "#646569", textTransform: "uppercase", letterSpacing: "0.06em" }}>
        {label}
      </label>
      <select
        defaultValue={value}
        style={{
          padding: "8px 32px 8px 12px",
          fontSize: "13px",
          fontWeight: 500,
          color: "#1A1A2E",
          backgroundColor: "#FFFFFF",
          border: "1.5px solid #E5E7EB",
          borderRadius: "7px",
          cursor: "pointer",
          appearance: "auto",
          minWidth: "180px",
        }}
      >
        <option>{value}</option>
      </select>
    </div>
  );
}

function GanttBar({ event }: { event: GanttEvent }) {
  const totalCols = MONTHS.length;
  const leftPct = (event.startCol / totalCols) * 100;
  const widthPct = (event.spanCols / totalCols) * 100;

  return (
    <div style={{ position: "relative", height: "32px", marginBottom: "10px" }}>
      <div
        style={{
          position: "absolute",
          left: `${leftPct}%`,
          width: `${widthPct}%`,
          height: "100%",
          backgroundColor: event.color,
          borderRadius: "5px",
          display: "flex",
          alignItems: "center",
          paddingLeft: "10px",
          overflow: "hidden",
        }}
      >
        <span
          style={{
            fontSize: "11px",
            fontWeight: 600,
            color: event.color === "#FFC107" ? "#1A1A2E" : "#FFFFFF",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {event.name}
        </span>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function EventModelerPage() {
  const [activeSegments, setActiveSegments] = useState<string[]>(["Retail", "Hospital", "340B", "VA/DoD"]);
  const [impactValue, setImpactValue] = useState(-2.1);

  const toggleSegment = (seg: string) => {
    setActiveSegments((prev) =>
      prev.includes(seg) ? prev.filter((s) => s !== seg) : [...prev, seg]
    );
  };

  return (
    <DashboardLayout breadcrumb={["Event Modeler", "Biktarvy", "United States"]}>
      {/* ── Page Header ── */}
      <div style={{ marginBottom: "20px" }}>
        <h1
          style={{
            fontSize: "22px",
            fontWeight: 700,
            color: "#1A1A2E",
            margin: "0 0 4px 0",
            letterSpacing: "-0.01em",
          }}
        >
          Event / Intervention Modeler
        </h1>
        <p style={{ fontSize: "13px", color: "#646569", margin: 0 }}>
          Apply structured event-based adjustments to baseline forecasts
        </p>
      </div>

      {/* ── Filters Row ── */}
      <div
        style={{
          display: "flex",
          gap: "20px",
          alignItems: "flex-end",
          backgroundColor: "#FFFFFF",
          border: "1px solid #E5E7EB",
          borderRadius: "10px",
          padding: "16px 20px",
          marginBottom: "20px",
          flexWrap: "wrap",
        }}
      >
        <FilterDropdown label="Brand" value="Biktarvy" />
        <FilterDropdown label="Market" value="United States" />
        <FilterDropdown label="Time Horizon" value="Q2–Q4 2026" />
      </div>

      {/* ── Two Panels ── */}
      <div style={{ display: "flex", gap: "16px", marginBottom: "20px" }}>

        {/* LEFT — Active Events Timeline (55%) */}
        <div
          style={{
            flex: "0 0 55%",
            backgroundColor: "#FFFFFF",
            border: "1px solid #E5E7EB",
            borderRadius: "10px",
            padding: "20px",
            boxSizing: "border-box",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <h2 style={{ fontSize: "14px", fontWeight: 700, color: "#1A1A2E", margin: 0 }}>
              Active Events Timeline
            </h2>
            <span style={{ fontSize: "12px", color: "#646569" }}>May–Sep 2026</span>
          </div>

          {/* Month header grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${MONTHS.length}, 1fr)`,
              marginBottom: "12px",
              borderBottom: "1px solid #F0F0F0",
              paddingBottom: "8px",
            }}
          >
            {MONTHS.map((m) => (
              <div
                key={m}
                style={{
                  fontSize: "11px",
                  fontWeight: 600,
                  color: "#646569",
                  textAlign: "center",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                {m}
              </div>
            ))}
          </div>

          {/* Column grid lines + bars */}
          <div style={{ position: "relative" }}>
            {/* Background grid lines */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "grid",
                gridTemplateColumns: `repeat(${MONTHS.length}, 1fr)`,
                pointerEvents: "none",
              }}
            >
              {MONTHS.map((_, i) => (
                <div
                  key={i}
                  style={{
                    borderRight: i < MONTHS.length - 1 ? "1px dashed #F0F0F0" : "none",
                  }}
                />
              ))}
            </div>

            {/* Gantt bars */}
            <div style={{ position: "relative", zIndex: 1, paddingTop: "4px" }}>
              {GANTT_EVENTS.map((ev) => (
                <GanttBar key={ev.id} event={ev} />
              ))}
            </div>
          </div>

          {/* Legend */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", marginTop: "16px", borderTop: "1px solid #F0F0F0", paddingTop: "14px" }}>
            {GANTT_EVENTS.map((ev) => (
              <div key={ev.id} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <div style={{ width: "10px", height: "10px", borderRadius: "2px", backgroundColor: ev.color, flexShrink: 0 }} />
                <span style={{ fontSize: "11px", color: "#646569" }}>{ev.name}</span>
              </div>
            ))}
          </div>

          {/* Add Event button */}
          <button
            style={{
              marginTop: "18px",
              padding: "9px 18px",
              backgroundColor: "#C80037",
              color: "#FFFFFF",
              fontSize: "13px",
              fontWeight: 600,
              border: "none",
              borderRadius: "7px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.backgroundColor = "#A8002E")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.backgroundColor = "#C80037")}
          >
            <span style={{ fontSize: "16px", lineHeight: 1 }}>+</span>
            Add New Event
          </button>
        </div>

        {/* RIGHT — Event Configuration (45%) */}
        <div
          style={{
            flex: "0 0 calc(45% - 16px)",
            backgroundColor: "#FFFFFF",
            border: "1px solid #E5E7EB",
            borderRadius: "10px",
            padding: "20px",
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
            gap: "14px",
          }}
        >
          <div>
            <h2 style={{ fontSize: "14px", fontWeight: 700, color: "#1A1A2E", margin: "0 0 2px 0" }}>
              Event Configuration
            </h2>
            <p style={{ fontSize: "12px", color: "#646569", margin: 0 }}>
              Competitor Launch: Sunlenca Generic
            </p>
          </div>

          {/* Event Name */}
          <div>
            <label style={labelStyle}>Event Name</label>
            <input
              defaultValue="Competitor Launch: Sunlenca Generic"
              style={inputStyle}
              onFocus={(e) => (e.target.style.borderColor = "#C80037")}
              onBlur={(e) => (e.target.style.borderColor = "#E5E7EB")}
            />
          </div>

          {/* Event Type */}
          <div>
            <label style={labelStyle}>Event Type</label>
            <select defaultValue="Competitor Action" style={inputStyle}>
              <option>Competitor Action</option>
              <option>Formulary Change</option>
              <option>Pricing Adjustment</option>
              <option>Supply Event</option>
            </select>
          </div>

          {/* Impact Direction toggle */}
          <div>
            <label style={labelStyle}>Impact Direction</label>
            <div style={{ display: "flex", gap: "8px" }}>
              {(["Positive", "Negative"] as const).map((dir) => (
                <button
                  key={dir}
                  style={{
                    padding: "7px 16px",
                    fontSize: "12px",
                    fontWeight: 600,
                    borderRadius: "6px",
                    cursor: "pointer",
                    border: dir === "Negative" ? "none" : "1.5px solid #E5E7EB",
                    backgroundColor: dir === "Negative" ? "#C80037" : "#F5F5F5",
                    color: dir === "Negative" ? "#FFFFFF" : "#646569",
                    transition: "all 0.15s",
                  }}
                >
                  {dir === "Positive" ? "▲ Positive" : "▼ Negative"}
                </button>
              ))}
            </div>
          </div>

          {/* Estimated Impact slider */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <label style={labelStyle}>Estimated Impact</label>
              <span
                style={{
                  fontSize: "14px",
                  fontWeight: 700,
                  color: "#C80037",
                }}
              >
                {impactValue.toFixed(1)}%
              </span>
            </div>
            <input
              type="range"
              min={-10}
              max={10}
              step={0.1}
              value={impactValue}
              onChange={(e) => setImpactValue(parseFloat(e.target.value))}
              style={{
                width: "100%",
                accentColor: "#C80037",
                marginTop: "6px",
              }}
            />
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "10px", color: "#9CA3AF", marginTop: "2px" }}>
              <span>-10%</span>
              <span>0%</span>
              <span>+10%</span>
            </div>
          </div>

          {/* Affected Segments */}
          <div>
            <label style={labelStyle}>Affected Segments</label>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "6px" }}>
              {SEGMENTS.map((seg) => {
                const active = activeSegments.includes(seg);
                return (
                  <button
                    key={seg}
                    onClick={() => toggleSegment(seg)}
                    style={{
                      padding: "5px 12px",
                      fontSize: "12px",
                      fontWeight: 500,
                      borderRadius: "20px",
                      cursor: "pointer",
                      border: active ? "none" : "1.5px solid #E5E7EB",
                      backgroundColor: active ? "#1A1A2E" : "#F5F5F5",
                      color: active ? "#FFFFFF" : "#646569",
                      transition: "all 0.15s",
                    }}
                  >
                    {seg}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Confidence Level */}
          <div>
            <label style={labelStyle}>Confidence Level</label>
            <select defaultValue="Medium" style={inputStyle}>
              <option>High</option>
              <option>Medium</option>
              <option>Low</option>
            </select>
          </div>

          {/* Date pickers */}
          <div style={{ display: "flex", gap: "12px" }}>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Start Date</label>
              <input type="date" defaultValue="2026-06-01" style={inputStyle}
                onFocus={(e) => (e.target.style.borderColor = "#C80037")}
                onBlur={(e) => (e.target.style.borderColor = "#E5E7EB")}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>End Date</label>
              <input type="date" defaultValue="2026-08-31" style={inputStyle}
                onFocus={(e) => (e.target.style.borderColor = "#C80037")}
                onBlur={(e) => (e.target.style.borderColor = "#E5E7EB")}
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label style={labelStyle}>Notes</label>
            <textarea
              rows={3}
              defaultValue="Generic entry anticipated mid-June. Estimated ~2% market share erosion across Retail and Hospital channels within 60 days."
              style={{
                ...inputStyle,
                resize: "vertical",
                fontFamily: "inherit",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#C80037")}
              onBlur={(e) => (e.target.style.borderColor = "#E5E7EB")}
            />
          </div>

          {/* Action buttons */}
          <div style={{ display: "flex", gap: "10px", marginTop: "4px" }}>
            <button
              style={{
                flex: 1,
                padding: "10px",
                backgroundColor: "#C80037",
                color: "#FFFFFF",
                fontSize: "13px",
                fontWeight: 600,
                border: "none",
                borderRadius: "7px",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.backgroundColor = "#A8002E")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.backgroundColor = "#C80037")}
            >
              Apply to Forecast
            </button>
            <button
              style={{
                flex: 1,
                padding: "10px",
                backgroundColor: "transparent",
                color: "#646569",
                fontSize: "13px",
                fontWeight: 600,
                border: "1.5px solid #D1D5DB",
                borderRadius: "7px",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                const b = e.currentTarget as HTMLButtonElement;
                b.style.backgroundColor = "#F5F5F5";
                b.style.borderColor = "#9CA3AF";
              }}
              onMouseLeave={(e) => {
                const b = e.currentTarget as HTMLButtonElement;
                b.style.backgroundColor = "transparent";
                b.style.borderColor = "#D1D5DB";
              }}
            >
              Save Draft
            </button>
          </div>
        </div>
      </div>

      {/* ── Impact Preview Chart ── */}
      <div
        style={{
          backgroundColor: "#FFFFFF",
          border: "1px solid #E5E7EB",
          borderRadius: "10px",
          padding: "20px",
        }}
      >
        <div style={{ marginBottom: "16px" }}>
          <h2 style={{ fontSize: "14px", fontWeight: 700, color: "#1A1A2E", margin: "0 0 2px 0" }}>
            Impact Preview
          </h2>
          <p style={{ fontSize: "12px", color: "#646569", margin: 0 }}>
            Baseline vs. adjusted forecast with active events applied — Biktarvy US (indexed, Apr 2026 = 100)
          </p>
        </div>

        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={IMPACT_DATA} margin={{ top: 8, right: 24, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 12, fill: "#646569" }}
              axisLine={{ stroke: "#E5E7EB" }}
              tickLine={false}
            />
            <YAxis
              domain={[98, 112]}
              tick={{ fontSize: 12, fill: "#646569" }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v: number) => `${v}`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#FFFFFF",
                border: "1px solid #E5E7EB",
                borderRadius: "8px",
                fontSize: "12px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
              }}
              formatter={(value) => [
                Number(value).toFixed(1),
                "",
              ]}
            />
            <Legend
              iconType="circle"
              iconSize={8}
              formatter={(value: string) =>
                value === "baseline" ? "Baseline Forecast" : "Adjusted Forecast"
              }
              wrapperStyle={{ fontSize: "12px", color: "#646569" }}
            />
            <Line
              type="monotone"
              dataKey="baseline"
              stroke="#646569"
              strokeWidth={2}
              strokeDasharray="5 4"
              dot={false}
              activeDot={{ r: 4, strokeWidth: 0 }}
            />
            <Line
              type="monotone"
              dataKey="adjusted"
              stroke="#C80037"
              strokeWidth={2.5}
              dot={{ r: 3.5, fill: "#C80037", strokeWidth: 0 }}
              activeDot={{ r: 5, strokeWidth: 0 }}
            />
          </LineChart>
        </ResponsiveContainer>

        {/* Summary callout */}
        <div
          style={{
            marginTop: "14px",
            padding: "12px 16px",
            backgroundColor: "#FFF5F7",
            border: "1px solid #FFC0C9",
            borderRadius: "8px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <div
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              backgroundColor: "#C80037",
              flexShrink: 0,
            }}
          />
          <p style={{ fontSize: "12px", color: "#1A1A2E", margin: 0 }}>
            <strong>Net forecast impact:</strong> Adjusted forecast is{" "}
            <span style={{ color: "#C80037", fontWeight: 700 }}>−2.1%</span> below
            baseline by end of Sep 2026, driven primarily by the Sunlenca Generic
            competitor launch event.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}

// ─── Shared styles ────────────────────────────────────────────────────────────

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: "11px",
  fontWeight: 600,
  color: "#646569",
  textTransform: "uppercase",
  letterSpacing: "0.06em",
  marginBottom: "5px",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "8px 12px",
  fontSize: "13px",
  color: "#1A1A2E",
  backgroundColor: "#FAFAFA",
  border: "1.5px solid #E5E7EB",
  borderRadius: "7px",
  outline: "none",
  boxSizing: "border-box",
  transition: "border-color 0.15s",
  fontFamily: "inherit",
};
