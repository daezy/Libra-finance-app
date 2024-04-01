import { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/App-Context";
import { formatAmount } from "../solana/utils";
import { performStake, performUnStake } from "../solana/services.ts";
import { StakeType } from "../solana/types.ts";
import { FaCoins, FaSpinner } from "react-icons/fa6";
import { STAKE_TOKEN_DECIMALS } from "../solana/constants.ts";
import { createStake, deleteStake } from "../supabaseClient.ts";
import { Timer } from "../components/Timer.tsx";
import PriorityFees from "../components/PriorityFees.tsx";

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
    const dayDiff = timeDiff / (1000 * 3600 * 24);

    const rewards = totalStaked * (dayDiff / 365) * (apy / 100);

    if (totalStaked < 2) {
      const newReward = (totalStaked + rewards).toFixed(7);
      setRewards(parseFloat(newReward));
    } else {
      const newReward = (
        totalStaked +
        rewards -
        (getTotalRewards() - Number(interest))
      ).toFixed(7);
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
        <h2 className="text-2xl my-4 mb-8 text-blue-800">Stake</h2>
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
          <div
            data-aos="fade-right"
            className="bg-white border border-gradient p-5 md:col-span-3  rounded-lg text-slate-600 shadow-sm"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
              <div className="balances">
                <div className="flex  items-center gap-3">
                  <div className="p-3 bg-gradient-to-r from-[rgb(78,107,244,0.8)] to-[rgb(78,107,244,0.2)]   rounded-full">
                    <FaCoins className="text-[#0D47A1] w-5 h-5" />
                  </div>
                  <p className="text-[18px] text-[#7F9ECF]">STAKE</p>
                </div>
                <div className="flex items-center my-4">
                  <div className="w-1/2 p-2">
                    <p className="text-[#7F9ECF] mb-1">Balance</p>
                    <p className="text-[#0D47A1] font-semibold">
                      {ctx.tokenAccount
                        ? formatAmount(
                            parseInt(ctx.tokenAccount.amount.toString()),
                            STAKE_TOKEN_DECIMALS
                          )
                        : 0}
                    </p>
                  </div>
                  <div className="w-1/2 bg-[#2E7FFC33] p-2 text-center rounded-sm">
                    <p className="text-[#7F9ECF] mb-1">Total Staked</p>
                    <p className="text-[#0D47A1] font-semibold">
                      {ctx.userData && ctx.userData.stakeType == BigInt(0)
                        ? formatAmount(
                            parseInt(ctx.userData.totalStaked.toString()),
                            STAKE_TOKEN_DECIMALS
                          )
                        : 0}
                    </p>
                  </div>
                </div>
                <button
                  className="text-white bg-[#0D47A1] py-3 px-6 rounded hover:bg-blue-800 w-full disabled:bg-[#cedbf3] text-center"
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

              <div>
                <label htmlFor="amount" className="text-[#7F9ECF]">
                  Enter amount to stake
                </label>
                <div className="flex items-center gap-2 mt-2">
                  <input
                    type="number"
                    id="amount"
                    value={amount}
                    min={0}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    placeholder="0"
                    className="py-2 px-4 w-full outline-none rounded-sm border border-solid border-[#0D47A133] bg-transparent text-[#0D47A1] placeholder:text-[#0D47A1]"
                  />
                  <button
                    className="border border-solid border-[#0D47A133] bg-transparent text-[#7F9ECF] p-2 px-3 hover:bg-slate-300"
                    onClick={() => {
                      setMaxAmount();
                    }}
                  >
                    MAX
                  </button>
                </div>
                <p className="text-[#7F9ECF] text-xs text-center my-3 p-2 bg-[#E4EBF8]">
                  You cannot withdraw for 24hrs after staking
                </p>
                <button
                  className="text-white bg-[#0D47A1] py-3 px-6 rounded hover:bg-blue-800 w-full disabled:bg-[#cedbf3] text-center"
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
            <PriorityFees />
          </div>

          <div
            data-aos="fade-left"
            className="bg-white p-5 border border-gradient1  md:col-span-2 rounded-lg text-slate-600 shadow-sm flex items-center justify-center gap-3 flex-col"
          >
            <div className="p-5 bg-gradient-to-r from-[rgb(119,83,185,0.8)] to-[rgb(119,83,185,0.2)] rounded-full">
              <img src="./img/apy.svg" alt="" width={22} />
            </div>
            <h2 className="text-[#7F9ECF]">LIBRA APY</h2>
            <div>
              <p className="text-4xl text-[#0D47A1] ">
                {ctx.contractData
                  ? formatAmount(
                      parseInt(ctx.contractData.normalStakingApy.toString()),
                      1
                    )
                  : 0}
                %
              </p>
              <p className="text-[#0D47A1] text-center">Per Year</p>
            </div>
          </div>

          <div className="md:col-span-5 order-4 grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-3">
            <div
              className="bg-white  border border-gradient p-4 rounded-md"
              data-aos="fade-up"
            >
              <div>
                <p className="text-[#032E70] text-[15px] py-2">
                  Today's Rewards:
                </p>
                <p className="text-[#7F9ECF] text-[12px] pb-2">
                  Added to expected rewards after each 24hrs
                </p>
                <p className="text-[#0D47A1] text-[20px] pb-2">
                  {ctx.userData && ctx.contractData
                    ? reward.toLocaleString()
                    : 0}{" "}
                  LIBRA ($
                  {displayValue(reward)})
                </p>
              </div>
            </div>
            <div
              className="bg-white  border border-gradient p-4 rounded-md"
              data-aos="fade-up"
            >
              <div>
                <p className="text-[#032E70] text-[15px] py-2">
                  EXPECTED REWARDS:
                </p>
                <p className="text-[#7F9ECF] text-[12px] pb-2">
                  Updates after every 24hrs:
                </p>
                <p className="text-[#0D47A1] text-[20px] pb-2">
                  {ctx.userData && ctx.contractData
                    ? getTotalRewards().toLocaleString()
                    : 0}{" "}
                  LIBRA (${displayValue(getTotalRewards())})
                </p>
              </div>
            </div>
            <div
              className="bg-white  border border-gradient p-4 rounded-md"
              data-aos="fade-up"
            >
              <div>
                <p className="text-[#032E70] text-[15px] py-2">Days elapsed:</p>
                <p className="text-[#7F9ECF] text-[12px] pb-2">
                  Days libra has been locked for:
                </p>
                <p className="text-[#0D47A1] text-[20px] pb-2">
                  {ctx.userData && ctx.contractData ? lockedFor : 0} Days
                </p>
              </div>
            </div>

            {ctx.lastUnstakeTime.lastunstake && (
              <div className="bg-white  border border-gradient p-4 rounded-md">
                <div>
                  <p className="text-[#032E70] text-[15px] py-2">
                    Cooldown Time
                  </p>
                  <p className="text-[#7F9ECF] text-[12px] pb-2">
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
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Bank;
