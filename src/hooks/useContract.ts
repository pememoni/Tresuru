"use client";

import { useReadContract, useWriteContract, useWatchContractEvent, useAccount } from "wagmi";
import { parseUnits, formatUnits } from "viem";
import { treasuryAbi } from "@/lib/abi/treasury";
import { erc20Abi } from "@/lib/abi/token";
import { TREASURY_ADDRESS, TOKEN_ADDRESS, isLiveMode } from "@/lib/contracts";

// ─── Token Reads ─────────────────────────────────────────────────────────────

export function useTokenBalance(address: `0x${string}` | undefined) {
  return useReadContract({
    address: TOKEN_ADDRESS,
    abi: erc20Abi,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: { enabled: isLiveMode() && !!address },
  });
}

export function useTreasuryTokenBalance() {
  return useTokenBalance(TREASURY_ADDRESS);
}

// ─── Treasury Reads ──────────────────────────────────────────────────────────

export function useTransactionCount() {
  return useReadContract({
    address: TREASURY_ADDRESS,
    abi: treasuryAbi,
    functionName: "getTransactionCount",
    query: { enabled: isLiveMode() },
  });
}

export function useOnChainTransaction(txId: bigint | undefined) {
  return useReadContract({
    address: TREASURY_ADDRESS,
    abi: treasuryAbi,
    functionName: "getTransaction",
    args: txId !== undefined ? [txId] : undefined,
    query: { enabled: isLiveMode() && txId !== undefined },
  });
}

export function useSigners() {
  return useReadContract({
    address: TREASURY_ADDRESS,
    abi: treasuryAbi,
    functionName: "getSigners",
    query: { enabled: isLiveMode() },
  });
}

export function useIsSigner(address: `0x${string}` | undefined) {
  return useReadContract({
    address: TREASURY_ADDRESS,
    abi: treasuryAbi,
    functionName: "isSigner",
    args: address ? [address] : undefined,
    query: { enabled: isLiveMode() && !!address },
  });
}

export function useHasApproved(txId: bigint, signer: `0x${string}` | undefined) {
  return useReadContract({
    address: TREASURY_ADDRESS,
    abi: treasuryAbi,
    functionName: "hasApproved",
    args: signer ? [txId, signer] : undefined,
    query: { enabled: isLiveMode() && !!signer },
  });
}

export function useHasRejected(txId: bigint, signer: `0x${string}` | undefined) {
  return useReadContract({
    address: TREASURY_ADDRESS,
    abi: treasuryAbi,
    functionName: "hasRejected",
    args: signer ? [txId, signer] : undefined,
    query: { enabled: isLiveMode() && !!signer },
  });
}

// ─── V2 Reads: Thresholds, Timelock, Daily Limit, Pause ─────────────────────

export function usePaused() {
  return useReadContract({
    address: TREASURY_ADDRESS,
    abi: treasuryAbi,
    functionName: "paused",
    query: { enabled: isLiveMode() },
  });
}

export function useDailySpendRemaining() {
  return useReadContract({
    address: TREASURY_ADDRESS,
    abi: treasuryAbi,
    functionName: "getDailySpendRemaining",
    query: { enabled: isLiveMode() },
  });
}

export function useOnChainDailyLimit() {
  return useReadContract({
    address: TREASURY_ADDRESS,
    abi: treasuryAbi,
    functionName: "dailyLimit",
    query: { enabled: isLiveMode() },
  });
}

export function useOnChainThresholds() {
  return useReadContract({
    address: TREASURY_ADDRESS,
    abi: treasuryAbi,
    functionName: "getThresholds",
    query: { enabled: isLiveMode() },
  });
}

export function useTimelockDuration() {
  return useReadContract({
    address: TREASURY_ADDRESS,
    abi: treasuryAbi,
    functionName: "timelockDuration",
    query: { enabled: isLiveMode() },
  });
}

export function useRequiredApprovalsForAmount(amount: bigint) {
  return useReadContract({
    address: TREASURY_ADDRESS,
    abi: treasuryAbi,
    functionName: "getRequiredApprovals",
    args: [amount],
    query: { enabled: isLiveMode() && amount > BigInt(0) },
  });
}

// ─── Treasury Writes ─────────────────────────────────────────────────────────

export function usePropose() {
  const { writeContractAsync, isPending, isSuccess, error } = useWriteContract();

  const propose = async (
    to: `0x${string}`,
    amount: number,
    memo: string,
    description: string
  ) => {
    const amountWei = parseUnits(amount.toString(), 18);
    return writeContractAsync({
      address: TREASURY_ADDRESS,
      abi: treasuryAbi,
      functionName: "propose",
      args: [to, amountWei, TOKEN_ADDRESS, memo, description],
    });
  };

  return { propose, isPending, isSuccess, error };
}

export function useApproveTx() {
  const { writeContractAsync, isPending, isSuccess, error } = useWriteContract();

  const approveTx = async (txId: bigint) => {
    return writeContractAsync({
      address: TREASURY_ADDRESS,
      abi: treasuryAbi,
      functionName: "approve",
      args: [txId],
    });
  };

  return { approveTx, isPending, isSuccess, error };
}

export function useRevokeApproval() {
  const { writeContractAsync, isPending, isSuccess, error } = useWriteContract();

  const revokeApproval = async (txId: bigint) => {
    return writeContractAsync({
      address: TREASURY_ADDRESS,
      abi: treasuryAbi,
      functionName: "revokeApproval",
      args: [txId],
    });
  };

  return { revokeApproval, isPending, isSuccess, error };
}

export function useRejectTx() {
  const { writeContractAsync, isPending, isSuccess, error } = useWriteContract();

  const rejectTx = async (txId: bigint, reason: string) => {
    return writeContractAsync({
      address: TREASURY_ADDRESS,
      abi: treasuryAbi,
      functionName: "reject",
      args: [txId, reason],
    });
  };

  return { rejectTx, isPending, isSuccess, error };
}

export function useExecuteTx() {
  const { writeContractAsync, isPending, isSuccess, error } = useWriteContract();

  const executeTx = async (txId: bigint) => {
    return writeContractAsync({
      address: TREASURY_ADDRESS,
      abi: treasuryAbi,
      functionName: "execute",
      args: [txId],
    });
  };

  return { executeTx, isPending, isSuccess, error };
}

export function useEmergencyPause() {
  const { writeContractAsync, isPending, isSuccess, error } = useWriteContract();

  const emergencyPause = async () => {
    return writeContractAsync({
      address: TREASURY_ADDRESS,
      abi: treasuryAbi,
      functionName: "emergencyPause",
    });
  };

  return { emergencyPause, isPending, isSuccess, error };
}

export function useVoteUnpause() {
  const { writeContractAsync, isPending, isSuccess, error } = useWriteContract();

  const voteUnpause = async () => {
    return writeContractAsync({
      address: TREASURY_ADDRESS,
      abi: treasuryAbi,
      functionName: "voteUnpause",
    });
  };

  return { voteUnpause, isPending, isSuccess, error };
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Convert on-chain wei amount to display number (e.g. 47500.00) */
export function fromWei(amount: bigint): number {
  return Number(formatUnits(amount, 18));
}

/** Convert display number to wei bigint */
export function toWei(amount: number): bigint {
  return parseUnits(amount.toString(), 18);
}

/** Check if current wallet is connected and on the right chain */
export function useIsConnected() {
  const { address, isConnected, chainId } = useAccount();
  return {
    address,
    isConnected: isConnected && isLiveMode(),
    isOnTempoTestnet: chainId === 42431,
  };
}
