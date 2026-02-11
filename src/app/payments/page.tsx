"use client";

import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { StatusBadge, Badge } from "@/components/ui/Badge";
import { useTreasuryStore } from "@/store/treasury";
import { formatUSD, timeAgo, shortenAddress, formatDateTime } from "@/lib/format";
import NewPaymentModal from "@/components/payments/NewPaymentModal";
import {
  Plus,
  ArrowUpRight,
  ArrowDownLeft,
  ArrowLeftRight,
  Filter,
  Download,
  Search,
  ExternalLink,
  FileText,
} from "lucide-react";
import { useState } from "react";

const TYPE_CONFIG = {
  outbound: { icon: ArrowUpRight, color: "text-red-400", bg: "bg-red-500/10", prefix: "-" },
  inbound: { icon: ArrowDownLeft, color: "text-emerald-400", bg: "bg-emerald-500/10", prefix: "+" },
  internal: { icon: ArrowLeftRight, color: "text-indigo-400", bg: "bg-indigo-500/10", prefix: "" },
};

export default function PaymentsPage() {
  const { transactions } = useTreasuryStore();
  const [showNewPayment, setShowNewPayment] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterType, setFilterType] = useState<string>("all");
  const [selectedTx, setSelectedTx] = useState<string | null>(null);

  const filtered = transactions.filter((tx) => {
    if (filterStatus !== "all" && tx.status !== filterStatus) return false;
    if (filterType !== "all" && tx.type !== filterType) return false;
    return true;
  });

  return (
    <div className="space-y-6 max-w-[1400px]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Payments</h1>
          <p className="text-sm text-white/40 mt-1">
            Manage outbound payments, transfers, and track inbound funds
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            size="sm"
            icon={<Download className="w-3.5 h-3.5" />}
          >
            Export
          </Button>
          <Button
            size="sm"
            icon={<Plus className="w-3.5 h-3.5" />}
            onClick={() => setShowNewPayment(true)}
          >
            New Payment
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-white/30" />
            <span className="text-xs text-white/40">Status:</span>
            {["all", "pending_approval", "executed", "rejected"].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                  filterStatus === status
                    ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
                    : "text-white/40 hover:text-white/60 hover:bg-white/[0.04]"
                }`}
              >
                {status === "all"
                  ? "All"
                  : status === "pending_approval"
                  ? "Pending"
                  : status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
          <div className="w-px h-6 bg-white/[0.06]" />
          <div className="flex items-center gap-2">
            <span className="text-xs text-white/40">Type:</span>
            {["all", "outbound", "inbound", "internal"].map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                  filterType === type
                    ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
                    : "text-white/40 hover:text-white/60 hover:bg-white/[0.04]"
                }`}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
          <div className="flex-1" />
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/20" />
            <input
              type="text"
              placeholder="Search transactions..."
              className="h-8 pl-9 pr-3 rounded-lg bg-white/[0.03] border border-white/[0.06] text-xs text-white placeholder-white/20 focus:outline-none focus:border-indigo-500/50 w-[200px]"
            />
          </div>
        </div>
      </Card>

      {/* Transaction List */}
      <Card>
        {/* Table Header */}
        <div className="grid grid-cols-[40px_2fr_1fr_1fr_1fr_1fr_40px] gap-4 px-6 py-3 border-b border-white/[0.06] text-xs font-medium text-white/30 uppercase tracking-wider">
          <div />
          <div>Transaction</div>
          <div>Category</div>
          <div>Memo</div>
          <div>Status</div>
          <div className="text-right">Amount</div>
          <div />
        </div>

        {/* Rows */}
        <div className="divide-y divide-white/[0.03]">
          {filtered.map((tx) => {
            const config = TYPE_CONFIG[tx.type];
            const Icon = config.icon;
            const isExpanded = selectedTx === tx.id;

            return (
              <div key={tx.id}>
                <div
                  className="grid grid-cols-[40px_2fr_1fr_1fr_1fr_1fr_40px] gap-4 px-6 py-4 hover:bg-white/[0.02] transition-colors cursor-pointer items-center"
                  onClick={() => setSelectedTx(isExpanded ? null : tx.id)}
                >
                  <div className={`w-8 h-8 rounded-lg ${config.bg} flex items-center justify-center`}>
                    <Icon className={`w-4 h-4 ${config.color}`} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-white truncate">
                      {tx.toLabel || tx.description}
                    </p>
                    <p className="text-xs text-white/30 mt-0.5">
                      {tx.createdBy} · {timeAgo(tx.createdAt)}
                    </p>
                  </div>
                  <div>
                    <Badge variant="outline">{tx.category}</Badge>
                  </div>
                  <div>
                    {tx.memo ? (
                      <span className="text-xs text-white/40 font-mono">{tx.memo}</span>
                    ) : (
                      <span className="text-xs text-white/15">—</span>
                    )}
                  </div>
                  <div>
                    <StatusBadge status={tx.status} />
                  </div>
                  <div className="text-right">
                    <p
                      className={`text-sm font-semibold tabular-nums ${
                        tx.type === "inbound" ? "text-emerald-400" : "text-white"
                      }`}
                    >
                      {config.prefix}
                      {formatUSD(tx.amount, 0)}
                    </p>
                    <p className="text-[10px] text-white/20 mt-0.5">{tx.token}</p>
                  </div>
                  <div>
                    <ExternalLink className="w-3.5 h-3.5 text-white/10 hover:text-white/30" />
                  </div>
                </div>

                {/* Expanded Detail */}
                {isExpanded && (
                  <div className="px-6 pb-4 pl-16">
                    <div className="grid grid-cols-3 gap-6 p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                      <div>
                        <p className="text-[10px] text-white/30 uppercase tracking-wider mb-1">
                          From
                        </p>
                        <p className="text-xs text-white/60 font-mono">
                          {shortenAddress(tx.from, 8)}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] text-white/30 uppercase tracking-wider mb-1">
                          To
                        </p>
                        <p className="text-xs text-white/60 font-mono">
                          {shortenAddress(tx.to, 8)}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] text-white/30 uppercase tracking-wider mb-1">
                          Created
                        </p>
                        <p className="text-xs text-white/60">{formatDateTime(tx.createdAt)}</p>
                      </div>
                      {tx.txHash && (
                        <div>
                          <p className="text-[10px] text-white/30 uppercase tracking-wider mb-1">
                            Tx Hash
                          </p>
                          <p className="text-xs text-indigo-400 font-mono">{tx.txHash}</p>
                        </div>
                      )}
                      <div>
                        <p className="text-[10px] text-white/30 uppercase tracking-wider mb-1">
                          Description
                        </p>
                        <p className="text-xs text-white/60">{tx.description}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-white/30 uppercase tracking-wider mb-1">
                          Approvals
                        </p>
                        <p className="text-xs text-white/60">
                          {tx.approvals.filter((a) => a.status === "approved").length} /{" "}
                          {tx.requiredApprovals} required
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="py-16 text-center">
            <FileText className="w-8 h-8 text-white/10 mx-auto" />
            <p className="text-sm text-white/30 mt-3">No transactions found</p>
            <p className="text-xs text-white/15 mt-1">Try adjusting your filters</p>
          </div>
        )}
      </Card>

      {/* New Payment Modal */}
      <NewPaymentModal open={showNewPayment} onClose={() => setShowNewPayment(false)} />
    </div>
  );
}
