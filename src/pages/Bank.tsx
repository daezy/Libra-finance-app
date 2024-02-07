import { useState } from "react";
import { FaLock } from "react-icons/fa6";

const Bank = () => {
  const [days, setDays] = useState<number>(0);

  return (
    <div className="w-11/12 md:w-11/12 mx-auto mt-52 md:mt-40">
      <div className="grid gap-3 grid-cols-1 md:grid-cols-2">
        <div className="my-8  bg-slate-100 p-6  rounded-xl text-slate-600">
          <h2 className="text-3xl my-3 text-slate-950">What is Libra Bank?</h2>
          <p className="mb-1">
            - You lock LIBRA (any period from 1 day to 4 years) in the LIBRA
            Bank to receive xLIBRA token as a receipt. (Proportionally, the
            longer you lock, the more xLIBRA you will receive. A 4 year lock
            will give a 1:1 ratio of LIBRA to xLIBRA conversion.)
          </p>
          <p className="mb-1">
            - By just holding xLIBRA, everyday you get BUSD reward from 7% LIBRA
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

            <div className="right">
              <button className="text-slate-100 bg-violet-600 py-4 px-6 rounded-2xl hover:bg-violet-800 flex justify-between gap-3 items-center w-full md:w-fit">
                Approve LIBRA
              </button>
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
        </div>
      </div>
    </div>
  );
};

export default Bank;
