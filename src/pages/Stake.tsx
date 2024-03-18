import { useContext, useState } from "react";
import { FaLock, FaSpinner } from "react-icons/fa6";
import { AppContext } from "../context/App-Context";
import { performStake, performUnStake } from "../solana/services.ts";
import { formatAmount } from "../solana/utils.ts";
import { STAKE_TOKEN_DECIMALS } from "../solana/constants.ts";
import { StakeType } from "../solana/types.ts";
import { Timer } from "../components/Timer.tsx";
import { createStake, deleteStake } from "../supabaseClient.ts";

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
      : new Date().toUTCString();

    return date;
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
    const result2 = newDate.setTime(newDate.getTime() + 1 * 60 * 60 * 1000);
    const newDate2 = new Date(result2);
    return newDate2.toUTCString();
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

  const displayValue = (func: number): string => {
    const value = func * ctx.tokenPrice;
    const fixed = value.toLocaleString();

    return fixed;
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
        await deleteStake(ctx.provider?.publicKey.toString());
        ctx.setSuccess("Stake Success 🚀✅");
        window.location.reload();
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
        await createStake(
          ctx.provider?.publicKey.toString(),
          new Date().toUTCString(),
          "bank"
        );
        ctx.setSuccess("Un Stake Success 🚀✅");
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

  return (
    // <div className="w-11/12 mx-auto my-9">
    //   {ctx.userData?.stakeType == BigInt(0) ? (
    //     <div className="bg-red-200 text-red-700 p-4 text-center my-4 rounded-md">
    //       <p>
    //         You currently have $LIBRA Staked. Kindly unstake your $LIBRA in the
    //         Stake to Lock $LIBRA
    //       </p>
    //     </div>
    //   ) : (
    //     ""
    //   )}

    //   <div className="grid gap-4 grid-cols-1 md:grid-cols-5">
    //     <div className="md:col-span-3 order-2 md:order-1">
    //       <div className="bg-white p-5  rounded-lg text-slate-600 shadow-sm">
    //         <div className="flex md:items-center justify-between p-3 rounded-lg bg-[#C0CFE773] flex-col md:flex-row">
    //           <div className="libra flex items-center gap-3">
    //             <img
    //               src="./img/logo.png"
    //               className="max-w-full"
    //               width={60}
    //               alt=""
    //             />
    //             <div>
    //               <h3 className="text-[#0D47A1] text-lg">LIBRA</h3>
    //               <p>
    //                 Balance:{" "}
    //                 {ctx.tokenAccount
    //                   ? formatAmount(
    //                       parseInt(ctx.tokenAccount.amount.toString()),
    //                       STAKE_TOKEN_DECIMALS
    //                     )
    //                   : 0}
    //               </p>
    //             </div>
    //           </div>

    //           <div className="right flex justify-center gap-1 flex-col">
    //             <div className="flex gap-1 items-center">
    //               <input
    //                 type="number"
    //                 min={0}
    //                 name="libraamount"
    //                 value={libraAmount}
    //                 onChange={(e) => setLibraAmount(Number(e.target.value))}
    //                 placeholder="*Enter Amount to Lock"
    //                 id="libraamount"
    //                 className="py-2 px-4 w-full rounded bg-white "
    //               />
    //               <button
    //                 className="bg-transparent border border-solid border-[#0D47A1] rounded-lg p-2 px-3 hover:bg-slate-300"
    //                 onClick={() => {
    //                   setLibraAmount(
    //                     ctx.tokenAccount
    //                       ? Number(
    //                           formatAmount(
    //                             parseInt(ctx.tokenAccount.amount.toString()),
    //                             STAKE_TOKEN_DECIMALS
    //                           )
    //                         ) - 100
    //                       : 0
    //                   );
    //                 }}
    //               >
    //                 Max
    //               </button>
    //             </div>
    //           </div>
    //         </div>
    //         <div className=" p-2 rounded-lg mt-4">
    //           <div className="flex md:items-center justify-between flex-col md:flex-row">
    //             <div className="flex items-center gap-3">
    //               <FaLock className="text-3xl" />
    //               <div>
    //                 <h3 className="text-[#0D47A1] text-lg">Lock for?</h3>
    //                 <p>7 Days - 4 Years</p>
    //               </div>
    //             </div>
    //             <div className="flex gap-2 items-center mt-3 md:mt-0">
    //               <input
    //                 type="number"
    //                 value={days}
    //                 onChange={(e) => setDays(Number(e.target.value))}
    //                 placeholder="Enter duration"
    //                 className="py-2 px-4 w-full rounded bg-white border border-solid border-[#0D47A180]"
    //               />
    //               <button
    //                 className="bg-transparent border border-solid border-[#0D47A1] rounded-lg p-2 px-3 hover:bg-slate-300"
    //                 onClick={() => setDays(1460)}
    //               >
    //                 Max
    //               </button>
    //             </div>
    //           </div>

    //           <div className="">
    //             <h2 className="my-4 text-xl text-slate-950">Lock for</h2>
    //           </div>
    //           <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
    //             {/* <div className="flex items-center gap-3">
    //               <input
    //                 type="radio"
    //                 name="days"
    //                 id="week1"
    //                 className="w-5 h-5"
    //                 onChange={() => setDays(7)}
    //               />
    //               <label htmlFor="week2">1 Week</label>
    //             </div>{" "} */}
    //             <div className="flex items-center gap-3">
    //               <input
    //                 type="radio"
    //                 name="days"
    //                 id="week2"
    //                 className="w-5 h-5"
    //                 onChange={() => setDays(14)}
    //               />
    //               <label htmlFor="week2">2 Weeks</label>
    //             </div>{" "}
    //             <div className="flex items-center gap-3">
    //               <input
    //                 type="radio"
    //                 name="days"
    //                 id="month1"
    //                 className="w-5 h-5"
    //                 onChange={() => setDays(30)}
    //               />
    //               <label htmlFor="month1">1 Month</label>
    //             </div>
    //             <div className="flex items-center gap-3">
    //               <input
    //                 type="radio"
    //                 name="days"
    //                 id="month6"
    //                 className="w-5 h-5"
    //                 onChange={() => setDays(180)}
    //               />
    //               <label htmlFor="month6">6 Months</label>
    //             </div>
    //             <div className="flex items-center gap-3">
    //               <input
    //                 type="radio"
    //                 name="days"
    //                 id="year1"
    //                 className="w-5 h-5"
    //                 onChange={() => setDays(365)}
    //               />
    //               <label htmlFor="year1">1 Year</label>
    //             </div>
    //             <div className="flex items-center gap-3">
    //               <input
    //                 type="radio"
    //                 name="days"
    //                 id="year2"
    //                 className="w-5 h-5"
    //                 onChange={() => setDays(730)}
    //               />
    //               <label htmlFor="year2">2 Years</label>
    //             </div>
    //             <div className="flex items-center gap-3">
    //               <input
    //                 type="radio"
    //                 name="days"
    //                 id="year3"
    //                 className="w-5 h-5"
    //                 onChange={() => {
    //                   setDays(1460);
    //                 }}
    //               />
    //               <label htmlFor="year3">4 years</label>
    //             </div>
    //           </div>

    //           <div className="my-2">
    //             <p>Lock until: {getLockDate(days)}</p>
    //           </div>
    //         </div>
    //         <div className="mb-3">
    //           <button
    //             className="text-slate-100 mx-auto bg-[#0D47A1] py-3 w-full text-center px-6 rounded-lg hover:bg-blue-800 flex justify-center gap-3 items-center"
    //             disabled={ctx.loading}
    //             onClick={handleStake}
    //           >
    //             {ctx.loading ? (
    //               <FaSpinner className="animate-spin" />
    //             ) : (
    //               "Deposit LIBRA"
    //             )}
    //           </button>
    //         </div>
    //         <div className="text-[#222222D1]">
    //           <p>- You need to lock a minimum amount of 10 LIBRA</p>
    //           <p> - You can lock maximum Unlimited LIBRA </p>
    //           <p>- Early unlock penalty fee is 10%</p>
    //         </div>
    //       </div>
    //       <div className="grid gap-3 grid-cols-1 md:grid-cols-2 mt-4">
    //         <div className="bg-white p-5  rounded-lg text-slate-600 shadow-sm flex flex-col justify-center text-center gap-2">
    //           <h2 className="text-lg text-[#1F242F] my-1">$LIBRA APY</h2>
    //           <div>
    //             <p className="text-4xl my-2 text-[#0D47A1] ">
    //               {ctx.contractData
    //                 ? formatAmount(
    //                     parseInt(ctx.contractData.lockedStakingApy.toString()),
    //                     1
    //                   )
    //                 : 0}
    //               %
    //             </p>
    //             <p className="text-[#0D47A1]">Per Year</p>
    //           </div>

    //           <p className="mb-2 text-[#222222D1]">
    //             (You will get back 100% your locked LIBRA amount after Lock for
    //             7 days)
    //           </p>
    //         </div>
    //         <div className="bg-white p-5  rounded-lg text-slate-600 shadow-sm flex flex-col justify-center text-center gap-2">
    //           <h2 className="text-lg text-[#1F242F] mt-1">STAKING INFO</h2>
    //           <p className="text-sm text-slate-400"> Your Locked LIBRA</p>
    //           <div>
    //             <p className="text-4xl my-2 text-[#0D47A1]">
    //               {ctx.userData && ctx.userData.stakeType == BigInt(1)
    //                 ? formatAmount(
    //                     parseInt(ctx.userData.totalStaked.toString()),
    //                     STAKE_TOKEN_DECIMALS
    //                   )
    //                 : 0}{" "}
    //             </p>
    //             <p className="text-[#0D47A1]">LIBRA</p>
    //           </div>

    //           <button
    //             className="text-white my-1 bg-[#0D47A1] py-3 px-6 rounded-lg hover:bg-blue-800 flex justify-center gap-3 items-center"
    //             onClick={handleUnstake}
    //           >
    //             {unstakeLoading ? (
    //               <FaSpinner className="animate-spin" />
    //             ) : (
    //               "Withdraw LIBRA"
    //             )}
    //           </button>
    //         </div>
    //       </div>
    //     </div>

    //     <div className="bg-white p-5  rounded-lg text-[#222222D1] md:col-span-2 order-1 md:order-2 shadow-sm">
    //       <h2 className="text-3xl my-3 text-[#222222]">What is Libra Bank?</h2>

    //       <p className="mb-1">
    //         - By just holding LIBRA, you get LIBRA interest (auto-compound to
    //         6057% APY for you). You will get back your locked amount after 14
    //         days if you lock for a month.
    //       </p>
    //       <br />
    //       <p className="mb-1">
    //         - LIBRA holders will receive other benefit such as
    //         multichain-farming profits in the future
    //       </p>
    //       <br />
    //       <p className="mb-1">
    //         - You can unlock LIBRA before time but 10% of your locked LIBRA will
    //         go to current LIBRA holders.
    //       </p>
    //     </div>
    //     <div className="bg-blue-100 text-blue-700 p-4 text-center my-4 rounded-md capitalize md:col-span-5 order-3">
    //       <p>
    //         Unstake failed? Send in extra 100 tokens to your wallet and try
    //         again
    //       </p>
    //     </div>
    //     <div className="bg-white p-5  rounded-lg text-[#222222] md:col-span-5 shadow-sm order-4 grid gap-4 grid-cols-1 md:grid-cols-2">
    //       <div>
    //         <h2 className="text-lg text-slate-950 uppercase">
    //           Expected Rewards:
    //         </h2>
    //         <p className="text-sm text-slate-400">
    //           You Will Receive(includes capital):
    //         </p>
    //         <p className="text-xl my-1 text-[#0D47A1]">
    //           {ctx.contractData ? getTotalRewards().toLocaleString() : 0} ($
    //           {displayValue(getTotalRewards())}) LIBRA
    //         </p>{" "}
    //       </div>
    //       <div>
    //         <h2 className="text-lg text-slate-950 uppercase">Locked Until:</h2>
    //         <p className="text-sm text-slate-400">
    //           LIBRA will be accessible by:
    //         </p>
    //         <p className="text-xl my-1 text-[#0D47A1]">
    //           {ctx.userData
    //             ? getUnlockDate(
    //                 parseInt(ctx.userData?.lockDuration.toString()) /
    //                   24 /
    //                   60 /
    //                   60
    //               )
    //             : new Date().toDateString()}{" "}
    //         </p>{" "}
    //       </div>
    //       <div>
    //         <h2 className="text-lg text-slate-950 uppercase">Lock duration:</h2>
    //         <p className="text-sm text-slate-400">Libra will be locked for:</p>
    //         <p className="text-xl my-1 text-[#0D47A1]">
    //           {ctx.userData
    //             ? parseInt(ctx.userData?.lockDuration.toString()) / 24 / 60 / 60
    //             : 0}{" "}
    //           Days
    //         </p>{" "}
    //       </div>
    //       {ctx.lastUnstakeTime.lastunstake && (
    //         <div>
    //           <h2 className="text-lg text-slate-950 uppercase">
    //             Cooldown Time
    //           </h2>
    //           <p className="text-sm text-slate-400">countdown to next stake:</p>
    //           <Timer
    //             deadline={
    //               ctx.lastUnstakeTime.lastunstake
    //                 ? getUnstakeDate()
    //                 : new Date().toUTCString()
    //             }
    //           />
    //         </div>
    //       )}
    //       {ctx.userData && (
    //         <div>
    //           <h2 className="text-lg text-slate-950 uppercase">Unlock Time:</h2>
    //           <p className="text-sm text-slate-400">
    //             countdown to libra unlock:
    //           </p>
    //           <Timer
    //             deadline={
    //               ctx.userData ? getTimerDate() : new Date().toUTCString()
    //             }
    //           />
    //         </div>
    //       )}
    //     </div>
    //   </div>
    // </div>

    <div className="w-11/12 mx-auto my-9">
      <h2 className="text-2xl my-4 mb-8 text-blue-800">Bank</h2>
      <div className="flex lg:flex-row flex-col gap-5 items-center">
        <div className="bg-white p-7 lg:w-[65%] w-full   rounded-lg text-slate-600 shadow-sm">
          <div className="flex lg:flex-row flex-col gap-8  ">
            <div>
              <div className="flex  items-center gap-3">
                <div className="p-3 bg-gradient-to-r from-[rgb(78,107,244,0.8)] to-[rgb(78,107,244,0.2)]   rounded-full">
                  <img src="./img/logoLibra 1.png" alt="" width={22} />
                </div>
                <p className="text-[18px] text-[#7F9ECF]">LIBRA</p>
              </div>
              <div className="mt-4">
                <p className="font-light text-[#7F9ECF]">Libra Balance</p>
              </div>
              <div className="flex items-center gap-4 mt-5">
                <p className="font-extrabold text-[19px] text-blue-800">
                  ${" "}
                  {ctx.tokenAccount
                    ? formatAmount(
                        parseInt(ctx.tokenAccount.amount.toString()),
                        STAKE_TOKEN_DECIMALS
                      )
                    : 0}
                </p>
              </div>
              <div className="flex items-center gap-4 mt-5">
                <div>
                  <FaLock className="text-[24px]" />
                </div>
                <p className="font-light text-[#7F9ECF]">Lock for</p>
              </div>
              <div className="  mt-3">
                <p className="font-[200] text-[#7F9ECF]">
                  7 Days(min) 4 Years(max)
                </p>
              </div>
              <div className=" mt-3">
                <p className="font-[200] text-[#7F9ECF]">
                  Enter amount to lock
                </p>
                <div className=" flex items-center gap-1 mt-2">
                  <div className="p-2 w-[180px] border border-[#7F9ECF] rounded-sm">
                    <input
                      className="bg-transparent w-full outline-none text-[#7F9ECF] "
                      type="number"
                      min={0}
                      name="libraamount"
                      value={libraAmount}
                      onChange={(e) => setLibraAmount(Number(e.target.value))}
                      placeholder="*Enter Amount to Lock"
                      id="libraamount"
                    />
                  </div>
                  <button
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
                    className="p-2 w-[50px] border border-[#7F9ECF] rounded-sm"
                  >
                    <p className="text-[#7F9ECF]">MAX</p>
                  </button>
                </div>
              </div>
            </div>

            <div>
              <p className="text-[18px]">Period</p>
              <div className="  mt-2">
                <p className="font-[200] text-[#7F9ECF]">
                  7 Days(min) 4 Years(max)
                </p>
              </div>
              <div className="flex flex-wrap gap-3 mt-5 ">
                <button className="bg-[#0D47A114] border border-[#032E703D] p-1 rounded-md">
                  <p
                    className="text-[#0D47A1A3] text-[12px]"
                    onClick={() => setDays(7)}
                  >
                    1 Week
                  </p>
                </button>
                <button
                  className="bg-[#0D47A114] border border-[#032E703D] p-1 rounded-md"
                  onClick={() => setDays(14)}
                >
                  <p className="text-[#0D47A1A3] text-[12px]">2 Weeks</p>
                </button>
                <button
                  className="bg-[#0D47A114] border border-[#032E703D] p-1 rounded-md"
                  onClick={() => setDays(30)}
                >
                  <p className="text-[#0D47A1A3] text-[12px]">1 Month</p>
                </button>
                <button
                  className="bg-[#0D47A114] border border-[#032E703D] p-1 rounded-md"
                  onClick={() => setDays(180)}
                >
                  <p className="text-[#0D47A1A3] text-[12px]">6 Months</p>
                </button>
                <button
                  className="bg-[#0D47A114] border border-[#032E703D] p-1 rounded-md"
                  onClick={() => setDays(365)}
                >
                  <p className="text-[#0D47A1A3] text-[12px]">1 Year</p>
                </button>
                <button
                  className="bg-[#0D47A114] border border-[#032E703D] p-1 rounded-md"
                  onClick={() => setDays(730)}
                >
                  <p className="text-[#0D47A1A3] text-[12px]">2 Years</p>
                </button>
                <button className="bg-[#0D47A114] border border-[#032E703D] p-1 rounded-md">
                  <p
                    className="text-[#0D47A1A3] text-[12px]"
                    onClick={() => {
                      setDays(1095);
                    }}
                  >
                    3 Years
                  </p>
                </button>
                <button
                  className="bg-[#0D47A114] border border-[#032E703D] p-1 rounded-md"
                  onClick={() => {
                    setDays(1460);
                  }}
                >
                  <p className="text-[#0D47A1A3] text-[12px]">4 Years</p>
                </button>
              </div>
              <div className="  mt-3">
                <p className="font-[400] text-[#032E70]">
                  Lock until {getLockDate(days)}
                </p>
              </div>
              <div className="mt-3">
                <button
                  disabled={ctx.loading}
                  onClick={handleStake}
                  className="p-1 bg-gradient-to-r from-[#4E6BF4] to-[#0D47A1] w-full rounded-md "
                >
                  <p className="font-semibold text-[20px] text-white">
                    {ctx.loading ? (
                      <FaSpinner className="animate-spin" />
                    ) : (
                      "Deposit LIBRA"
                    )}
                  </p>
                </button>
              </div>
              <div className="bg-[#E4EBF8] p-3 mt-3">
                <p className="text-[#7F9ECF] text-[12px] font-light">
                  • You need to lock a minimum of 10 LIBRA
                </p>
                <p className="text-[#7F9ECF] text-[12px] font-light">
                  • You can lock maximum Unlimited LIBRA
                </p>
                <p className="text-[#7F9ECF] text-[12px] font-light">
                  • Early unlock penalty fee is 10%
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#E4EBF8] p-7 lg:w-[35%] w-full h-[100%]">
          <p className="text-[25px] text-[#032E70] mb-7">What is Libra Bank</p>
          <div>
            <p className="text-[#032E70] text-[15px]">
              - By just holding LIBRA, you get LIBRA interest (auto-compound to
              6057% APY for you). You will get back your locked amount after 14
              days if you lock for a month.
            </p>
            <br />
            <p className="text-[#032E70] text-[15px]">
              - LIBRA holders will receive other benefit such as
              multichain-farming profits in the future
            </p>
            <br />
            <p className="text-[#032E70] text-[15px]">
              - You can unlock LIBRA before time but 10% of your locked LIBRA
              will go to current LIBRA holders.
            </p>
          </div>
        </div>
      </div>
      <div className="grid md:grid-rows-2 grid-rows-2 gap-4">
        <div className="bg-white  border border-gradient1 mt-5 p-4 rounded-md">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex  items-center gap-3">
                <div className="p-3 bg-gradient-to-r from-[hsla(261,42%,53%,1)] to-[rgb(119,83,185,0.2)] rounded-full">
                  <img src="./img/earnings_3916706 1.png" alt="" width={22} />
                </div>
                <p className="text-[15px] text-[#7F9ECF]">LIBRA APY</p>
              </div>
              <div className="mt-5 ml-2">
                <p className="font-[400]  text-[16px] text-[#0D47A1]">
                  {ctx.contractData
                    ? formatAmount(
                        parseInt(ctx.contractData.lockedStakingApy.toString()),
                        1
                      )
                    : 0}
                  % <span className="font-light text-[13px]">per year</span>
                </p>
              </div>
            </div>
            <div className="bg-[#E4EBF8] p-2 w-[65%] ">
              <p className="text-[#7F9ECF] text-[14px] font-light">
                (You will get back 100% your locked LIBRA amount after Lock for
                7 days)
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white  border border-gradient mt-5 p-4 rounded-md">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex  items-center gap-3">
                <div className="p-3 bg-gradient-to-r from-[rgb(78,107,244,0.8)] to-[rgb(78,107,244,0.2)] rounded-full">
                  <img src="./img/Vector-3.png" alt="" width={22} />
                </div>
                <p className="text-[15px] text-[#7F9ECF]">STAKING INFO</p>
              </div>
              <div className="mt-3 ml-2">
                <p className="font-[200]  text-[12px] text-[#7F9ECF]">
                  Your locked LIBRA
                </p>
              </div>
              <div className="mt-3 ml-2">
                <p className="font-[400]  text-[16px] text-[#0D47A1]">
                  {ctx.userData && ctx.userData.stakeType == BigInt(1)
                    ? formatAmount(
                        parseInt(ctx.userData.totalStaked.toString()),
                        STAKE_TOKEN_DECIMALS
                      )
                    : 0}{" "}
                  LIBRA
                </p>
              </div>
            </div>
            <button
              className="p-3 bg-gradient-to-r from-[#4E6BF4] to-[#0D47A1] w-[60%] rounded-md "
              onClick={handleUnstake}
            >
              <p className="font-semibold text-[20px] text-white">
                {unstakeLoading ? (
                  <FaSpinner className="animate-spin" />
                ) : (
                  "Withdraw LIBRA"
                )}
              </p>
            </button>
          </div>
        </div>
      </div>
      <div className="p-3 bg-[#2E7FFC29] mt-3">
        <p className="text-center lg:text-[14px] text-[11px] ">
          Unstake Failed? Send In Extra 100 Tokens To Your Wallet And Try Again
        </p>
      </div>
      <div className="grid lg:grid-cols-3 grid-rows-2 gap-4">
        <div className="bg-white  border border-gradient1 mt-5 p-4 rounded-md">
          <div>
            <p className="text-[#032E70] text-[15px] py-2">EXPECTED REWARDS:</p>
            <p className="text-[#7F9ECF] text-[12px] pb-2">
              You will receive (include capital)
            </p>
            <p className="text-[#0D47A1] text-[20px] pb-2">
              {" "}
              {ctx.contractData ? getTotalRewards().toLocaleString() : 0} ($
              {displayValue(getTotalRewards())}) LIBRA{" "}
            </p>
          </div>
        </div>
        <div className="bg-white  border border-gradient mt-5 p-4 rounded-md">
          <div>
            <p className="text-[#032E70] text-[15px] py-2">LOCK DURATION:</p>
            <p className="text-[#7F9ECF] text-[12px] pb-2">
              Libra will be locked for:
            </p>
            <p className="text-[#0D47A1] text-[20px] pb-2">
              {" "}
              {ctx.userData
                ? parseInt(ctx.userData?.lockDuration.toString()) / 24 / 60 / 60
                : 0}{" "}
              Days
            </p>
          </div>
        </div>
        <div className="bg-white  border border-gradient mt-5 p-4 rounded-md">
          <div>
            <p className="text-[#032E70] text-[15px] py-2">EXPECTED REWARDS:</p>
            <p className="text-[#7F9ECF] text-[12px] pb-2">
              LIBRA will be accessible by:
            </p>
            <p className="text-[#0D47A1] text-[20px] pb-2">
              {" "}
              {ctx.userData
                ? getUnlockDate(
                    parseInt(ctx.userData?.lockDuration.toString()) /
                      24 /
                      60 /
                      60
                  )
                : new Date().toDateString()}{" "}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Stake;
