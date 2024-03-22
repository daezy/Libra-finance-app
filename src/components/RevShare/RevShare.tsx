import { useContext } from "react";
import RevenueContext from "./context/Revenue-Context";
import { formatAmount } from "./solana/utils";
import { REV_SHARE_TOKEN_DECIMALS } from "./solana/constants";
const RevShare = () => {
  const ctx = useContext(RevenueContext);

  return (
    <div className="w-11/12 mx-auto my-9">
      <h2 className="text-2xl my-4 mb-8 text-blue-800">Autostake</h2>
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
      <div className=" bg-white p-5 rounded" data-aos="zoom-in">
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

        <div className="flex items-center justify-center flex-wrap gap-5 my-6">
          <div className="w-[300px] bg-[#bbcfff] p-5 border border-gradient  md:col-span-2 rounded text-slate-600 shadow-sm flex items-center justify-center gap-3 flex-col">
            <div className="p-5 bg-gradient-to-r from-[#4E6BF4] to-[#4E6BF400] rounded-full">
              <img src="./img/totalpool.svg" alt="" width={22} />
            </div>
            <h2 className="text-[#7F9ECF]">Total Pool</h2>
            <div>
              <p className="text-[#5f8cd4] text-center">{ctx.poolTotal} SOL</p>
            </div>
          </div>

          <div className="w-[300px] bg-[#bbcfff] p-5 border border-gradient2  md:col-span-2 rounded text-slate-600 shadow-sm flex items-center justify-center gap-3 flex-col">
            <div className="p-5 bg-gradient-to-r from-[#B880B9] to-[#B880B900] rounded-full">
              <img src="./img/Vector.png" alt="" width={22} />
            </div>
            <h2 className="text-[#7F9ECF]">Next Share Total</h2>
            <div>
              <p className="text-[#5f8cd4] text-center">
                {ctx.nextShareTotal} SOL
              </p>
            </div>
          </div>
          <div className="w-[300px] bg-[#bbcfff] p-5 border border-gradient3  md:col-span-2 rounded text-slate-600 shadow-sm flex items-center justify-center gap-3 flex-col">
            <div className="p-5 bg-gradient-to-r from-[#7753B9] to-[#7753B900] rounded-full">
              <img src="./img/nextshare.svg" alt="" width={22} />
            </div>
            <h2 className="text-[#7F9ECF]">Next Share Unlock</h2>
            <div>
              <p className="text-[#5f8cd4] text-center">
                {ctx.nextClaimTime != 0 && ctx.nextClaimTime * 1000 > Date.now()
                  ? new Date(ctx.nextClaimTime * 1000).toLocaleString()
                  : "Now"}
              </p>
            </div>
          </div>
          <div className="w-[300px] bg-[#bbcfff] p-5 border border-gradient4  md:col-span-2 rounded text-slate-600 shadow-sm flex items-center justify-center gap-3 flex-col">
            <div className="p-5 bg-gradient-to-r from-[#7753B9] to-[#7753B900] rounded-full">
              <img src="./img/Vector.png" alt="" width={22} />
            </div>
            <h2 className="text-[#7F9ECF]">LIBRA Balance</h2>
            <div>
              <p className="text-[#5f8cd4] text-center">
                {ctx.balances.token} LIBRA
              </p>
            </div>
          </div>
          <div className="w-[300px] bg-[#bbcfff] p-5 border border-gradient  md:col-span-2 rounded text-slate-600 shadow-sm flex items-center justify-center gap-3 flex-col">
            <div className="p-5 bg-gradient-to-r from-[#4E6BF4] to-[#4E6BF400] rounded-full">
              <img src="./img/totalpool.svg" alt="" width={22} />
            </div>
            <h2 className="text-[#7F9ECF]">Sol Balance</h2>
            <div>
              <p className="text-[#5f8cd4] text-center">
                {ctx.balances.sol} SOL
              </p>
            </div>
          </div>
        </div>
        <button
          className="text-white bg-[#0D47A1] py-3 px-6 rounded hover:bg-blue-800 w-full disabled:bg-[#cedbf3] text-center"
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
  );
};

export default RevShare;
