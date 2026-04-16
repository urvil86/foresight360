"use client";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import AIAssistantButton from "./AIAssistantButton";

export default function DashboardLayout({
  children,
  breadcrumb,
}: {
  children: React.ReactNode;
  breadcrumb: string[];
}) {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar breadcrumb={breadcrumb} />
        <main className="flex-1 overflow-auto p-6 bg-[#F5F5F5]">{children}</main>
      </div>
      <AIAssistantButton />
    </div>
  );
}
