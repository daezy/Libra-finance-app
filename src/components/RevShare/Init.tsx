import { useContext, useState } from "react";
import { AppContext } from "../../context/App-Context";

const Init = () => {
  const [amount, setAmount] = useState<string>("");
  const [minimumTokenBalance, setMinimumTokenBalance] = useState<string>("");

  const ctx = useContext(AppContext);

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
  };
  return (
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
  );
};

export default Init;
