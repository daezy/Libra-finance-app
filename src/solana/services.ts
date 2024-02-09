import {makeStakeInstruction, makeUnstakeInstruction, signAndConfirmTransaction} from "./utils.ts";
import {Connection, PublicKey, Transaction} from "@solana/web3.js";
import {PhantomProvider} from "../types.ts";
import {StakeType} from "./types.ts";
import {CONTRACT_DATA_ACCOUNT, CONTRACT_TOKEN_ACCOUNT} from "./constants.ts";

export const performStake = async (
    connection: Connection,
    provider: PhantomProvider,
    amount: number,
    lockDuration: number,
    programId: PublicKey,
    userTokenAccount: PublicKey,
) => {
    const [userDataAccount, _] = PublicKey.findProgramAddressSync(
        [Buffer.from("spl_staking_user", "utf-8"), provider.publicKey.toBuffer()],
        programId
    );
    const ix = makeStakeInstruction(
        StakeType.LOCKED,
        amount,
        lockDuration,
        programId,
        provider.publicKey,
        userTokenAccount,
        userDataAccount,
        new PublicKey(CONTRACT_TOKEN_ACCOUNT),
        new PublicKey(CONTRACT_DATA_ACCOUNT)
    );
    const txn = new Transaction().add(ix);
    await signAndConfirmTransaction(connection, provider, txn)
}

export const performUnStake = async (
    connection: Connection,
    provider: PhantomProvider,
    programId: PublicKey,
    userTokenAccount: PublicKey,
) => {
    const [userDataAccount, _] = PublicKey.findProgramAddressSync(
        [Buffer.from("spl_staking_user", "utf-8"), provider.publicKey.toBuffer()],
        programId
    );
    const ix = makeUnstakeInstruction(
        programId,
        provider.publicKey,
        userTokenAccount,
        userDataAccount,
        new PublicKey(CONTRACT_TOKEN_ACCOUNT),
        new PublicKey(CONTRACT_DATA_ACCOUNT)
    );
    const txn = new Transaction().add(ix);
    await signAndConfirmTransaction(connection, provider, txn);
}