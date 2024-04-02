import {makeStakeInstruction, makeUnstakeInstruction, signAndConfirmTransaction} from "./utils.ts";
import { ComputeBudgetProgram, Connection, PublicKey, Transaction, TransactionInstruction } from "@solana/web3.js";
import {PhantomProvider} from "../types.ts";
import { encode } from 'bs58';
import {StakeType} from "./types.ts";
import {CONTRACT_DATA_ACCOUNT, CONTRACT_TOKEN_ACCOUNT, PROGRAM_ID} from "./constants.ts";

async function getPriorityFeeEstimate(transaction: Transaction, connection: Connection) {
    const response = await fetch(connection.rpcEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: "1",
        method: "getPriorityFeeEstimate",
        params: [
          {
            transaction: encode(transaction.serialize()),
            options: { includeAllPriorityFeeLevels: true },
          },
        ],
      }),
    });
    const data = await response.json();
    return data.result;
}

const getTxnPriorityRate = async (
    connection: Connection,
    provider: PhantomProvider,
    ix: TransactionInstruction, 
    priorityLevel: string
  ) => {
    if (priorityLevel == "none") {
      return 100000 // defaults to 0.1 lamports
    }
    const txn = new Transaction();
    txn.add(ix);
    const blockHash = await connection.getLatestBlockhash('finalized');
    txn.recentBlockhash = blockHash.blockhash;
    txn.feePayer = provider.publicKey;
    const signedTx = await provider.signTransaction(txn);
    const fees = await getPriorityFeeEstimate(signedTx, connection);
    return fees.priorityFeeLevels[priorityLevel];
}

export const performStakeWithPriority = async (
    connection: Connection,
    provider: PhantomProvider,
    amount: number,
    lockDuration: number,
    userTokenAccount: PublicKey,
    stakeType: StakeType,
    priorityLevel: string
) => {
    const programId = new PublicKey(PROGRAM_ID);
    const [userDataAccount,] = PublicKey.findProgramAddressSync(
        [Buffer.from("spl_staking_user", "utf-8"), provider.publicKey.toBuffer()],
        programId
    );
    const ix = makeStakeInstruction(
        stakeType,
        amount,
        lockDuration,
        programId,
        provider.publicKey,
        userTokenAccount,
        userDataAccount,
        new PublicKey(CONTRACT_TOKEN_ACCOUNT),
        new PublicKey(CONTRACT_DATA_ACCOUNT)
    );
    const priorityRate = await getTxnPriorityRate(connection, provider, ix, priorityLevel);
    const computeUnitLimitIx = ComputeBudgetProgram.setComputeUnitLimit({
        units: 200000
    });
    const computePriceIx = ComputeBudgetProgram.setComputeUnitPrice({
        microLamports: priorityRate
    });
    const txn = new Transaction();
    txn.add(computePriceIx);
    txn.add(computeUnitLimitIx);
    txn.add(ix);
    await signAndConfirmTransaction(connection, provider, txn)
}

export const performStake = async (
    connection: Connection,
    provider: PhantomProvider,
    amount: number,
    lockDuration: number,
    userTokenAccount: PublicKey,
    stakeType: StakeType,
) => {
    const programId = new PublicKey(PROGRAM_ID);
    const [userDataAccount,] = PublicKey.findProgramAddressSync(
        [Buffer.from("spl_staking_user", "utf-8"), provider.publicKey.toBuffer()],
        programId
    );
    const ix = makeStakeInstruction(
        stakeType,
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
    userTokenAccount: PublicKey,
) => {
    const programId = new PublicKey(PROGRAM_ID);
    const [userDataAccount,] = PublicKey.findProgramAddressSync(
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