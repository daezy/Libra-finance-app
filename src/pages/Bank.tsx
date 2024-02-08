const Bank = () => {
  return (
    <>
      <div className="w-11/12 md:w-11/12 mx-auto mt-52 md:mt-40">
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
                  <p>Balance: 0</p>
                </div>
              </div>

              <div className="right">
                <button className="text-slate-100 bg-violet-600 py-4 px-6 rounded-2xl hover:bg-violet-800 flex justify-between gap-3 items-center w-full md:w-fit">
                  Lock LIBRA
                </button>
              </div>
            </div>
            <h2 className="text-2xl text-slate-950 my-4">Deposit</h2>
            <div className="flex items-center gap-3">
              <label htmlFor="amount">Amount</label>
              <input
                type="number"
                id="amount"
                placeholder="*Enter Amount"
                className="py-2 px-4 w-full rounded-xl bg-opacity-45 bg-white border border-solid border-slate-500"
              />
            </div>
            <div className="my-3 flex justify-end">
              <button className="text-slate-100 bg-violet-600 py-4 px-6 rounded-2xl hover:bg-violet-800 flex justify-between gap-3 items-center">
                Deposit LIBRA
              </button>
            </div>
          </div>
          <div className="my-6  bg-slate-100 p-6  rounded-xl text-slate-600">
            <h2 className="text-lg text-slate-950 my-1">xLIBRA APY</h2>
            <p className="text-xl my-2 text-violet-500 ">
              543.27% (0.51% / day)
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
