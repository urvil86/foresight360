"use client";

import DashboardLayout from "@/components/DashboardLayout";
import {
  Presentation,
  FileSpreadsheet,
  FileText,
  Download,
  Eye,
  Calendar,
  Plus,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { useState } from "react";

// ─── Types ───────────────────────────────────────────────────────────────────

type OutputType = "PPT" | "Excel" | "PDF";

interface RecentOutput {
  fileName: string;
  type: OutputType;
  generatedBy: string;
  date: string;
  brandMarket: string;
  status: "Ready" | "Processing" | "Failed";
  hasPreview?: boolean;
}

// ─── Data ────────────────────────────────────────────────────────────────────

const recentOutputs: RecentOutput[] = [
  {
    fileName: "Biktarvy_US_Q2_Forecast_Deck.pptx",
    type: "PPT",
    generatedBy: "Urvil Shah",
    date: "Apr 14",
    brandMarket: "Biktarvy / US",
    status: "Ready",
    hasPreview: true,
  },
  {
    fileName: "HIV_Global_Consolidation_Apr2026.xlsx",
    type: "Excel",
    generatedBy: "System",
    date: "Apr 13",
    brandMarket: "HIV / Global",
    status: "Ready",
  },
  {
    fileName: "Descovy_EU5_Scenario_Report.pdf",
    type: "PDF",
    generatedBy: "Sarah Chen",
    date: "Apr 12",
    brandMarket: "Descovy / EU5",
    status: "Ready",
    hasPreview: true,
  },
  {
    fileName: "Trodelvy_US_Monthly_Brief.pdf",
    type: "PDF",
    generatedBy: "System",
    date: "Apr 11",
    brandMarket: "Trodelvy / US",
    status: "Ready",
    hasPreview: true,
  },
  {
    fileName: "Yescarta_Global_Pipeline_Update.pptx",
    type: "PPT",
    generatedBy: "Mark Torres",
    date: "Apr 10",
    brandMarket: "Yescarta / Global",
    status: "Ready",
  },
];

const scheduledReports = [
  {
    name: "Monthly HIV Forecast Deck",
    frequency: "Every 1st Monday",
    next: "May 4",
    type: "PPT" as OutputType,
  },
  {
    name: "Weekly CI Digest",
    frequency: "Every Friday",
    next: "Apr 18",
    type: "PDF" as OutputType,
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function typeConfig(type: OutputType) {
  switch (type) {
    case "PPT":
      return {
        icon: Presentation,
        color: "#C0392B",
        bg: "#FFF5F5",
        border: "#FED7D7",
        label: "PPT",
      };
    case "Excel":
      return {
        icon: FileSpreadsheet,
        color: "#1D6F42",
        bg: "#F0FFF4",
        border: "#C6F6D5",
        label: "Excel",
      };
    case "PDF":
      return {
        icon: FileText,
        color: "#C80037",
        bg: "#FFF0F3",
        border: "#FED7E2",
        label: "PDF",
      };
  }
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function TypeBadge({ type }: { type: OutputType }) {
  const cfg = typeConfig(type);
  const Icon = cfg.icon;
  return (
    <span
      className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-2 py-0.5 rounded-full border"
      style={{ color: cfg.color, backgroundColor: cfg.bg, borderColor: cfg.border }}
    >
      <Icon size={11} strokeWidth={2.5} />
      {cfg.label}
    </span>
  );
}

function StatusBadge({ status }: { status: RecentOutput["status"] }) {
  if (status === "Ready") {
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#28A745] bg-[#F0FFF4] border border-[#C6F6D5] rounded-full px-2 py-0.5">
        <CheckCircle2 size={10} strokeWidth={2.5} />
        Ready
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#646569] bg-[#F5F5F5] border border-gray-200 rounded-full px-2 py-0.5">
      {status}
    </span>
  );
}

function QuickGenerateCard({
  type,
  title,
  description,
  dropdownLabel,
  dropdownOptions,
  buttonLabel,
}: {
  type: OutputType;
  title: string;
  description: string;
  dropdownLabel: string;
  dropdownOptions: string[];
  buttonLabel: string;
}) {
  const cfg = typeConfig(type);
  const Icon = cfg.icon;
  const [selected, setSelected] = useState(dropdownOptions[0]);

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col gap-5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
      {/* Header */}
      <div className="flex items-start gap-4">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 border"
          style={{ backgroundColor: cfg.bg, borderColor: cfg.border }}
        >
          <Icon size={22} style={{ color: cfg.color }} strokeWidth={1.8} />
        </div>
        <div>
          <h3 className="text-sm font-bold text-[#2D2D2D]">{title}</h3>
          <p className="text-xs text-[#646569] mt-1 leading-snug">{description}</p>
        </div>
      </div>

      {/* Dropdown */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[10px] font-semibold text-[#646569] uppercase tracking-wider">
          {dropdownLabel}
        </label>
        <select
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
          className="w-full text-sm text-[#2D2D2D] bg-[#F5F5F5] border border-gray-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-[#C80037]/20 focus:border-[#C80037] transition-all cursor-pointer"
        >
          {dropdownOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>

      {/* Button */}
      <button
        className="w-full text-sm font-semibold text-white rounded-xl py-2.5 transition-all duration-150 hover:opacity-90 active:scale-[0.98] shadow-sm mt-auto"
        style={{ backgroundColor: "#C80037" }}
      >
        {buttonLabel}
      </button>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ReportsPage() {
  return (
    <DashboardLayout breadcrumb={["Reports", "Output Management"]}>
      <div className="space-y-6">

        {/* ── Page Header ────────────────────────────────────────────── */}
        <div>
          <h1 className="text-2xl font-bold text-[#2D2D2D]">Automated Output Generation</h1>
          <p className="text-sm text-[#646569] mt-1">
            Generate structured reports, presentations, and exports
          </p>
        </div>

        {/* ── Section 1: Quick Generate ───────────────────────────────── */}
        <section>
          <h2 className="text-xs font-semibold text-[#646569] uppercase tracking-wider mb-3">
            Quick Generate
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <QuickGenerateCard
              type="PPT"
              title="Executive Deck"
              description="Auto-generate a forecast summary presentation with charts, scenarios, and key assumptions"
              dropdownLabel="Template"
              dropdownOptions={["Gilead Standard", "Quarterly Review", "Board Summary"]}
              buttonLabel="Generate PPT"
            />
            <QuickGenerateCard
              type="Excel"
              title="Data Export"
              description="Export forecast data, events, and scenario comparisons in structured Excel format"
              dropdownLabel="Scope"
              dropdownOptions={["Single Market", "Regional", "Global"]}
              buttonLabel="Generate Excel"
            />
            <QuickGenerateCard
              type="PDF"
              title="Forecast Report"
              description="Create a formatted PDF report with narrative summaries, charts, and appendix"
              dropdownLabel="Detail Level"
              dropdownOptions={["Summary", "Full", "Executive Brief"]}
              buttonLabel="Generate PDF"
            />
          </div>
        </section>

        {/* ── Section 2: Recent Outputs ───────────────────────────────── */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <div>
              <h2 className="text-sm font-bold text-[#2D2D2D]">Recent Outputs</h2>
              <p className="text-xs text-[#646569] mt-0.5">
                All generated files · last 7 days
              </p>
            </div>
            <button className="text-xs font-semibold text-[#646569] hover:text-[#2D2D2D] border border-gray-200 rounded-lg px-3 py-1.5 hover:bg-gray-50 transition-colors">
              View All
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#FAFAFA] border-b border-gray-100">
                  {["File Name", "Type", "Generated By", "Date", "Brand / Market", "Status", "Actions"].map(
                    (h) => (
                      <th
                        key={h}
                        className="text-left text-[10px] font-semibold text-[#646569] uppercase tracking-wider px-5 py-3 whitespace-nowrap"
                      >
                        {h}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {recentOutputs.map((row, i) => {
                  const cfg = typeConfig(row.type);
                  const Icon = cfg.icon;
                  return (
                    <tr
                      key={i}
                      className="border-b border-gray-50 hover:bg-[#FFF8FA] group transition-colors duration-100"
                    >
                      {/* File Name */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <Icon
                            size={15}
                            style={{ color: cfg.color }}
                            strokeWidth={1.8}
                            className="flex-shrink-0"
                          />
                          <span className="text-xs font-semibold text-[#2D2D2D] group-hover:text-[#C80037] transition-colors font-mono">
                            {row.fileName}
                          </span>
                        </div>
                      </td>

                      {/* Type */}
                      <td className="px-5 py-3.5">
                        <TypeBadge type={row.type} />
                      </td>

                      {/* Generated By */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          {row.generatedBy === "System" ? (
                            <span className="w-5 h-5 rounded-full bg-[#F5F5F5] border border-gray-200 flex items-center justify-center flex-shrink-0">
                              <Clock size={10} className="text-[#646569]" strokeWidth={2} />
                            </span>
                          ) : (
                            <span className="w-5 h-5 rounded-full bg-[#C80037] flex items-center justify-center flex-shrink-0 text-[9px] font-bold text-white">
                              {row.generatedBy
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </span>
                          )}
                          <span className="text-xs text-[#2D2D2D]">{row.generatedBy}</span>
                        </div>
                      </td>

                      {/* Date */}
                      <td className="px-5 py-3.5 text-xs text-[#646569] whitespace-nowrap">
                        {row.date}
                      </td>

                      {/* Brand / Market */}
                      <td className="px-5 py-3.5">
                        <span className="text-xs text-[#2D2D2D] font-medium">{row.brandMarket}</span>
                      </td>

                      {/* Status */}
                      <td className="px-5 py-3.5">
                        <StatusBadge status={row.status} />
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          <button
                            className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#C80037] hover:text-[#A00029] border border-[#C80037]/30 hover:border-[#C80037] rounded-lg px-2.5 py-1 transition-all hover:bg-[#FFF0F3]"
                            title="Download"
                          >
                            <Download size={11} strokeWidth={2.5} />
                            Download
                          </button>
                          {row.hasPreview && (
                            <button
                              className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#646569] hover:text-[#2D2D2D] border border-gray-200 hover:border-gray-300 rounded-lg px-2.5 py-1 transition-all hover:bg-gray-50"
                              title="Preview"
                            >
                              <Eye size={11} strokeWidth={2.5} />
                              Preview
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="px-6 py-3 bg-[#FAFAFA] border-t border-gray-100">
            <p className="text-xs text-[#646569]">Showing 5 of 24 outputs</p>
          </div>
        </section>

        {/* ── Section 3: Scheduled Reports ───────────────────────────── */}
        <section>
          <h2 className="text-xs font-semibold text-[#646569] uppercase tracking-wider mb-3">
            Scheduled Reports
          </h2>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="divide-y divide-gray-50">
              {scheduledReports.map((report, i) => {
                const cfg = typeConfig(report.type);
                const Icon = cfg.icon;
                return (
                  <div
                    key={i}
                    className="flex items-center justify-between px-6 py-4 hover:bg-[#FFF8FA] transition-colors duration-100 group cursor-default"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 border"
                        style={{ backgroundColor: cfg.bg, borderColor: cfg.border }}
                      >
                        <Icon size={16} style={{ color: cfg.color }} strokeWidth={1.8} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[#2D2D2D] group-hover:text-[#C80037] transition-colors">
                          {report.name}
                        </p>
                        <p className="text-xs text-[#646569] mt-0.5 flex items-center gap-1.5">
                          <Calendar size={11} strokeWidth={2} />
                          {report.frequency}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="text-[10px] font-semibold text-[#646569] uppercase tracking-wider">
                          Next Run
                        </p>
                        <p className="text-sm font-bold text-[#2D2D2D] mt-0.5">{report.next}</p>
                      </div>
                      <TypeBadge type={report.type} />
                      <button className="text-xs font-semibold text-[#646569] hover:text-[#C80037] border border-gray-200 hover:border-[#C80037]/30 rounded-lg px-3 py-1.5 hover:bg-[#FFF0F3] transition-all">
                        Edit
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="px-6 py-4 border-t border-gray-100 bg-[#FAFAFA]">
              <button className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#C80037] hover:text-[#A00029] transition-colors">
                <Plus size={15} strokeWidth={2.5} />
                Add Schedule
              </button>
            </div>
          </div>
        </section>

      </div>
    </DashboardLayout>
  );
}
