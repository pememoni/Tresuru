"use client";

import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { useTreasury } from "@/hooks/useTreasury";
import { formatUSD, shortenAddress } from "@/lib/format";
import { Wallet, Building, Users, TrendingUp, ExternalLink } from "lucide-react";

const ACCOUNT_ICONS = {
  operating: Wallet,
  reserve: Building,
  payroll: Users,
  investment: TrendingUp,
};

const ACCOUNT_COLORS = {
  operating: "from-indigo-500 to-blue-600",
  reserve: "from-violet-500 to-purple-600",
  payroll: "from-emerald-500 to-green-600",
  investment: "from-amber-500 to-orange-500",
};

export default function AccountsList() {
  const { accounts, totalBalance } = useTreasury();
  const total = totalBalance();

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-white">Treasury Accounts</h3>
          <p className="text-xs text-white/40 mt-0.5">TresuruUSD (trUSD) balances</p>
        </div>
        <Badge variant="info">{accounts.length} accounts</Badge>
      </CardHeader>
      <CardContent className="space-y-3 p-4">
        {accounts.map((account) => {
          const Icon = ACCOUNT_ICONS[account.type];
          const color = ACCOUNT_COLORS[account.type];
          const pct = total > 0 ? (account.balance / total) * 100 : 0;

          return (
            <div
              key={account.id}
              className="flex items-center gap-4 p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.04] hover:border-white/[0.08] transition-all cursor-pointer group"
            >
              <div
                className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center flex-shrink-0`}
              >
                <Icon className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-white">{account.name}</p>
                  <p className="text-sm font-semibold text-white tabular-nums">
                    {formatUSD(account.balance, 0)}
                  </p>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-xs text-white/30 font-mono">
                    {shortenAddress(account.address)}
                  </p>
                  <p className="text-xs text-white/30">{pct.toFixed(1)}% of total</p>
                </div>
                {/* Balance bar */}
                <div className="mt-2 h-1 bg-white/[0.04] rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r ${color} rounded-full transition-all`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-white/0 group-hover:text-white/30 transition-colors flex-shrink-0" />
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
