import { useContext, useState } from "react";
import { FaLock, FaSpinner } from "react-icons/fa6";
import { AppContext } from "../context/App-Context";
import { performStake, performUnStake } from "../solana/services.ts";

const Stake = () => {
  const [days, setDays] = useState<number>(0);
  const [libraAmount, setLibraAmount] = useState<number>(0);

  const ctx = useContext(AppContext);

  const handleStake = async () => {
    ctx.setLoading(true);
    if (ctx.connection && ctx.provider && ctx.tokenAccount) {
      try {
        const duration = days * 60 * 60;
        await performStake(
            ctx.connection,
            ctx.provider,
            libraAmount,
            duration,
            ctx.tokenAccount.address
        );
        ctx.setSuccess('Stake Success 🚀✅')
      } catch (e) {
        console.log(e)
        ctx.setError('An Error Occurred while staking..')
      }
    } else {
      ctx.setError('Unable to perform stake..')
    }
    ctx.setLoading(false);
  }

  const handleUnstake = async () => {
    ctx.setLoading(true);
    if (ctx.connection && ctx.provider && ctx.tokenAccount) {
      try {
        await performUnStake(
            ctx.connection,
            ctx.provider,
            ctx.tokenAccount.address
        );
        ctx.setSuccess('Stake Success 🚀✅')
      } catch (e) {
        console.log(e)
        ctx.setError('An Error Occurred while un-staking..')
      }
    } else {
      ctx.setError('Unable to perform un-stake..')
    }
    ctx.setLoading(false);
  }

  return (
    <div className="w-11/12 md:w-11/12 mx-auto mt-52 md:mt-40">
      <div className="grid gap-3 grid-cols-1 md:grid-cols-2">
        <div className="my-8  bg-slate-100 p-6  rounded-xl text-slate-600">
          <h2 className="text-3xl my-3 text-slate-950">What is Libra Bank?</h2>
          <p className="mb-1">
            - You lock LIBRA (any period from 1 day to 4 years) in the LIBRA
            Stake to receive xLIBRA token as a receipt. (Proportionally, the
            longer you lock, the more xLIBRA you will receive. A 4 year lock
            will give a 1:1 ratio of LIBRA to xLIBRA conversion.)
          </p>
          <p className="mb-1">
            - By just holding xLIBRA, everyday you get USDC reward from 7% LIBRA
            trading volume, plus 0.51% LIBRA interest (auto-compound to 543.27%
            APY for you). You will get back your locked amount after 136 days if
            you lock for 4 years.
          </p>
          <p className="mb-1">
            - xLIBRA holders will receive other benefit such as
            multichain-farming profits in the future
          </p>
          <p className="mb-1">
            - xLIBRA holders can vote in LIBRA DAO governance for important
            factor such as transaction tax change...
          </p>
          <p className="mb-1">
            - You can unlock xLIBRA before time but 90% of your locked LIBRA
            will go to current xLIBRA holders.
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
                <p>Balance: 0</p>
              </div>
            </div>

            <div className="right flex justify-center gap-1 flex-col">
              <label htmlFor="libraamout">Enter Libra Amount to lock</label>
              <input
                type="number"
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
              <p>Lock until: Sun Feb 06 2028 15:52:33</p>
              <p>1 LIBRA locked for 4 years = 1.00 xLIBRA</p>
              <p>1 LIBRA locked for 3 years = 0.75 xLIBRA</p>
              <p>1 LIBRA locked for 2 years = 0.50 xLIBRA</p>
              <p>1 LIBRA locked for 1 years = 0.25 xLIBRA</p>
            </div>
          </div>
          <div className="my-3">
            <button
              className="text-slate-100 mx-auto bg-violet-600 py-4 px-6 rounded-2xl hover:bg-violet-800 flex justify-between gap-3 items-center"
              disabled={ctx.loading}
              onClick={handleStake}
            >
              {ctx.loading ? <FaSpinner className="animate-spin" /> : "Submit"}
            </button>
          </div>
          <p>
            - You need to lock a minimum amount of 0 LIBRA <br />
            - You can lock maximum Unlimited LIBRA <br />- Early unlock penalty
            fee is 99.999%
          </p>
        </div>
      </div>
      <div className="bg-slate-100 p-6  rounded-xl text-slate-600">
        <p className="text-lg">Your shares / Total reward:</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
        <div className="bg-slate-100 p-6  rounded-xl text-slate-600  flex items-center gap-2">
          <img src="./img/logo.png" width={70} alt="" />
          <div className="flex flex-col gap-1">
            <h3 className="text-slate-950 text-lg">Total $LIBRA Rewarded</h3>
            <p>80,248,487,081.34($66,913.34)</p>
          </div>
        </div>
        <div className="bg-slate-100 p-6  rounded-xl text-slate-600 flex items-center gap-2">
          <img src="./img/logo.png" width={70} alt="" />
          <div className="flex flex-col gap-1">
            <h3 className="text-slate-950 text-lg">Total $USDC Rewarded</h3>
            <p>3,300,511.28</p>
          </div>
        </div>
        <div className="bg-slate-100 p-6  rounded-xl text-slate-600  flex items-center gap-2">
          <img src="./img/logo.png" width={70} alt="" />
          <div className="flex flex-col gap-1">
            <h3 className="text-slate-950 text-lg">LIBRA Locked</h3>
            <p>81,311,042,800.5($67,799.32)</p>
          </div>
        </div>
        <div className="bg-slate-100 p-6  rounded-xl text-slate-600 flex items-center gap-2">
          <img src="./img/logo.png" width={70} alt="" />
          <div className="flex flex-col gap-1">
            <h3 className="text-slate-950 text-lg">xLIBRA in circulation</h3>
            <p>7,616,109,466.7</p>
          </div>
        </div>
        <div className="bg-slate-100 p-6  rounded-xl text-slate-600 flex items-center gap-2">
          <img src="./img/logo.png" width={70} alt="" />
          <div className="flex flex-col gap-1">
            <h3 className="text-slate-950 text-lg">Average Lock Time</h3>
            <p>136.75 Days</p>
          </div>
        </div>
      </div>

      <h1 className="mt-7 text-3xl text-slate-950">Your Rewards</h1>
      <div className="grid gap-3 grid-cols-1 md:grid-cols-2">
        <div className="my-3  bg-slate-100 p-6  rounded-xl text-slate-600">
          <h2 className="text-lg text-slate-950 my-1">Your LIBRA Locked</h2>
          <p className="text-xl my-2 text-violet-500 ">
            0 LIBRA <span className="text-slate-500">($0)</span>
          </p>

          <h2 className="text-lg text-slate-950 my-1">Your xLIBRA Balance</h2>
          <p className="text-xl my-2 text-violet-500">0 xLIBRA</p>

          <h2 className="text-lg text-slate-950 my-1">
            Your total rewards in USDC
          </h2>
          <p className="text-xl my-2 text-violet-500">$0</p>
        </div>

        <div className="my-3  bg-slate-100 p-6  rounded-xl text-slate-600">
          <h2 className="text-lg text-slate-950 my-1">xLIBRA APY</h2>
          <p className="text-xl my-2 text-violet-500 ">543.27% (0.51% / day)</p>
          <p className="mb-2">
            (You will get back 100% your locked LIBRA amount after 136 days if
            you lock for 4 years)
          </p>

          <h2 className="text-lg text-slate-950 my-1">USDC APY</h2>
          <p className="text-xl my-2 text-violet-500">815.27% (2.23% / day)</p>

          <h2 className="text-lg text-slate-950 my-1">Next Reward</h2>
          <p className="text-xl my-2 text-violet-500">0:0:0</p>
        </div>

        <div className="my-1 bg-slate-100 p-6  rounded-xl text-slate-600">
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div>
              <h2 className="text-lg text-slate-950 my-1">
                Total $LIBRA Reward
              </h2>
              <p className="text-xl my-2 text-violet-500">0 LIBRA($0)</p>
            </div>
            <div>
              <h2 className="text-lg text-slate-950 my-1">
                Total $USDC Reward
              </h2>
              <p className="text-xl my-2 text-violet-500">$0</p>
            </div>
          </div>
          <br />
          <div className="grid grid-cols-1 md:grid-cols-2">
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
          </div>
          <br />

          <div className="grid grid-cols-1 md:grid-cols-2">
            <div>
              <h2 className="text-lg text-slate-950 my-1">
                Pending $USDC Reward
              </h2>
              <p className="text-xl my-2 text-violet-500">$0</p>
            </div>
            <div className="flex justify-end items-center">
              <button className="text-slate-100 bg-violet-600 py-4 px-6 rounded-2xl hover:bg-violet-800 flex justify-between gap-3 items-center">
                Claim $USDC
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Stake;
