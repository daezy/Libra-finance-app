import {PublicKey} from "@solana/web3.js";

export enum StakeType {
    NORMAL,
    LOCKED
}

export interface ContractData {
    isInitialized: boolean,
    adminPubkey: Uint8Array,
    stakeTokenMint: Uint8Array,
    stakeTokenAccount: Uint8Array,
    minimumStakeAmount: Uint8Array,
    minimumLockDuration: Uint8Array,
    normalStakingApy: Uint8Array,
    lockedStakingApy: Uint8Array,
    earlyWithdrawalFee: Uint8Array,
    totalStaked: Uint8Array,
    totalEarned: Uint8Array,
    feeBasisPoints: Uint8Array,
    maxFee: Uint8Array
}

export interface UserData {
    isInitialized: boolean,
    ownerPubkey: Uint8Array,
    stakeType: Uint8Array,
    lockDuration: Uint8Array,
    totalStaked: Uint8Array,
    interestAccrued: Uint8Array,
    stakeTs: Uint8Array,
    lastClaimTs: Uint8Array,
    lastUnstakeTs: Uint8Array
}

export interface TokenAccount {
    address: PublicKey,
    mint: PublicKey,
    owner: PublicKey,
    amount: bigint,
}