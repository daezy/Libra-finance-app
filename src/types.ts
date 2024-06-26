import {
  Connection,
  PublicKey,
  SendOptions,
  Transaction,
} from "@solana/web3.js";
import { TokenAccount } from "./solana/types.ts";

export type AppContextType = {
  isWalletConnected: boolean;
  supply: number;
  network: "localnet" | "devnet" | "mainnet";
  priority: "none" | "high" | "low" | "medium" | "veryHigh";
  provider: PhantomProvider | null;
  connection: Connection | null;
  userData: UserDataInterface | null;
  contractData: ContractDataInterface | null;
  tokenAccount: TokenAccount | null;
  successMsg: string | null;
  loading: boolean;
  tokenPrice: number;
  errorMsg: string | null;
  setNetwork: (name: "localnet" | "devnet" | "mainnet") => void;
  setPriority: (prior: "none" | "high" | "low" | "medium" | "veryHigh") => void;
  setSuccess: (message: string) => void;
  setError: (message: string) => void;
  setLoading: (val: boolean) => void;
  connectWallet: () => void;
  disconnectWallet: () => void;
  lastUnstakeTime: {
    lastunstake: string | null | undefined;
    appType: string | null | undefined;
  };
};

export type PhantomEvent = "disconnect" | "connect" | "accountChanged";

export interface ConnectOpts {
  onlyIfTrusted: boolean;
}

export interface PhantomProvider {
  connect: (opts?: Partial<ConnectOpts>) => Promise<{ publicKey: PublicKey }>;
  disconnect: () => Promise<void>;
  signAndSendTransaction: (
    transaction: Transaction,
    opts?: SendOptions
  ) => Promise<{ signature: string; publicKey: PublicKey }>;
  signTransaction: (transaction: Transaction) => Promise<Transaction>;
  on: (event: PhantomEvent, callback: (args: any) => void) => void;
  publicKey: PublicKey;
  isPhantom: boolean;
}

export type WindowWithSolana = Window & {
  solana?: PhantomProvider;
};

export interface ContractDataInterface {
  isInitialized: boolean;
  adminPubkey: PublicKey;
  stakeTokenMint: PublicKey;
  stakeTokenAccount: PublicKey;
  minimumStakeAmount: bigint;
  minimumLockDuration: bigint;
  normalStakingApy: bigint;
  lockedStakingApy: bigint;
  earlyWithdrawalFee: bigint;
  totalStaked: bigint;
  totalEarned: bigint;
}

export interface UserDataInterface {
  isInitialized: boolean;
  ownerPubkey: PublicKey;
  stakeType: bigint;
  lockDuration: bigint;
  totalStaked: bigint;
  interestAccrued: bigint;
  stakeTs: bigint;
  lastClaimTs: bigint;
  lastUnstakeTs: bigint;
}

export type TokenData = {
  id: string;
  mintSymbol: string;
  vsToken: string;
  vsTokenSymbol: string;
  price: number;
};
