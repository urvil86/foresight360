"use client";

import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";

const suggestedQuestions = [
  "Summarize this month's CI signals",
  "Compare top 3 scenarios for Biktarvy",
  "What assumptions changed since last review?",
  "Generate a brief for the HIV franchise lead",
];

const referencedData = [
  { label: "Aetna Formulary Update", type: "Event", date: "Apr 8, 2026" },
  { label: "WAC Pricing Adjustment", type: "Event", date: "Apr 12, 2026" },
  { label: "Sunlenca Generic Entry Model", type: "Assumption", date: "CI Signal" },
  { label: "Biktarvy US Forecast — Base", type: "Forecast", date: "Q3 2026" },
];

type Message = {
  role: "user" | "assistant";
  content: string | React.ReactNode;
};

const initialMessages: Message[] = [
  {
    role: "user",
    content:
      "What's driving the gap between base and adjusted forecast for Biktarvy in Q3?",
  },
  {
    role: "assistant",
    content: (
      <div className="space-y-3 text-sm text-[#2D2D2D] leading-relaxed">
        <p>
          The adjusted forecast for Biktarvy US in Q3 2026 is{" "}
          <span className="font-semibold">$14M above baseline</span>, driven by
          three factors:
        </p>
        <ol className="list-decimal list-inside space-y-1 pl-1">
          <li>
            <span className="font-medium">Aetna formulary expansion</span>{" "}
            (+$8M, applied Apr 8)
          </li>
          <li>
            <span className="font-medium">WAC pricing adjustment of +4.5%</span>{" "}
            (+$6M, applied Apr 12)
          </li>
        </ol>
        <p>
          These are partially offset by the anticipated{" "}
          <span className="font-medium">Sunlenca generic entry</span> (−$5M,
          confidence:{" "}
          <span className="inline-flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-yellow-400 inline-block" />
            Medium
          </span>
          ).
        </p>
        <div className="flex gap-4 pt-1">
          <button className="text-[#1A56DB] hover:underline text-xs font-medium">
            View in Forecast Drivers
          </button>
          <button className="text-[#1A56DB] hover:underline text-xs font-medium">
            Open Event Modeler
          </button>
        </div>
      </div>
    ),
  },
  {
    role: "user",
    content:
      "Run a quick sensitivity on the competitor impact. What if uptake is 2x faster?",
  },
  {
    role: "assistant",
    content: (
      <div className="space-y-3 text-sm text-[#2D2D2D] leading-relaxed">
        <p>
          If competitor uptake doubles, the impact shifts from{" "}
          <span className="font-semibold">−$5M to approximately −$11M</span> in
          Q3, reducing the adjusted forecast from{" "}
          <span className="font-semibold">$412M to $406M</span>. This moves
          confidence from{" "}
          <span className="font-semibold text-[#0D7C3D]">87%</span> to{" "}
          <span className="font-semibold text-[#C97B00]">72%</span>.
        </p>
        <div className="flex gap-4 pt-1">
          <button className="text-[#1A56DB] hover:underline text-xs font-medium">
            View Simulation
          </button>
          <button className="text-[#1A56DB] hover:underline text-xs font-medium">
            Create Scenario from This
          </button>
        </div>
      </div>
    ),
  },
];

export default function AIAssistantPage() {
  const [messages] = useState<Message[]>(initialMessages);
  const [inputValue, setInputValue] = useState("");

  return (
    <DashboardLayout breadcrumb={["AI Assistant"]}>
      <div className="flex gap-5 h-full min-h-0" style={{ height: "calc(100vh - 112px)" }}>
        {/* LEFT — Chat Interface (65%) */}
        <div className="flex flex-col bg-white rounded-xl border border-[#E0E0E0] overflow-hidden" style={{ flex: "0 0 65%" }}>
          {/* Chat Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#E0E0E0] bg-white">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#C80037] flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M2 8C2 4.686 4.686 2 8 2s6 2.686 6 6-2.686 6-6 6-6-2.686-6-6z"
                    fill="white"
                    opacity="0.3"
                  />
                  <path
                    d="M5 8h6M8 5v6"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-[#1A1A1A] text-sm">
                    Foresight AI
                  </span>
                  <span className="w-2 h-2 rounded-full bg-green-500" />
                </div>
                <span className="text-xs text-[#646569]">
                  Connected to: Biktarvy (US) forecast
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#646569] bg-[#F5F5F5] px-3 py-1 rounded-full border border-[#E0E0E0]">
                Q3 2026 · Base Case
              </span>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5 bg-[#FAFAFA]">
            {messages.map((msg, i) =>
              msg.role === "user" ? (
                <div key={i} className="flex justify-end">
                  <div className="max-w-[72%] bg-[#EFEFEF] rounded-2xl rounded-tr-sm px-4 py-3">
                    <p className="text-sm text-[#1A1A1A] leading-relaxed">
                      {msg.content as string}
                    </p>
                  </div>
                </div>
              ) : (
                <div key={i} className="flex justify-start">
                  <div
                    className="max-w-[82%] bg-white rounded-2xl rounded-tl-sm px-5 py-4 shadow-sm"
                    style={{ borderLeft: "3px solid #C80037" }}
                  >
                    {msg.content}
                  </div>
                </div>
              )
            )}
          </div>

          {/* Input Bar */}
          <div className="px-5 py-4 border-t border-[#E0E0E0] bg-white">
            <div className="flex items-center gap-3 bg-[#F5F5F5] rounded-xl border border-[#E0E0E0] px-4 py-3 focus-within:border-[#C80037] transition-colors">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask about forecasts, events, assumptions, or scenarios..."
                className="flex-1 bg-transparent text-sm text-[#1A1A1A] placeholder-[#9E9E9E] outline-none"
              />
              <button
                className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-opacity"
                style={{ backgroundColor: "#C80037" }}
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                >
                  <path
                    d="M1 7h12M8 3l4 4-4 4"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
            <p className="text-[10px] text-[#9E9E9E] mt-2 px-1">
              AI responses are based on forecast data and events in the system. Always verify against source models before distribution.
            </p>
          </div>
        </div>

        {/* RIGHT — Context Panel (35%) */}
        <div className="flex flex-col gap-4 overflow-y-auto" style={{ flex: "0 0 35%" }}>
          {/* Active Context */}
          <div className="bg-white rounded-xl border border-[#E0E0E0] p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1.5 h-4 rounded-full" style={{ backgroundColor: "#C80037" }} />
              <h3 className="text-sm font-semibold text-[#1A1A1A] uppercase tracking-wide">
                Active Context
              </h3>
            </div>
            <div className="space-y-3">
              {[
                { label: "Brand", value: "Biktarvy" },
                { label: "Market", value: "United States" },
                { label: "Scenario", value: "Base Case" },
                { label: "Period", value: "2026 (Full Year)" },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center justify-between">
                  <span className="text-xs text-[#646569]">{label}</span>
                  <span className="text-xs font-medium text-[#1A1A1A] bg-[#F5F5F5] px-2.5 py-1 rounded-md border border-[#E8E8E8]">
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Suggested Questions */}
          <div className="bg-white rounded-xl border border-[#E0E0E0] p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1.5 h-4 rounded-full bg-[#646569]" />
              <h3 className="text-sm font-semibold text-[#1A1A1A] uppercase tracking-wide">
                Suggested Questions
              </h3>
            </div>
            <div className="space-y-2">
              {suggestedQuestions.map((q, i) => (
                <button
                  key={i}
                  className="w-full text-left text-xs text-[#2D2D2D] bg-[#FAFAFA] hover:bg-[#F0F0F0] border border-[#E8E8E8] hover:border-[#C80037] rounded-lg px-3.5 py-2.5 transition-all leading-relaxed group"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span>{q}</span>
                    <svg
                      className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      width="10"
                      height="10"
                      viewBox="0 0 10 10"
                      fill="none"
                    >
                      <path
                        d="M1 5h8M6 2l3 3-3 3"
                        stroke="#C80037"
                        strokeWidth="1.3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Referenced Data */}
          <div className="bg-white rounded-xl border border-[#E0E0E0] p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1.5 h-4 rounded-full bg-[#646569]" />
              <h3 className="text-sm font-semibold text-[#1A1A1A] uppercase tracking-wide">
                Referenced Data
              </h3>
            </div>
            <div className="space-y-2">
              {referencedData.map((item, i) => (
                <div
                  key={i}
                  className="flex items-start justify-between gap-3 px-3.5 py-2.5 bg-[#FAFAFA] border border-[#E8E8E8] rounded-lg"
                >
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-[#1A1A1A] leading-snug truncate">
                      {item.label}
                    </p>
                    <p className="text-[10px] text-[#9E9E9E] mt-0.5">{item.date}</p>
                  </div>
                  <span
                    className="flex-shrink-0 text-[10px] font-medium px-2 py-0.5 rounded-full border"
                    style={
                      item.type === "Event"
                        ? {
                            backgroundColor: "#FFF0F3",
                            color: "#C80037",
                            borderColor: "#F5C6CF",
                          }
                        : item.type === "Assumption"
                        ? {
                            backgroundColor: "#FFF8E6",
                            color: "#8B5C00",
                            borderColor: "#F5DFA0",
                          }
                        : {
                            backgroundColor: "#EEF4FF",
                            color: "#1A56DB",
                            borderColor: "#C3D4F8",
                          }
                    }
                  >
                    {item.type}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
