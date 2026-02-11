"use client";

import { useCallback } from "react";
import { useTreasuryStore, type Transaction } from "@/store/treasury";
import { isLiveMode, TREASURY_ADDRESS, TOKEN_ADDRESS } from "@/lib/contracts";
import {
  usePropose,
  useApproveTx,
  useRejectTx,
  useExecuteTx,
  useTreasuryTokenBalance,
  useTransactionCount,
  useSigners,
  useRequiredApprovals,
  useIsSigner,
  fromWei,
} from "./useContract";
import { useAccount } from "wagmi";

/**
 * Unified treasury hook. Returns the same interface regardless of mode:
 * - Demo mode: reads/writes from Zustand store (existing behavior)
 * - Live mode: reads from chain, writes call smart contracts, then syncs to Zustand
 */
export function useTreasury() {
  const store = useTreasuryStore();
  const live = isLiveMode();
  const { address } = useAccount();

  // ─── Live mode hooks (no-op when not live) ──────────────────────────
  const { data: onChainBalance } = useTreasuryTokenBalance();
  const { data: txCount } = useTransactionCount();
  const { data: signers } = useSigners();
  const { data: threshold } = useRequiredApprovals();
  const { data: callerIsSigner } = useIsSigner(address);

  const { propose, isPending: isProposing } = usePropose();
  const { approveTx, isPending: isApproving } = useApproveTx();
  const { rejectTx, isPending: isRejecting } = useRejectTx();
  const { executeTx, isPending: isExecuting } = useExecuteTx();

  // ─── Unified write actions ──────────────────────────────────────────

  const proposeTransaction = useCallback(
    async (params: {
      to: string;
      amount: number;
      memo: string;
      description: string;
      category: string;
      fromAccount: string;
      toLabel?: string;
    }) => {
      if (live) {
        await propose(
          params.to as `0x${string}`,
          params.amount,
          params.memo,
          params.description
        );
      }
      // Always update local store for immediate UI feedback
      store.addTransaction({
        type: "outbound",
        status: "pending_approval",
        from: params.fromAccount,
        to: params.to,
        toLabel: params.toLabel,
        amount: params.amount,
        token: "trUSD",
        category: params.category as Transaction["category"],
        memo: params.memo,
        description: params.description,
        createdBy: store.currentUser?.name || "Unknown",
        requiredApprovals: live && threshold ? Number(threshold) : 2,
      });
    },
    [live, propose, store, threshold]
  );

  const approveTransaction = useCallback(
    async (txId: string, onChainId?: bigint) => {
      if (live && onChainId !== undefined) {
        await approveTx(onChainId);
      }
      store.approveTransaction(txId, store.currentUser?.name || "Unknown");
    },
    [live, approveTx, store]
  );

  const rejectTransaction = useCallback(
    async (txId: string, comment: string, onChainId?: bigint) => {
      if (live && onChainId !== undefined) {
        await rejectTx(onChainId, comment);
      }
      store.rejectTransaction(txId, store.currentUser?.name || "Unknown", comment);
    },
    [live, rejectTx, store]
  );

  const executeTransaction = useCallback(
    async (onChainId: bigint) => {
      if (live) {
        await executeTx(onChainId);
      }
    },
    [live, executeTx]
  );

  // ─── Return unified interface ───────────────────────────────────────

  return {
    // Mode
    isLive: live,
    isSigner: live ? !!callerIsSigner : true,

    // State (live overrides demo where available)
    treasuryBalance: live && onChainBalance !== undefined
      ? fromWei(onChainBalance)
      : store.totalBalance(),
    transactionCount: live && txCount !== undefined
      ? Number(txCount)
      : store.transactions.length,
    signers: live && signers ? signers : store.team.map((m) => m.address as `0x${string}`),
    requiredApprovals: live && threshold ? Number(threshold) : 2,

    // Store data (always from Zustand for UI rendering)
    accounts: store.accounts,
    transactions: store.transactions,
    team: store.team,
    policies: store.policies,
    currentUser: store.currentUser,
    totalBalance: store.totalBalance,
    pendingTransactions: store.pendingTransactions,
    recentTransactions: store.recentTransactions,

    // Actions
    proposeTransaction,
    approveTransaction,
    rejectTransaction,
    executeTransaction,
    setCurrentUser: store.setCurrentUser,
    addTeamMember: store.addTeamMember,
    removeTeamMember: store.removeTeamMember,

    // Loading states
    isProposing,
    isApproving,
    isRejecting,
    isExecuting,
    isLoading: isProposing || isApproving || isRejecting || isExecuting,

    // Contract addresses (for display)
    treasuryAddress: TREASURY_ADDRESS,
    tokenAddress: TOKEN_ADDRESS,
  };
}
