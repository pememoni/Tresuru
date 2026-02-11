"use client";

import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { useTreasuryStore } from "@/store/treasury";
import { formatUSD, formatCompactUSD } from "@/lib/format";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownLeft,
  DollarSign,
  BarChart3,
  PieChart as PieIcon,
  Activity,
} from "lucide-react";

const MONTHLY_DATA = [
  { month: "Sep", inflow: 1800000, outflow: 1200000 },
  { month: "Oct", inflow: 2200000, outflow: 1500000 },
  { month: "Nov", inflow: 1900000, outflow: 1800000 },
  { month: "Dec", inflow: 2800000, outflow: 1600000 },
  { month: "Jan", inflow: 3200000, outflow: 2100000 },
  { month: "Feb", inflow: 2400000, outflow: 1700000 },
];

const CATEGORY_DATA = [
  { name: "Payroll", value: 4200000, color: "#0ea5e9" },
  { name: "Vendor Payments", value: 2100000, color: "#8b5cf6" },
  { name: "Operating Expense", value: 1800000, color: "#f59e0b" },
  { name: "Tax Payments", value: 1200000, color: "#ef4444" },
  { name: "Investments", value: 900000, color: "#10b981" },
  { name: "Other", value: 450000, color: "#6b7280" },
];

const DAILY_VOLUME = [
  { day: "Mon", volume: 320000 },
  { day: "Tue", volume: 580000 },
  { day: "Wed", volume: 420000 },
  { day: "Thu", volume: 890000 },
  { day: "Fri", volume: 650000 },
  { day: "Sat", volume: 120000 },
  { day: "Sun", volume: 80000 },
];

export default function AnalyticsPage() {
  const { transactions, accounts, totalBalance } = useTreasuryStore();
  const total = totalBalance();

  const totalOutflow = MONTHLY_DATA.reduce((s, d) => s + d.outflow, 0);
  const totalInflow = MONTHLY_DATA.reduce((s, d) => s + d.inflow, 0);
  const netFlow = totalInflow - totalOutflow;

  return (
    <div className="space-y-6 max-w-[1400px]">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Analytics & Reporting</h1>
        <p className="text-sm text-white/40 mt-1">
          Treasury performance metrics and cash flow analysis
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <p className="text-xs text-white/40">Total AUM</p>
              <p className="text-xl font-bold text-white">{formatCompactUSD(total)}</p>
            </div>
          </div>
        </Card>
        <Card className="p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
              <ArrowDownLeft className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-xs text-white/40">6M Inflow</p>
              <p className="text-xl font-bold text-emerald-400">
                {formatCompactUSD(totalInflow)}
              </p>
            </div>
          </div>
        </Card>
        <Card className="p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
              <ArrowUpRight className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <p className="text-xs text-white/40">6M Outflow</p>
              <p className="text-xl font-bold text-white">{formatCompactUSD(totalOutflow)}</p>
            </div>
          </div>
        </Card>
        <Card className="p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-violet-400" />
            </div>
            <div>
              <p className="text-xs text-white/40">Net Flow</p>
              <p className="text-xl font-bold text-emerald-400">
                +{formatCompactUSD(netFlow)}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Cash Flow Chart */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-white/40" />
              <h3 className="text-sm font-semibold text-white">Cash Flow (6 Months)</h3>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={MONTHLY_DATA} barGap={4}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11 }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11 }}
                    tickFormatter={(val) => `$${(val / 1000000).toFixed(1)}M`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0e0e16",
                      border: "1px solid rgba(255,255,255,0.08)",
                      borderRadius: "12px",
                      padding: "12px",
                    }}
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    formatter={(value: any) => [formatUSD(Number(value), 0)]}
                  />
                  <Bar dataKey="inflow" fill="#10b981" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="outflow" fill="#ef4444" radius={[4, 4, 0, 0]} opacity={0.7} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Category Breakdown */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <PieIcon className="w-4 h-4 text-white/40" />
              <h3 className="text-sm font-semibold text-white">Spending by Category</h3>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-8">
              <div className="w-[200px] h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={CATEGORY_DATA}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      dataKey="value"
                      stroke="none"
                    >
                      {CATEGORY_DATA.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#0e0e16",
                        border: "1px solid rgba(255,255,255,0.08)",
                        borderRadius: "12px",
                        padding: "8px 12px",
                      }}
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      formatter={(value: any) => [formatUSD(Number(value), 0)]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex-1 space-y-3">
                {CATEGORY_DATA.map((cat) => {
                  const totalCat = CATEGORY_DATA.reduce((s, c) => s + c.value, 0);
                  const pct = ((cat.value / totalCat) * 100).toFixed(1);
                  return (
                    <div key={cat.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: cat.color }}
                        />
                        <span className="text-xs text-white/60">{cat.name}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-white/40">{pct}%</span>
                        <span className="text-xs font-medium text-white tabular-nums">
                          {formatCompactUSD(cat.value)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Daily Volume */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-white/40" />
            <h3 className="text-sm font-semibold text-white">Daily Transaction Volume</h3>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={DAILY_VOLUME}>
                <defs>
                  <linearGradient id="volumeGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis
                  dataKey="day"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11 }}
                  tickFormatter={(val) => `$${(val / 1000).toFixed(0)}K`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0e0e16",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: "12px",
                    padding: "8px 12px",
                  }}
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  formatter={(value: any) => [formatUSD(Number(value), 0), "Volume"]}
                />
                <Area
                  type="monotone"
                  dataKey="volume"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                  fill="url(#volumeGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-5">
          <h4 className="text-xs text-white/30 uppercase tracking-wider">Avg Transaction Size</h4>
          <p className="text-2xl font-bold text-white mt-2">$127,500</p>
          <div className="flex items-center gap-1 mt-1">
            <TrendingUp className="w-3 h-3 text-emerald-400" />
            <span className="text-xs text-emerald-400">+8.3% vs last month</span>
          </div>
        </Card>
        <Card className="p-5">
          <h4 className="text-xs text-white/30 uppercase tracking-wider">Avg Approval Time</h4>
          <p className="text-2xl font-bold text-white mt-2">2.4 hours</p>
          <div className="flex items-center gap-1 mt-1">
            <TrendingDown className="w-3 h-3 text-emerald-400" />
            <span className="text-xs text-emerald-400">-15% vs last month</span>
          </div>
        </Card>
        <Card className="p-5">
          <h4 className="text-xs text-white/30 uppercase tracking-wider">Transaction Fees</h4>
          <p className="text-2xl font-bold text-white mt-2">$0.47</p>
          <p className="text-xs text-white/30 mt-1">
            Total fees for {transactions.filter((t) => t.status === "executed").length} executed transactions
          </p>
        </Card>
      </div>
    </div>
  );
}
