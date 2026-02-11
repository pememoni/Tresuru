"use client";

import { useCallback } from "react";
import { useTreasuryStore, LIVE_ACCOUNTS, type Transaction } from "@/store/treasury";
import { isLiveMode, TREASURY_ADDRESS, TOKEN_ADDRESS } from "@/lib/contracts";
import {
  usePropose,
  useApproveTx,
  useRevokeApproval,
  useRejectTx,
  useExecuteTx,
  useEmergencyPause,
  useVoteUnpause,
  useTreasuryTokenBalance,
  useTransactionCount,
  useSigners,
  useIsSigner,
  usePaused,
  useDailySpendRemaining,
  useOnChainDailyLimit,
  useTimelockDuration,
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
  const { data: callerIsSigner } = useIsSigner(address);

  // V2 reads
  const { data: isPaused } = usePaused();
  const { data: dailyRemaining } = useDailySpendRemaining();
  const { data: onChainDailyLimit } = useOnChainDailyLimit();
  const { data: onChainTimelockDuration } = useTimelockDuration();

  // Write hooks
  const { propose, isPending: isProposing } = usePropose();
  const { approveTx, isPending: isApproving } = useApproveTx();
  const { revokeApproval, isPending: isRevoking } = useRevokeApproval();
  const { rejectTx, isPending: isRejecting } = useRejectTx();
  const { executeTx, isPending: isExecuting } = useExecuteTx();
  const { emergencyPause, isPending: isPausing } = useEmergencyPause();
  const { voteUnpause, isPending: isUnpausing } = useVoteUnpause();

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
        requiredApprovals: 2,
      });
    },
    [live, demo, propose, store]
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

  const revokeTransactionApproval = useCallback(
    async (txId: string, onChainId?: bigint) => {
      if (live && !demo && onChainId !== undefined) {
        await revokeApproval(onChainId);
      }
    },
    [live, demo, revokeApproval]
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

  const pauseTreasury = useCallback(
    async () => {
      if (live && !demo) {
        await emergencyPause();
      }
    },
    [live, demo, emergencyPause]
  );

  const unpauseTreasury = useCallback(
    async () => {
      if (live && !demo) {
        await voteUnpause();
      }
    },
    [live, demo, voteUnpause]
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

    // V2: On-chain governance data
    isPaused: live && !demo ? !!isPaused : false,
    dailySpendRemaining: live && !demo && dailyRemaining !== undefined
      ? fromWei(dailyRemaining) : 500_000,
    dailyLimit: live && !demo && onChainDailyLimit !== undefined
      ? fromWei(onChainDailyLimit) : 500_000,
    timelockDuration: live && !demo && onChainTimelockDuration !== undefined
      ? Number(onChainTimelockDuration) : 120,

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
    revokeTransactionApproval,
    rejectTransaction,
    executeTransaction,
    pauseTreasury,
    unpauseTreasury,
    setCurrentUser: store.setCurrentUser,
    addTeamMember: store.addTeamMember,
    removeTeamMember: store.removeTeamMember,
    setDemoSession: store.setDemoSession,

    // Loading states
    isProposing,
    isApproving,
    isRevoking,
    isRejecting,
    isExecuting,
    isPausing,
    isUnpausing,
    isLoading: isProposing || isApproving || isRevoking || isRejecting || isExecuting || isPausing || isUnpausing,

    // Contract addresses (for display)
    treasuryAddress: TREASURY_ADDRESS,
    tokenAddress: TOKEN_ADDRESS,
  };
}
