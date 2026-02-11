"use client";

import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge, StatusBadge } from "@/components/ui/Badge";
import { useTreasury } from "@/hooks/useTreasury";
import { formatUSD, timeAgo, shortenAddress } from "@/lib/format";
import {
  CheckCircle2,
  XCircle,
  Clock,
  Shield,
  Users,
  AlertTriangle,
  ChevronRight,
  MessageSquare,
  Wifi,
} from "lucide-react";
import { useState } from "react";

export default function ApprovalsPage() {
  const { transactions, currentUser, approveTransaction, rejectTransaction, isLive, isApproving, isRejecting } = useTreasury();
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectComment, setRejectComment] = useState("");
  const [processingId, setProcessingId] = useState<string | null>(null);

  const pendingTxs = transactions.filter((tx) => tx.status === "pending_approval");
  const recentActions = transactions.filter(
    (tx) => tx.status === "executed" || tx.status === "rejected"
  );

  const handleApprove = async (txId: string) => {
    if (!currentUser) return;
    setProcessingId(txId);
    try {
      await approveTransaction(txId);
    } catch (err) {
      console.error("Approval failed:", err);
    }
    setProcessingId(null);
  };

  const handleReject = async (txId: string) => {
    if (!currentUser) return;
    setProcessingId(txId);
    try {
      await rejectTransaction(txId, rejectComment);
    } catch (err) {
      console.error("Rejection failed:", err);
    }
    setProcessingId(null);
    setRejectingId(null);
    setRejectComment("");
  };

  return (
    <div className="space-y-6 max-w-[1400px]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Approval Queue</h1>
          <p className="text-sm text-white/40 mt-1">
            Review and approve pending treasury transactions
          </p>
        </div>
        {isLive && (
            <Badge variant="success" dot>
              <Wifi className="w-3 h-3 mr-1" />
              On-Chain
            </Badge>
          )}
          <Badge variant={pendingTxs.length > 0 ? "warning" : "success"} dot>
          {pendingTxs.length} pending approval{pendingTxs.length !== 1 ? "s" : ""}
        </Badge>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
              <Clock className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{pendingTxs.length}</p>
              <p className="text-xs text-white/40">Pending Reviews</p>
            </div>
          </div>
        </Card>
        <Card className="p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">
                {formatUSD(
                  pendingTxs.reduce((s, t) => s + t.amount, 0),
                  0
                )}
              </p>
              <p className="text-xs text-white/40">Total Pending Value</p>
            </div>
          </div>
        </Card>
        <Card className="p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
              <Shield className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">
                {currentUser?.role || "—"}
              </p>
              <p className="text-xs text-white/40">Your Role</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Pending Transactions */}
      {pendingTxs.length > 0 ? (
        <div className="space-y-4">
          <h2 className="text-sm font-semibold text-white/60 uppercase tracking-wider">
            Pending Approvals
          </h2>
          {pendingTxs.map((tx) => {
            const approvedCount = tx.approvals.filter((a) => a.status === "approved").length;
            const progress = (approvedCount / tx.requiredApprovals) * 100;
            const isRejecting = rejectingId === tx.id;

            return (
              <Card key={tx.id} className="overflow-hidden">
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h3 className="text-base font-semibold text-white">
                          {tx.toLabel || tx.description}
                        </h3>
                        <Badge variant="outline">{tx.category}</Badge>
                      </div>
                      <p className="text-sm text-white/40 mt-1">{tx.description}</p>

                      {/* Details Grid */}
                      <div className="grid grid-cols-4 gap-6 mt-4">
                        <div>
                          <p className="text-[10px] text-white/25 uppercase tracking-wider">
                            Amount
                          </p>
                          <p className="text-lg font-bold text-white mt-1">
                            {formatUSD(tx.amount, 0)}
                          </p>
                          <p className="text-xs text-white/30">{tx.token}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-white/25 uppercase tracking-wider">
                            Recipient
                          </p>
                          <p className="text-sm text-white/70 mt-1 font-mono">
                            {shortenAddress(tx.to, 6)}
                          </p>
                        </div>
                        <div>
                          <p className="text-[10px] text-white/25 uppercase tracking-wider">
                            Memo
                          </p>
                          <p className="text-sm text-white/70 mt-1 font-mono">
                            {tx.memo || "—"}
                          </p>
                        </div>
                        <div>
                          <p className="text-[10px] text-white/25 uppercase tracking-wider">
                            Requested By
                          </p>
                          <p className="text-sm text-white/70 mt-1">{tx.createdBy}</p>
                          <p className="text-xs text-white/30">{timeAgo(tx.createdAt)}</p>
                        </div>
                      </div>

                      {/* Approval Progress */}
                      <div className="mt-5">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-xs text-white/40">
                            <Users className="w-3 h-3 inline mr-1" />
                            {approvedCount} of {tx.requiredApprovals} approvals
                          </p>
                          <p className="text-xs text-white/30">{Math.round(progress)}%</p>
                        </div>
                        <div className="h-1.5 bg-white/[0.04] rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full transition-all"
                            style={{ width: `${progress}%` }}
                          />
                        </div>

                        {/* Approver Status */}
                        <div className="flex items-center gap-3 mt-3">
                          {tx.approvals.map((approval) => (
                            <div
                              key={approval.id}
                              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs ${
                                approval.status === "approved"
                                  ? "bg-emerald-500/10 text-emerald-400"
                                  : approval.status === "rejected"
                                  ? "bg-red-500/10 text-red-400"
                                  : "bg-white/[0.04] text-white/40"
                              }`}
                            >
                              {approval.status === "approved" ? (
                                <CheckCircle2 className="w-3 h-3" />
                              ) : approval.status === "rejected" ? (
                                <XCircle className="w-3 h-3" />
                              ) : (
                                <Clock className="w-3 h-3" />
                              )}
                              {approval.approverName}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Reject Comment */}
                  {isRejecting && (
                    <div className="mt-4 p-4 rounded-xl bg-red-500/5 border border-red-500/10">
                      <p className="text-xs font-medium text-red-400 mb-2">
                        <MessageSquare className="w-3 h-3 inline mr-1" />
                        Rejection Reason
                      </p>
                      <textarea
                        value={rejectComment}
                        onChange={(e) => setRejectComment(e.target.value)}
                        placeholder="Provide a reason for rejecting this transaction..."
                        className="w-full h-20 px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.06] text-sm text-white placeholder-white/20 focus:outline-none focus:border-red-500/30 resize-none"
                      />
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center justify-end gap-3 mt-5 pt-4 border-t border-white/[0.04]">
                    {isRejecting ? (
                      <>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setRejectingId(null);
                            setRejectComment("");
                          }}
                        >
                          Cancel
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          loading={processingId === tx.id}
                          onClick={() => handleReject(tx.id)}
                          icon={<XCircle className="w-3.5 h-3.5" />}
                        >
                          Confirm Rejection
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => setRejectingId(tx.id)}
                          icon={<XCircle className="w-3.5 h-3.5" />}
                        >
                          Reject
                        </Button>
                        <Button
                          size="sm"
                          loading={processingId === tx.id}
                          onClick={() => handleApprove(tx.id)}
                          icon={<CheckCircle2 className="w-3.5 h-3.5" />}
                        >
                          Approve
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card className="p-16 text-center">
          <CheckCircle2 className="w-12 h-12 text-emerald-500/20 mx-auto" />
          <h3 className="text-lg font-semibold text-white mt-4">All Clear</h3>
          <p className="text-sm text-white/40 mt-1">No pending approvals at this time</p>
        </Card>
      )}

      {/* Recent Decisions */}
      <div>
        <h2 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-4">
          Recent Decisions
        </h2>
        <Card>
          <div className="divide-y divide-white/[0.03]">
            {recentActions.slice(0, 5).map((tx) => (
              <div
                key={tx.id}
                className="flex items-center justify-between px-6 py-3 hover:bg-white/[0.02] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      tx.status === "executed"
                        ? "bg-emerald-500/10"
                        : "bg-red-500/10"
                    }`}
                  >
                    {tx.status === "executed" ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-400" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-white">{tx.toLabel || tx.description}</p>
                    <p className="text-xs text-white/30">{timeAgo(tx.executedAt || tx.createdAt)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <StatusBadge status={tx.status} />
                  <p className="text-sm font-semibold text-white tabular-nums">
                    {formatUSD(tx.amount, 0)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
