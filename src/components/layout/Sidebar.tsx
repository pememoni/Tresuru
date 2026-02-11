"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ArrowLeftRight,
  ClipboardCheck,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";
import { LogoMark } from "@/components/ui/Logo";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/payments", label: "Payments", icon: ArrowLeftRight },
  { href: "/approvals", label: "Approvals", icon: ClipboardCheck },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/settings", label: "Settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`fixed left-0 top-0 h-screen bg-[#0a0a0f] border-r border-white/[0.05] z-40 flex flex-col transition-all duration-300 ${
        collapsed ? "w-[72px]" : "w-[260px]"
      }`}
    >
      {/* Logo */}
      <div className="h-16 flex items-center px-5 border-b border-white/[0.05]">
        <div className="flex items-center gap-3 min-w-0">
          <LogoMark size={30} />
          {!collapsed && (
            <div className="min-w-0">
              <h1 className="text-sm font-semibold text-white truncate tracking-tight">Tresuru</h1>
              <p className="text-[10px] text-white/30 font-mono">Moderato Testnet</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3 space-y-0.5">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-indigo-500/10 text-indigo-400"
                  : "text-white/40 hover:text-white/70 hover:bg-white/[0.04]"
              }`}
            >
              <Icon className={`w-[18px] h-[18px] flex-shrink-0 ${isActive ? "text-indigo-400" : ""}`} />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Network Status */}
      <div className="px-3 pb-3">
        <div className={`rounded-xl bg-white/[0.02] border border-white/[0.05] p-3 ${collapsed ? "flex justify-center" : ""}`}>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
            {!collapsed && (
              <div className="min-w-0">
                <p className="text-xs text-white/50">Tempo Testnet</p>
                <p className="text-[10px] text-white/25 font-mono">Chain 42431</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Collapse Toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-[#0a0a0f] border border-white/[0.08] flex items-center justify-center hover:bg-white/[0.04] transition-colors cursor-pointer"
      >
        {collapsed ? (
          <ChevronRight className="w-3 h-3 text-white/40" />
        ) : (
          <ChevronLeft className="w-3 h-3 text-white/40" />
        )}
      </button>
    </aside>
  );
}
