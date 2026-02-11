import { defineChain } from "viem";

export const tempoTestnet = defineChain({
  id: 42431,
  name: "Tempo Testnet (Moderato)",
  nativeCurrency: {
    decimals: 18,
    name: "USD",
    symbol: "USD",
  },
  rpcUrls: {
    default: {
      http: ["https://rpc.moderato.tempo.xyz"],
      webSocket: ["wss://rpc.moderato.tempo.xyz"],
    },
  },
  blockExplorers: {
    default: {
      name: "Tempo Explorer",
      url: "https://explorer.moderato.tempo.xyz",
    },
  },
  testnet: true,
});

// Tempo testnet stablecoin addresses (TIP-20 tokens)
export const STABLECOINS = {
  TresuruUSD: {
    address: "0x20c0000000000000000000000000000000000001" as `0x${string}`,
    symbol: "trUSD",
    name: "TresuruUSD",
    decimals: 18,
    description: "Tresuru native USD stablecoin on Tempo",
    icon: "💎",
  },
  AlphaUSD: {
    address: "0x20c0000000000000000000000000000000000002" as `0x${string}`,
    symbol: "αUSD",
    name: "AlphaUSD",
    decimals: 18,
    description: "Tempo Testnet Alpha USD",
    icon: "🅰️",
  },
  PathUSD: {
    address: "0x20c0000000000000000000000000000000000000" as `0x${string}`,
    symbol: "pUSD",
    name: "pathUSD",
    decimals: 18,
    description: "Tempo Testnet Path USD",
    icon: "🛤️",
  },
} as const;

// Primary stablecoin for the treasury
export const PRIMARY_STABLECOIN = STABLECOINS.TresuruUSD;

// Predeployed contract addresses
export const CONTRACTS = {
  TIP20_FACTORY: "0x20Fc000000000000000000000000000000000000" as `0x${string}`,
  EXCHANGE: "0xdec0000000000000000000000000000000000000" as `0x${string}`,
};
