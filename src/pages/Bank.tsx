import { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/App-Context";
import { formatAmount } from "../solana/utils";
import { performStake, performUnStake } from "../solana/services.ts";
import { StakeType } from "../solana/types.ts";
import { FaSpinner } from "react-icons/fa6";
import { STAKE_TOKEN_DECIMALS } from "../solana/constants.ts";

const Bank = () => {
  const [amount, setAmount] = useState<number>();
  const [unstakeLoading, setUnstakeLoading] = useState(false);
  const [canUnStake, setCanUnstake] = useState<boolean>(true);
  const ctx = useContext(AppContext);

  useEffect(() => {
    const dayOfStake = ctx.userData
      ? parseInt(ctx.userData?.stakeTs.toString()) * 1000
      : 0;

    const dateOfStamp = new Date(dayOfStake);
    const newDate = new Date();
    const timeDiff = newDate.getTime() - dateOfStamp.getTime();
    const dayDiff = Math.round(timeDiff / (1000 * 3600 * 24));
    if (dayDiff >= 1) {
      setCanUnstake(true);
    } else {
      setCanUnstake(false);
    }
  }, [ctx.userData]);

  const getTotalRewards = (): number => {
    const totalStaked: number | null =
      ctx.userData && ctx.userData.stakeType == BigInt(0)
        ? Number(
            formatAmount(
              parseInt(ctx.userData.totalStaked.toString()),
              STAKE_TOKEN_DECIMALS
            )
          )
        : 0;

    const apy = ctx.contractData
      ? Number(
          formatAmount(
            parseInt(ctx.contractData.normalStakingApy.toString()),
            1
          )
        )
      : 0;

    const dayOfStake = ctx.userData
      ? parseInt(ctx.userData?.stakeTs.toString()) * 1000
      : 0;
    const dateOfStamp = new Date(dayOfStake);
    // const todayDate = new Date();
    // const result = todayDate.setDate(todayDate.getDate() + 14);
    const newDate = new Date();
    const timeDiff = newDate.getTime() - dateOfStamp.getTime();
    const dayDiff = Math.round(timeDiff / (1000 * 3600 * 24));

    const rewards = totalStaked * (dayDiff / 365) * (apy / 100);
    return totalStaked + rewards;
  };

  const handleStake = async () => {
    ctx.setLoading(true);
    if (
      ctx.connection &&
      ctx.provider &&
      ctx.tokenAccount &&
      amount &&
      amount > 0
    ) {
      await performStake(
        ctx.connection,
        ctx.provider,
        amount,
        0,
        ctx.tokenAccount.address,
        StakeType.NORMAL
      );
      ctx.setSuccess("$LIBRA staked successfully");
    } else {
      ctx.setError("Unable to Perform Staking...");
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

  const setMaxAmount = () => {
    setAmount(
      ctx.tokenAccount
        ? Number(
            formatAmount(
              parseInt(ctx.tokenAccount.amount.toString()),
              STAKE_TOKEN_DECIMALS
            )
          )
        : 0
    );
  };

  return (
    <>
      <div className="w-11/12 mx-auto my-9">
        {ctx.userData?.stakeType == BigInt(1) ? (
          <div className="bg-red-200 text-red-700 p-4 text-center my-4 rounded-md">
            <p>
              You currently have $LIBRA Locked. Kindly unlock your Locked $LIBRA
              to Stake $LIBRA Here
            </p>
          </div>
        ) : (
          ""
        )}
        <div className="grid gap-4 grid-cols-1 md:grid-cols-5">
          <div className="bg-white  rounded-lg shadow-sm md:col-span-3">
            <div className="flex md:items-center justify-between  flex-col md:flex-row p-4 border-b border-solid">
              <div className="libra flex items-center gap-3">
                <img
                  src="./img/logo.png"
                  className="max-w-full"
                  width={70}
                  alt=""
                />
                <div>
                  <p>
                    Balance:{" "}
                    {ctx.tokenAccount
                      ? formatAmount(
                          parseInt(ctx.tokenAccount.amount.toString()),
                          STAKE_TOKEN_DECIMALS
                        )
                      : 0}
                  </p>
                  <p>
                    Total Staked:{" "}
                    {ctx.userData && ctx.userData.stakeType == BigInt(0)
                      ? formatAmount(
                          parseInt(ctx.userData.totalStaked.toString()),
                          STAKE_TOKEN_DECIMALS
                        )
                      : 0}
                  </p>
                </div>
              </div>

              <div className="right">
                <button
                  className="text-slate-100 bg-[#0D47A1] py-3 px-6 rounded-xl hover:bg-blue-800 flex justify-between gap-3 items-center w-full md:w-fit disabled:bg-slate-400"
                  disabled={ctx.userData?.stakeType != BigInt(0) || !canUnStake}
                  onClick={handleUnstake}
                >
                  {unstakeLoading ? (
                    <FaSpinner className="animate-spin" />
                  ) : (
                    "UNSTAKE"
                  )}
                </button>
              </div>
            </div>
            <div className="p-4">
              <div className="flex items-center gap-3">
                <label htmlFor="amount" className="text-lg text-slate-950 my-4">
                  STAKE:
                </label>
                <input
                  type="number"
                  id="amount"
                  value={amount}
                  min={0}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  placeholder="Amount"
                  className="py-2 px-4 w-full rounded bg-opacity-45 bg-[#F2F2F2] "
                />
                <button
                  className="bg-transparent border border-solid border-[#0D47A1] rounded-lg p-2 px-3 hover:bg-slate-300"
                  onClick={() => {
                    setMaxAmount();
                  }}
                >
                  Max
                </button>
              </div>
              <div className="my-3 flex justify-between flex-col md:flex-row">
                <p className="text-slate-600 my-2">
                  (You cannot withdraw for 24hrs after staking)
                </p>
                <button
                  className="text-slate-100 bg-[#0D47A1] py-3 px-6 rounded-xl hover:bg-blue-800 flex justify-center gap-3 items-center w-full md:w-fit text-center"
                  // disabled={ctx.userData?.stakeType != BigInt(0)}
                  onClick={handleStake}
                >
                  {ctx.loading ? (
                    <FaSpinner className="animate-spin" />
                  ) : (
                    "STAKE LIBRA"
                  )}
                </button>
              </div>
            </div>
          </div>
          <div className="bg-white p-5  rounded-lg text-slate-600 md:col-span-2 shadow-sm flex flex-col justify-center text-center gap-2">
            <h2 className="text-lg text-[#1F242F] my-1">$LIBRA APY</h2>
            <div>
              <p className="text-4xl my-2 text-[#0D47A1] ">
                {ctx.contractData
                  ? formatAmount(
                      parseInt(ctx.contractData.normalStakingApy.toString()),
                      1
                    )
                  : 0}
                %
              </p>
              <p className="text-[#0D47A1]">Per Year</p>
            </div>

            <p className="mb-2 text-[#222222D1]">
              (You will get back 100% your locked LIBRA amount after Lock for 14
              days)
            </p>
          </div>
          <div className="bg-white p-5  rounded-lg text-[#222222] md:col-span-5 flex md:items-center md:gap-3 shadow-sm flex-col md:flex-row">
            <h2 className="text-lg text-slate-950 my-1 uppercase">
              Expected Rewards:
            </h2>
            <p className="text-xl my-2 text-[#0D47A1]">
              {ctx.contractData ? getTotalRewards() : 0} LIBRA
            </p>{" "}
          </div>
        </div>
      </div>
    </>
  );
};

export default Bank;
