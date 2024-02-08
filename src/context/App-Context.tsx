import React, { createContext, useEffect, useState } from "react";
import { AppContextType, PhantomProvider, WindowWithSolana } from "../types";
import { PublicKey } from "@solana/web3.js";

export const AppContext = createContext<AppContextType>({
  isWalletConnected: false,
  walletAddress: PublicKey.default,
  successMsg: "",
  network: null,
  errorMsg: "",
  setNetwork: () => {},
  connectWallet: () => {},
  disconnectWallet: () => {},
});

export const AppContextPorvider: React.FC<{ children: React.ReactNode }> = (
  props
) => {
  const [provider, setProvider] = useState<PhantomProvider | null>(null);
  const [pubKey, setPubKey] = useState<PublicKey>(PublicKey.default);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [connected, setConnected] = useState(false);
  const [network, setNetwork] = useState<"devnet" | "mainnet" | null>(null);

  useEffect(() => {
    // logic to fetch any data or connect to wallet once app launches
    if ("solana" in window) {
      const solWindow = window as WindowWithSolana;
      if (solWindow?.solana?.isPhantom) {
        setProvider(solWindow.solana);
        // Attempt an eager connection
        solWindow.solana.connect({ onlyIfTrusted: true });
      }
    }
  }, []);

  useEffect(() => {
    provider?.on("connect", (publicKey: PublicKey) => {
      setConnected(true);
      setPubKey(publicKey);
      setSuccess("Wallet Connected successfully");
      setTimeout(() => {
        setSuccess("");
      }, 3000);
    });
    provider?.on("disconnect", () => {
      setConnected(false);
      setPubKey(PublicKey.default);
      setSuccess("Wallet Disconnected successfully");
      setTimeout(() => {
        setSuccess("");
      }, 3000);
    });
  }, [provider]);

  const handleConnectWallet = (): void => {
    provider?.connect().catch(() => {
      setError("Could not connect wallet");
      setTimeout(() => {
        setError("");
      }, 3000);
    });
  };

  const handleSetNetwork = (name: "devnet" | "mainnet") => {
    setNetwork(name);
  };

  const handleDisconnectWallet = (): void => {
    provider?.disconnect().catch(() => {
      setError("Could not disconnect wallet");
      setTimeout(() => {
        setError("");
      }, 3000);
    });
  };
  return (
    <AppContext.Provider
      value={{
        isWalletConnected: connected,
        setNetwork: handleSetNetwork,
        network,
        walletAddress: pubKey,
        connectWallet: handleConnectWallet,
        successMsg: success,
        errorMsg: error,
        disconnectWallet: handleDisconnectWallet,
      }}
    >
      {props.children}
    </AppContext.Provider>
  );
};
