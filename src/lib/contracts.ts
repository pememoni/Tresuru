/**
 * Contract addresses — set via environment variables after deployment.
 * When these are empty, the app falls back to demo mode.
 */

export const TREASURY_ADDRESS = (process.env.NEXT_PUBLIC_TREASURY_ADDRESS || "") as `0x${string}`;
export const TOKEN_ADDRESS = (process.env.NEXT_PUBLIC_TOKEN_ADDRESS || "") as `0x${string}`;

/**
 * Returns true when contracts are deployed and configured.
 * The app uses real on-chain data in this mode.
 */
export function isLiveMode(): boolean {
  return (
    TREASURY_ADDRESS.length === 42 &&
    TOKEN_ADDRESS.length === 42 &&
    TREASURY_ADDRESS !== "0x" &&
    TOKEN_ADDRESS !== "0x"
  );
}
