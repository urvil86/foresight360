"use client";

import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import {
  TrendingUp,
  Rocket,
  Megaphone,
  Award,
  Globe2,
  Search,
  CheckCircle2,
  Info,
  ArrowRight,
  Layers,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
type UseCaseId =
  | "market-growth"
  | "launch-uptake"
  | "promo-response"
  | "tender"
  | "partnership";

interface UseCase {
  id: UseCaseId;
  label: string;
  shortLabel: string;
  description: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  count: number;
}

interface AnalogEntry {
  id: string;
  title: string;
  subtitle: string;
  useCase: UseCaseId;
  region: string;
  period: string;
  tags: string[];
  sparkPoints: number[];
  dataPoints: number;
  metric: string;
  metricValue: string;
  fitsBestFor: string;
}

// ─── Predefined Use Cases (in scope) ──────────────────────────────────────────
const USE_CASES: UseCase[] = [
  {
    id: "market-growth",
    label: "Market Growth Patterns",
    shortLabel: "Market Growth",
    description: "Historical trend curves for total market expansion or contraction",
    icon: TrendingUp,
    count: 4,
  },
  {
    id: "launch-uptake",
    label: "SKU / Product Launch Uptake",
    shortLabel: "Launch Uptake",
    description: "Adoption curves from past launches to inform new product trajectories",
    icon: Rocket,
    count: 5,
  },
  {
    id: "promo-response",
    label: "Promotional Response",
    shortLabel: "Promo Response",
    description: "Short-term lift patterns from prior promotional campaigns",
    icon: Megaphone,
    count: 3,
  },
  {
    id: "tender",
    label: "Tender Wins & Losses",
    shortLabel: "Tender",
    description: "Institutional share shifts following tender outcomes",
    icon: Award,
    count: 3,
  },
  {
    id: "partnership",
    label: "Country-Level Partnerships",
    shortLabel: "Partnership",
    description: "Co-marketing / co-distribution patterns from comparable markets",
    icon: Globe2,
    count: 2,
  },
];

// ─── Predefined Structured Analog Library ─────────────────────────────────────
const ANALOGS: AnalogEntry[] = [
  // Market Growth
  {
    id: "mg-1",
    title: "HIV Treatment Market — US",
    subtitle: "Total market growth 2018–2023",
    useCase: "market-growth",
    region: "US",
    period: "2018–2023",
    tags: ["HIV", "Mature Market"],
    sparkPoints: [60, 65, 71, 76, 82, 88, 92, 95, 98, 100],
    dataPoints: 60,
    metric: "Avg CAGR",
    metricValue: "5.4%",
    fitsBestFor: "Steady-growth markets with established treatment paradigms",
  },
  {
    id: "mg-2",
    title: "Oncology Immunotherapy — EU5",
    subtitle: "Class growth post-checkpoint inhibitor era",
    useCase: "market-growth",
    region: "EU5",
    period: "2016–2022",
    tags: ["Oncology", "Class Expansion"],
    sparkPoints: [10, 22, 38, 52, 68, 78, 86, 92, 96, 100],
    dataPoints: 72,
    metric: "Avg CAGR",
    metricValue: "18.2%",
    fitsBestFor: "Rapidly expanding therapeutic classes",
  },
  {
    id: "mg-3",
    title: "Hepatitis C — Global",
    subtitle: "Cure-driven market contraction",
    useCase: "market-growth",
    region: "Global",
    period: "2015–2020",
    tags: ["HepC", "Contraction"],
    sparkPoints: [100, 95, 82, 65, 48, 38, 32, 28, 25, 22],
    dataPoints: 60,
    metric: "Avg Decline",
    metricValue: "-22%/yr",
    fitsBestFor: "Markets facing therapeutic obsolescence",
  },
  {
    id: "mg-4",
    title: "Diabetes GLP-1 Class — US",
    subtitle: "Category growth with new entrants",
    useCase: "market-growth",
    region: "US",
    period: "2019–2024",
    tags: ["Diabetes", "Category Lift"],
    sparkPoints: [25, 32, 42, 55, 68, 80, 88, 94, 97, 100],
    dataPoints: 60,
    metric: "Avg CAGR",
    metricValue: "24.7%",
    fitsBestFor: "Categories with breakthrough innovation",
  },
  // Launch Uptake
  {
    id: "lu-1",
    title: "Biktarvy Launch — US",
    subtitle: "Single-tablet HIV regimen uptake",
    useCase: "launch-uptake",
    region: "US",
    period: "2018–2021",
    tags: ["HIV", "STR", "First-in-Class"],
    sparkPoints: [5, 18, 35, 52, 68, 78, 86, 92, 96, 100],
    dataPoints: 36,
    metric: "Peak Share (Mo 24)",
    metricValue: "44%",
    fitsBestFor: "Best-in-class single-tablet regimen launches",
  },
  {
    id: "lu-2",
    title: "Trikafta Launch — US",
    subtitle: "CF triple combo rapid uptake",
    useCase: "launch-uptake",
    region: "US",
    period: "2019–2022",
    tags: ["CF", "Rapid Adoption"],
    sparkPoints: [12, 38, 62, 78, 88, 93, 96, 98, 99, 100],
    dataPoints: 36,
    metric: "Peak Share (Mo 18)",
    metricValue: "85%",
    fitsBestFor: "Breakthrough therapy designations with strong differentiation",
  },
  {
    id: "lu-3",
    title: "Repatha Launch — US",
    subtitle: "PCSK9 inhibitor measured uptake",
    useCase: "launch-uptake",
    region: "US",
    period: "2015–2020",
    tags: ["Cardio", "Access-Constrained"],
    sparkPoints: [3, 8, 15, 22, 30, 38, 46, 54, 62, 70],
    dataPoints: 60,
    metric: "Peak Share (Mo 36)",
    metricValue: "12%",
    fitsBestFor: "Launches with significant payer access barriers",
  },
  {
    id: "lu-4",
    title: "Sunlenca Launch — US",
    subtitle: "Long-acting HIV (heavily-treated)",
    useCase: "launch-uptake",
    region: "US",
    period: "2023–2025",
    tags: ["HIV", "Long-Acting"],
    sparkPoints: [2, 6, 12, 20, 28, 36, 44, 50, 56, 60],
    dataPoints: 24,
    metric: "Peak Share (Mo 24)",
    metricValue: "8%",
    fitsBestFor: "Niche / specialty population launches",
  },
  {
    id: "lu-5",
    title: "Yescarta Launch — US",
    subtitle: "CAR-T cell therapy uptake",
    useCase: "launch-uptake",
    region: "US",
    period: "2017–2022",
    tags: ["Oncology", "CAR-T"],
    sparkPoints: [4, 12, 22, 34, 46, 58, 68, 76, 84, 90],
    dataPoints: 60,
    metric: "Site Activation (Mo 36)",
    metricValue: "180 sites",
    fitsBestFor: "Cell therapy with site-of-care constraints",
  },
  // Promo Response
  {
    id: "pr-1",
    title: "Descovy DTC Campaign — US",
    subtitle: "Q2-Q3 2022 promotional lift",
    useCase: "promo-response",
    region: "US",
    period: "2022 Q2–Q3",
    tags: ["DTC", "PrEP"],
    sparkPoints: [50, 55, 68, 82, 78, 72, 65, 58, 54, 52],
    dataPoints: 12,
    metric: "Peak Lift",
    metricValue: "+18%",
    fitsBestFor: "Direct-to-consumer pull marketing in PrEP",
  },
  {
    id: "pr-2",
    title: "HCP Speaker Program — Yescarta",
    subtitle: "KOL-driven academic medical center push",
    useCase: "promo-response",
    region: "US",
    period: "2021 H2",
    tags: ["HCP", "Speaker Program"],
    sparkPoints: [40, 42, 48, 56, 62, 65, 64, 60, 56, 54],
    dataPoints: 24,
    metric: "Referral Lift",
    metricValue: "+12%",
    fitsBestFor: "Specialty channel HCP engagement",
  },
  {
    id: "pr-3",
    title: "Co-Pay Card Refresh — Trodelvy",
    subtitle: "Affordability program relaunch",
    useCase: "promo-response",
    region: "US",
    period: "2023 Q1",
    tags: ["Affordability", "Adherence"],
    sparkPoints: [60, 62, 68, 75, 80, 82, 80, 78, 76, 75],
    dataPoints: 12,
    metric: "Persistence Lift",
    metricValue: "+9%",
    fitsBestFor: "Patient affordability initiatives",
  },
  // Tender
  {
    id: "td-1",
    title: "VA Tender Win — Biktarvy",
    subtitle: "Federal contract share shift",
    useCase: "tender",
    region: "US Federal",
    period: "2020",
    tags: ["VA/DoD", "Win"],
    sparkPoints: [20, 22, 28, 42, 58, 70, 78, 82, 84, 85],
    dataPoints: 36,
    metric: "Share Gain",
    metricValue: "+62 pts",
    fitsBestFor: "Single-source federal contracts",
  },
  {
    id: "td-2",
    title: "NHS Procurement Loss — HepC Portfolio",
    subtitle: "UK national tender displacement",
    useCase: "tender",
    region: "UK",
    period: "2017",
    tags: ["NHS", "Loss"],
    sparkPoints: [85, 80, 70, 50, 30, 18, 10, 8, 7, 6],
    dataPoints: 24,
    metric: "Share Loss",
    metricValue: "-78 pts",
    fitsBestFor: "Single-winner national procurement losses",
  },
  {
    id: "td-3",
    title: "Brazilian COE Tender — HIV",
    subtitle: "Centers-of-Excellence allocation",
    useCase: "tender",
    region: "Brazil",
    period: "2019–2021",
    tags: ["LATAM", "COE"],
    sparkPoints: [30, 35, 42, 50, 55, 58, 60, 61, 62, 62],
    dataPoints: 36,
    metric: "Share Gain",
    metricValue: "+30 pts",
    fitsBestFor: "Multi-winner allocated tenders in LATAM",
  },
  // Partnership
  {
    id: "pt-1",
    title: "Japan Co-Promotion — HIV",
    subtitle: "Local partner co-marketing model",
    useCase: "partnership",
    region: "Japan",
    period: "2016–2021",
    tags: ["Japan", "Co-Marketing"],
    sparkPoints: [10, 18, 28, 40, 52, 62, 72, 80, 86, 90],
    dataPoints: 60,
    metric: "Peak Share Uplift",
    metricValue: "+35%",
    fitsBestFor: "Markets requiring local commercial partner",
  },
  {
    id: "pt-2",
    title: "China Co-Distribution — Oncology",
    subtitle: "Joint venture distribution model",
    useCase: "partnership",
    region: "China",
    period: "2018–2023",
    tags: ["China", "JV"],
    sparkPoints: [5, 12, 22, 35, 48, 60, 70, 78, 84, 88],
    dataPoints: 60,
    metric: "Distribution Reach",
    metricValue: "+312 cities",
    fitsBestFor: "Tier-2/3 city expansion via local JVs",
  },
];

// ─── Sparkline ────────────────────────────────────────────────────────────────
function Sparkline({ points, color = "#C80037", width = 96, height = 32 }: { points: number[]; color?: string; width?: number; height?: number }) {
  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = max - min || 1;

  const coords = points.map((p, i) => {
    const x = (i / (points.length - 1)) * width;
    const y = height - ((p - min) / range) * height;
    return `${x},${y}`;
  });

  const pathD = `M ${coords.join(" L ")}`;
  const areaD = `M 0,${height} L ${coords.join(" L ")} L ${width},${height} Z`;
  const gradId = `sg-${color.replace("#", "")}-${Math.random().toString(36).slice(2, 7)}`;

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ display: "block" }}>
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.22} />
          <stop offset="100%" stopColor={color} stopOpacity={0.02} />
        </linearGradient>
      </defs>
      <path d={areaD} fill={`url(#${gradId})`} />
      <path d={pathD} fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ─── Overlay Chart (Analog vs Target) ─────────────────────────────────────────
function OverlayChart({ analogPoints, scaling, offset, weight }: { analogPoints: number[]; scaling: number; offset: number; weight: number }) {
  const w = 480;
  const h = 180;

  // Build target line by applying scaling & offset & blend with a base curve
  const baseCurve = analogPoints.map((p, i) => {
    const blendedBase = 50 + i * 4; // a linear baseline
    const scaled = p * scaling;
    const blended = (weight / 100) * scaled + (1 - weight / 100) * blendedBase;
    return blended;
  });

  // Apply offset by shifting the array
  const shifted = [...baseCurve];
  if (offset > 0) {
    for (let i = 0; i < offset && shifted.length > 1; i++) {
      shifted.unshift(shifted[0]);
      shifted.pop();
    }
  } else if (offset < 0) {
    for (let i = 0; i < Math.abs(offset) && shifted.length > 1; i++) {
      shifted.shift();
      shifted.push(shifted[shifted.length - 1]);
    }
  }

  const allPoints = [...analogPoints, ...shifted];
  const min = Math.min(...allPoints);
  const max = Math.max(...allPoints);
  const range = max - min || 1;
  const padX = 28;
  const padY = 16;

  const toCoord = (arr: number[]) =>
    arr
      .map((p, i) => {
        const x = padX + (i / (arr.length - 1)) * (w - padX * 2);
        const y = h - padY - ((p - min) / range) * (h - padY * 2);
        return `${x},${y}`;
      })
      .join(" L ");

  return (
    <div style={{ backgroundColor: "#FAFAFA", border: "1px solid #E5E7EB", borderRadius: "8px", padding: "12px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
        <span style={{ fontSize: "11px", fontWeight: 600, color: "#646569", textTransform: "uppercase", letterSpacing: "0.06em" }}>
          Analog Overlay vs Forecast
        </span>
        <div style={{ display: "flex", gap: "14px" }}>
          <span style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "10px", color: "#646569" }}>
            <span style={{ width: "16px", height: "2px", backgroundColor: "#C80037", borderRadius: "1px" }} />
            Analog Pattern
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "10px", color: "#646569" }}>
            <span style={{ width: "16px", height: "2px", borderTop: "2px dashed #1A1A2E" }} />
            Adjusted Forecast
          </span>
        </div>
      </div>

      <svg width="100%" viewBox={`0 0 ${w} ${h}`} style={{ display: "block" }}>
        {[0, 1, 2, 3].map((i) => (
          <line
            key={i}
            x1={padX}
            y1={padY + i * ((h - padY * 2) / 3)}
            x2={w - padX}
            y2={padY + i * ((h - padY * 2) / 3)}
            stroke="#E5E7EB"
            strokeWidth={1}
            strokeDasharray="3 3"
          />
        ))}
        {/* Analog line */}
        <path d={`M ${toCoord(analogPoints)}`} fill="none" stroke="#C80037" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
        {/* Adjusted forecast (target) */}
        <path d={`M ${toCoord(shifted)}`} fill="none" stroke="#1A1A2E" strokeWidth={2} strokeDasharray="6 4" strokeLinecap="round" strokeLinejoin="round" />
        {/* X axis ticks */}
        {[0, 3, 6, 9].map((idx) => {
          const x = padX + (idx / (analogPoints.length - 1)) * (w - padX * 2);
          return (
            <text key={idx} x={x} y={h - 2} textAnchor="middle" fontSize="9" fill="#9CA3AF">
              T+{idx * 3}mo
            </text>
          );
        })}
      </svg>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function AnalogToolPage() {
  const [activeUseCase, setActiveUseCase] = useState<UseCaseId>("launch-uptake");
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string>("lu-1");
  const [scaling, setScaling] = useState(1.0);
  const [offset, setOffset] = useState(0);
  const [weight, setWeight] = useState(40);
  const [targetScenario, setTargetScenario] = useState("Competitive Pressure");
  const [applied, setApplied] = useState<string | null>(null);

  const filtered = ANALOGS.filter(
    (a) =>
      a.useCase === activeUseCase &&
      (a.title.toLowerCase().includes(search.toLowerCase()) ||
        a.tags.some((t) => t.toLowerCase().includes(search.toLowerCase())))
  );

  const selected = ANALOGS.find((a) => a.id === selectedId) ?? ANALOGS[0];

  const handleApply = () => {
    setApplied(`${selected.title} → ${targetScenario}`);
    setTimeout(() => setApplied(null), 3000);
  };

  return (
    <DashboardLayout breadcrumb={["Analog Tool", USE_CASES.find((u) => u.id === activeUseCase)?.shortLabel ?? ""]}>
      {/* ── Header ── */}
      <div style={{ marginBottom: "16px", display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "16px", flexWrap: "wrap" }}>
        <div>
          <h1 style={{ fontSize: "22px", fontWeight: 700, color: "#1A1A2E", margin: "0 0 4px 0", letterSpacing: "-0.01em" }}>
            Analog Analysis
          </h1>
          <p style={{ fontSize: "13px", color: "#646569", margin: 0 }}>
            Apply predefined historical analog patterns to support assumption-building and scenario comparison
          </p>
        </div>
      </div>

      {/* ── Use Case Tabs ── */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "16px", flexWrap: "wrap" }}>
        {USE_CASES.map((uc) => {
          const isActive = uc.id === activeUseCase;
          const Icon = uc.icon;
          return (
            <button
              key={uc.id}
              onClick={() => {
                setActiveUseCase(uc.id);
                const first = ANALOGS.find((a) => a.useCase === uc.id);
                if (first) setSelectedId(first.id);
              }}
              style={{
                flex: 1,
                minWidth: "180px",
                padding: "14px 14px",
                backgroundColor: isActive ? "#FFFFFF" : "#FAFAFA",
                border: isActive ? "1.5px solid #C80037" : "1px solid #E5E7EB",
                borderRadius: "10px",
                cursor: "pointer",
                textAlign: "left",
                transition: "all 0.15s",
                boxShadow: isActive ? "0 2px 6px rgba(200,0,55,0.08)" : "none",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "6px" }}>
                <div
                  style={{
                    width: "30px",
                    height: "30px",
                    borderRadius: "7px",
                    backgroundColor: isActive ? "#FFF0F3" : "#F5F5F5",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Icon size={16} className={isActive ? "text-[#C80037]" : "text-[#646569]"} />
                </div>
                <span style={{ fontSize: "11px", color: "#9CA3AF", fontWeight: 600 }}>{uc.count}</span>
              </div>
              <p style={{ fontSize: "13px", fontWeight: 600, color: isActive ? "#C80037" : "#1A1A2E", margin: "0 0 2px 0" }}>
                {uc.shortLabel}
              </p>
              <p style={{ fontSize: "11px", color: "#646569", margin: 0, lineHeight: 1.35 }}>{uc.description}</p>
            </button>
          );
        })}
      </div>

      {/* ── Two Column Layout ── */}
      <div style={{ display: "flex", gap: "16px", marginBottom: "16px" }}>

        {/* LEFT — Analog Library */}
        <div
          style={{
            flex: "0 0 50%",
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
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <h2 style={{ fontSize: "14px", fontWeight: 700, color: "#1A1A2E", margin: 0 }}>
                Analog Library
              </h2>
              <p style={{ fontSize: "11px", color: "#646569", margin: "2px 0 0 0" }}>
                Predefined, structured patterns curated by Foresight
              </p>
            </div>
            <span
              style={{
                fontSize: "10px",
                backgroundColor: "#F5F5F5",
                color: "#646569",
                borderRadius: "20px",
                padding: "3px 10px",
                fontWeight: 600,
                border: "1px solid #E5E7EB",
              }}
            >
              {filtered.length} of {ANALOGS.filter((a) => a.useCase === activeUseCase).length}
            </span>
          </div>

          {/* Search */}
          <div style={{ position: "relative" }}>
            <Search size={14} style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "#9CA3AF" }} />
            <input
              type="text"
              placeholder="Search by name, region, or tag..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: "100%",
                padding: "8px 12px 8px 32px",
                fontSize: "13px",
                color: "#1A1A2E",
                backgroundColor: "#FAFAFA",
                border: "1.5px solid #E5E7EB",
                borderRadius: "7px",
                outline: "none",
                boxSizing: "border-box",
                fontFamily: "inherit",
              }}
            />
          </div>

          {/* Cards */}
          <div style={{ display: "flex", flexDirection: "column", gap: "8px", maxHeight: "520px", overflowY: "auto" }}>
            {filtered.map((analog) => {
              const isSelected = analog.id === selectedId;
              return (
                <button
                  key={analog.id}
                  onClick={() => setSelectedId(analog.id)}
                  style={{
                    padding: "14px 16px",
                    borderRadius: "8px",
                    border: isSelected ? "1.5px solid #C80037" : "1.5px solid #E5E7EB",
                    backgroundColor: isSelected ? "#FFF8FA" : "#FFFFFF",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "12px",
                    transition: "all 0.15s",
                    textAlign: "left",
                    fontFamily: "inherit",
                  }}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                      <p style={{ fontSize: "13px", fontWeight: 600, color: isSelected ? "#C80037" : "#1A1A2E", margin: 0 }}>
                        {analog.title}
                      </p>
                      {isSelected && <CheckCircle2 size={13} className="text-[#C80037]" />}
                    </div>
                    <p style={{ fontSize: "11px", color: "#646569", margin: "0 0 8px 0" }}>
                      {analog.subtitle} · <span style={{ fontWeight: 600 }}>{analog.metric}: {analog.metricValue}</span>
                    </p>
                    <div style={{ display: "flex", gap: "5px", flexWrap: "wrap" }}>
                      {analog.tags.map((tag) => (
                        <span
                          key={tag}
                          style={{
                            fontSize: "10px",
                            fontWeight: 600,
                            padding: "2px 7px",
                            borderRadius: "4px",
                            backgroundColor: "#F5F5F5",
                            color: "#646569",
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div style={{ flexShrink: 0, textAlign: "right" }}>
                    <Sparkline points={analog.sparkPoints} color={isSelected ? "#C80037" : "#9CA3AF"} />
                    <p style={{ fontSize: "9px", color: "#9CA3AF", margin: "3px 0 0 0", fontWeight: 600 }}>
                      {analog.dataPoints} data pts
                    </p>
                  </div>
                </button>
              );
            })}
            {filtered.length === 0 && (
              <div style={{ padding: "40px 20px", textAlign: "center", color: "#9CA3AF", fontSize: "12px" }}>
                No analogs match your search in this use case.
              </div>
            )}
          </div>
        </div>

        {/* RIGHT — Configuration */}
        <div
          style={{
            flex: "0 0 calc(50% - 16px)",
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
              Apply Analog
            </h2>
            <p style={{ fontSize: "11px", color: "#646569", margin: 0 }}>
              <strong>{selected.title}</strong> · {selected.region} · {selected.period}
            </p>
          </div>

          {/* Best fit info */}
          <div
            style={{
              backgroundColor: "#F0F7FF",
              border: "1px solid #DBEAFE",
              borderRadius: "7px",
              padding: "10px 12px",
              display: "flex",
              gap: "8px",
              alignItems: "flex-start",
            }}
          >
            <Info size={13} className="text-[#3B82F6]" style={{ marginTop: "1px", flexShrink: 0 }} />
            <p style={{ fontSize: "11.5px", color: "#1E3A8A", margin: 0, lineHeight: 1.4 }}>
              <strong>Best fit for:</strong> {selected.fitsBestFor}
            </p>
          </div>

          {/* Scaling */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <label style={labelStyle}>Scaling Factor</label>
              <span style={{ fontSize: "13px", fontWeight: 700, color: "#C80037" }}>{scaling.toFixed(2)}x</span>
            </div>
            <input
              type="range"
              min={0.5}
              max={2.0}
              step={0.05}
              value={scaling}
              onChange={(e) => setScaling(parseFloat(e.target.value))}
              style={{ width: "100%", accentColor: "#C80037", marginTop: "6px" }}
            />
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "10px", color: "#9CA3AF", marginTop: "2px" }}>
              <span>0.5x dampened</span>
              <span>1.0x as-is</span>
              <span>2.0x amplified</span>
            </div>
          </div>

          {/* Offset */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <label style={labelStyle}>Time Offset</label>
              <span style={{ fontSize: "13px", fontWeight: 700, color: "#1A1A2E" }}>
                {offset > 0 ? `+${offset}` : offset} months
              </span>
            </div>
            <input
              type="range"
              min={-6}
              max={6}
              step={1}
              value={offset}
              onChange={(e) => setOffset(parseInt(e.target.value, 10))}
              style={{ width: "100%", accentColor: "#646569", marginTop: "6px" }}
            />
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "10px", color: "#9CA3AF", marginTop: "2px" }}>
              <span>-6mo earlier</span>
              <span>aligned</span>
              <span>+6mo later</span>
            </div>
          </div>

          {/* Weight */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <label style={labelStyle}>Analog Weight in Blend</label>
              <span style={{ fontSize: "13px", fontWeight: 700, color: "#1A1A2E" }}>{weight}%</span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              step={5}
              value={weight}
              onChange={(e) => setWeight(parseInt(e.target.value, 10))}
              style={{ width: "100%", accentColor: "#646569", marginTop: "6px" }}
            />
          </div>

          {/* Target Scenario */}
          <div>
            <label style={labelStyle}>Apply to Scenario</label>
            <select value={targetScenario} onChange={(e) => setTargetScenario(e.target.value)} style={inputStyle}>
              <option>Base Case</option>
              <option>Competitive Pressure</option>
              <option>Formulary Upside</option>
            </select>
          </div>

          {/* Overlay chart */}
          <OverlayChart analogPoints={selected.sparkPoints} scaling={scaling} offset={offset} weight={weight} />
        </div>
      </div>

      {/* ── Apply Bar ── */}
      <div
        style={{
          backgroundColor: "#FFFFFF",
          border: "1px solid #E5E7EB",
          borderRadius: "10px",
          padding: "16px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "16px",
          marginBottom: "16px",
        }}
      >
        <div>
          <p style={{ fontSize: "13px", fontWeight: 600, color: "#1A1A2E", margin: "0 0 2px 0" }}>
            Apply <strong>{selected.title}</strong> to <strong>{targetScenario}</strong>
          </p>
          <p style={{ fontSize: "12px", color: "#646569", margin: 0 }}>
            Output feeds assumption-building and scenario comparison · {scaling.toFixed(2)}x scale, {offset > 0 ? `+${offset}` : offset}mo offset, {weight}% blend
          </p>
        </div>
        <div style={{ display: "flex", gap: "10px", flexShrink: 0, alignItems: "center" }}>
          {applied && (
            <span style={{ fontSize: "12px", color: "#28A745", fontWeight: 600, display: "flex", alignItems: "center", gap: "5px" }}>
              <CheckCircle2 size={14} />
              Applied
            </span>
          )}
          <button
            style={{
              padding: "9px 18px",
              backgroundColor: "#FFFFFF",
              color: "#1A1A2E",
              fontSize: "13px",
              fontWeight: 600,
              border: "1.5px solid #D1D5DB",
              borderRadius: "7px",
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            Preview Impact
          </button>
          <button
            onClick={handleApply}
            style={{
              padding: "9px 22px",
              backgroundColor: "#C80037",
              color: "#FFFFFF",
              fontSize: "13px",
              fontWeight: 600,
              border: "none",
              borderRadius: "7px",
              cursor: "pointer",
              fontFamily: "inherit",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            Apply to Scenario <ArrowRight size={14} />
          </button>
        </div>
      </div>

      {/* ── Recently Applied ── */}
      <div
        style={{
          backgroundColor: "#FFFFFF",
          border: "1px solid #E5E7EB",
          borderRadius: "10px",
          padding: "16px 20px",
          marginBottom: "16px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Layers size={14} className="text-[#646569]" />
            <h3 style={{ fontSize: "13px", fontWeight: 700, color: "#1A1A2E", margin: 0 }}>
              Recently Applied Analogs
            </h3>
          </div>
          <span style={{ fontSize: "11px", color: "#646569" }}>3 analogs feeding active scenarios</span>
        </div>
        <div style={{ borderTop: "1px solid #F5F5F5" }}>
          {[
            { analog: "Biktarvy Launch — US", scenario: "Base Case", weight: 35, applied: "Apr 12, 2026", by: "Urvil Shah" },
            { analog: "Sunlenca Launch — US", scenario: "Competitive Pressure", weight: 50, applied: "Apr 10, 2026", by: "Sarah Chen" },
            { analog: "VA Tender Win — Biktarvy", scenario: "Formulary Upside", weight: 25, applied: "Apr 8, 2026", by: "Urvil Shah" },
          ].map((row, i) => (
            <div
              key={i}
              style={{
                display: "grid",
                gridTemplateColumns: "2fr 1.5fr 0.8fr 1fr 1fr 0.6fr",
                gap: "12px",
                padding: "10px 0",
                borderBottom: i < 2 ? "1px solid #F5F5F5" : "none",
                alignItems: "center",
                fontSize: "12px",
              }}
            >
              <span style={{ fontWeight: 600, color: "#1A1A2E" }}>{row.analog}</span>
              <span style={{ color: "#646569" }}>→ {row.scenario}</span>
              <span style={{ color: "#646569" }}>{row.weight}% blend</span>
              <span style={{ color: "#646569" }}>{row.applied}</span>
              <span style={{ color: "#646569" }}>{row.by}</span>
              <button
                style={{
                  fontSize: "11px",
                  color: "#C80037",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontWeight: 600,
                  textAlign: "right",
                  fontFamily: "inherit",
                }}
              >
                Edit
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* ── Scope & Limitations ── */}
      <div
        style={{
          backgroundColor: "#FFFBF0",
          border: "1px solid #FDE68A",
          borderRadius: "10px",
          padding: "14px 18px",
          display: "flex",
          gap: "12px",
        }}
      >
        <Info size={16} className="text-[#B45309]" style={{ marginTop: "2px", flexShrink: 0 }} />
        <div>
          <p style={{ fontSize: "12px", fontWeight: 700, color: "#92400E", margin: "0 0 4px 0", textTransform: "uppercase", letterSpacing: "0.04em" }}>
            Scope &amp; Limitations
          </p>
          <p style={{ fontSize: "12px", color: "#78350F", margin: "0 0 6px 0", lineHeight: 1.5 }}>
            Analog Analysis in this release supports the 5 use cases above with predefined, structured patterns. It is intended to support assumption-building and scenario comparison.
          </p>
          <ul style={{ fontSize: "11.5px", color: "#92400E", margin: 0, paddingLeft: "16px", lineHeight: 1.6 }}>
            <li>Does <strong>not</strong> function as an automated prediction engine — outputs require analyst judgment</li>
            <li><strong>No</strong> external data acquisition or large-scale historical modeling is included in this phase</li>
            <li>Expansion to advanced or automated analog capabilities is planned for future phases</li>
          </ul>
        </div>
      </div>
    </DashboardLayout>
  );
}

// ─── Shared Styles ────────────────────────────────────────────────────────────
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
