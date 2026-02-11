"use client";

import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { useTreasuryStore } from "@/store/treasury";
import { TRANSACTION_CATEGORIES, APPROVAL_THRESHOLDS, TransactionCategory } from "@/lib/constants";
import { formatUSD } from "@/lib/format";
import { useState } from "react";
import { Send, AlertCircle, Shield, FileText } from "lucide-react";

interface NewPaymentModalProps {
  open: boolean;
  onClose: () => void;
}

export default function NewPaymentModal({ open, onClose }: NewPaymentModalProps) {
  const { accounts, addTransaction, currentUser } = useTreasuryStore();
  const [formData, setFormData] = useState({
    fromAccount: "",
    toAddress: "",
    toLabel: "",
    amount: "",
    category: "" as TransactionCategory | "",
    memo: "",
    description: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const amount = parseFloat(formData.amount) || 0;

  const getApprovalThreshold = () => {
    if (amount <= APPROVAL_THRESHOLDS.LOW.max) return APPROVAL_THRESHOLDS.LOW;
    if (amount <= APPROVAL_THRESHOLDS.MEDIUM.max) return APPROVAL_THRESHOLDS.MEDIUM;
    if (amount <= APPROVAL_THRESHOLDS.HIGH.max) return APPROVAL_THRESHOLDS.HIGH;
    return APPROVAL_THRESHOLDS.CRITICAL;
  };

  const threshold = getApprovalThreshold();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fromAccount || !formData.toAddress || !amount || !formData.category) return;

    setIsSubmitting(true);

    // Simulate transaction creation
    setTimeout(() => {
      addTransaction({
        type: "outbound",
        status: "pending_approval",
        from: formData.fromAccount,
        to: formData.toAddress,
        toLabel: formData.toLabel || undefined,
        amount,
        token: "trUSD",
        category: formData.category as TransactionCategory,
        memo: formData.memo,
        description: formData.description,
        createdBy: currentUser?.name || "Unknown",
        requiredApprovals: threshold.requiredApprovals,
      });
      setIsSubmitting(false);
      setFormData({
        fromAccount: "",
        toAddress: "",
        toLabel: "",
        amount: "",
        category: "",
        memo: "",
        description: "",
      });
      onClose();
    }, 1500);
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="New Payment"
      subtitle="Create a new outbound trUSD payment"
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* From Account */}
        <div>
          <label className="block text-xs font-medium text-white/50 mb-2">From Account</label>
          <select
            value={formData.fromAccount}
            onChange={(e) => setFormData({ ...formData, fromAccount: e.target.value })}
            className="w-full h-10 px-3 rounded-lg bg-white/[0.04] border border-white/[0.08] text-sm text-white focus:outline-none focus:border-indigo-500/50 appearance-none"
            required
          >
            <option value="">Select treasury account</option>
            {accounts.map((acc) => (
              <option key={acc.id} value={acc.address} className="bg-[#0e0e16]">
                {acc.name} — {formatUSD(acc.balance, 0)}
              </option>
            ))}
          </select>
        </div>

        {/* To Address + Label */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-white/50 mb-2">
              Recipient Address
            </label>
            <input
              type="text"
              placeholder="0x..."
              value={formData.toAddress}
              onChange={(e) => setFormData({ ...formData, toAddress: e.target.value })}
              className="w-full h-10 px-3 rounded-lg bg-white/[0.04] border border-white/[0.08] text-sm text-white placeholder-white/20 focus:outline-none focus:border-indigo-500/50 font-mono"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-white/50 mb-2">
              Recipient Label
            </label>
            <input
              type="text"
              placeholder="e.g. AWS, Payroll"
              value={formData.toLabel}
              onChange={(e) => setFormData({ ...formData, toLabel: e.target.value })}
              className="w-full h-10 px-3 rounded-lg bg-white/[0.04] border border-white/[0.08] text-sm text-white placeholder-white/20 focus:outline-none focus:border-indigo-500/50"
            />
          </div>
        </div>

        {/* Amount + Category */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-white/50 mb-2">
              Amount (trUSD)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-white/30">
                $
              </span>
              <input
                type="number"
                placeholder="0.00"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                className="w-full h-10 pl-7 pr-3 rounded-lg bg-white/[0.04] border border-white/[0.08] text-sm text-white placeholder-white/20 focus:outline-none focus:border-indigo-500/50 tabular-nums"
                min="0"
                step="0.01"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-white/50 mb-2">Category</label>
            <select
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value as TransactionCategory })
              }
              className="w-full h-10 px-3 rounded-lg bg-white/[0.04] border border-white/[0.08] text-sm text-white focus:outline-none focus:border-indigo-500/50 appearance-none"
              required
            >
              <option value="">Select category</option>
              {TRANSACTION_CATEGORIES.map((cat) => (
                <option key={cat} value={cat} className="bg-[#0e0e16]">
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Memo (for on-chain reconciliation) */}
        <div>
          <label className="block text-xs font-medium text-white/50 mb-2">
            <FileText className="w-3 h-3 inline mr-1" />
            On-Chain Memo (for reconciliation)
          </label>
          <input
            type="text"
            placeholder="e.g. INV-2025-0043, PO-12345"
            value={formData.memo}
            onChange={(e) => setFormData({ ...formData, memo: e.target.value })}
            className="w-full h-10 px-3 rounded-lg bg-white/[0.04] border border-white/[0.08] text-sm text-white placeholder-white/20 focus:outline-none focus:border-indigo-500/50 font-mono"
          />
          <p className="text-[10px] text-white/20 mt-1">
            Stored on-chain via Tempo&apos;s native memo system for automatic reconciliation
          </p>
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-medium text-white/50 mb-2">Description</label>
          <textarea
            placeholder="Payment description..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full h-20 px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.08] text-sm text-white placeholder-white/20 focus:outline-none focus:border-indigo-500/50 resize-none"
          />
        </div>

        {/* Approval Info */}
        {amount > 0 && (
          <div className="flex items-start gap-3 p-3 rounded-xl bg-indigo-500/5 border border-indigo-500/10">
            <Shield className="w-4 h-4 text-indigo-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs font-medium text-indigo-400">{threshold.label} Transaction</p>
              <p className="text-xs text-white/40 mt-0.5">
                Requires {threshold.requiredApprovals} approval
                {threshold.requiredApprovals > 1 ? "s" : ""} before execution.
                Amount: {formatUSD(amount)}
              </p>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Button variant="ghost" onClick={onClose} type="button">
            Cancel
          </Button>
          <Button
            type="submit"
            loading={isSubmitting}
            icon={<Send className="w-4 h-4" />}
          >
            Submit for Approval
          </Button>
        </div>
      </form>
    </Modal>
  );
}
