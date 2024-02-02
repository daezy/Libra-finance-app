// import { useContext } from "react";

import ApyCalculator from "./ApyCalculator";

const MainApp = () => {
  return (
    <>
      <div className="w-11/12 md:w-11/12 mx-auto mt-52 md:mt-40">
        <div className="my-8  bg-slate-100 p-6  rounded-xl">
          <div className="grid gap-3 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            <div className="p-4">
              <h2 className="text-lg text-slate-500 my-1">Market Cap</h2>
              <p className="text-purple-600 text-2xl">$279,045</p>
            </div>
            <div className="p-4">
              <h2 className="text-lg text-slate-500 my-1">
                Libra Price (+0.13%)
              </h2>
              <p className="text-purple-600 text-2xl">$0.000001</p>
            </div>
            <div className="p-4">
              <h2 className="text-lg text-slate-500 my-1">Libra Price</h2>
              <p className="text-purple-600 text-2xl">$0.925766</p>
            </div>
            <div className="p-4 text-slate-900">
              <h2 className="text-lg text-slate-500 my-1">Total Burned</h2>
              <p className="text-2xl ">$70,036.48</p>
              <p>( 20.05% total supply )</p>
            </div>
            <div className="p-4 text-slate-900">
              <h2 className="text-lg text-slate-500 my-1">
                Total Locked In Libero Bank
              </h2>
              <p className="text-2xl ">$66,730.11</p>
              <p>( 23.89% total supply )</p>
            </div>
            <div className="p-4 text-slate-900">
              <h2 className="text-lg text-slate-500 my-1">
                Total Locked In Libera System
              </h2>
              <p className="text-2xl ">$2,253.14</p>
              <p>( 0.81% total supply )</p>
            </div>
            <div className="p-4">
              <h2 className="text-lg text-slate-500 my-1">Liquidity Value</h2>
              <p className=" text-2xl">$4,148.22</p>
            </div>
            <div className="p-4">
              <h2 className="text-lg text-slate-500 my-1">Backed Liquidity</h2>
              <p className="text-purple-600 text-2xl">225,358.21%</p>
            </div>
            <div className="p-4">
              <h2 className="text-lg text-slate-500 my-1">Farming Profit</h2>
              <p className="text-2xl">$0</p>
            </div>
            <div className="p-4">
              <h2 className="text-lg text-slate-500 my-1">24h Volume</h2>
              <p className="text-2xl">$0.43</p>
            </div>
            <div className="p-4">
              <h2 className="text-lg text-slate-500 my-1">Total Holders</h2>
              <p className="text-2xl">130,774</p>
            </div>
            <div className="p-4">
              <h2 className="text-lg text-slate-500 my-1">Next Reward</h2>
              <p className="text-2xl">130,774</p>
            </div>
          </div>
        </div>

        <div className="grid gap-3 grid-cols-1 md:grid-cols-3">
          <div className="p-6 bg-slate-100 rounded-xl">
            <h2 className="text-lg text-slate-500 my-1">
              Marketing & Development Treasury
            </h2>
            <p className="text-2xl">
              <span className="text-purple-600 ">$759,044.27</span> ( 248 SOL )
            </p>
          </div>
          <div className="p-6 bg-slate-100 rounded-xl">
            <h2 className="text-lg text-slate-500 my-1">
              Libra Insurance Treasury
            </h2>
            <p className="text-purple-600 text-2xl">$3,920,000.19</p>
          </div>
          <div className="p-6 bg-slate-100 rounded-xl">
            <h2 className="text-lg text-slate-500 my-1">
              Total $BUSD Rewarded
            </h2>
            <p className="text-purple-600 text-2xl">$3,300,511.28</p>
          </div>
        </div>

        <ApyCalculator />
      </div>
    </>
  );
};

export default MainApp;
