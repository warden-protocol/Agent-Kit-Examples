"use client";

import React, { type ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createAppKit } from "@reown/appkit/react";
import {
  wagmiAdapter,
  projectId,
  siweConfig,
  metadata,
  networks,
} from "../config";
import { State, WagmiProvider } from "wagmi";

const queryClient = new QueryClient();

if (!projectId) {
  throw new Error("Project ID is not defined");
}

createAppKit({
  adapters: [wagmiAdapter],
  networks: networks,
  projectId,
  siweConfig,
  metadata,
  features: {
    email: true,
    socials: [
      "google",
      "x",
      "discord",
    ],
    emailShowWallets: true,
  },
});

function ContextProvider({
  children,
  initialState,
}: {
  children: ReactNode;
  initialState?: State;
}) {
  return (
    <WagmiProvider
      config={wagmiAdapter.wagmiConfig}
      initialState={initialState}
    >
      <QueryClientProvider client={queryClient}>
          {children}
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default ContextProvider;