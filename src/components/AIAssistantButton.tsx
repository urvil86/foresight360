"use client";
import { useState } from "react";
import { usePathname } from "next/navigation";
import {
  Sparkles,
  X,
  Send,
  Calendar,
  GitBranch,
  Activity,
  Eye,
  Layers,
  FileText,
  Compass,
  LayoutDashboard,
  BarChart3,
  ArrowRight,
} from "lucide-react";

// Context-aware quick actions per page
const pageContext: Record<
  string,
  {
    title: string;
    icon: React.ComponentType<{ size?: number; className?: string }>;
    actions: { label: string; description: string }[];
    placeholder: string;
  }
> = {
  "/performance-pulse": {
    title: "Performance Pulse Assistant",
    icon: BarChart3,
    actions: [
      { label: "Explain Q1 variance drivers", description: "Walk through the biggest gaps between actuals and forecast" },
      { label: "Simulate a corrective action", description: "Run a what-if to close the $70M gap to annual target" },
      { label: "Generate variance action brief", description: "Draft a summary for the HIV franchise lead" },
    ],
    placeholder: "Ask about variance drivers or simulate recovery actions...",
  },
  "/dashboard": {
    title: "Dashboard Assistant",
    icon: LayoutDashboard,
    actions: [
      { label: "Summarize this month's forecast", description: "Get a high-level briefing of base vs adjusted across HIV portfolio" },
      { label: "Highlight top forecast risks", description: "Surface the biggest downside drivers across brands" },
      { label: "Compare to last quarter", description: "Quarter-over-quarter delta on Biktarvy US" },
    ],
    placeholder: "Ask about KPIs, trends, or events...",
  },
  "/event-modeler": {
    title: "Event Modeling Assistant",
    icon: Calendar,
    actions: [
      { label: "Suggest events from CI feed", description: "Convert recent intelligence signals into structured events" },
      { label: "Estimate impact of Sunlenca generic", description: "Generate a draft event with confidence range" },
      { label: "Bulk-apply formulary wins", description: "Stage 3 formulary expansion events at once" },
    ],
    placeholder: "Describe an event to model...",
  },
  "/scenario-planner": {
    title: "Scenario Planning Assistant",
    icon: GitBranch,
    actions: [
      { label: "Generate a downside scenario", description: "Build a 'worst case' with biosimilar entry + access loss" },
      { label: "Clone Base Case with adjustments", description: "Create variant with +5% pricing erosion" },
      { label: "Recommend scenarios for board review", description: "Curate 3 scenarios that bracket strategic decisions" },
    ],
    placeholder: "Describe a scenario to build...",
  },
  "/sensitivity-engine": {
    title: "Sensitivity Analysis Assistant",
    icon: Activity,
    actions: [
      { label: "Identify most sensitive driver", description: "Rank drivers by impact on revenue variance" },
      { label: "Run Monte Carlo with custom ranges", description: "Stress-test with widened pricing assumptions" },
      { label: "Compare downside vs severe downside", description: "Walk through what changes between cases" },
    ],
    placeholder: "Ask about driver sensitivity...",
  },
  "/ci-intelligence": {
    title: "CI Intelligence Assistant",
    icon: Eye,
    actions: [
      { label: "Summarize this week's signals", description: "Top 5 CI items with forecast relevance" },
      { label: "Convert ViiV signal to event", description: "Auto-create event from cabotegravir sNDA filing" },
      { label: "Compare competitor pipelines", description: "ViiV vs Merck vs GSK HIV pipeline depth" },
    ],
    placeholder: "Ask about competitor moves or signals...",
  },
  "/consolidator": {
    title: "Consolidation Assistant",
    icon: Layers,
    actions: [
      { label: "Flag misaligned markets", description: "Identify regions with stale or pending forecasts" },
      { label: "Generate global roll-up summary", description: "Narrative for HIV franchise consolidation" },
      { label: "Compare regional growth rates", description: "Rank markets by YoY momentum" },
    ],
    placeholder: "Ask about regional or global roll-ups...",
  },
  "/reports": {
    title: "Reports Assistant",
    icon: FileText,
    actions: [
      { label: "Draft executive deck outline", description: "Suggest slides for the next board review" },
      { label: "Generate Q2 Biktarvy narrative", description: "Auto-write commentary for the upcoming PPT" },
      { label: "Schedule a recurring CI digest", description: "Set up a weekly Friday email" },
    ],
    placeholder: "Ask about reports or exports...",
  },
  "/forecast-drivers": {
    title: "Forecast Drivers Assistant",
    icon: Compass,
    actions: [
      { label: "Explain the +$14M adjustment", description: "Walk through each contributing driver in plain English" },
      { label: "Compare to v3 of this forecast", description: "What changed since Apr 10?" },
      { label: "Rank drivers by confidence", description: "Identify weakest assumptions to revisit" },
    ],
    placeholder: "Ask why a number looks the way it does...",
  },
};

const defaultContext = {
  title: "Foresight AI",
  icon: Sparkles,
  actions: [
    { label: "What can you help me with?", description: "See available capabilities" },
    { label: "Summarize my workspace", description: "Quick overview of brand, market, and active scenarios" },
  ],
  placeholder: "Ask anything about forecasts, events, or scenarios...",
};

export default function AIAssistantButton() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const context = pageContext[pathname] ?? defaultContext;
  const Icon = context.icon;

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-40 group flex items-center gap-2 bg-[#C80037] hover:bg-[#A8002E] text-white pl-4 pr-5 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
          style={{ boxShadow: "0 10px 30px rgba(200, 0, 55, 0.35)" }}
        >
          <div className="relative">
            <Sparkles size={20} />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#FFC107] rounded-full animate-pulse" />
          </div>
          <span className="text-sm font-semibold">Ask AI</span>
        </button>
      )}

      {/* Slide-over Panel */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/30 z-40 transition-opacity"
            onClick={() => setIsOpen(false)}
          />

          {/* Panel */}
          <div
            className="fixed right-0 top-0 bottom-0 w-[420px] bg-white z-50 flex flex-col shadow-2xl"
            style={{ animation: "slideIn 0.25s ease-out" }}
          >
            {/* Header */}
            <div className="px-5 py-4 border-b border-gray-200 bg-gradient-to-br from-[#1A1A2E] to-[#0D0D1A] text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-[#C80037] flex items-center justify-center">
                    <Icon size={18} className="text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm">{context.title}</h3>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                      <p className="text-xs text-gray-400">Connected · Biktarvy (US)</p>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-white/10 transition"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-5">
              {/* Welcome message */}
              <div className="mb-5">
                <div className="bg-[#F9F4F6] border-l-2 border-[#C80037] rounded-r-lg p-3">
                  <p className="text-sm text-[#2D2D2D] leading-relaxed">
                    I can help you take action on this page. Pick a quick action below, or ask me anything in your own words.
                  </p>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="mb-4">
                <p className="text-[10px] font-semibold text-[#646569] uppercase tracking-wider mb-2.5">
                  Suggested Actions
                </p>
                <div className="space-y-2">
                  {context.actions.map((action, i) => (
                    <button
                      key={i}
                      className="w-full text-left p-3 bg-white border border-gray-200 rounded-lg hover:border-[#C80037] hover:bg-[#FFF8FA] transition-all group"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-[#2D2D2D] mb-0.5">
                            {action.label}
                          </p>
                          <p className="text-xs text-[#646569] leading-relaxed">
                            {action.description}
                          </p>
                        </div>
                        <ArrowRight
                          size={14}
                          className="text-gray-300 group-hover:text-[#C80037] mt-1 transition-colors shrink-0"
                        />
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Context Info */}
              <div className="mt-6 pt-4 border-t border-gray-100">
                <p className="text-[10px] font-semibold text-[#646569] uppercase tracking-wider mb-2">
                  Active Context
                </p>
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-[#646569]">Brand</span>
                    <span className="font-medium text-[#2D2D2D]">Biktarvy</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-[#646569]">Market</span>
                    <span className="font-medium text-[#2D2D2D]">United States</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-[#646569]">Scenario</span>
                    <span className="font-medium text-[#2D2D2D]">Base Case</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-[#646569]">Period</span>
                    <span className="font-medium text-[#2D2D2D]">2026</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Input */}
            <div className="px-5 py-4 border-t border-gray-200 bg-[#FAFAFA]">
              <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2 focus-within:border-[#C80037] transition">
                <input
                  type="text"
                  placeholder={context.placeholder}
                  className="flex-1 text-sm outline-none bg-transparent text-[#2D2D2D] placeholder:text-gray-400"
                />
                <button className="w-7 h-7 rounded-md bg-[#C80037] hover:bg-[#A8002E] flex items-center justify-center transition">
                  <Send size={13} className="text-white" />
                </button>
              </div>
              <p className="text-[10px] text-gray-400 mt-2 text-center">
                Foresight AI uses your active context to ground responses
              </p>
            </div>
          </div>

          <style jsx>{`
            @keyframes slideIn {
              from {
                transform: translateX(100%);
              }
              to {
                transform: translateX(0);
              }
            }
          `}</style>
        </>
      )}
    </>
  );
}
