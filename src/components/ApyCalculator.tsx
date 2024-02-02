const ApyCalculator = () => {
  return (
    <div className="bg-slate-100 md:w-1/2 my-7 rounded-xl p-6">
      <h2 className="text-lg my-3 text-slate-800">Estimate Your Returns</h2>

      <div className="flex items-center gap-4 mb-3 justify-between">
        <label htmlFor="input-group-1 w-3/12">Amount</label>
        <div className="relative w-9/12 ">
          <input
            type="text"
            id="input-group-1"
            className="bg-gray-50 border text-gray-900 rounded-lg block w-full ps-7 p-2.5 focus:outline-none focus:border-0"
            placeholder="amount"
          />
          <div className="absolute inset-y-0 end-0 flex items-center pe-3.5 pointer-events-none text-slate-600">
            $LIBRA
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 my-2 justify-between">
        <label htmlFor="input-group-1 w-3/12">Starting Balance</label>
        <div className="relative w-9/12">
          <input
            type="text"
            id="input-group-1"
            className="bg-gray-50 border text-gray-900 rounded-lg block w-full ps-7 p-2.5 focus:outline-none focus:border-0"
            placeholder="amount"
          />
          <div className="absolute inset-y-0 end-0 flex items-center pe-3.5 pointer-events-none text-slate-600">
            $USD
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 my-2 justify-between">
        <label htmlFor="input-group-1 w-3/12">Price</label>
        <div className="relative w-9/12">
          <input
            type="text"
            id="input-group-1"
            className="bg-gray-50 border text-gray-900 rounded-lg block w-full ps-7 p-2.5 focus:outline-none focus:border-0"
            placeholder="amount"
          />
          <div className="absolute inset-y-0 end-0 flex items-center pe-3.5 pointer-events-none text-slate-600">
            $USD
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 my-2 justify-between">
        <label htmlFor="input-group-1 w-3/12">Days</label>
        <div className="relative w-9/12">
          <input
            type="text"
            id="input-group-1"
            className="bg-gray-50 border text-gray-900 rounded-lg block w-full ps-7 p-2.5 focus:outline-none focus:border-0"
          />
          <div className="absolute inset-y-0 end-0 flex items-center pe-3.5 pointer-events-none text-slate-600">
            Days
          </div>
        </div>
      </div>

      <h2 className="text-lg my-3 mt-5 text-slate-800">Results</h2>

      <div className="flex items-center gap-4 mb-3 justify-between">
        <label htmlFor="input-group-1 w-3/12">$Libra Balance</label>
        <div className="relative w-9/12">
          <input
            type="text"
            id="input-group-1"
            className="bg-gray-50 border text-gray-900 rounded-lg block w-full ps-7 p-2.5 focus:outline-none focus:border-0"
            placeholder="amount"
          />
          <div className="absolute inset-y-0 end-0 flex items-center pe-3.5 pointer-events-none text-slate-600">
            $LIBRA
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 my-2 justify-between">
        <label htmlFor="input-group-1 w-3/12">Total USD Balance</label>
        <div className="relative w-9/12">
          <input
            type="text"
            id="input-group-1"
            className="bg-gray-50 border text-gray-900 rounded-lg block w-full ps-7 p-2.5 focus:outline-none focus:border-0"
            placeholder="amount"
          />
          <div className="absolute inset-y-0 end-0 flex items-center pe-3.5 pointer-events-none text-slate-600">
            $USD
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApyCalculator;
