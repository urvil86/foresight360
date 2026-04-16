"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Calendar,
  GitBranch,
  Activity,
  Eye,
  Layers,
  FileText,
  Compass,
  TrendingUp,
  MessageSquare,
  Settings,
  User,
} from "lucide-react";

type NavItem = {
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
  badge?: string;
};

const navItems: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/event-modeler", label: "Event Modeler", icon: Calendar },
  { href: "/scenario-planner", label: "Scenario Planner", icon: GitBranch },
  { href: "/sensitivity-engine", label: "Sensitivity Engine", icon: Activity },
  { href: "/ci-intelligence", label: "CI Intelligence", icon: Eye },
  { href: "/consolidator", label: "Consolidator", icon: Layers },
  { href: "/reports", label: "Reports", icon: FileText },
  { href: "/forecast-drivers", label: "Forecast Drivers", icon: Compass },
  { href: "/ai-assistant", label: "AI Assistant", icon: MessageSquare },
  { href: "/analog-tool", label: "Analog Tool", icon: TrendingUp },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-[240px] min-h-screen bg-[#1A1A2E] flex flex-col shrink-0">
      {/* Logo */}
      <div className="px-5 pt-6 pb-4">
        <h1 className="text-white text-xl font-bold tracking-wider">
          FORESIGHT 360
        </h1>
        <p className="text-gray-400 text-xs mt-1">by Chryselys</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-2 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                isActive
                  ? "bg-[#C80037]/15 text-white border-l-3 border-[#C80037]"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <Icon size={18} />
              <span className="flex-1">{item.label}</span>
              {item.badge && (
                <span className="text-[9px] bg-[#C80037]/20 text-[#C80037] px-1.5 py-0.5 rounded font-medium">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User area */}
      <div className="px-4 py-4 border-t border-white/10 flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-[#C80037] flex items-center justify-center">
          <User size={14} className="text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-white text-sm truncate">Gilead | US Market</p>
          <p className="text-gray-500 text-xs">Analyst</p>
        </div>
        <Settings size={16} className="text-gray-500 hover:text-white cursor-pointer" />
      </div>
    </aside>
  );
}
