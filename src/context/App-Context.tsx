import React, { createContext, useEffect, useState } from "react";
import {
  AppContextType,
  ContractDataInterface,
  PhantomProvider,
  UserDataInterface,
  WindowWithSolana,
} from "../types";
import { Connection, PublicKey } from "@solana/web3.js";
import {
  CONTRACT_DATA_ACCOUNT,
  DEVNET_CONNECTION_URL,
  LOCALNET_CONNECTION_URL,
  MAINNET_CONNECTION_URL,
} from "../solana/constants.ts";
import { TokenAccount } from "../solana/types.ts";
import {
  getContractData,
  getTokenAccount,
  getUserData,
} from "../solana/utils.ts";

export const AppContext = createContext<AppContextType>({
  isWalletConnected: false,
  loading: false,
  provider: null,
  connection: null,
  contractData: null,
  userData: null,
  tokenAccount: null,
  successMsg: "",
  network: "mainnet",
  errorMsg: "",
  setNetwork: () => {},
  setSuccess: () => {},
  setError: () => {},
  setLoading: () => {},
  connectWallet: () => {},
  disconnectWallet: () => {},
});

export const AppContextProvider: React.FC<{ children: React.ReactNode }> = (
  props
) => {
  const [provider, setProvider] = useState<PhantomProvider | null>(null);
  const [connection, setConnection] = useState<Connection | null>(null);
  const [tokenAccount, setTokenAccount] = useState<TokenAccount | null>(null);
  const [contractData, setContractData] =
    useState<ContractDataInterface | null>(null);
  const [userData, setUserData] = useState<UserDataInterface | null>(null);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [network, setNetwork] = useState<"localnet" | "devnet" | "mainnet">(
    "mainnet"
  );

  useEffect(() => {
    // logic to fetch any data or connect to wallet once app launches
    if ("solana" in window) {
      const solWindow = window as WindowWithSolana;
      if (solWindow?.solana?.isPhantom) {
        setProvider(solWindow.solana);
        console.log(network);
        if (network == "localnet") {
          setConnection(new Connection(LOCALNET_CONNECTION_URL, "confirmed"));
        } else if (network == "devnet") {
          setConnection(new Connection(DEVNET_CONNECTION_URL, "confirmed"));
        } else {
          setConnection(new Connection(MAINNET_CONNECTION_URL, "confirmed"));
        }
        // Attempt an eager connection
        solWindow.solana.connect({ onlyIfTrusted: true });
      }
    }
  }, [network]);

  useEffect(() => {
    provider?.on("connect", () => {
      setConnected(true);
      setSuccess("Wallet Connected successfully");

      setTimeout(() => {
        setSuccess("");
      }, 3000);
    });
    provider?.on("disconnect", () => {
      setConnected(false);
      setSuccess("Wallet Disconnected successfully");
      setTimeout(() => {
        setSuccess("");
      }, 3000);
    });
  }, [provider]);

  useEffect(() => {
    // Function to set up user account, user token account and contract account data
    const setUp = async () => {
      if (connection && provider) {
        const contractData = await getContractData(
          connection,
          new PublicKey(CONTRACT_DATA_ACCOUNT)
        );
        setContractData(contractData);
        console.log(
          contractData?.minimumStakeAmount.toString(),
          contractData?.minimumLockDuration.toString(),
          contractData?.earlyWithdrawalFee.toString(),
          contractData?.lockedStakingApy.toString(),
          contractData?.normalStakingApy.toString()
        );
        try {
          if (contractData) {
            const tokenAccount = await getTokenAccount(
              connection,
              provider.publicKey,
              contractData.stakeTokenMint
            );
            setTokenAccount(tokenAccount);
          }
        } catch (error) {
          console.log(error);
          setError("You do not have Libra tokens in your wallet❌");
        }
        try {
          const userData = await getUserData(connection, provider.publicKey);
          setUserData(userData);
        } catch {
          console.log("User data not setup");
        }
      }
    };
    setUp().then((val) => console.log(val));
  }, [connection, provider, success]);

  const handleConnectWallet = (): void => {
    provider?.connect().catch(() => {
      setError("Could not connect wallet");
      setTimeout(() => {
        setError("");
      }, 3000);
    });
  };

  const handleSetNetwork = (name: "localnet" | "devnet" | "mainnet") => {
    setNetwork(name);
  };

  const handleDisconnectWallet = (): void => {
    provider?.disconnect().catch(() => {
      setError("Could not disconnect wallet");
      setLoading(false);
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
        loading,
        setLoading,
        setError,
        setSuccess,
        connection,
        contractData,
        userData,
        tokenAccount,
        provider,
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
