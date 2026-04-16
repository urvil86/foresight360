"use client";

import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";

// ─── Data ────────────────────────────────────────────────────────────────────

const treemapData = [
  { label: "United States", value: 2410, growth: 8.4, flex: 5.5 },
  { label: "EU5",           value: 890,  growth: 5.1, flex: 2.0 },
  { label: "Japan",         value: 340,  growth: 3.2, flex: 0.77 },
  { label: "Rest of World", value: 210,  growth: 6.7, flex: 0.48 },
  { label: "Canada",        value: 180,  growth: 4.8, flex: 0.41 },
  { label: "Australia",     value: 95,   growth: 2.9, flex: 0.22 },
];

// Growth range for color intensity: 2.9 – 8.4
const MIN_GROWTH = 2.9;
const MAX_GROWTH = 8.4;

function growthColor(growth: number): string {
  const t = (growth - MIN_GROWTH) / (MAX_GROWTH - MIN_GROWTH); // 0–1
  // Interpolate: light pink (#FFCCD9) → deep crimson (#C80037)
  const r = Math.round(255 + (200 - 255) * t);
  const g = Math.round(204 + (0   - 204) * t);
  const b = Math.round(217 + (55  - 217) * t);
  return `rgb(${r},${g},${b})`;
}

function growthTextColor(growth: number): string {
  const t = (growth - MIN_GROWTH) / (MAX_GROWTH - MIN_GROWTH);
  return t > 0.5 ? "#FFFFFF" : "#1A1A1A";
}

function fmtM(m: number): string {
  if (m >= 1000) return `$${(m / 1000).toFixed(2)}B`;
  return `$${m}M`;
}

// ─── Hierarchical Table Data ──────────────────────────────────────────────────

type RowStatus = "Approved" | "Draft" | "Under Review";

interface TableRow {
  id: string;
  market: string;
  indent: number;
  base: string;
  adjusted: string;
  delta: string;
  deltaPositive: boolean;
  yoy: string;
  status: RowStatus;
  children?: string[];
}

const rowMap: Record<string, TableRow> = {
  global: {
    id: "global", market: "Global Total", indent: 0,
    base: "$4.13B", adjusted: "$4.13B", delta: "—", deltaPositive: true,
    yoy: "+6.2%", status: "Approved",
  },
  namerica: {
    id: "namerica", market: "North America", indent: 1,
    base: "$2.59B", adjusted: "$2.61B", delta: "+$20M", deltaPositive: true,
    yoy: "+7.8%", status: "Approved",
    children: ["us", "canada"],
  },
  us: {
    id: "us", market: "United States", indent: 2,
    base: "$2.41B", adjusted: "$2.43B", delta: "+$20M", deltaPositive: true,
    yoy: "+8.4%", status: "Approved",
  },
  canada: {
    id: "canada", market: "Canada", indent: 2,
    base: "$180M", adjusted: "$180M", delta: "—", deltaPositive: true,
    yoy: "+4.8%", status: "Approved",
  },
  europe: {
    id: "europe", market: "Europe", indent: 1,
    base: "$890M", adjusted: "$875M", delta: "-$15M", deltaPositive: false,
    yoy: "+5.1%", status: "Under Review",
    children: ["germany", "france", "uk", "italy", "spain"],
  },
  germany: {
    id: "germany", market: "Germany", indent: 2,
    base: "$245M", adjusted: "$240M", delta: "-$5M", deltaPositive: false,
    yoy: "+5.8%", status: "Under Review",
  },
  france: {
    id: "france", market: "France", indent: 2,
    base: "$198M", adjusted: "$195M", delta: "-$3M", deltaPositive: false,
    yoy: "+4.9%", status: "Draft",
  },
  uk: {
    id: "uk", market: "United Kingdom", indent: 2,
    base: "$187M", adjusted: "$185M", delta: "-$2M", deltaPositive: false,
    yoy: "+4.7%", status: "Draft",
  },
  italy: {
    id: "italy", market: "Italy", indent: 2,
    base: "$142M", adjusted: "$140M", delta: "-$2M", deltaPositive: false,
    yoy: "+4.4%", status: "Under Review",
  },
  spain: {
    id: "spain", market: "Spain", indent: 2,
    base: "$118M", adjusted: "$115M", delta: "-$3M", deltaPositive: false,
    yoy: "+4.1%", status: "Draft",
  },
  apac: {
    id: "apac", market: "Asia Pacific", indent: 1,
    base: "$435M", adjusted: "$438M", delta: "+$3M", deltaPositive: true,
    yoy: "+3.5%", status: "Draft",
  },
  row: {
    id: "row", market: "Rest of World", indent: 1,
    base: "$210M", adjusted: "$212M", delta: "+$2M", deltaPositive: true,
    yoy: "+6.7%", status: "Under Review",
  },
};

const ROOT_ORDER = ["global", "namerica", "europe", "apac", "row"];
const EXPANDABLE = new Set(["namerica", "europe"]);

// ─── Alignment Tracker Data ───────────────────────────────────────────────────

interface AlignmentRow {
  market: string;
  submitted: number;
  reviewed: number;
  approved: number;
}

const alignmentData: AlignmentRow[] = [
  { market: "United States",  submitted: 100, reviewed: 100, approved: 100 },
  { market: "Canada",         submitted: 100, reviewed: 100, approved: 100 },
  { market: "Germany",        submitted: 100, reviewed: 80,  approved: 0   },
  { market: "France",         submitted: 100, reviewed: 60,  approved: 0   },
  { market: "United Kingdom", submitted: 100, reviewed: 55,  approved: 0   },
  { market: "Italy",          submitted: 100, reviewed: 70,  approved: 0   },
  { market: "Spain",          submitted: 80,  reviewed: 40,  approved: 0   },
  { market: "Japan",          submitted: 100, reviewed: 90,  approved: 60  },
  { market: "Australia",      submitted: 100, reviewed: 100, approved: 80  },
  { market: "Rest of World",  submitted: 60,  reviewed: 30,  approved: 0   },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: RowStatus }) {
  const cfg: Record<RowStatus, { bg: string; color: string }> = {
    Approved:      { bg: "#D1FAE5", color: "#28A745" },
    Draft:         { bg: "#F3F4F6", color: "#646569" },
    "Under Review":{ bg: "#FEF3C7", color: "#B45309" },
  };
  const { bg, color } = cfg[status];
  return (
    <span
      style={{
        backgroundColor: bg,
        color,
        fontSize: "11px",
        fontWeight: 600,
        padding: "2px 8px",
        borderRadius: "999px",
        whiteSpace: "nowrap",
      }}
    >
      {status}
    </span>
  );
}

function AlignmentBar({ label, pct }: { label: string; pct: number }) {
  return (
    <div style={{ flex: 1, minWidth: 100 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
        <span style={{ fontSize: 11, color: "#646569" }}>{label}</span>
        <span style={{ fontSize: 11, fontWeight: 600, color: "#1A1A1A" }}>{pct}%</span>
      </div>
      <div style={{ height: 8, backgroundColor: "#E5E7EB", borderRadius: 999, overflow: "hidden" }}>
        <div
          style={{
            height: "100%",
            width: `${pct}%`,
            backgroundColor: "#C80037",
            borderRadius: 999,
            transition: "width 0.4s ease",
          }}
        />
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ConsolidatorPage() {
  const [activeToggle, setActiveToggle] = useState<"market" | "brand" | "franchise">("market");
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  function toggleRow(id: string) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  // Build flat visible rows
  const visibleRows: TableRow[] = [];
  for (const id of ROOT_ORDER) {
    visibleRows.push(rowMap[id]);
    if (expanded.has(id) && rowMap[id].children) {
      for (const childId of rowMap[id].children!) {
        visibleRows.push(rowMap[childId]);
      }
    }
  }

  const card: React.CSSProperties = {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
    padding: "24px",
    marginBottom: "24px",
  };

  const sectionTitle: React.CSSProperties = {
    fontSize: 15,
    fontWeight: 700,
    color: "#1A1A1A",
    marginBottom: 4,
  };

  const sectionSub: React.CSSProperties = {
    fontSize: 12,
    color: "#646569",
    marginBottom: 20,
  };

  return (
    <DashboardLayout breadcrumb={["Consolidator", "HIV Franchise", "Global"]}>
      <div
        style={{
          fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
          maxWidth: 1200,
          margin: "0 auto",
        }}
      >
        {/* ── Page Header ── */}
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: "#1A1A1A", margin: "0 0 4px 0" }}>
            Forecast Consolidation
          </h1>
          <p style={{ fontSize: 13, color: "#646569", margin: 0 }}>
            Align and aggregate forecasts across country, regional, and global levels
          </p>
        </div>

        {/* ── Controls Row ── */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            marginBottom: 24,
            flexWrap: "wrap",
          }}
        >
          {/* Toggle buttons */}
          <div
            style={{
              display: "flex",
              border: "1px solid #D1D5DB",
              borderRadius: 7,
              overflow: "hidden",
            }}
          >
            {(
              [
                { key: "market",    label: "By Market"   },
                { key: "brand",     label: "By Brand"    },
                { key: "franchise", label: "By Franchise"},
              ] as const
            ).map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setActiveToggle(key)}
                style={{
                  padding: "8px 18px",
                  fontSize: 13,
                  fontWeight: 500,
                  border: "none",
                  borderRight: key !== "franchise" ? "1px solid #D1D5DB" : "none",
                  cursor: "pointer",
                  backgroundColor: activeToggle === key ? "#C80037" : "#FFFFFF",
                  color: activeToggle === key ? "#FFFFFF" : "#374151",
                  transition: "background-color 0.15s, color 0.15s",
                }}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Dropdowns */}
          <div style={{ display: "flex", gap: 12 }}>
            {/* Franchise */}
            <div style={{ position: "relative" }}>
              <label style={{ fontSize: 11, color: "#646569", display: "block", marginBottom: 2 }}>
                Franchise
              </label>
              <select
                defaultValue="HIV"
                style={{
                  padding: "7px 32px 7px 12px",
                  fontSize: 13,
                  border: "1px solid #D1D5DB",
                  borderRadius: 7,
                  backgroundColor: "#FFFFFF",
                  color: "#1A1A1A",
                  cursor: "pointer",
                  appearance: "none",
                  WebkitAppearance: "none",
                  backgroundImage:
                    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23646569' d='M6 8L1 3h10z'/%3E%3C/svg%3E\")",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right 10px center",
                }}
              >
                <option>HIV</option>
                <option>Oncology</option>
                <option>Inflammation</option>
              </select>
            </div>

            {/* Scenario */}
            <div style={{ position: "relative" }}>
              <label style={{ fontSize: 11, color: "#646569", display: "block", marginBottom: 2 }}>
                Scenario
              </label>
              <select
                defaultValue="Base Case"
                style={{
                  padding: "7px 32px 7px 12px",
                  fontSize: 13,
                  border: "1px solid #D1D5DB",
                  borderRadius: 7,
                  backgroundColor: "#FFFFFF",
                  color: "#1A1A1A",
                  cursor: "pointer",
                  appearance: "none",
                  WebkitAppearance: "none",
                  backgroundImage:
                    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23646569' d='M6 8L1 3h10z'/%3E%3C/svg%3E\")",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right 10px center",
                }}
              >
                <option>Base Case</option>
                <option>Upside</option>
                <option>Downside</option>
              </select>
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════
            Section 1 — Geographic Treemap
        ══════════════════════════════════════════════════ */}
        <div style={card}>
          <p style={sectionTitle}>Global Forecast — HIV Franchise (Base Case)</p>
          <p style={sectionSub}>
            Block area proportional to revenue · Color intensity mapped to YoY growth rate
          </p>

          {/* Legend */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 16,
              fontSize: 11,
              color: "#646569",
            }}
          >
            <span>Low growth</span>
            <div
              style={{
                width: 120,
                height: 10,
                borderRadius: 999,
                background: "linear-gradient(to right, #FFCCD9, #C80037)",
              }}
            />
            <span>High growth</span>
          </div>

          {/* Treemap */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 6,
              width: "100%",
              minHeight: 200,
            }}
          >
            {treemapData.map((d) => (
              <div
                key={d.label}
                style={{
                  flex: `${d.flex} 0 0`,
                  minWidth: 80,
                  minHeight: d.flex > 3 ? 200 : d.flex > 1 ? 160 : 120,
                  backgroundColor: growthColor(d.growth),
                  borderRadius: 8,
                  padding: "14px 16px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-end",
                  cursor: "default",
                  position: "relative",
                  transition: "filter 0.15s",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.filter = "brightness(0.92)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.filter = "brightness(1)";
                }}
              >
                <div
                  style={{
                    fontSize: d.flex > 3 ? 15 : 12,
                    fontWeight: 700,
                    color: growthTextColor(d.growth),
                    lineHeight: 1.2,
                    marginBottom: 4,
                  }}
                >
                  {d.label}
                </div>
                <div
                  style={{
                    fontSize: d.flex > 3 ? 20 : 14,
                    fontWeight: 800,
                    color: growthTextColor(d.growth),
                  }}
                >
                  {fmtM(d.value)}
                </div>
                <div
                  style={{
                    fontSize: 11,
                    color: growthTextColor(d.growth),
                    opacity: 0.85,
                    marginTop: 2,
                  }}
                >
                  +{d.growth}% YoY
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ══════════════════════════════════════════════════
            Section 2 — Hierarchical Consolidation Table
        ══════════════════════════════════════════════════ */}
        <div style={card}>
          <p style={sectionTitle}>Hierarchical Consolidation Table</p>
          <p style={sectionSub}>
            Expand rows to drill into regional and country-level forecasts
          </p>

          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ backgroundColor: "#F5F5F5" }}>
                  {[
                    "Market",
                    "Base Forecast",
                    "Adjusted Forecast",
                    "Delta",
                    "YoY Growth",
                    "Status",
                  ].map((col) => (
                    <th
                      key={col}
                      style={{
                        padding: "10px 14px",
                        textAlign: col === "Market" ? "left" : "right",
                        fontWeight: 600,
                        color: "#646569",
                        fontSize: 11,
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                        whiteSpace: "nowrap",
                        borderBottom: "1px solid #E5E7EB",
                      }}
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {visibleRows.map((row) => {
                  const isExpandable = EXPANDABLE.has(row.id);
                  const isExpanded = expanded.has(row.id);
                  const isChild = row.indent === 2;
                  return (
                    <tr
                      key={row.id}
                      style={{
                        backgroundColor: isChild ? "#FAFAFA" : "#FFFFFF",
                        borderBottom: "1px solid #F3F4F6",
                        cursor: isExpandable ? "pointer" : "default",
                      }}
                      onClick={() => isExpandable && toggleRow(row.id)}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLTableRowElement).style.backgroundColor =
                          isChild ? "#F3F4F6" : "#FFF5F7";
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLTableRowElement).style.backgroundColor =
                          isChild ? "#FAFAFA" : "#FFFFFF";
                      }}
                    >
                      {/* Market name */}
                      <td
                        style={{
                          padding: "11px 14px",
                          paddingLeft: `${14 + row.indent * 20}px`,
                          fontWeight: row.indent === 0 ? 700 : row.indent === 1 ? 600 : 400,
                          color: "#1A1A1A",
                          whiteSpace: "nowrap",
                        }}
                      >
                        <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          {isExpandable && (
                            <span
                              style={{
                                fontSize: 11,
                                color: "#C80037",
                                fontWeight: 700,
                                width: 14,
                                display: "inline-block",
                                textAlign: "center",
                                flexShrink: 0,
                              }}
                            >
                              {isExpanded ? "▼" : "▶"}
                            </span>
                          )}
                          {!isExpandable && row.indent > 0 && (
                            <span style={{ width: 14, display: "inline-block" }} />
                          )}
                          {row.market}
                        </span>
                      </td>
                      <td style={{ padding: "11px 14px", textAlign: "right", color: "#1A1A1A" }}>
                        {row.base}
                      </td>
                      <td style={{ padding: "11px 14px", textAlign: "right", color: "#1A1A1A", fontWeight: 600 }}>
                        {row.adjusted}
                      </td>
                      <td
                        style={{
                          padding: "11px 14px",
                          textAlign: "right",
                          color: row.delta === "—" ? "#646569" : row.deltaPositive ? "#28A745" : "#C80037",
                          fontWeight: 600,
                        }}
                      >
                        {row.delta}
                      </td>
                      <td
                        style={{
                          padding: "11px 14px",
                          textAlign: "right",
                          color: "#28A745",
                          fontWeight: 600,
                        }}
                      >
                        {row.yoy}
                      </td>
                      <td style={{ padding: "11px 14px", textAlign: "right" }}>
                        <StatusBadge status={row.status} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════
            Section 3 — Alignment Tracker
        ══════════════════════════════════════════════════ */}
        <div style={card}>
          <p style={sectionTitle}>Alignment Tracker</p>
          <p style={sectionSub}>
            Forecast submission and approval progress by market
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {alignmentData.map((row) => (
              <div key={row.market}>
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: "#1A1A1A",
                    marginBottom: 10,
                  }}
                >
                  {row.market}
                </div>
                <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
                  <AlignmentBar label="Submitted" pct={row.submitted} />
                  <AlignmentBar label="Reviewed"  pct={row.reviewed}  />
                  <AlignmentBar label="Approved"  pct={row.approved}  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Bottom Actions ── */}
        <div
          style={{
            display: "flex",
            gap: 12,
            justifyContent: "flex-end",
            paddingBottom: 24,
          }}
        >
          <button
            style={{
              padding: "10px 22px",
              fontSize: 13,
              fontWeight: 600,
              border: "1.5px solid #C80037",
              borderRadius: 7,
              backgroundColor: "transparent",
              color: "#C80037",
              cursor: "pointer",
              transition: "background-color 0.15s, color 0.15s",
            }}
            onMouseEnter={(e) => {
              const b = e.currentTarget;
              b.style.backgroundColor = "#FFF5F7";
            }}
            onMouseLeave={(e) => {
              const b = e.currentTarget;
              b.style.backgroundColor = "transparent";
            }}
          >
            Export Global View
          </button>
          <button
            style={{
              padding: "10px 22px",
              fontSize: 13,
              fontWeight: 600,
              border: "none",
              borderRadius: 7,
              backgroundColor: "#C80037",
              color: "#FFFFFF",
              cursor: "pointer",
              transition: "background-color 0.15s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#A8002E";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#C80037";
            }}
          >
            Generate Alignment Report
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}
