import { useContext } from "react";
import { AppContext } from "../../context/App-Context";
import {
  AiOutlineSecurityScan,
  AiOutlineClockCircle,
  AiOutlineHeatMap,
} from "react-icons/ai";
import Init from "./Init";

const RevShare = () => {
  const ctx = useContext(AppContext);

  return (
    <div className="w-11/12 md:w-11/12 mx-auto mt-52 md:mt-40">
      <div className="grid gap-5 grid-cols-1 md:grid-cols-2">
        <Init />

        <div className="my-6  bg-slate-100 p-6  rounded-xl">
          <h2 className="font-bold tracking-wider">AUTO STAKE</h2>
          <div className="p-6 text-center text-slate-600">
            <p>You must hold at least $LIBRA to claim</p>
          </div>

          <div id="details" className="">
            <ul className="text-slate-700">
              <li className="flex items-center justify-between p-3 mb-1">
                <span className="flex items-center">
                  <AiOutlineSecurityScan /> &nbsp; Pool total
                </span>
                <span>0 SOL</span>
              </li>
              <li className="flex items-center justify-between p-3 mb-1">
                <span className="flex items-center">
                  <AiOutlineHeatMap /> &nbsp; Next Share Total
                </span>
                <span>0 SOL</span>
              </li>
              <li className="flex items-center justify-between p-3 mb-1">
                <span className="flex items-center">
                  <AiOutlineClockCircle /> &nbsp; Next Share Unlock
                </span>
                <span>3344</span>
              </li>
              <li className="flex items-center justify-between p-3 mb-1">
                <span>$LIBRA Balance</span>
                <span>0 $CEX</span>
              </li>
              <li className="flex items-center justify-between p-3 mb-1">
                <span>SOL Balance</span>
                <span>0 SOL</span>
              </li>
            </ul>
          </div>

          <button
            className="w-full text-center text-slate-100 bg-violet-600  hover:bg-violet-800 py-3 rounded-lg disabled:bg-slate-400"
            disabled={!ctx.isWalletConnected}
          >
            Claim
          </button>
        </div>
      </div>
    </div>
  );
};

export default RevShare;
