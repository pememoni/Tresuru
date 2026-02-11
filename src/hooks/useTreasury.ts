"use client";

import { useCallback } from "react";
import { useTreasuryStore, LIVE_ACCOUNTS, type Transaction } from "@/store/treasury";
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
 * Unified treasury hook.
 * - Demo session: shows sample data for showcasing the product
 * - Live mode (wallet connected): reads from chain, writes call smart contracts
 */
export function useTreasury() {
  const store = useTreasuryStore();
  const live = isLiveMode();
  const demo = store.demoSession;
  const showDemo = demo || !live;
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
      if (live && !demo) {
        await propose(
          params.to as `0x${string}`,
          params.amount,
          params.memo,
          params.description
        );
      }
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
        requiredApprovals: live && !demo && threshold ? Number(threshold) : 2,
      });
    },
    [live, demo, propose, store, threshold]
  );

  const approveTransaction = useCallback(
    async (txId: string, onChainId?: bigint) => {
      if (live && !demo && onChainId !== undefined) {
        await approveTx(onChainId);
      }
      store.approveTransaction(txId, store.currentUser?.name || "Unknown");
    },
    [live, demo, approveTx, store]
  );

  const rejectTransaction = useCallback(
    async (txId: string, comment: string, onChainId?: bigint) => {
      if (live && !demo && onChainId !== undefined) {
        await rejectTx(onChainId, comment);
      }
      store.rejectTransaction(txId, store.currentUser?.name || "Unknown", comment);
    },
    [live, demo, rejectTx, store]
  );

  const executeTransaction = useCallback(
    async (onChainId: bigint) => {
      if (live && !demo) {
        await executeTx(onChainId);
      }
    },
    [live, demo, executeTx]
  );

  // ─── Compute live-mode data ────────────────────────────────────────

  const liveBalance = live && onChainBalance !== undefined ? fromWei(onChainBalance) : 0;

  const liveAccountsWithBalance = LIVE_ACCOUNTS.map((a) =>
    a.id === "acc-treasury" ? { ...a, balance: liveBalance } : a
  );

  // ─── Return unified interface ───────────────────────────────────────

  return {
    // Mode
    isLive: live && !demo,
    isDemo: showDemo,
    isSigner: live && !demo ? !!callerIsSigner : true,

    // State — demo shows sample data, live shows on-chain data
    treasuryBalance: showDemo ? store.totalBalance() : liveBalance,
    transactionCount: showDemo
      ? store.transactions.length
      : (txCount !== undefined ? Number(txCount) : 0),
    signers: showDemo
      ? store.team.map((m) => m.address as `0x${string}`)
      : (signers ?? []),
    requiredApprovals: showDemo ? 2 : (threshold ? Number(threshold) : 1),

    // Store data — demo uses full store, live uses empty/on-chain
    accounts: showDemo ? store.accounts : liveAccountsWithBalance,
    transactions: showDemo ? store.transactions : [],
    team: showDemo ? store.team : [],
    policies: showDemo ? store.policies : [],
    currentUser: showDemo ? store.currentUser : null,
    totalBalance: showDemo ? store.totalBalance : () => liveBalance,
    pendingTransactions: showDemo ? store.pendingTransactions : () => [],
    recentTransactions: showDemo ? store.recentTransactions : () => [],

    // Actions
    proposeTransaction,
    approveTransaction,
    rejectTransaction,
    executeTransaction,
    setCurrentUser: store.setCurrentUser,
    addTeamMember: store.addTeamMember,
    removeTeamMember: store.removeTeamMember,
    setDemoSession: store.setDemoSession,

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
