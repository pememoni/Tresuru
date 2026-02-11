"use client";

import { Card, CardHeader } from "@/components/ui/Card";
import { useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Demo data showing treasury growth over time
const CHART_DATA = [
  { date: "Jan 1", balance: 14200000, inflow: 800000, outflow: 620000 },
  { date: "Jan 8", balance: 14380000, inflow: 450000, outflow: 270000 },
  { date: "Jan 15", balance: 14850000, inflow: 920000, outflow: 450000 },
  { date: "Jan 22", balance: 15100000, inflow: 600000, outflow: 350000 },
  { date: "Jan 29", balance: 15600000, inflow: 1200000, outflow: 700000 },
  { date: "Feb 1", balance: 16200000, inflow: 1100000, outflow: 500000 },
  { date: "Feb 5", balance: 17400000, inflow: 1800000, outflow: 600000 },
  { date: "Feb 8", balance: 17850000, inflow: 950000, outflow: 500000 },
  { date: "Feb 10", balance: 18000000, inflow: 500000, outflow: 350000 },
];

type TimeRange = "7d" | "30d" | "90d" | "1y";

export default function TreasuryChart() {
  const [range, setRange] = useState<TimeRange>("30d");

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-white">Treasury Balance</h3>
          <p className="text-xs text-white/40 mt-0.5">
            Total across all accounts in trUSD
          </p>
        </div>
        <div className="flex items-center gap-1 bg-white/[0.04] rounded-lg p-1">
          {(["7d", "30d", "90d", "1y"] as TimeRange[]).map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
                range === r
                  ? "bg-white/[0.08] text-white"
                  : "text-white/40 hover:text-white/60"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </CardHeader>
      <div className="px-6 pb-6">
        <div className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={CHART_DATA} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="balanceGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11 }}
                tickFormatter={(val) => `$${(val / 1000000).toFixed(0)}M`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0e0e16",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "12px",
                  padding: "12px",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
                }}
                labelStyle={{ color: "rgba(255,255,255,0.5)", fontSize: 12 }}
                itemStyle={{ color: "#6366f1", fontSize: 12 }}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                formatter={(value: any) => [
                  `$${(Number(value) / 1000000).toFixed(2)}M`,
                  "Balance",
                ]}
              />
              <Area
                type="monotone"
                dataKey="balance"
                stroke="#6366f1"
                strokeWidth={2}
                fill="url(#balanceGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Card>
  );
}
