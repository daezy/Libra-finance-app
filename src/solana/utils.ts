import {Connection, PublicKey, SystemProgram, Transaction, TransactionInstruction} from "@solana/web3.js";
import {CONTRACT_DATA_LAYOUT, USER_DATA_LAYOUT} from "./layout.ts";
import BN from "bn.js";
import {STAKE_TOKEN_DECIMALS} from "./constants.ts";
import {AccountLayout, getAssociatedTokenAddress, TOKEN_PROGRAM_ID} from "@solana/spl-token";
import { StakeType } from "./types.ts";
import {PhantomProvider} from "../types.ts";

export const getTokenAccount = async (
    connection: Connection,
    owner: PublicKey,
    mint: PublicKey
) => {
    const associatedToken = await getAssociatedTokenAddress(
        mint,
        owner
    )
    const accountData = await getAccountData(
        connection,
        associatedToken
    )
    if (accountData) {
        const rawAccount = AccountLayout.decode(accountData);
        return {
            address: associatedToken,
            mint: rawAccount.mint,
            owner: rawAccount.owner,
            amount: rawAccount.amount
        }
    } else {
        throw Error("Token Account Not Found")
    }
}

export const getAccountData = async (connection: Connection, address: PublicKey) => {
    const accountInfo = await connection.getAccountInfo(
        address
    );
    return accountInfo?.data;
}

export const getUserData = async (connection: Connection, address: PublicKey) => {
    const accountData = await getAccountData(connection, address);
    if (accountData) {
        const userData = USER_DATA_LAYOUT.decode(accountData);
        return {
            isInitialized: userData.isInitialized,
            ownerPubkey: new PublicKey(userData.ownerPubkey),
            stakeType: new BN(userData.stakeType, 10, "le"),
            lockDuration: new BN(userData.lockDuration, 10, "le"),
            totalStaked: new BN(userData.totalStaked, 10, "le"),
            interestAccrued: new BN(userData.interestAccrued, 10, "le"),
            stakeTs: new BN(userData.stakeTs, 10, "le"),
            lastClaimTs: new BN(userData.lastClaimTs, 10, "le"),
            lastUnstakeTs: new BN(userData.lastUnstakeTs, 10, "le")
        }
    }
    return null
}

export const getContractData = async (connection: Connection, address: PublicKey) => {
    const accountData = await getAccountData(connection, address);
    if (accountData) {
        const contractData = CONTRACT_DATA_LAYOUT.decode(accountData);
        return {
            isInitialized: contractData.isInitialized,
            adminPubkey: new PublicKey(contractData.adminPubkey),
            stakeTokenMint: new PublicKey(contractData.stakeTokenMint),
            stakeTokenAccount: new PublicKey(contractData.stakeTokenAccount),
            minimumStakeAmount: new BN(contractData.minimumStakeAmount, 10, "le"),
            minimumLockDuration: new BN(contractData.minimumLockDuration, 10, "le"),
            normalStakingApy: new BN(contractData.normalStakingApy, 10, "le"),
            lockedStakingApy: new BN(contractData.lockedStakingApy, 10, "le"),
            earlyWithdrawalFee: new BN(contractData.earlyWithdrawalFee, 10, "le"),
            totalStaked: new BN(contractData.totalStaked, 10, "le"),
            totalEarned: new BN(contractData.totalEarned, 10, "le")
        }
    }
    return null
}

export const makeStakeInstruction = (
    stakeType: StakeType,
    amount: number,
    lockDuration: number,
    programId: PublicKey,
    user: PublicKey,
    userTokenAccount: PublicKey,
    userDataAccount: PublicKey,
    contractTokenAccount: PublicKey,
    contractDataAccount: PublicKey
) => {
    const instructionData = Buffer.from(
        Uint8Array.of(
            1,
            stakeType,
            ...new BN(amount * (10^STAKE_TOKEN_DECIMALS)).toArray("le", 8),
            ...new BN(lockDuration).toArray("le", 8)
        )
    )
    return new TransactionInstruction({
        programId,
        keys: [
            {pubkey: user, isSigner: true, isWritable: true},
            {pubkey: userTokenAccount, isSigner: false, isWritable: true},
            {pubkey: userDataAccount, isSigner: false, isWritable: true},
            {pubkey: contractTokenAccount, isSigner: false, isWritable: true},
            {pubkey: contractDataAccount, isSigner: false, isWritable: true},
            {pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false},
            {pubkey: SystemProgram.programId, isSigner: false, isWritable: false}
        ],
        data: instructionData
    })
}

export const makeUnstakeInstruction = (
    programId: PublicKey,
    user: PublicKey,
    userTokenAccount: PublicKey,
    userDataAccount: PublicKey,
    contractTokenAccount: PublicKey,
    contractDataAccount: PublicKey
) => {
    const instructionData = Buffer.from(Uint8Array.of(2));
    return new TransactionInstruction({
        programId,
        keys: [
            {pubkey: user, isSigner: true, isWritable: true},
            {pubkey: userTokenAccount, isSigner: false, isWritable: true},
            {pubkey: userDataAccount, isSigner: false, isWritable: true},
            {pubkey: contractTokenAccount, isSigner: false, isWritable: true},
            {pubkey: contractDataAccount, isSigner: false, isWritable: true},
            {pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false},
        ],
        data: instructionData
    })
}

export const signAndConfirmTransaction = async (
    connection: Connection,
    provider: PhantomProvider,
    txn: Transaction
) => {
    txn.recentBlockhash = (await connection.getLatestBlockhash('finalized')).blockhash;
    txn.feePayer = provider.publicKey;
    const signedTxn = await provider.signTransaction(txn);
    const signature = await connection.sendRawTransaction(signedTxn.serialize(), { skipPreflight: true, preflightCommitment: "confirmed"});
    const res = await connection.confirmTransaction(signature, "confirmed");
    const { err } = res.value;
    if (err) {
        console.log(err)
        throw new Error(`An Error Occurred: ${err.toString()}`)
    }
}