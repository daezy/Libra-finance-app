// import React, { createContext, useState } from "react";
// import { AppContextType } from "../types";
// import { PublicKey } from "@solana/web3.js";

// export const AppContext = createContext<AppContextType>({
//   isWalletConnected: false,
//   walletAddress: PublicKey.default,
//   contractData: null,
//   balances: { token: "", sol: "" },
//   connection: null,
//   successMsg: null,
//   errorMsg: null,
//   connectWallet: () => {},
//   disconnectWallet: () => {},
// });

// export const AppContextPorvider: React.FC<{ children: React.ReactNode }> = (
//   props
// ) => {
//   return <AppContext.Provider>{props.children}</AppContext.Provider>;
// };
