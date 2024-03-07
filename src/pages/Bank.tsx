import { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/App-Context";
import { formatAmount } from "../solana/utils";
import { performStake, performUnStake } from "../solana/services.ts";
import { StakeType } from "../solana/types.ts";
import { FaSpinner } from "react-icons/fa6";
import { STAKE_TOKEN_DECIMALS } from "../solana/constants.ts";
import { createStake, deleteStake } from "../supabaseClient.ts";
import { Timer } from "../components/Timer.tsx";

const Bank = () => {
  const [amount, setAmount] = useState<number>();
  const [unstakeLoading, setUnstakeLoading] = useState(false);
  const [canUnStake, setCanUnstake] = useState<boolean>(false);
  const [showInfo, setShowInfo] = useState<boolean>(false);
  const [reward, setRewards] = useState<number>(0);
  const [lockedFor, setLockedFor] = useState<number>(0);
  const ctx = useContext(AppContext);

  useEffect(() => {
    const dayOfStake = ctx.userData
      ? parseInt(ctx.userData?.stakeTs.toString()) * 1000
      : 0;

    const dateOfStamp = new Date(dayOfStake);
    const newDate = new Date();

    const timeDiff = newDate.getTime() - dateOfStamp.getTime();
    const dayDiff = timeDiff / (1000 * 3600 * 24);
    setLockedFor(Math.floor(dayDiff));
    if (dayDiff >= 1.00347) {
      setCanUnstake(true);
      if (ctx.userData) {
        setShowInfo(true);
      } else {
        setShowInfo(false);
      }
    } else {
      setCanUnstake(false);
      setShowInfo(false);
    }
  }, [ctx.userData]);

  useEffect(() => {
    const interval = setInterval(() => getTotalLiveRewards(), 2000);

    return () => clearInterval(interval);
  });

  const displayValue = (func: number): string => {
    const value = func * ctx.tokenPrice;
    const fixed = value.toLocaleString();

    return fixed;
  };

  const getUnstakeDate = (): string => {
    // const date = ctx.lastUnstakeTime.lastunstake
    //   ? getUnlockDate(ctx.lastUnstakeTime.lastunstake)
    //   : new Date().toUTCString();

    if (ctx.lastUnstakeTime.lastunstake) {
      const todayDate = new Date(ctx.lastUnstakeTime.lastunstake);
      const cooldown = ctx.lastUnstakeTime.appType == "stake" ? 3 : 7;
      const result = todayDate.setDate(
        todayDate.getDate() + (cooldown + 0.04166)
      );
      const newDate = new Date(result);

      return newDate.toUTCString();
    } else {
      return new Date().toUTCString();
    }
  };

  const getTotalLiveRewards = () => {
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
    const dayDiff = timeDiff / (1000 * 3600 * 24);

    const rewards = totalStaked * (dayDiff / 365) * (apy / 100);

    if (totalStaked < 2) {
      const newReward = (totalStaked + rewards).toFixed(7);
      setRewards(parseFloat(newReward));
    } else {
      const newReward = (totalStaked + rewards - getTotalRewards()).toFixed(7);
      setRewards(parseFloat(newReward));
    }
  };

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
    const interest = ctx.userData
      ? formatAmount(
          parseInt(ctx.userData?.interestAccrued.toString()),
          STAKE_TOKEN_DECIMALS
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
    const dayDiff = Math.floor(timeDiff / (1000 * 3600 * 24));

    const rewards = totalStaked * (dayDiff / 365) * (apy / 100);

    return totalStaked + rewards + Number(interest);
  };

  const handleStake = async () => {
    ctx.setLoading(true);
    const dayOfStake = ctx.lastUnstakeTime.lastunstake;
    // console.log(dayOfStake);
    if (dayOfStake != null || dayOfStake != undefined) {
      const dateOfStamp = new Date(String(dayOfStake));
      // console.log(dateOfStamp.toDateString());
      const newDate = new Date();

      const timeDiff = newDate.getTime() - dateOfStamp.getTime();
      const dayDiff = timeDiff / (1000 * 3600 * 24);
      // console.log(Math.floor(dayDiff));

      const cooldown = ctx.lastUnstakeTime.appType == "stake" ? 3 : 7;
      if (Math.floor(dayDiff) < cooldown) {
        ctx.setError(`${cooldown - Math.floor(dayDiff)} days cooldown left`);
        setTimeout(() => {
          ctx.setError("");
        }, 3000);
        ctx.setLoading(false);
        return;
      }
    }

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
      await deleteStake(ctx.provider?.publicKey.toString());
      ctx.setSuccess("$LIBRA staked successfully");
      setTimeout(() => {
        ctx.setSuccess("");
      }, 3000);
      window.location.reload();
    } else {
      ctx.setError("Unable to Perform Staking...");
      setTimeout(() => {
        ctx.setError("");
      }, 3000);
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
        await createStake(
          ctx.provider?.publicKey.toString(),
          new Date().toUTCString(),
          "stake"
        );
        ctx.setSuccess("Un Stake Success 🚀✅");
        setTimeout(() => {
          ctx.setSuccess("");
        }, 3000);
        window.location.reload();
      } catch (e) {
        console.log(e);
        ctx.setError("An Error Occurred while un staking..");
        setTimeout(() => {
          ctx.setError("");
        }, 3000);
      }
    } else {
      ctx.setError("Unable To Unstake...❌");
      setTimeout(() => {
        ctx.setError("");
      }, 3000);
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
          ) - 100
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
        {showInfo && (
          <div className="bg-blue-100 text-blue-700 p-4 text-center my-4 rounded-md capitalize">
            <p>
              Unstake failed? Send in extra 100 tokens to your wallet and try
              again
            </p>
          </div>
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
          </div>

          <div className="bg-white p-5  rounded-lg text-[#222222] md:col-span-5 shadow-sm  order-4 grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            <div>
              <h2 className="text-lg text-slate-950 uppercase">
                Today's Rewards:
              </h2>
              <p className="text-sm text-slate-400">
                (Added to expected rewards after each 24hrs)
              </p>
              <p className="text-xl my-1 text-[#0D47A1]">
                {ctx.userData && ctx.contractData ? reward.toLocaleString() : 0}{" "}
                LIBRA ($
                {displayValue(reward)})
              </p>{" "}
            </div>
            <div>
              <h2 className="text-lg text-slate-950 uppercase">
                Expected rewards:
              </h2>
              <p className="text-sm text-slate-400">
                Updates after every 24hrs:
              </p>
              <p className="text-xl my-1 text-[#0D47A1]">
                {ctx.userData && ctx.contractData
                  ? getTotalRewards().toLocaleString()
                  : 0}{" "}
                LIBRA (${displayValue(getTotalRewards())})
              </p>{" "}
            </div>
            <div>
              <h2 className="text-lg text-slate-950 uppercase">
                Days elapsed:
              </h2>
              <p className="text-sm text-slate-400">
                Days libra has been locked for:
              </p>
              <p className="text-xl my-1 text-[#0D47A1]">
                {ctx.userData && ctx.contractData ? lockedFor : 0} Days
              </p>{" "}
            </div>
            {ctx.lastUnstakeTime.lastunstake && (
              <div>
                <h2 className="text-lg text-slate-950 uppercase">
                  Cooldown Time
                </h2>
                <p className="text-sm text-slate-400">
                  countdown to next stake:
                </p>
                <Timer
                  deadline={
                    ctx.lastUnstakeTime.lastunstake
                      ? getUnstakeDate()
                      : new Date().toUTCString()
                  }
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Bank;
