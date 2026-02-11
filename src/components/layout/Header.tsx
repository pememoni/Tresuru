"use client";

import { useAuth } from "@/hooks/useAuth";
import { Bell, Search, LogOut, User, ChevronDown, Play, X } from "lucide-react";
import { useState } from "react";
import { useTreasury } from "@/hooks/useTreasury";
import { shortenAddress } from "@/lib/format";
import { useRouter } from "next/navigation";

export default function Header() {
  const { ready, authenticated, login, logout, user } = useAuth();
  const { currentUser, pendingTransactions, isDemo, setDemoSession } = useTreasury();
  const pendingCount = pendingTransactions().length;
  const [showUserMenu, setShowUserMenu] = useState(false);
  const router = useRouter();

  return (
    <header className="h-16 border-b border-white/[0.05] bg-[#0a0a0f]/80 backdrop-blur-xl flex items-center justify-between px-6 sticky top-0 z-30">
      {/* Search */}
      <div className="relative w-[400px]">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25" />
        <input
          type="text"
          placeholder="Search transactions, addresses, memos..."
          className="w-full h-10 pl-10 pr-4 rounded-xl bg-white/[0.03] border border-white/[0.05] text-sm text-white placeholder-white/25 focus:outline-none focus:border-indigo-500/40 focus:bg-white/[0.05] transition-all"
        />
        <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-white/15 bg-white/[0.05] px-1.5 py-0.5 rounded">
          ⌘K
        </kbd>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        {/* Demo Mode Badge */}
        {isDemo && (
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-400/20">
              <Play className="w-3 h-3 text-amber-400 fill-amber-400" />
              <span className="text-xs font-medium text-amber-300">Demo Mode</span>
            </div>
            <button
              onClick={() => {
                setDemoSession(false);
                if (!authenticated) router.push("/");
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] text-xs text-white/50 hover:text-white/80 transition-all cursor-pointer"
            >
              <X className="w-3 h-3" />
              Exit Demo
            </button>
          </div>
        )}

        {/* Notifications */}
        <button className="relative p-2 rounded-xl hover:bg-white/[0.04] transition-colors cursor-pointer">
          <Bell className="w-[18px] h-[18px] text-white/40" />
          {pendingCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-indigo-500 rounded-full text-[10px] text-white flex items-center justify-center font-medium">
              {pendingCount}
            </span>
          )}
        </button>

        {/* Divider */}
        <div className="w-px h-8 bg-white/[0.05]" />

        {/* User */}
        {authenticated && user ? (
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-3 p-1.5 pr-3 rounded-xl hover:bg-white/[0.04] transition-colors cursor-pointer"
            >
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-400 to-indigo-600 flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <div className="text-left hidden sm:block">
                <p className="text-sm font-medium text-white/80">
                  {user.email?.address || (user.wallet?.address ? shortenAddress(user.wallet.address) : currentUser?.name || "Connected")}
                </p>
                <p className="text-[10px] text-white/30 font-mono">
                  {user.wallet?.address
                    ? shortenAddress(user.wallet.address)
                    : ""}
                </p>
              </div>
              <ChevronDown className="w-3 h-3 text-white/25" />
            </button>

            {showUserMenu && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-[#12121a] border border-white/[0.06] rounded-2xl shadow-2xl py-2 z-50">
                <button
                  onClick={() => {
                    logout();
                    setShowUserMenu(false);
                  }}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-white/50 hover:text-white hover:bg-white/[0.04] transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={login}
            disabled={!ready}
            className="flex items-center gap-2 px-5 py-2 bg-indigo-500 hover:bg-indigo-400 text-white text-sm font-medium rounded-full transition-colors duration-200 disabled:opacity-50 cursor-pointer"
          >
            Connect
          </button>
        )}
      </div>
    </header>
  );
}
