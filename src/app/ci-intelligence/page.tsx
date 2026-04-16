"use client";

import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";

// ─── Types ────────────────────────────────────────────────────────────────────

type FilterChip =
  | "All Signals"
  | "Competitor Actions"
  | "Regulatory"
  | "Market Access"
  | "Pipeline"
  | "Pricing";

type SignalTag =
  | "COMPETITOR ACTION"
  | "MARKET ACCESS"
  | "PIPELINE"
  | "PRICING"
  | "REGULATORY";

interface SignalCard {
  id: number;
  borderColor: string;
  tagColor: string;
  tag: SignalTag;
  headline: string;
  source: string;
  impact?: string;
  relevanceDots?: number;
  filterCategory: FilterChip;
}

type EventStatus = "Applied" | "Pending Review" | "Draft";

interface LinkedEvent {
  id: number;
  title: string;
  status: EventStatus;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const FILTER_CHIPS: FilterChip[] = [
  "All Signals",
  "Competitor Actions",
  "Regulatory",
  "Market Access",
  "Pipeline",
  "Pricing",
];

const SIGNAL_CARDS: SignalCard[] = [
  {
    id: 1,
    borderColor: "#C80037",
    tagColor: "#C80037",
    tag: "COMPETITOR ACTION",
    headline:
      "ViiV Healthcare files sNDA for long-acting cabotegravir oral formulation",
    source: "FDA.gov | April 12, 2026",
    impact: "Potential impact on Biktarvy share in treatment-naive segment",
    relevanceDots: 4,
    filterCategory: "Competitor Actions",
  },
  {
    id: 2,
    borderColor: "#FFC107",
    tagColor: "#B8860B",
    tag: "MARKET ACCESS",
    headline:
      "Express Scripts updates preferred formulary — Descovy retained, Biktarvy Tier 2",
    source: "Internal | April 10, 2026",
    filterCategory: "Market Access",
  },
  {
    id: 3,
    borderColor: "#3B82F6",
    tagColor: "#2563EB",
    tag: "PIPELINE",
    headline:
      "Merck announces Phase 3 results for islatravir combo — non-inferior to Biktarvy",
    source: "CROI 2026 Abstract | April 8, 2026",
    filterCategory: "Pipeline",
  },
  {
    id: 4,
    borderColor: "#28A745",
    tagColor: "#1A7A35",
    tag: "PRICING",
    headline:
      "CMS releases updated Part D negotiation list — no Gilead products included",
    source: "CMS.gov | April 5, 2026",
    filterCategory: "Pricing",
  },
];

const DONUT_SEGMENTS = [
  { label: "Competitor Actions", count: 8, color: "#C80037" },
  { label: "Market Access", count: 5, color: "#FFC107" },
  { label: "Pipeline", count: 6, color: "#3B82F6" },
  { label: "Pricing", count: 3, color: "#28A745" },
  { label: "Regulatory", count: 4, color: "#8B5CF6" },
];

const LINKED_EVENTS: LinkedEvent[] = [
  {
    id: 1,
    title: "CAB LA Oral: Biktarvy erosion scenario — treatment-naive",
    status: "Applied",
  },
  {
    id: 2,
    title: "ESI formulary shift: Descovy volume uplift Q3 2026",
    status: "Pending Review",
  },
  {
    id: 3,
    title: "Islatravir Phase 3: long-range share risk model",
    status: "Draft",
  },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function RelevanceDots({ filled, total = 5 }: { filled: number; total?: number }) {
  return (
    <div style={{ display: "flex", gap: "4px", alignItems: "center" }}>
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          style={{
            width: "8px",
            height: "8px",
            borderRadius: "50%",
            backgroundColor: i < filled ? "#C80037" : "#E5E7EB",
          }}
        />
      ))}
    </div>
  );
}

function StatusBadge({ status }: { status: EventStatus }) {
  const styles: Record<EventStatus, { bg: string; color: string }> = {
    Applied: { bg: "#D1FAE5", color: "#065F46" },
    "Pending Review": { bg: "#FEF3C7", color: "#92400E" },
    Draft: { bg: "#F3F4F6", color: "#374151" },
  };
  const s = styles[status];
  return (
    <span
      style={{
        display: "inline-block",
        padding: "2px 8px",
        borderRadius: "12px",
        fontSize: "11px",
        fontWeight: "600",
        backgroundColor: s.bg,
        color: s.color,
        letterSpacing: "0.02em",
      }}
    >
      {status}
    </span>
  );
}

// Simple CSS donut chart
function DonutChart() {
  const total = DONUT_SEGMENTS.reduce((acc, s) => acc + s.count, 0);
  const size = 120;
  const cx = size / 2;
  const cy = size / 2;
  const r = 44;
  const strokeWidth = 18;

  // Build conic gradient string
  let cumulative = 0;
  const gradientParts: string[] = [];
  DONUT_SEGMENTS.forEach((seg) => {
    const pct = (seg.count / total) * 100;
    gradientParts.push(
      `${seg.color} ${cumulative.toFixed(1)}% ${(cumulative + pct).toFixed(1)}%`
    );
    cumulative += pct;
  });

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
      {/* Donut */}
      <div style={{ position: "relative", flexShrink: 0 }}>
        <div
          style={{
            width: "120px",
            height: "120px",
            borderRadius: "50%",
            background: `conic-gradient(${gradientParts.join(", ")})`,
            position: "relative",
          }}
        >
          {/* Inner white hole */}
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "68px",
              height: "68px",
              borderRadius: "50%",
              backgroundColor: "#FFFFFF",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span
              style={{
                fontSize: "20px",
                fontWeight: "700",
                color: "#111827",
                lineHeight: 1,
              }}
            >
              {total}
            </span>
            <span style={{ fontSize: "9px", color: "#6B7280", fontWeight: "500" }}>
              signals
            </span>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        {DONUT_SEGMENTS.map((seg) => (
          <div key={seg.label} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <div
              style={{
                width: "10px",
                height: "10px",
                borderRadius: "2px",
                backgroundColor: seg.color,
                flexShrink: 0,
              }}
            />
            <span style={{ fontSize: "11px", color: "#374151" }}>
              {seg.label}
            </span>
            <span
              style={{
                fontSize: "11px",
                fontWeight: "600",
                color: "#111827",
                marginLeft: "auto",
                paddingLeft: "12px",
              }}
            >
              {seg.count}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Sentiment gauge
function SentimentGauge() {
  // Simple arc gauge using a rotated div approach
  const level = 65; // 0–100, where 65 = "Elevated"
  const rotation = -90 + (level / 100) * 180; // -90 to +90 deg

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
      {/* Arc container */}
      <div
        style={{
          position: "relative",
          width: "160px",
          height: "82px",
          overflow: "hidden",
        }}
      >
        {/* Background arc */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: "50%",
            transform: "translateX(-50%)",
            width: "160px",
            height: "160px",
            borderRadius: "50%",
            background:
              "conic-gradient(from 180deg, #28A745 0deg 36deg, #FFC107 36deg 108deg, #C80037 108deg 180deg, transparent 180deg)",
            clipPath: "inset(50% 0 0 0)",
          }}
        />
        {/* White inner to make arc */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: "50%",
            transform: "translateX(-50%)",
            width: "110px",
            height: "110px",
            borderRadius: "50%",
            backgroundColor: "#FFFFFF",
            clipPath: "inset(50% 0 0 0)",
          }}
        />
        {/* Needle */}
        <div
          style={{
            position: "absolute",
            bottom: "2px",
            left: "50%",
            transformOrigin: "bottom center",
            transform: `translateX(-50%) rotate(${rotation}deg)`,
            width: "2px",
            height: "54px",
            backgroundColor: "#374151",
            borderRadius: "1px",
          }}
        />
        {/* Needle pivot */}
        <div
          style={{
            position: "absolute",
            bottom: "-2px",
            left: "50%",
            transform: "translateX(-50%)",
            width: "10px",
            height: "10px",
            borderRadius: "50%",
            backgroundColor: "#374151",
          }}
        />
      </div>

      {/* Labels */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          width: "160px",
          fontSize: "10px",
          color: "#9CA3AF",
        }}
      >
        <span>Low</span>
        <span>Elevated</span>
        <span>High</span>
      </div>

      {/* Reading */}
      <div
        style={{
          padding: "4px 14px",
          borderRadius: "20px",
          backgroundColor: "#FEF3C7",
          color: "#92400E",
          fontSize: "13px",
          fontWeight: "700",
          letterSpacing: "0.03em",
        }}
      >
        ELEVATED
      </div>

      <p style={{ fontSize: "11px", color: "#6B7280", margin: 0, textAlign: "center" }}>
        Based on 26 signals across HIV franchise
      </p>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

export default function CIIntelligencePage() {
  const [activeChip, setActiveChip] = useState<FilterChip>("All Signals");

  const filteredCards =
    activeChip === "All Signals"
      ? SIGNAL_CARDS
      : SIGNAL_CARDS.filter((c) => c.filterCategory === activeChip);

  return (
    <DashboardLayout breadcrumb={["CI Intelligence", "HIV Franchise"]}>
      <div
        style={{
          fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
          maxWidth: "1400px",
          margin: "0 auto",
        }}
      >
        {/* ── Page Header ── */}
        <div style={{ marginBottom: "24px" }}>
          <h1
            style={{
              fontSize: "24px",
              fontWeight: "700",
              color: "#111827",
              margin: "0 0 4px 0",
              letterSpacing: "-0.01em",
            }}
          >
            Competitive &amp; Market Intelligence
          </h1>
          <p style={{ fontSize: "14px", color: "#6B7280", margin: 0 }}>
            Real-time signals informing forecast adjustments
          </p>
        </div>

        {/* ── Filter Chip Bar ── */}
        <div
          style={{
            display: "flex",
            gap: "8px",
            flexWrap: "wrap",
            marginBottom: "28px",
          }}
        >
          {FILTER_CHIPS.map((chip) => {
            const isActive = chip === activeChip;
            return (
              <button
                key={chip}
                onClick={() => setActiveChip(chip)}
                style={{
                  padding: "6px 16px",
                  borderRadius: "20px",
                  fontSize: "13px",
                  fontWeight: isActive ? "600" : "500",
                  cursor: "pointer",
                  border: isActive ? "none" : "1.5px solid #D1D5DB",
                  backgroundColor: isActive ? "#C80037" : "transparent",
                  color: isActive ? "#FFFFFF" : "#374151",
                  transition: "all 0.15s ease",
                  letterSpacing: "0.01em",
                  outline: "none",
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    (e.currentTarget as HTMLButtonElement).style.borderColor =
                      "#C80037";
                    (e.currentTarget as HTMLButtonElement).style.color =
                      "#C80037";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    (e.currentTarget as HTMLButtonElement).style.borderColor =
                      "#D1D5DB";
                    (e.currentTarget as HTMLButtonElement).style.color =
                      "#374151";
                  }
                }}
              >
                {chip}
              </button>
            );
          })}
        </div>

        {/* ── Two-column Layout ── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "3fr 2fr",
            gap: "24px",
            alignItems: "start",
          }}
        >
          {/* ════ LEFT: Intelligence Feed ════ */}
          <div>
            <h2
              style={{
                fontSize: "15px",
                fontWeight: "600",
                color: "#374151",
                margin: "0 0 16px 0",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
              }}
            >
              Intelligence Feed
            </h2>

            {filteredCards.length === 0 ? (
              <div
                style={{
                  backgroundColor: "#FFFFFF",
                  borderRadius: "10px",
                  padding: "40px",
                  textAlign: "center",
                  color: "#9CA3AF",
                  fontSize: "14px",
                  border: "1px solid #E5E7EB",
                }}
              >
                No signals match this filter.
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                {filteredCards.map((card) => (
                  <div
                    key={card.id}
                    style={{
                      backgroundColor: "#FFFFFF",
                      borderRadius: "10px",
                      borderLeft: `4px solid ${card.borderColor}`,
                      padding: "18px 20px",
                      boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
                      border: `1px solid #E5E7EB`,
                      borderLeftWidth: "4px",
                      borderLeftColor: card.borderColor,
                    }}
                  >
                    {/* Tag */}
                    <div style={{ marginBottom: "8px" }}>
                      <span
                        style={{
                          fontSize: "10px",
                          fontWeight: "700",
                          color: card.tagColor,
                          letterSpacing: "0.08em",
                          textTransform: "uppercase",
                        }}
                      >
                        {card.tag}
                      </span>
                    </div>

                    {/* Headline */}
                    <p
                      style={{
                        fontSize: "14px",
                        fontWeight: "600",
                        color: "#111827",
                        margin: "0 0 6px 0",
                        lineHeight: "1.5",
                      }}
                    >
                      {card.headline}
                    </p>

                    {/* Source */}
                    <p
                      style={{
                        fontSize: "12px",
                        color: "#9CA3AF",
                        margin: "0 0 10px 0",
                        fontStyle: "italic",
                      }}
                    >
                      {card.source}
                    </p>

                    {/* Impact (optional) */}
                    {card.impact && (
                      <div
                        style={{
                          backgroundColor: "#FFF5F7",
                          border: "1px solid #FECDD3",
                          borderRadius: "6px",
                          padding: "8px 12px",
                          marginBottom: "12px",
                        }}
                      >
                        <span
                          style={{
                            fontSize: "11px",
                            fontWeight: "600",
                            color: "#9F1239",
                            textTransform: "uppercase",
                            letterSpacing: "0.05em",
                          }}
                        >
                          Forecast Impact:&nbsp;
                        </span>
                        <span style={{ fontSize: "12px", color: "#7F1D1D" }}>
                          {card.impact}
                        </span>
                      </div>
                    )}

                    {/* Footer row */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        flexWrap: "wrap",
                        gap: "10px",
                      }}
                    >
                      {/* Relevance dots */}
                      {card.relevanceDots !== undefined ? (
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                          }}
                        >
                          <span
                            style={{
                              fontSize: "11px",
                              color: "#6B7280",
                              fontWeight: "500",
                            }}
                          >
                            Relevance
                          </span>
                          <RelevanceDots filled={card.relevanceDots} />
                        </div>
                      ) : (
                        <div />
                      )}

                      {/* Actions */}
                      <div
                        style={{ display: "flex", alignItems: "center", gap: "16px" }}
                      >
                        <button
                          style={{
                            padding: "6px 14px",
                            backgroundColor: "#C80037",
                            color: "#FFFFFF",
                            fontSize: "12px",
                            fontWeight: "600",
                            border: "none",
                            borderRadius: "6px",
                            cursor: "pointer",
                            letterSpacing: "0.01em",
                          }}
                          onMouseEnter={(e) =>
                            ((e.currentTarget as HTMLButtonElement).style.backgroundColor =
                              "#A8002E")
                          }
                          onMouseLeave={(e) =>
                            ((e.currentTarget as HTMLButtonElement).style.backgroundColor =
                              "#C80037")
                          }
                        >
                          Link to Event
                        </button>
                        <button
                          style={{
                            background: "none",
                            border: "none",
                            fontSize: "12px",
                            color: "#9CA3AF",
                            cursor: "pointer",
                            padding: 0,
                            textDecoration: "underline",
                          }}
                          onMouseEnter={(e) =>
                            ((e.currentTarget as HTMLButtonElement).style.color =
                              "#6B7280")
                          }
                          onMouseLeave={(e) =>
                            ((e.currentTarget as HTMLButtonElement).style.color =
                              "#9CA3AF")
                          }
                        >
                          Dismiss
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ════ RIGHT: Impact Summary ════ */}
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <h2
              style={{
                fontSize: "15px",
                fontWeight: "600",
                color: "#374151",
                margin: "0 0 16px 0",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
              }}
            >
              Impact Summary
            </h2>

            {/* ── Card 1: Signals This Month ── */}
            <div
              style={{
                backgroundColor: "#FFFFFF",
                borderRadius: "10px",
                padding: "20px",
                boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
                border: "1px solid #E5E7EB",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "16px",
                }}
              >
                <h3
                  style={{
                    fontSize: "14px",
                    fontWeight: "600",
                    color: "#111827",
                    margin: 0,
                  }}
                >
                  Signals This Month
                </h3>
                <span
                  style={{
                    fontSize: "11px",
                    color: "#6B7280",
                    backgroundColor: "#F3F4F6",
                    padding: "2px 8px",
                    borderRadius: "10px",
                  }}
                >
                  April 2026
                </span>
              </div>
              <DonutChart />
            </div>

            {/* ── Card 2: Events Created from CI ── */}
            <div
              style={{
                backgroundColor: "#FFFFFF",
                borderRadius: "10px",
                padding: "20px",
                boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
                border: "1px solid #E5E7EB",
              }}
            >
              <h3
                style={{
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "#111827",
                  margin: "0 0 14px 0",
                }}
              >
                Events Created from CI
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {LINKED_EVENTS.map((ev) => (
                  <div
                    key={ev.id}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      justifyContent: "space-between",
                      gap: "10px",
                      paddingBottom: "12px",
                      borderBottom:
                        ev.id < LINKED_EVENTS.length
                          ? "1px solid #F3F4F6"
                          : "none",
                    }}
                  >
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p
                        style={{
                          fontSize: "12px",
                          color: "#374151",
                          margin: "0 0 4px 0",
                          lineHeight: "1.4",
                          fontWeight: "500",
                        }}
                      >
                        {ev.title}
                      </p>
                    </div>
                    <div style={{ flexShrink: 0 }}>
                      <StatusBadge status={ev.status} />
                    </div>
                  </div>
                ))}
              </div>
              <button
                style={{
                  marginTop: "12px",
                  width: "100%",
                  padding: "8px",
                  backgroundColor: "transparent",
                  border: "1.5px solid #E5E7EB",
                  borderRadius: "6px",
                  fontSize: "12px",
                  color: "#374151",
                  cursor: "pointer",
                  fontWeight: "500",
                  transition: "border-color 0.15s",
                }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLButtonElement).style.borderColor =
                    "#C80037")
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLButtonElement).style.borderColor =
                    "#E5E7EB")
                }
              >
                View All Linked Events →
              </button>
            </div>

            {/* ── Card 3: Market Sentiment Tracker ── */}
            <div
              style={{
                backgroundColor: "#FFFFFF",
                borderRadius: "10px",
                padding: "20px",
                boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
                border: "1px solid #E5E7EB",
              }}
            >
              <h3
                style={{
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "#111827",
                  margin: "0 0 16px 0",
                }}
              >
                Market Sentiment Tracker
              </h3>
              <SentimentGauge />
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
