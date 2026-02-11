"use client";

import StatsGrid from "@/components/dashboard/StatsGrid";
import AccountsList from "@/components/dashboard/AccountsList";
import RecentTransactions from "@/components/dashboard/RecentTransactions";
import TreasuryChart from "@/components/dashboard/TreasuryChart";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Shield, Zap, Clock, CheckCircle2, Wifi } from "lucide-react";
import { isLiveMode } from "@/lib/contracts";

export default function DashboardPage() {
  const live = isLiveMode();

  return (
    <div className="space-y-6 max-w-[1400px]">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Treasury Dashboard</h1>
          <p className="text-sm text-white/40 mt-1">
            Corporate treasury overview on Tempo Network
          </p>
        </div>
        <div className="flex items-center gap-2">
          {live ? (
            <Badge variant="success" dot>
              <Wifi className="w-3 h-3 mr-1" />
              Live on Testnet
            </Badge>
          ) : (
            <Badge variant="warning" dot>
              Demo Mode
            </Badge>
          )}
          <Badge variant="info">
            <Zap className="w-3 h-3 mr-1" />
            &lt;$0.001 per tx
          </Badge>
        </div>
      </div>

      {/* Stats */}
      <StatsGrid />

      {/* Chart + Accounts */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <TreasuryChart />
        </div>
        <div>
          <AccountsList />
        </div>
      </div>

      {/* Recent Transactions */}
      <RecentTransactions />

      {/* Compliance & Security Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-5">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
              <Shield className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-white">TIP-403 Compliant</p>
              <p className="text-xs text-white/40 mt-1">
                All transactions pass through Tempo&apos;s built-in policy registry for regulatory compliance
              </p>
            </div>
          </div>
        </Card>
        <Card className="p-5">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center flex-shrink-0">
              <Clock className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-white">Real-Time Settlement</p>
              <p className="text-xs text-white/40 mt-1">
                Instant finality on Tempo with dedicated payment lanes for TIP-20 stablecoins
              </p>
            </div>
          </div>
        </Card>
        <Card className="p-5">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center flex-shrink-0">
              <CheckCircle2 className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-white">Native Reconciliation</p>
              <p className="text-xs text-white/40 mt-1">
                On-chain memos for invoices and cost centers — no off-chain reconciliation needed
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
