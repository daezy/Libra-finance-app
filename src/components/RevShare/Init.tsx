import { useContext, useState } from "react";
import RevenueContext from "./context/Revenue-Context";

const Init = () => {
  const [amount, setAmount] = useState<string>("");
  const [minimumTokenBalance, setMinimumTokenBalance] = useState<string>("");

  const ctx = useContext(RevenueContext);
  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (amount && minimumTokenBalance) {
      ctx.handleInit(parseFloat(amount), parseFloat(minimumTokenBalance));
    }
  };
  return (
    <div className="w-11/12 md:w-11/12 mx-auto mt-52 md:mt-40">
      {" "}
      <div className="my-6  bg-slate-100 p-6  rounded-xl">
        <form action="" onSubmit={handleSubmit}>
          <input
            type="number"
            value={amount}
            placeholder="Enter amount of sol to deposit per period*"
            className="w-full py-3 px-4 my-5 rounded-lg"
            onChange={(e) => setAmount(e.target.value)}
          />
          <input
            type="number"
            value={minimumTokenBalance}
            placeholder="Enter minimum token balance for claim*"
            className="w-full py-3 px-4 my-5 rounded-lg"
            onChange={(e) => setMinimumTokenBalance(e.target.value)}
          />
          <button
            className="w-full text-center text-slate-100 bg-violet-600  hover:bg-violet-800 py-3 rounded-lg disabled:bg-slate-400"
            disabled={!ctx.isWalletConnected || !amount || !minimumTokenBalance}
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default Init;
