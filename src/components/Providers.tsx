"use client";

import { PrivyProvider, usePrivy } from "@privy-io/react-auth";
import { WagmiProvider } from "@privy-io/wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, createContext, useContext } from "react";
import { useRouter } from "next/navigation";
import { wagmiConfig } from "@/lib/wagmi";
import { tempoTestnet } from "@/lib/chain";
import { APP_NAME } from "@/lib/constants";

const PRIVY_APP_ID = process.env.NEXT_PUBLIC_PRIVY_APP_ID || "";
const isValidPrivyId = PRIVY_APP_ID.length > 5 && PRIVY_APP_ID !== "clxxxxxxxxxxxxxxxxxxxxxxxxx";

// Unified auth context used by both demo and Privy paths
interface AuthUser {
  email?: { address: string };
  wallet?: { address: string };
  [key: string]: unknown;
}

interface AuthState {
  ready: boolean;
  authenticated: boolean;
  login: () => void;
  logout: () => void;
  user: AuthUser | null;
}

const AuthContext = createContext<AuthState>({
  ready: false,
  authenticated: false,
  login: () => {},
  logout: () => {},
  user: null,
});

export function useAuthContext() {
  return useContext(AuthContext);
}

// Bridges real Privy hook into the unified AuthContext
function PrivyAuthBridge({ children }: { children: React.ReactNode }) {
  const { ready, authenticated, login, logout, user } = usePrivy();
  const router = useRouter();

  return (
    <AuthContext.Provider
      value={{
        ready,
        authenticated,
        login,
        logout: async () => {
          await logout();
          router.push("/");
        },
        user: user as AuthUser | null,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

function DemoProviders({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <AuthContext.Provider
      value={{
        ready: true,
        authenticated: false,
        login: () => {
          if (typeof window !== "undefined") {
            window.location.href = "/dashboard";
          }
        },
        logout: () => {
          if (typeof window !== "undefined") {
            window.location.href = "/";
          }
        },
        user: null,
      }}
    >
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </AuthContext.Provider>
  );
}

function PrivyProviders({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <PrivyProvider
      appId={PRIVY_APP_ID}
      config={{
        appearance: {
          theme: "dark",
          accentColor: "#6366f1",
          logo: undefined,
          landingHeader: `Connect to ${APP_NAME}`,
          loginMessage: "Enterprise treasury management on Tempo Network",
        },
        loginMethods: ["email", "wallet", "google"],
        defaultChain: tempoTestnet,
        supportedChains: [tempoTestnet],
        embeddedWallets: {
          ethereum: {
            createOnLogin: "users-without-wallets",
          },
        },
      }}
    >
      <QueryClientProvider client={queryClient}>
        <WagmiProvider config={wagmiConfig}>
          <PrivyAuthBridge>{children}</PrivyAuthBridge>
        </WagmiProvider>
      </QueryClientProvider>
    </PrivyProvider>
  );
}

export default function Providers({ children }: { children: React.ReactNode }) {
  if (isValidPrivyId) {
    return <PrivyProviders>{children}</PrivyProviders>;
  }
  return <DemoProviders>{children}</DemoProviders>;
}
