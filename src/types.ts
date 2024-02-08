import { PublicKey, SendOptions, Transaction } from "@solana/web3.js";

export type AppContextType = {
  isWalletConnected: boolean;
  network: "devnet" | "mainnet" | null;
  walletAddress: PublicKey;
  successMsg: string | null;
  loading: boolean;
  errorMsg: string | null;
  setNetwork: (name: "devnet" | "mainnet") => void;
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
  isInitialized: number;
  adminPubkey: PublicKey;
  tokenMintPubkey: PublicKey;
  pdaBump: Uint8Array;
  depositPerPeriod: number;
  minimumTokenBalanceForClaim: number;
}

export interface UserDataInterface {
  isInitialized: number;
  ownerPubkey: PublicKey;
  lastClaimTs: number;
}
