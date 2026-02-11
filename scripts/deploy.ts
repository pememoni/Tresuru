/**
 * Deploy TresuruTreasury + TresuruUSD to Tempo Testnet
 *
 * Usage:
 *   nvm use 22
 *   DEPLOYER_PRIVATE_KEY=0x... npm run deploy:testnet
 *
 * After deploying, update your .env.local with the printed addresses.
 */

import {
  createPublicClient,
  http,
  parseUnits,
  encodeFunctionData,
  encodeDeployData,
  serializeTransaction,
  type TransactionSerializableLegacy,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { readFileSync } from "fs";

const TEMPO_TESTNET = {
  id: 42431,
  name: "Tempo Testnet",
  nativeCurrency: { decimals: 18, name: "USD", symbol: "USD" },
  rpcUrls: { default: { http: ["https://rpc.moderato.tempo.xyz"] } },
} as const;

const RPC_URL = "https://rpc.moderato.tempo.xyz";

async function sendRawTx(
  account: ReturnType<typeof privateKeyToAccount>,
  publicClient: ReturnType<typeof createPublicClient>,
  tx: { to?: `0x${string}`; data: `0x${string}`; gas: bigint; nonce: number }
) {
  const gasPrice = await publicClient.getGasPrice();
  const txData: TransactionSerializableLegacy = {
    type: "legacy",
    chainId: 42431,
    nonce: tx.nonce,
    to: tx.to ?? undefined,
    value: 0n,
    data: tx.data,
    gas: tx.gas,
    gasPrice,
  };
  const signed = await account.signTransaction(txData);
  const hash = await publicClient.sendRawTransaction({ serializedTransaction: signed });
  return hash;
}

async function main() {
  const key = process.env.DEPLOYER_PRIVATE_KEY;
  if (!key) {
    console.error("Set DEPLOYER_PRIVATE_KEY env var");
    process.exit(1);
  }

  const account = privateKeyToAccount(key as `0x${string}`);
  console.log("Deployer:", account.address);

  const publicClient = createPublicClient({
    chain: TEMPO_TESTNET,
    transport: http(RPC_URL),
  });

  const balance = await publicClient.getBalance({ address: account.address });
  console.log("Balance:", balance.toString(), "wei");

  let nonce = Number(
    await publicClient.getTransactionCount({ address: account.address })
  );
  console.log("Nonce:", nonce);

  // Load compiled artifacts
  const tokenArtifact = JSON.parse(
    readFileSync("./artifacts/contracts/TresuruUSD.sol/TresuruUSD.json", "utf8")
  );
  const treasuryArtifact = JSON.parse(
    readFileSync("./artifacts/contracts/TresuruTreasury.sol/TresuruTreasury.json", "utf8")
  );

  // 1. Deploy TresuruUSD
  console.log("\nDeploying TresuruUSD...");
  const tokenHash = await sendRawTx(account, publicClient, {
    data: tokenArtifact.bytecode as `0x${string}`,
    gas: 3_000_000n,
    nonce: nonce++,
  });
  console.log("  tx:", tokenHash);
  const tokenReceipt = await publicClient.waitForTransactionReceipt({ hash: tokenHash });
  const tokenAddress = tokenReceipt.contractAddress!;
  console.log("  TresuruUSD deployed:", tokenAddress);

  // 2. Deploy TresuruTreasury (V2 with tiered thresholds, timelock, daily limit)
  console.log("\nDeploying TresuruTreasury V2...");
  const treasuryDeployData = encodeDeployData({
    abi: treasuryArtifact.abi,
    bytecode: treasuryArtifact.bytecode as `0x${string}`,
    args: [
      [account.address],             // _signers
      parseUnits("10000", 18),       // _lowThreshold: $10k
      parseUnits("100000", 18),      // _mediumThreshold: $100k
      parseUnits("1000000", 18),     // _highThreshold: $1M
      120n,                          // _timelockDuration: 2 minutes (demo)
      parseUnits("500000", 18),      // _dailyLimit: $500k
      3600n,                         // _txExpirationPeriod: 1 hour (demo)
    ],
  });
  const treasuryHash = await sendRawTx(account, publicClient, {
    data: treasuryDeployData,
    gas: 8_000_000n,
    nonce: nonce++,
  });
  console.log("  tx:", treasuryHash);
  const treasuryReceipt = await publicClient.waitForTransactionReceipt({ hash: treasuryHash });
  const treasuryAddress = treasuryReceipt.contractAddress!;
  console.log("  TresuruTreasury deployed:", treasuryAddress);

  // 3. Fund treasury with 20M trUSD
  console.log("\nFunding treasury with 20,000,000 trUSD...");
  const fundAmount = parseUnits("20000000", 18);
  const transferData = encodeFunctionData({
    abi: tokenArtifact.abi,
    functionName: "transfer",
    args: [treasuryAddress, fundAmount],
  });
  const transferHash = await sendRawTx(account, publicClient, {
    to: tokenAddress,
    data: transferData,
    gas: 100_000n,
    nonce: nonce++,
  });
  await publicClient.waitForTransactionReceipt({ hash: transferHash });
  console.log("  Funded!");

  console.log("\n─── Add these to your .env.local ───");
  console.log(`NEXT_PUBLIC_TREASURY_ADDRESS=${treasuryAddress}`);
  console.log(`NEXT_PUBLIC_TOKEN_ADDRESS=${tokenAddress}`);
  console.log("NEXT_PUBLIC_DEMO_MODE=false");
  console.log("────────────────────────────────────\n");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
