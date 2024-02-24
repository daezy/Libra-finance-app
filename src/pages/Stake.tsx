import { useContext, useState } from "react";
import { FaLock, FaSpinner } from "react-icons/fa6";
import { AppContext } from "../context/App-Context";
import { performStake, performUnStake } from "../solana/services.ts";
import { formatAmount } from "../solana/utils.ts";
import { STAKE_TOKEN_DECIMALS } from "../solana/constants.ts";
import { StakeType } from "../solana/types.ts";

const Stake = () => {
  const [days, setDays] = useState<number>(0);
  const [libraAmount, setLibraAmount] = useState<number>(0);
  const [unstakeLoading, setUnstakeLoading] = useState(false);

  const ctx = useContext(AppContext);

  const getLockDate = (days: number): string => {
    const todayDate = new Date();
    const result = todayDate.setDate(todayDate.getDate() + days);
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

    const rewards = totalStaked * (duration / 365) * (apy / 100);
    return rewards;
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
      }
    } else {
      ctx.setError("Unable to perform stake..");
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
    <div className="w-11/12 md:w-11/12 mx-auto mt-52 md:mt-40">
      {ctx.userData?.stakeType == BigInt(0) ? (
        <div className="bg-red-700 text-white p-4 text-center my-4 rounded-lg">
          <p>
            You currently have $LIBRA Staked. Kindly unstake your $LIBRA in the
            Stake to Lock $LIBRA
          </p>
        </div>
      ) : (
        ""
      )}
      <div className="grid gap-3 grid-cols-1 md:grid-cols-2">
        <div className="my-8  bg-slate-100 p-6  rounded-xl text-slate-600">
          <h2 className="text-3xl my-3 text-slate-950">What is Libra Bank?</h2>

          <p className="mb-1">
            - By just holding LIBRA, you get LIBRA interest (auto-compound to
            6057% APY for you). You will get back your locked amount after 14
            days if you lock for a month.
          </p>
          <p className="mb-1">
            - LIBRA holders will receive other benefit such as
            multichain-farming profits in the future
          </p>
          <p className="mb-1">
            - You can unlock LIBRA before time but 10% of your locked LIBRA
            will go to current LIBRA holders.
          </p>
        </div>

        <div className="my-8  bg-slate-100 p-6  rounded-xl text-slate-600">
          <div className="flex md:items-center justify-between p-3 rounded-xl bg-slate-300 bg-opacity-40 flex-col md:flex-row">
            <div className="libra flex items-center gap-3">
              <img
                src="./img/logo.png"
                className="max-w-full"
                width={70}
                alt=""
              />
              <div>
                <h3 className="text-slate-950 text-lg">LIBRA</h3>
                <p
                  className="cursor-pointer"
                  onClick={() => {
                    setLibraAmount(
                      ctx.tokenAccount
                        ? Number(
                            formatAmount(
                              parseInt(ctx.tokenAccount.amount.toString()),
                              STAKE_TOKEN_DECIMALS
                            )
                          )
                        : 0
                    );
                  }}
                >
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
              <label htmlFor="libraamout">Enter Libra Amount to lock</label>
              <input
                type="number"
                min={0}
                name="libraamount"
                value={libraAmount}
                onChange={(e) => setLibraAmount(Number(e.target.value))}
                placeholder="*Libra amount"
                id="libraamount"
                className="py-2 px-4 rounded-xl bg-opacity-45 bg-white border border-solid border-slate-500"
              />
            </div>
          </div>

          <div className=" p-4 rounded-xl bg-slate-300 bg-opacity-40 mt-4">
            <div className="flex md:items-center justify-between flex-col md:flex-row">
              <div className="flex items-center gap-3">
                <FaLock className="text-4xl" />
                <div>
                  <h3 className="text-slate-950 text-lg">Lock for?</h3>
                  <p>14 Days - 4 Years</p>
                </div>
              </div>
              <div className="flex gap-2 items-center flex-wrap">
                <input
                  type="number"
                  value={days}
                  onChange={(e) => setDays(Number(e.target.value))}
                  className="py-2 px-4 rounded-xl bg-opacity-45 bg-white border border-solid border-slate-500"
                />
                <p>Days</p>
                <button
                  className="bg-transparent border border-solid border-violet-500 rounded-xl p-2 px-3 hover:bg-slate-300"
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
              <div className="flex items-center text-lg gap-3">
                <input
                  type="radio"
                  name="days"
                  id="week2"
                  className="w-5 h-5"
                  onChange={() => setDays(14)}
                />
                <label htmlFor="week2">2 Weeks</label>
              </div>{" "}
              <div className="flex items-center text-lg gap-3">
                <input
                  type="radio"
                  name="days"
                  id="month1"
                  className="w-5 h-5"
                  onChange={() => setDays(30)}
                />
                <label htmlFor="month1">1 Month</label>
              </div>
              <div className="flex items-center text-lg gap-3">
                <input
                  type="radio"
                  name="days"
                  id="month6"
                  className="w-5 h-5"
                  onChange={() => setDays(180)}
                />
                <label htmlFor="month6">6 Months</label>
              </div>
              <div className="flex items-center text-lg gap-3">
                <input
                  type="radio"
                  name="days"
                  id="year1"
                  className="w-5 h-5"
                  onChange={() => setDays(365)}
                />
                <label htmlFor="year1">1 Year</label>
              </div>
              <div className="flex items-center text-lg gap-3">
                <input
                  type="radio"
                  name="days"
                  id="year2"
                  className="w-5 h-5"
                  onChange={() => setDays(730)}
                />
                <label htmlFor="year2">2 Years</label>
              </div>
              <div className="flex items-center text-lg gap-3">
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

            <div className="my-4 *:mb-1">
              <p>Lock until: {getLockDate(days)}</p>
            </div>
          </div>
          <div className="my-3">
            <button
              className="text-slate-100 mx-auto bg-violet-600 py-4 px-6 rounded-2xl hover:bg-violet-800 flex justify-between gap-3 items-center"
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
          <p>
            - You need to lock a minimum amount of 10 LIBRA <br />
            - You can lock maximum Unlimited LIBRA <br />- Early unlock penalty
            fee is 10%
          </p>
        </div>
      </div>
      {/*<div className="bg-slate-100 p-6  rounded-xl text-slate-600">*/}
      {/*  <p className="text-lg">Your shares / Total reward:</p>*/}
      {/*</div>*/}
      {/*<div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">*/}
      {/*  <div className="bg-slate-100 p-6  rounded-xl text-slate-600  flex items-center gap-2">*/}
      {/*    <img src="./img/logo.png" width={70} alt="" />*/}
      {/*    <div className="flex flex-col gap-1">*/}
      {/*      <h3 className="text-slate-950 text-lg">Total $LIBRA Rewarded</h3>*/}
      {/*      <p>80,248,487,081.34($66,913.34)</p>*/}
      {/*    </div>*/}
      {/*  </div>*/}
      {/*  <div className="bg-slate-100 p-6  rounded-xl text-slate-600 flex items-center gap-2">*/}
      {/*    <img src="./img/logo.png" width={70} alt="" />*/}
      {/*    <div className="flex flex-col gap-1">*/}
      {/*      <h3 className="text-slate-950 text-lg">Total $USDC Rewarded</h3>*/}
      {/*      <p>3,300,511.28</p>*/}
      {/*    </div>*/}
      {/*  </div>*/}
      {/*  <div className="bg-slate-100 p-6  rounded-xl text-slate-600  flex items-center gap-2">*/}
      {/*    <img src="./img/logo.png" width={70} alt="" />*/}
      {/*    <div className="flex flex-col gap-1">*/}
      {/*      <h3 className="text-slate-950 text-lg">LIBRA Locked</h3>*/}
      {/*      <p>81,311,042,800.5($67,799.32)</p>*/}
      {/*    </div>*/}
      {/*  </div>*/}
      {/*  <div className="bg-slate-100 p-6  rounded-xl text-slate-600 flex items-center gap-2">*/}
      {/*    <img src="./img/logo.png" width={70} alt="" />*/}
      {/*    <div className="flex flex-col gap-1">*/}
      {/*      <h3 className="text-slate-950 text-lg">LIBRA in circulation</h3>*/}
      {/*      <p>7,616,109,466.7</p>*/}
      {/*    </div>*/}
      {/*  </div>*/}
      {/*  <div className="bg-slate-100 p-6  rounded-xl text-slate-600 flex items-center gap-2">*/}
      {/*    <img src="./img/logo.png" width={70} alt="" />*/}
      {/*    <div className="flex flex-col gap-1">*/}
      {/*      <h3 className="text-slate-950 text-lg">Average Lock Time</h3>*/}
      {/*      <p>136.75 Days</p>*/}
      {/*    </div>*/}
      {/*  </div>*/}
      {/*</div>*/}

      <h1 className="mt-7 text-3xl text-slate-950">Staking Info</h1>
      <div className="grid gap-3 grid-cols-1 md:grid-cols-2">
        <div className="my-3  bg-slate-100 p-6  rounded-xl text-slate-600">
          <h2 className="text-lg text-slate-950 my-1">Your LIBRA Locked</h2>
          <p className="text-xl my-2 text-violet-500 ">
            {ctx.userData && ctx.userData.stakeType == BigInt(1)
              ? formatAmount(
                  parseInt(ctx.userData.totalStaked.toString()),
                  STAKE_TOKEN_DECIMALS
                )
              : 0}{" "}
            LIBRA
          </p>
          <div className="flex justify-end items-center">
            <button
              className="text-slate-100 bg-violet-600 py-4 px-6 rounded-2xl hover:bg-violet-800 flex justify-between gap-3 items-center"
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

        <div className="my-3  bg-slate-100 p-6  rounded-xl text-slate-600">
          <h2 className="text-lg text-slate-950 my-1">LIBRA APY</h2>
          <p className="text-xl my-2 text-violet-500 ">
            {ctx.contractData
              ? formatAmount(
                  parseInt(ctx.contractData.lockedStakingApy.toString()),
                  1
                )
              : 0}
            % / yr
          </p>
          <p className="mb-2">
            (You will get back 100% your locked LIBRA amount after staking for
            14 days)
          </p>
        </div>

        <div className="my-1 bg-slate-100 p-6  rounded-xl text-slate-600">
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div>
              <h2 className="text-lg text-slate-950 my-1">
                Total $LIBRA Reward(After Duration)
              </h2>
              <p className="text-xl my-2 text-violet-500">
                {getTotalRewards()} LIBRA
              </p>
            </div>
            <div>
              <h2 className="text-lg text-slate-950 my-1">Lock Duration</h2>
              <p className="text-xl my-2 text-violet-500">
                {ctx.userData
                  ? parseInt(ctx.userData?.lockDuration.toString()) /
                    24 /
                    60 /
                    60
                  : 0}{" "}
                Days
              </p>
            </div>
            <br />
            <div>
              <h2 className="text-lg text-slate-950 my-1">Locked Until</h2>
              <p className="text-xl my-2 text-violet-500">
                {ctx.userData
                  ? getLockDate(
                      parseInt(ctx.userData?.lockDuration.toString()) /
                        24 /
                        60 /
                        60
                    )
                  : new Date().toDateString()}{" "}
              </p>
            </div>
          </div>
          {/* <br /> */}
          {/* <div className="grid grid-cols-1 md:grid-cols-2">
            <div>
              <h2 className="text-lg text-slate-950 my-1">
                Pending $LIBRA Reward
              </h2>
              <p className="text-xl my-2 text-violet-500">0 LIBRA($0)</p>
              <p>(Autocompound every 30 mins)</p>
            </div>
            <div className="flex justify-end items-center">
              <button className="text-slate-100 bg-violet-600 py-4 px-6 rounded-2xl hover:bg-violet-800 flex justify-between gap-3 items-center">
                Claim LIBRA
              </button>
            </div>
          </div> */}
          <br />
        </div>
      </div>
    </div>
  );
};

export default Stake;
