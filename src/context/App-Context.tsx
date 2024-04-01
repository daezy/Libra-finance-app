import React, { createContext, useEffect, useState } from "react";
import {
  AppContextType,
  ContractDataInterface,
  PhantomProvider,
  TokenData,
  UserDataInterface,
  WindowWithSolana,
} from "../types";
import { Connection, PublicKey } from "@solana/web3.js";
import {
  CONTRACT_DATA_ACCOUNT,
  DEVNET_CONNECTION_URL,
  LOCALNET_CONNECTION_URL,
  MAINNET_CONNECTION_URL,
  STAKE_TOKEN_MINT,
} from "../solana/constants.ts";
import { TokenAccount } from "../solana/types.ts";
import {
  getContractData,
  getTokenAccount,
  getUserData,
} from "../solana/utils.ts";
import { supabase } from "../supabaseClient.ts";

export const AppContext = createContext<AppContextType>({
  isWalletConnected: false,
  loading: false,
  provider: null,
  connection: null,
  supply: 0,
  contractData: null,
  userData: null,
  tokenAccount: null,
  tokenPrice: 0,
  successMsg: "",
  priority: "medium",
  lastUnstakeTime: { lastunstake: null, appType: null },
  network: "mainnet",
  errorMsg: "",
  setNetwork: () => {},
  setPriority: () => {},
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
  const [libraPrice, setLibraPrice] = useState<number>(0);
  const [lastUnstake, setLastUnstake] = useState<string | null | undefined>();
  const [lastUnstakeApp, setLastUnstakeApp] = useState<string | null>();
  const [supply, setSupply] = useState<number>(0);
  const [priority, setPriority] = useState<
    "none" | "high" | "low" | "medium" | "veryHigh"
  >("medium");

  useEffect(() => {
    // logic to fetch any data or connect to wallet once app launches
    if ("solana" in window) {
      const solWindow = window as WindowWithSolana;
      if (solWindow?.solana?.isPhantom) {
        setProvider(solWindow.solana);
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
          setTimeout(() => {
            setError("");
          }, 5000);
        }
        try {
          const userData = await getUserData(connection, provider.publicKey);
          setUserData(userData);
          await fetchStakeData();
        } catch {
          console.log("User data not setup");
        }
      }
    };

    fetch(
      "https://price.jup.ag/v4/price?ids=Hz1XePA2vukqFBcf9P7VJ3AsMKoTXyPn3s21dNvGrHnd"
    )
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        const authors: TokenData =
          data.data["Hz1XePA2vukqFBcf9P7VJ3AsMKoTXyPn3s21dNvGrHnd"];
        setLibraPrice(authors.price);
      });
    const getTokenSupply = async () => {
      if (contractData && connection) {
        const supply = await connection.getTokenSupply(
          new PublicKey(STAKE_TOKEN_MINT)
        );
        setSupply(Number(supply.value.amount));
      }
    };

    setUp().then((val) => val);
    getTokenSupply();
  }, [connection, provider, success]);

  const fetchStakeData = async () => {
    try {
      const { data, error } = await supabase
        .from("stakes")
        .select("*")
        .eq("address", `${provider?.publicKey.toString()}`)
        .limit(1);

      if (error) throw error;
      setLastUnstake(data[0].lastunstake);
      if (!data[0].appType) {
        setLastUnstakeApp("stake");
        console.log(data[0]);
      } else {
        setLastUnstakeApp(data[0].appType);
        console.log(data[0]);
      }
    } catch (err) {
      console.log(err);
    }
  };

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

  const handleSetPriority = (
    priority_f: "none" | "high" | "low" | "medium" | "veryHigh"
  ) => {
    setPriority(priority_f);
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
        supply,
        setNetwork: handleSetNetwork,
        network,
        loading,
        setLoading,
        setError,
        setSuccess,
        tokenPrice: libraPrice,
        connection,
        contractData,
        priority,
        setPriority: handleSetPriority,
        userData,
        tokenAccount,
        provider,
        connectWallet: handleConnectWallet,
        successMsg: success,
        errorMsg: error,
        disconnectWallet: handleDisconnectWallet,
        lastUnstakeTime: { lastunstake: lastUnstake, appType: lastUnstakeApp },
      }}
    >
      {props.children}
    </AppContext.Provider>
  );
};
