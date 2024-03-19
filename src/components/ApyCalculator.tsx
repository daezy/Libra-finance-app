import { useContext, useState } from "react";
import { formatAmount } from "../solana/utils";
import { AppContext } from "../context/App-Context";

const ApyCalculator = () => {
  const [appName, setAppName] = useState<"stake" | "bank">("bank");
  const [amount, setAmount] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [totalRewards, setTotalRewards] = useState<number>(0);

  const ctx = useContext(AppContext);

  const getTotalRewards = async () => {
    const apy = ctx.contractData
      ? appName == "stake"
        ? formatAmount(
            parseInt(ctx.contractData.normalStakingApy.toString()),
            1
          )
        : formatAmount(
            parseInt(ctx.contractData.lockedStakingApy.toString()),
            1
          )
      : 0;

    if (amount && duration && apy) {
      const rewards = amount * (duration / 365) * (Number(apy) / 100);
      // if (appName == "stake") {
      const newRewards = rewards + amount;
      setTotalRewards(newRewards);
      // } else {
      //   setTotalRewards(rewards);
      // }
    }
  };

  const handleChangeApp = (ap: "stake" | "bank") => {
    setAppName(ap);
    setAmount(0);
    setDuration(0);
    setTotalRewards(0);
  };

  return (
    <div className="w-11/12 mx-auto my-9">
      <div className="grid gap-4 grid-cols-1 md:grid-cols-5">
        <div className="bg-white border border-gradient md:col-span-3  rounded-lg text-slate-600 shadow-sm">
          <div className="flex md:items-center justify-between p-5  flex-col md:flex-row border-b border-solid">
            <div className="libra flex items-center gap-3">
              <h2 className="text-lg my-3 text-slate-800">
                Estimate Your Returns
              </h2>
            </div>

            <div className="right">
              <ul className="flex flex-wrap text-sm font-medium text-center text-gray-500 dark:text-gray-400">
                <li className="me-2">
                  <a
                    href="#"
                    className={`inline-block px-4 py-3 rounded-lg border-blue-700 ${appName == "bank" ? "active bg-[#0D47A1] text-white" : "hover:text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-white"}`}
                    onClick={() => handleChangeApp("bank")}
                  >
                    Bank
                  </a>
                </li>
                <li className="me-2">
                  <a
                    href="#"
                    className={`inline-block px-4 py-3 rounded-lg border-blue-700 ${appName == "stake" ? "active bg-[#0D47A1] text-white" : "hover:text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-white"}`}
                    aria-current="page"
                    onClick={() => handleChangeApp("stake")}
                  >
                    Stake
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="p-5 text-[#222222]">
            <div className="flex justify-between items-center my-4 gap-4">
              <p>Fixed APY:</p>
              <p className=" text-lg text-[#0D47A1] ">
                {ctx.contractData
                  ? appName == "stake"
                    ? formatAmount(
                        parseInt(ctx.contractData.normalStakingApy.toString()),
                        1
                      )
                    : formatAmount(
                        parseInt(ctx.contractData.lockedStakingApy.toString()),
                        1
                      )
                  : 0}
                % / Yr
              </p>
            </div>

            <div className="flex justify-between items-center my-4 gap-4">
              <p className="md:w-2/12">Amount:</p>
              <input
                type="number"
                id="amount"
                min={0}
                placeholder="Amount in libra"
                value={amount}
                required
                onChange={(e) => setAmount(parseInt(e.target.value))}
                className="py-2 px-4 w-full outline-none rounded-sm border border-solid border-[#0D47A133] bg-transparent text-[#0D47A1] placeholder:text-[#0D47A1]"
              />
            </div>
            <div className="flex justify-between items-center my-4 gap-4">
              <p className="md:w-2/12">Duration:</p>
              <input
                type="number"
                id="amount"
                value={duration}
                onChange={(e) => setDuration(parseInt(e.target.value))}
                min={0}
                required
                placeholder="Duration in days"
                className="py-2 px-4 w-full outline-none rounded-sm border border-solid border-[#0D47A133] bg-transparent text-[#0D47A1] placeholder:text-[#0D47A1]"
              />
            </div>
            {appName == "bank" && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-5 my-4">
                {/* <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="days"
                    id="week1"
                    className="w-5 h-5"
                    onChange={() => setDuration(7)}
                  />
                  <label htmlFor="week2">1 Week</label>
                </div>{" "} */}
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="days"
                    id="week2"
                    className="w-5 h-5"
                    onChange={() => setDuration(14)}
                  />
                  <label htmlFor="week2">2 Weeks</label>
                </div>{" "}
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="days"
                    id="month1"
                    className="w-5 h-5"
                    onChange={() => setDuration(30)}
                  />
                  <label htmlFor="month1">1 Month</label>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="days"
                    id="month6"
                    className="w-5 h-5"
                    onChange={() => setDuration(180)}
                  />
                  <label htmlFor="month6">6 Months</label>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="days"
                    id="year1"
                    className="w-5 h-5"
                    onChange={() => setDuration(365)}
                  />
                  <label htmlFor="year1">1 Year</label>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="days"
                    id="year2"
                    className="w-5 h-5"
                    onChange={() => setDuration(730)}
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
                      setDuration(1460);
                    }}
                  />
                  <label htmlFor="year3">4 years</label>
                </div>
              </div>
            )}

            <button
              className="py-3 px-6 bg-gradient-to-r from-[#4E6BF4] to-[#0D47A1] w-full rounded flex justify-center items-center text-white mt-6"
              onClick={getTotalRewards}
            >
              Calculate Rewards
            </button>
          </div>
        </div>
        <div className="bg-white p-5  rounded-lg text-slate-600 md:col-span-2 shadow-sm flex flex-col justify-center text-center gap-2">
          <h2 className="text-lg text-[#1F242F]">Expected Rewards</h2>
          <p>You Will Receive(in {appName}):</p>
          <div>
            <p className="text-4xl my-2 text-[#0D47A1] ">{`${totalRewards.toLocaleString()}`}</p>
            <p className="text-[#0D47A1]">LIBRA</p>
            <p>After {duration ? duration : 0} days</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApyCalculator;

// yioSCXUsXCXejm1C
