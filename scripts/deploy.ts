/**
 * Deploy TresuruTreasury + TresuruUSD to Tempo Testnet
 *
 * Usage:
 *   DEPLOYER_PRIVATE_KEY=0x... npx hardhat run scripts/deploy.ts --network tempoTestnet
 *
 * After deploying, update your .env.local with the printed addresses:
 *   NEXT_PUBLIC_TREASURY_ADDRESS=0x...
 *   NEXT_PUBLIC_TOKEN_ADDRESS=0x...
 */

import hre from "hardhat";
import { parseUnits } from "viem";

async function main() {
  console.log("Deploying to", hre.network.name, "...\n");

  // 1. Deploy TresuruUSD token
  const Token = await hre.ethers.getContractFactory("TresuruUSD");
  const token = await Token.deploy();
  await token.waitForDeployment();
  const tokenAddress = await token.getAddress();
  console.log("TresuruUSD deployed:", tokenAddress);

  // 2. Get deployer address (will be first signer)
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deployer:", deployer.address);

  // 3. Deploy TresuruTreasury with deployer as sole initial signer, threshold = 1
  const Treasury = await hre.ethers.getContractFactory("TresuruTreasury");
  const treasury = await Treasury.deploy([deployer.address], 1);
  await treasury.waitForDeployment();
  const treasuryAddress = await treasury.getAddress();
  console.log("TresuruTreasury deployed:", treasuryAddress);

  // 4. Fund treasury with 20M trUSD for demo
  const fundAmount = parseUnits("20000000", 18);
  const tx = await token.transfer(treasuryAddress, fundAmount);
  await tx.wait();
  console.log("Funded treasury with 20,000,000 trUSD");

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
