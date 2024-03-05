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
  }, [ctx.contractData]);

  const displayValue = (func: number): string => {
    const value = func * ctx.tokenPrice;
    const fixed = value.toLocaleString();

    return fixed;
  };

  return (
    <div className="w-11/12 mx-auto my-9">
      <div className="bg-white p-5  rounded-lg text-slate-600 shadow-sm">
        <h2 className="text-2xl my-4 mb-8 text-slate-800">Libra Overview</h2>
        <div className="grid gap-3 gap-y-8 grid-cols-1 md:grid-cols-2">
          <div>
            <h2 className="text-lg text-slate-950 uppercase">Libra Price:</h2>
            <p className="text-xl my-1 text-[#0D47A1]">
              ${ctx.contractData ? ctx.tokenPrice : 0}{" "}
            </p>{" "}
          </div>
          <div>
            <h2 className="text-lg text-slate-950 uppercase">Libra Supply:</h2>
            <p className="text-xl my-1 text-[#0D47A1]">
              {ctx.contractData
                ? Math.round(
                    Number(formatAmount(supply, STAKE_TOKEN_DECIMALS))
                  ).toLocaleString()
                : 0}{" "}
              LIBRA{" "}
            </p>{" "}
          </div>
          <div>
            <h2 className="text-lg text-slate-950 uppercase">Libra Burnt:</h2>
            <p className="text-xl my-1 text-[#0D47A1]">
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
            </p>{" "}
            <p>
              ({" "}
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
              % total supply )
            </p>
          </div>
          <div>
            <h2 className="text-lg text-slate-950 uppercase">
              Total Deposited:
            </h2>
            <p className="text-sm text-slate-400">
              (Amount staked across bank and stake)
            </p>
            <p className="text-xl my-1 text-[#0D47A1]">
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
            </p>{" "}
          </div>
          <div>
            <h2 className="text-lg text-slate-950 uppercase">Total Payouts:</h2>
            <p className="text-sm text-slate-400">(Amount paid out to users)</p>
            <p className="text-xl my-1 text-[#0D47A1]">
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
            </p>{" "}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverView;
