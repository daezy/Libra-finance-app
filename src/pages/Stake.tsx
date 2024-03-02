import { useContext, useState } from "react";
import { FaLock, FaSpinner } from "react-icons/fa6";
import { AppContext } from "../context/App-Context";
import { performStake, performUnStake } from "../solana/services.ts";
import { formatAmount } from "../solana/utils.ts";
import { STAKE_TOKEN_DECIMALS } from "../solana/constants.ts";
import { StakeType } from "../solana/types.ts";
import { Timer } from "../components/Timer.tsx";

const Stake = () => {
  const [days, setDays] = useState<number>(0);
  const [libraAmount, setLibraAmount] = useState<number>(0);
  const [unstakeLoading, setUnstakeLoading] = useState(false);

  const ctx = useContext(AppContext);

  const getTimerDate = (): string => {
    const date = ctx.userData
      ? getUnlockDate(
          parseInt(ctx.userData?.lockDuration.toString()) / 24 / 60 / 60
        )
      : new Date().toDateString();

    return date;
  };

  const getLockDate = (days: number): string => {
    const todayDate = new Date();
    const result = todayDate.setDate(todayDate.getDate() + days);
    const newDate = new Date(result);
    return newDate.toDateString();
  };

  const getUnlockDate = (days: number): string => {
    const dayOfStake = ctx.userData
      ? parseInt(ctx.userData?.stakeTs.toString()) * 1000
      : 0;
    const dateOfStamp = new Date(dayOfStake);
    const result = dateOfStamp.setDate(dateOfStamp.getDate() + days);
    const newDate = new Date(result);
    return newDate.toDateString();
  };

  const getTotalRewards = (): number => {
    const totalStaked: number | null = ctx.userData
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
            parseInt(ctx.contractData.lockedStakingApy.toString()),
            1
          )
        )
      : 0;

    const duration = ctx.userData
      ? parseInt(ctx.userData?.lockDuration.toString()) / 24 / 60 / 60
      : 0;

    const interest = ctx.userData
      ? formatAmount(
          parseInt(ctx.userData?.interestAccrued.toString()),
          STAKE_TOKEN_DECIMALS
        )
      : 0;
    const rewards = totalStaked * (duration / 365) * (apy / 100);
    if (rewards == 0) {
      return rewards;
    }
    return rewards + totalStaked + Number(interest);
  };

  const handleStake = async () => {
    ctx.setLoading(true);
    if (ctx.connection && ctx.provider && ctx.tokenAccount) {
      try {
        const duration = days * 24 * 60 * 60;
        await performStake(
          ctx.connection,
          ctx.provider,
          libraAmount,
          duration,
          ctx.tokenAccount.address,
          StakeType.LOCKED
        );
        ctx.setSuccess("Stake Success 🚀✅");
      } catch (e) {
        console.log(e);
        ctx.setError("An Error Occurred while staking..");
        setTimeout(() => {
          ctx.setError("");
        }, 3000);
      }
    } else {
      ctx.setError("Unable to perform stake..");
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
        ctx.setSuccess("Un Stake Success 🚀✅");
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

  return (
    <div className="w-11/12 mx-auto my-9">
      {ctx.userData?.stakeType == BigInt(0) ? (
        <div className="bg-red-200 text-red-700 p-4 text-center my-4 rounded-md">
          <p>
            You currently have $LIBRA Staked. Kindly unstake your $LIBRA in the
            Stake to Lock $LIBRA
          </p>
        </div>
      ) : (
        ""
      )}

      <div className="grid gap-4 grid-cols-1 md:grid-cols-5">
        <div className="md:col-span-3 order-2 md:order-1">
          <div className="bg-white p-5  rounded-lg text-slate-600 shadow-sm">
            <div className="flex md:items-center justify-between p-3 rounded-lg bg-[#C0CFE773] flex-col md:flex-row">
              <div className="libra flex items-center gap-3">
                <img
                  src="./img/logo.png"
                  className="max-w-full"
                  width={60}
                  alt=""
                />
                <div>
                  <h3 className="text-[#0D47A1] text-lg">LIBRA</h3>
                  <p>
                    Balance:{" "}
                    {ctx.tokenAccount
                      ? formatAmount(
                          parseInt(ctx.tokenAccount.amount.toString()),
                          STAKE_TOKEN_DECIMALS
                        )
                      : 0}
                  </p>
                </div>
              </div>

              <div className="right flex justify-center gap-1 flex-col">
                <div className="flex gap-1 items-center">
                  <input
                    type="number"
                    min={0}
                    name="libraamount"
                    value={libraAmount}
                    onChange={(e) => setLibraAmount(Number(e.target.value))}
                    placeholder="*Enter Amount to Lock"
                    id="libraamount"
                    className="py-2 px-4 w-full rounded bg-white "
                  />
                  <button
                    className="bg-transparent border border-solid border-[#0D47A1] rounded-lg p-2 px-3 hover:bg-slate-300"
                    onClick={() => {
                      setLibraAmount(
                        ctx.tokenAccount
                          ? Number(
                              formatAmount(
                                parseInt(ctx.tokenAccount.amount.toString()),
                                STAKE_TOKEN_DECIMALS
                              )
                            ) - 100
                          : 0
                      );
                    }}
                  >
                    Max
                  </button>
                </div>
              </div>
            </div>
            <div className=" p-2 rounded-lg mt-4">
              <div className="flex md:items-center justify-between flex-col md:flex-row">
                <div className="flex items-center gap-3">
                  <FaLock className="text-3xl" />
                  <div>
                    <h3 className="text-[#0D47A1] text-lg">Lock for?</h3>
                    <p>7 Days - 4 Years</p>
                  </div>
                </div>
                <div className="flex gap-2 items-center mt-3 md:mt-0">
                  <input
                    type="number"
                    value={days}
                    onChange={(e) => setDays(Number(e.target.value))}
                    placeholder="Enter duration"
                    className="py-2 px-4 w-full rounded bg-white border border-solid border-[#0D47A180]"
                  />
                  <button
                    className="bg-transparent border border-solid border-[#0D47A1] rounded-lg p-2 px-3 hover:bg-slate-300"
                    onClick={() => setDays(1460)}
                  >
                    Max
                  </button>
                </div>
              </div>

              <div className="">
                <h2 className="my-4 text-xl text-slate-950">Lock for</h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="days"
                    id="week1"
                    className="w-5 h-5"
                    onChange={() => setDays(7)}
                  />
                  <label htmlFor="week2">1 Week</label>
                </div>{" "}
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="days"
                    id="week2"
                    className="w-5 h-5"
                    onChange={() => setDays(14)}
                  />
                  <label htmlFor="week2">2 Weeks</label>
                </div>{" "}
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="days"
                    id="month1"
                    className="w-5 h-5"
                    onChange={() => setDays(30)}
                  />
                  <label htmlFor="month1">1 Month</label>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="days"
                    id="month6"
                    className="w-5 h-5"
                    onChange={() => setDays(180)}
                  />
                  <label htmlFor="month6">6 Months</label>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="days"
                    id="year1"
                    className="w-5 h-5"
                    onChange={() => setDays(365)}
                  />
                  <label htmlFor="year1">1 Year</label>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="days"
                    id="year2"
                    className="w-5 h-5"
                    onChange={() => setDays(730)}
                  />
                  <label htmlFor="year2">2 Years</label>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="days"
                    id="year3"
                    className="w-5 h-5"
                    onChange={() => {
                      setDays(1460);
                    }}
                  />
                  <label htmlFor="year3">4 years</label>
                </div>
              </div>

              <div className="my-2">
                <p>Lock until: {getLockDate(days)}</p>
              </div>
            </div>
            <div className="mb-3">
              <button
                className="text-slate-100 mx-auto bg-[#0D47A1] py-3 w-full text-center px-6 rounded-lg hover:bg-blue-800 flex justify-center gap-3 items-center"
                disabled={ctx.loading}
                onClick={handleStake}
              >
                {ctx.loading ? (
                  <FaSpinner className="animate-spin" />
                ) : (
                  "Lock LIBRA"
                )}
              </button>
            </div>
            <div className="text-[#222222D1]">
              <p>- You need to lock a minimum amount of 10 LIBRA</p>
              <p> - You can lock maximum Unlimited LIBRA </p>
              <p>- Early unlock penalty fee is 10%</p>
            </div>
          </div>
          <div className="grid gap-3 grid-cols-1 md:grid-cols-2 mt-4">
            <div className="bg-white p-5  rounded-lg text-slate-600 shadow-sm flex flex-col justify-center text-center gap-2">
              <h2 className="text-lg text-[#1F242F] my-1">$LIBRA APY</h2>
              <div>
                <p className="text-4xl my-2 text-[#0D47A1] ">
                  {ctx.contractData
                    ? formatAmount(
                        parseInt(ctx.contractData.lockedStakingApy.toString()),
                        1
                      )
                    : 0}
                  %
                </p>
                <p className="text-[#0D47A1]">Per Year</p>
              </div>

              <p className="mb-2 text-[#222222D1]">
                (You will get back 100% your locked LIBRA amount after Lock for
                7 days)
              </p>
            </div>
            <div className="bg-white p-5  rounded-lg text-slate-600 shadow-sm flex flex-col justify-center text-center gap-2">
              <h2 className="text-lg text-[#1F242F] mt-1">STAKING INFO</h2>
              <p className="text-sm text-slate-400"> Your Locked LIBRA</p>
              <div>
                <p className="text-4xl my-2 text-[#0D47A1]">
                  {ctx.userData && ctx.userData.stakeType == BigInt(1)
                    ? formatAmount(
                        parseInt(ctx.userData.totalStaked.toString()),
                        STAKE_TOKEN_DECIMALS
                      )
                    : 0}{" "}
                </p>
                <p className="text-[#0D47A1]">LIBRA</p>
              </div>

              <button
                className="text-white my-1 bg-[#0D47A1] py-3 px-6 rounded-lg hover:bg-blue-800 flex justify-center gap-3 items-center"
                onClick={handleUnstake}
              >
                {unstakeLoading ? (
                  <FaSpinner className="animate-spin" />
                ) : (
                  "UnLock LIBRA"
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white p-5  rounded-lg text-[#222222D1] md:col-span-2 order-1 md:order-2 shadow-sm">
          <h2 className="text-3xl my-3 text-[#222222]">What is Libra Bank?</h2>

          <p className="mb-1">
            - By just holding LIBRA, you get LIBRA interest (auto-compound to
            6057% APY for you). You will get back your locked amount after 14
            days if you lock for a month.
          </p>
          <br />
          <p className="mb-1">
            - LIBRA holders will receive other benefit such as
            multichain-farming profits in the future
          </p>
          <br />
          <p className="mb-1">
            - You can unlock LIBRA before time but 10% of your locked LIBRA will
            go to current LIBRA holders.
          </p>
        </div>
        <div className="bg-blue-100 text-blue-700 p-4 text-center my-4 rounded-md capitalize md:col-span-5 order-3">
          <p>
            Unstake failed? Send in extra 100 tokens to your wallet and try
            again
          </p>
        </div>
        <div className="bg-white p-5  rounded-lg text-[#222222] md:col-span-5 shadow-sm order-4 grid gap-4 grid-cols-1 md:grid-cols-2">
          <div>
            <h2 className="text-lg text-slate-950 uppercase">
              Expected Rewards:
            </h2>
            <p className="text-sm text-slate-400">
              You Will Receive(includes capital):
            </p>
            <p className="text-xl my-1 text-[#0D47A1]">
              {ctx.contractData ? getTotalRewards() : 0} LIBRA
            </p>{" "}
          </div>
          <div>
            <h2 className="text-lg text-slate-950 uppercase">Locked Until:</h2>
            <p className="text-sm text-slate-400">
              LIBRA will be accessible by:
            </p>
            <p className="text-xl my-1 text-[#0D47A1]">
              {ctx.userData
                ? getUnlockDate(
                    parseInt(ctx.userData?.lockDuration.toString()) /
                      24 /
                      60 /
                      60
                  )
                : new Date().toDateString()}{" "}
            </p>{" "}
          </div>
          <div>
            <h2 className="text-lg text-slate-950 uppercase">Lock duration:</h2>
            <p className="text-sm text-slate-400">Libra will be locked for:</p>
            <p className="text-xl my-1 text-[#0D47A1]">
              {ctx.userData
                ? parseInt(ctx.userData?.lockDuration.toString()) / 24 / 60 / 60
                : 0}{" "}
              Days
            </p>{" "}
          </div>
          {ctx.userData && (
            <div>
              <h2 className="text-lg text-slate-950 uppercase">Unlock Time:</h2>
              <p className="text-sm text-slate-400">
                countdown to libra unlock:
              </p>
              <Timer
                deadline={
                  ctx.userData ? getTimerDate() : new Date().toDateString()
                }
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Stake;
