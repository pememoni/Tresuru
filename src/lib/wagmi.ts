import { createConfig } from "@privy-io/wagmi";
import { http } from "wagmi";
import { tempoTestnet } from "./chain";

export const wagmiConfig = createConfig({
  chains: [tempoTestnet],
  transports: {
    [tempoTestnet.id]: http("https://rpc.moderato.tempo.xyz"),
  },
});
