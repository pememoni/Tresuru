"use client";

import { Card } from "@/components/ui/Card";
import { useTreasury } from "@/hooks/useTreasury";
import { formatCompactUSD, formatUSD } from "@/lib/format";
import {
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  Clock,
  TrendingUp,
  Shield,
} from "lucide-react";

export default function StatsGrid() {
  const { accounts, transactions, pendingTransactions, totalBalance } = useTreasury();
  const pending = pendingTransactions();
  const total = totalBalance();

  const monthlyOutflow = transactions
    .filter((tx) => tx.type === "outbound" && tx.status === "executed")
    .reduce((sum, tx) => sum + tx.amount, 0);

  const monthlyInflow = transactions
    .filter((tx) => tx.type === "inbound" && tx.status === "executed")
    .reduce((sum, tx) => sum + tx.amount, 0);

  const stats = [
    {
      label: "Total Treasury",
      value: formatCompactUSD(total),
      subtext: `${accounts.length} accounts`,
      icon: Wallet,
      color: "from-indigo-500 to-blue-600",
      change: "+2.4%",
      changePositive: true,
    },
    {
      label: "Monthly Outflow",
      value: formatCompactUSD(monthlyOutflow),
      subtext: "This month",
      icon: ArrowUpRight,
      color: "from-orange-500 to-red-500",
      change: "-12.3%",
      changePositive: true,
    },
    {
      label: "Monthly Inflow",
      value: formatCompactUSD(monthlyInflow),
      subtext: "This month",
      icon: ArrowDownLeft,
      color: "from-emerald-500 to-green-600",
      change: "+18.7%",
      changePositive: true,
    },
    {
      label: "Pending Approvals",
      value: pending.length.toString(),
      subtext: `${formatUSD(pending.reduce((s, t) => s + t.amount, 0), 0)} total`,
      icon: Clock,
      color: "from-amber-500 to-orange-500",
      change: "",
      changePositive: false,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.label} className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-white/40 font-medium uppercase tracking-wider">
                  {stat.label}
                </p>
                <p className="text-2xl font-bold text-white mt-2">{stat.value}</p>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-xs text-white/30">{stat.subtext}</p>
                  {stat.change && (
                    <span
                      className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${
                        stat.changePositive
                          ? "bg-emerald-500/10 text-emerald-400"
                          : "bg-red-500/10 text-red-400"
                      }`}
                    >
                      {stat.change}
                    </span>
                  )}
                </div>
              </div>
              <div
                className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}
              >
                <Icon className="w-5 h-5 text-white" />
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
