"use client";

import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/Badge";
import { useTreasury } from "@/hooks/useTreasury";
import { formatUSD, timeAgo, shortenAddress } from "@/lib/format";
import { ArrowUpRight, ArrowDownLeft, ArrowLeftRight, ExternalLink } from "lucide-react";
import Link from "next/link";

const TYPE_CONFIG = {
  outbound: {
    icon: ArrowUpRight,
    color: "text-red-400",
    bg: "bg-red-500/10",
    prefix: "-",
  },
  inbound: {
    icon: ArrowDownLeft,
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    prefix: "+",
  },
  internal: {
    icon: ArrowLeftRight,
    color: "text-indigo-400",
    bg: "bg-indigo-500/10",
    prefix: "",
  },
};

export default function RecentTransactions() {
  const { recentTransactions } = useTreasury();
  const txs = recentTransactions();

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-white">Recent Activity</h3>
          <p className="text-xs text-white/40 mt-0.5">Latest treasury transactions</p>
        </div>
        <Link
          href="/payments"
          className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
        >
          View All
        </Link>
      </CardHeader>
      <div className="divide-y divide-white/[0.04]">
        {txs.length === 0 && (
          <div className="px-6 py-10 text-center">
            <p className="text-sm text-white/30">No transactions yet</p>
            <p className="text-xs text-white/20 mt-1">
              Submit your first payment to get started
            </p>
          </div>
        )}
        {txs.map((tx) => {
          const config = TYPE_CONFIG[tx.type];
          const Icon = config.icon;

          return (
            <div
              key={tx.id}
              className="flex items-center gap-4 px-6 py-3 hover:bg-white/[0.02] transition-colors cursor-pointer group"
            >
              <div
                className={`w-9 h-9 rounded-lg ${config.bg} flex items-center justify-center flex-shrink-0`}
              >
                <Icon className={`w-4 h-4 ${config.color}`} />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-white truncate">
                    {tx.toLabel || tx.description}
                  </p>
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs text-white/30">{tx.category}</span>
                  <span className="text-white/10">·</span>
                  <span className="text-xs text-white/30">{timeAgo(tx.createdAt)}</span>
                  {tx.memo && (
                    <>
                      <span className="text-white/10">·</span>
                      <span className="text-xs text-white/20 font-mono">{tx.memo}</span>
                    </>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <StatusBadge status={tx.status} />
                <p
                  className={`text-sm font-semibold tabular-nums ${
                    tx.type === "inbound" ? "text-emerald-400" : "text-white"
                  }`}
                >
                  {config.prefix}
                  {formatUSD(tx.amount, 0)}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
