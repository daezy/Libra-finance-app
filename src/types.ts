import {Connection, PublicKey, SendOptions, Transaction} from "@solana/web3.js";
import {TokenAccount} from "./solana/types.ts";

export type AppContextType = {
  isWalletConnected: boolean;
  network: "localnet" | "devnet" | "mainnet";
  provider: PhantomProvider | null;
  connection: Connection | null;
  userData: UserDataInterface | null;
  contractData: ContractDataInterface | null;
  tokenAccount: TokenAccount | null;
  successMsg: string | null;
  loading: boolean;
  errorMsg: string | null;
  setNetwork: (name: "localnet" | "devnet" | "mainnet") => void;
  setSuccess: (message: string) => void;
  setError: (message: string) => void;
  setLoading: (val: boolean) => void;
  connectWallet: () => void;
  disconnectWallet: () => void;
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
  isInitialized: boolean,
  adminPubkey: PublicKey,
  stakeTokenMint: PublicKey,
  stakeTokenAccount: PublicKey,
  minimumStakeAmount: bigint,
  minimumLockDuration: bigint,
  normalStakingApy: bigint,
  lockedStakingApy: bigint,
  earlyWithdrawalFee: bigint,
  totalStaked: bigint,
  totalEarned: bigint
}

export interface UserDataInterface {
  isInitialized: boolean,
  ownerPubkey: PublicKey,
  stakeType: bigint,
  lockDuration: bigint,
  totalStaked: bigint,
  interestAccrued: bigint,
  stakeTs: bigint,
  lastClaimTs: bigint,
  lastUnstakeTs: bigint
}
