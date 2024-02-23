import {useContext, useState} from "react";
import {AppContext} from "../context/App-Context";
import {formatAmount} from "../solana/utils";
import {performStake, performUnStake} from "../solana/services.ts";
import {StakeType} from "../solana/types.ts";
import {FaSpinner} from "react-icons/fa6";
import {STAKE_TOKEN_DECIMALS} from "../solana/constants.ts";

const Bank = () => {
  const [amount, setAmount] = useState<number>(0);
  const [unstakeLoading, setUnstakeLoading] = useState(false);
  const ctx = useContext(AppContext);

  const handleStake = async () => {
    ctx.setLoading(true);
    if (ctx.connection && ctx.provider && ctx.tokenAccount && amount && amount > 0) {
      await performStake(
          ctx.connection,
          ctx.provider,
          amount,
          0,
          ctx.tokenAccount.address,
          StakeType.NORMAL
      )
      ctx.setSuccess("$LIBRA staked successfully");
    } else {
      ctx.setError("Unable to Perform Staking...")
    }
    ctx.setLoading(false);
  };


  const handleUnstake = async () => {
    setUnstakeLoading(true);
    if (ctx.connection && ctx.provider && ctx.tokenAccount) {
      try {
        await performUnStake(
            ctx.connection,
            ctx.provider,
            ctx.tokenAccount.address
        );
        ctx.setSuccess("Un Stake Success 🚀✅");
      } catch (e) {
        console.log(e);
        ctx.setError("An Error Occurred while un staking..");
      }
    } else {
      ctx.setError("Unable To Unstake...❌");
    }
    setUnstakeLoading(false);
  };

  return (
    <>
      <div className="w-11/12 md:w-11/12 mx-auto mt-52 md:mt-40">
        {ctx.userData?.stakeType == BigInt(1) ? <div className="bg-red-700 text-white p-4 text-center my-4 rounded-lg">
          <p>You currently have $LIBRA Locked. Kindly unlock your Locked $LIBRA to Stake $LIBRA Here</p>
        </div>: ""}
        <div className="grid gap-3 grid-cols-1 md:grid-cols-2">
          <div className="my-6  bg-slate-100 p-6  rounded-xl">
            <div className="flex md:items-center justify-between  flex-col md:flex-row">
              <div className="libra flex items-center gap-3">
                <img
                    src="./img/logo.png"
                    className="max-w-full"
                    width={70}
                    alt=""
                />
                <div>
                  <h3 className="text-slate-950 text-lg">LIBRA</h3>
                  <p>Balance: {ctx.tokenAccount ? formatAmount(parseInt(ctx.tokenAccount.amount.toString()), STAKE_TOKEN_DECIMALS) : 0}</p>
                  <p>Total
                    Staked: {ctx.userData && ctx.userData.stakeType == BigInt(0) ? formatAmount(parseInt(ctx.userData.totalStaked.toString()), STAKE_TOKEN_DECIMALS) : 0}</p>
                </div>
              </div>

              <div className="right">
                <button
                    className="text-slate-100 bg-violet-600 py-4 px-6 rounded-2xl hover:bg-violet-800 flex justify-between gap-3 items-center w-full md:w-fit"
                    disabled={ctx.userData?.stakeType != BigInt(0)}
                    onClick={handleUnstake}
                >
                  {unstakeLoading ? <FaSpinner className="animate-spin"/> : "UN STAKE LIBRA"}
                </button>
              </div>
            </div>
            <h2 className="text-2xl text-slate-950 my-4">Stake</h2>
            <div className="flex items-center gap-3">
              <label htmlFor="amount">Amount</label>
              <input
                  type="number"
                  id="amount"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  placeholder="*Enter Amount"
                  className="py-2 px-4 w-full rounded-xl bg-opacity-45 bg-white border border-solid border-slate-500"
              />
            </div>
            <div className="my-3 flex justify-end">
              <button
                  className="text-slate-100 bg-violet-600 py-4 px-6 rounded-2xl hover:bg-violet-800 flex justify-between gap-3 items-center w-full md:w-fit"
                  // disabled={ctx.userData?.stakeType != BigInt(0)}
                  onClick={handleStake}
              >
                {ctx.loading ? <FaSpinner className="animate-spin"/> : "STAKE LIBRA"}
              </button>
            </div>
          </div>
          <div className="my-6  bg-slate-100 p-6  rounded-xl text-slate-600">
            <h2 className="text-lg text-slate-950 my-1">xLIBRA APY</h2>
            <p className="text-xl my-2 text-violet-500 ">
              {ctx.contractData
                  ? formatAmount(
                      parseInt(ctx.contractData.normalStakingApy.toString()),
                      1
                  )
                  : 0}
              % / yr
            </p>
            <p className="mb-2">
              (You will get back 100% your locked LIBRA amount after 136 days if
              you lock for 4 years)
            </p>

            <h2 className="text-lg text-slate-950 my-1">USDC APY</h2>
            <p className="text-xl my-2 text-violet-500">
              815.27% (2.23% / day)
            </p>

            <h2 className="text-lg text-slate-950 my-1">Next Reward</h2>
            <p className="text-xl my-2 text-violet-500">0:0:0</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Bank;
