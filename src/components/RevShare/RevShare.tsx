import { useContext } from "react";
import {
  AiOutlineSecurityScan,
  AiOutlineClockCircle,
  AiOutlineHeatMap,
} from "react-icons/ai";
import RevenueContext from "./context/Revenue-Context";
import { formatAmount } from "./solana/utils";
import { REV_SHARE_TOKEN_DECIMALS } from "./solana/constants";
const RevShare = () => {
  const ctx = useContext(RevenueContext);

  return (
    <div className="w-11/12 mx-auto my-9">
      <div className="grid gap-3 grid-cols-1 ">
        <div className=" bg-white p-5  rounded-lg">
          {ctx.successMsg && (
            <div className="bg-green-200 text-green-700 p-4 text-center my-4 rounded-md">
              <p>{ctx.successMsg}</p>
            </div>
          )}
          {ctx.errorMsg && (
            <div className="bg-red-200 text-red-700 p-4 text-center my-4 rounded-md">
              <p>{ctx.errorMsg}</p>
            </div>
          )}
          <h2 className="font-bold tracking-wider text-center">AUTO STAKE</h2>
          <div className="p-4 text-center text-slate-600">
            <p>
              You must hold at least{" "}
              {formatAmount(
                ctx.contractData
                  ? ctx.contractData.minimumTokenBalanceForClaim
                  : 0,
                REV_SHARE_TOKEN_DECIMALS
              )}{" "}
              $LIBRA to claim
            </p>
          </div>

          <div id="details" className="">
            <ul className="text-slate-700">
              <li className="flex items-center justify-between p-3 mb-1">
                <span className="flex items-center">
                  <AiOutlineSecurityScan /> &nbsp; Pool total
                </span>
                <span>{ctx.poolTotal} SOL</span>
              </li>
              <li className="flex items-center justify-between p-3 mb-1">
                <span className="flex items-center">
                  <AiOutlineHeatMap /> &nbsp; Next Share Total
                </span>
                <span>{ctx.nextShareTotal} SOL</span>
              </li>
              <li className="flex items-center justify-between p-3 mb-1">
                <span className="flex items-center">
                  <AiOutlineClockCircle /> &nbsp; Next Share Unlock
                </span>
                <span>
                  {ctx.nextClaimTime != 0 &&
                  ctx.nextClaimTime * 1000 > Date.now()
                    ? new Date(ctx.nextClaimTime * 1000).toLocaleString()
                    : "Now"}
                </span>
              </li>
              <li className="flex items-center justify-between p-3 mb-1">
                <span>$LIBRA Balance</span>
                <span>{ctx.balances.token} $LIBRA</span>
              </li>
              <li className="flex items-center justify-between p-3 mb-1">
                <span>SOL Balance</span>
                <span>{ctx.balances.sol} SOL</span>
              </li>
            </ul>
          </div>
          <button
            className="w-full text-center text-slate-100 bg-[#0D47A1]  hover:bg-blue-800 py-3 rounded-lg disabled:bg-slate-400"
            disabled={
              !ctx.isWalletConnected ||
              !ctx.canClaim ||
              (ctx.nextClaimTime != 0 && ctx.nextClaimTime * 1000 >= Date.now())
            }
            onClick={ctx.onClaim}
          >
            Claim
          </button>
        </div>
      </div>
    </div>
  );
};

export default RevShare;
