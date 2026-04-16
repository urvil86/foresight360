"use client";
import { Bell, ChevronRight, CalendarDays } from "lucide-react";

export default function TopBar({ breadcrumb }: { breadcrumb: string[] }) {
  return (
    <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0">
      <div className="flex items-center gap-1.5 text-sm">
        {breadcrumb.map((item, i) => (
          <span key={i} className="flex items-center gap-1.5">
            {i > 0 && <ChevronRight size={14} className="text-gray-400" />}
            <span className={i === breadcrumb.length - 1 ? "text-[#2D2D2D] font-medium" : "text-[#646569]"}>
              {item}
            </span>
          </span>
        ))}
      </div>
      <div className="flex items-center gap-4">
        <button className="flex items-center gap-2 text-sm text-[#646569] border border-gray-200 rounded-lg px-3 py-1.5 hover:bg-gray-50">
          <CalendarDays size={14} />
          Jan 2026 – Dec 2026
        </button>
        <button className="relative p-2 rounded-lg hover:bg-gray-50">
          <Bell size={18} className="text-[#646569]" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#C80037] rounded-full" />
        </button>
      </div>
    </header>
  );
}
