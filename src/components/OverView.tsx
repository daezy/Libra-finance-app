import { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/App-Context";
import { formatAmount } from "../solana/utils";
import { STAKE_TOKEN_DECIMALS, STAKE_TOKEN_MINT } from "../solana/constants";
// import { TokenAccount } from "../solana/types";
import { PublicKey } from "@solana/web3.js";

const OverView = () => {
  const ctx = useContext(AppContext);

  //   const [tokenAccount, setTokenAccount] = useState<TokenAccount | null>(null);
  const [supply, setSupply] = useState<number>(0);

  useEffect(() => {
    const getTokenData = async () => {
      if (ctx.contractData && ctx.connection) {
        // const tokenAccount = await getTokenAccount(
        //   ctx.connection,
        //   new PublicKey("994NbZhmVGDAvXHWW8VMA4kBgeHpKF8xebncag4KnRVE"),
        //   ctx.contractData.stakeTokenMint
        // );
        // setTokenAccount(tokenAccount);
        // console.log(tokenAccount);
      }
    };
    const getTokenSupply = async () => {
      if (ctx.contractData && ctx.connection) {
        const supply = await ctx.connection.getTokenSupply(
          new PublicKey(STAKE_TOKEN_MINT)
        );
        setSupply(Number(supply.value.amount));
      }
    };

    getTokenSupply();
    getTokenData();
  }, [ctx.contractData, ctx.connection]);

  const displayValue = (func: number): string => {
    const value = func * ctx.tokenPrice;
    const fixed = value.toLocaleString();

    return fixed;
  };

  return (
    <div className="w-11/12 mx-auto my-9">
      <h2 className="text-2xl my-4 mb-8 text-blue-800">Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-9 gap-3">
        <div className="bg-white border border-gradient p-5 md:col-span-3  rounded-lg text-slate-600 shadow-sm">
          <div className="flex  items-center gap-3">
            <div className="p-3 bg-gradient-to-r from-[rgb(78,107,244,0.8)] to-[rgb(78,107,244,0.2)]   rounded-full">
              <img src="./img/logoLibra 1.png" alt="" width={22} />
            </div>
            <p className="text-[18px] text-[#7F9ECF]">LIBRA</p>
          </div>
          <div className="mt-2">
            <p className="font-light text-[#7F9ECF]">Libra Price</p>
          </div>
          <div className="flex items-center gap-4 mt-2">
            <p className="font-extrabold text-blue-800">
              ${ctx.contractData ? ctx.tokenPrice : 0}
            </p>
            {/* <div className="py-[2px] px-[4px]  bg-gradient-to-r from-[rgba(29,215,126,0.5)] to-[rgba(29,215,126,0.1)] ">
              <p className="text-green-500 font-light">+ 32.09%</p>
            </div> */}
          </div>
        </div>
        <div className="bg-white p-5 border border-gradient1  md:col-span-3 rounded-lg text-slate-600 shadow-sm">
          <div className="flex  items-center gap-3">
            <div className="p-3 bg-gradient-to-r from-[rgb(119,83,185,0.8)] to-[rgb(119,83,185,0.2)] rounded-full">
              <img src="./img/Vector.png" alt="" width={22} />
            </div>
            <p className="text-[18px] text-[#7F9ECF]">SUPPLY</p>
          </div>
          <div className="mt-2">
            <p className="font-light text-[#7F9ECF]">Libra Supply</p>
          </div>
          <div className="flex items-center gap-4 mt-2">
            <p className="font-extrabold text-blue-800">
              {ctx.contractData
                ? Math.round(
                    Number(formatAmount(supply, STAKE_TOKEN_DECIMALS))
                  ).toLocaleString()
                : 0}{" "}
              LIBRA
            </p>
            {/* <div className="py-[2px] px-[4px]  bg-gradient-to-r from-[rgba(119,83,185,0.5)] to-[rgba(119,83,185,0.1)] ">
              <p className="text-[rgb(119,83,185)] font-light">+ 32.09%</p>
            </div> */}
          </div>
        </div>
        <div className="bg-white p-5 border border-gradient2 md:col-span-3  rounded-lg text-slate-600 shadow-sm">
          <div className="flex  items-center gap-3">
            <div className="p-3 bg-gradient-to-r from-[rgb(184,128,185,0.8)] to-[rgb(184,128,185,0.2)] rounded-full">
              <img src="./img/Vector-1.png" alt="" width={22} />
            </div>
            <p className="text-[18px] text-[#7F9ECF]">BURNT</p>
          </div>
          <div className="mt-2">
            <p className="font-light text-[#7F9ECF]">Libra Burnt</p>
          </div>
          <div className="flex items-center gap-4 mt-2">
            <p className="font-extrabold text-blue-800">
              {ctx.contractData
                ? (
                    1000000000 -
                    Math.round(
                      Number(formatAmount(supply, STAKE_TOKEN_DECIMALS))
                    )
                  ).toLocaleString()
                : 0}{" "}
              LIBRA ($
              {displayValue(
                ctx.contractData
                  ? 1000000000 -
                      Math.round(
                        Number(formatAmount(supply, STAKE_TOKEN_DECIMALS))
                      )
                  : 0
              )}
              )
            </p>
            <div className="py-[2px] px-[4px]  bg-gradient-to-r from-[rgba(184,128,185,0.5)] to-[rgba(184,128,185,0.1)] ">
              <p className="text-[rgb(184,128,185)] font-light">
                {ctx.contractData
                  ? (
                      ((1000000000 -
                        Math.round(
                          Number(formatAmount(supply, STAKE_TOKEN_DECIMALS))
                        )) /
                        1000000000) *
                      100
                    ).toLocaleString()
                  : 0}
                %
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-5 border border-gradient3 md:col-span-5  rounded-lg text-slate-600 shadow-sm">
          <div className="flex  items-center gap-3">
            <div className="p-3 bg-gradient-to-r from-[rgb(119,83,185,0.8)] to-[rgb(119,83,185,0.2)] rounded-full">
              <img src="./img/Vector-2 2.png" alt="" width={22} />
            </div>
            <p className="text-[18px] text-[#7F9ECF]">DEPOSIT</p>
          </div>
          <div className="mt-2">
            <p className="font-light text-[#7F9ECF]">Total Deposit</p>
          </div>
          <div className="mt-2 p-1 bg-[rgba(3,64,158,0.08)] flex justify-left">
            <p className="font-light text-[10px] text-[#7F9ECF]">
              Amount staked across banks and stake
            </p>
          </div>
          <div className="flex items-center gap-4 mt-2">
            <p className="font-extrabold text-blue-800">
              {" "}
              {ctx.contractData
                ? Math.round(
                    Number(
                      formatAmount(
                        parseInt(ctx.contractData.totalStaked.toString()),
                        STAKE_TOKEN_DECIMALS
                      )
                    )
                  ).toLocaleString()
                : 0}{" "}
              LIBRA ($
              {displayValue(
                ctx.contractData
                  ? Math.round(
                      Number(
                        formatAmount(
                          parseInt(ctx.contractData.totalStaked.toString()),
                          STAKE_TOKEN_DECIMALS
                        )
                      )
                    )
                  : 0
              )}
              )
            </p>
            {/* <div className="py-[2px] px-[4px]  bg-gradient-to-r from-[rgba(119,83,185,0.5)] to-[rgba(119,83,185,0.1)] ">
              <p className="text-[rgb(119,83,185)] font-light">+ 32.09%</p>
            </div> */}
          </div>
        </div>
        <div className="bg-white p-5 border border-gradient4 md:col-span-4  rounded-lg text-slate-600 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-r from-[rgb(78,107,244,0.8)] to-[rgb(78,107,244,0.2)] rounded-full">
              <img src="./img/Vector-2.png" alt="" width={22} />
            </div>
            <p className="text-[18px] text-[#7F9ECF]">PAYOUT</p>
          </div>
          <div className="mt-2">
            <p className="font-light text-[#7F9ECF]">Total Payout</p>
          </div>
          <div className="mt-2 p-1 bg-[rgba(3,64,158,0.08)] flex justify-left">
            <p className="font-light text-[10px] text-[#7F9ECF]">
              Amount paid out to user
            </p>
          </div>
          <div className="flex items-center gap-4 mt-2">
            <p className="font-extrabold text-blue-800">
              {ctx.contractData
                ? Math.round(
                    Number(
                      formatAmount(
                        parseInt(ctx.contractData.totalEarned.toString()),
                        STAKE_TOKEN_DECIMALS
                      )
                    )
                  ).toLocaleString()
                : 0}{" "}
              LIBRA ($
              {displayValue(
                ctx.contractData
                  ? Math.round(
                      Number(
                        formatAmount(
                          parseInt(ctx.contractData.totalEarned.toString()),
                          STAKE_TOKEN_DECIMALS
                        )
                      )
                    )
                  : 0
              )}
              )
            </p>
            {/* <div className="py-[2px] px-[4px]  bg-gradient-to-r from-[rgba(78,107,244,0.5)] to-[rgba(78,107,244,0.1)] ">
              <p className="text-[rgb(78,107,244)] font-light">+ 32.09%</p>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverView;
