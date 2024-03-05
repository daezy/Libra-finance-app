import React from "react";
import { FaHome, FaTelegramPlane } from "react-icons/fa";
import {
  FaBook,
  FaCalculator,
  FaCoins,
  FaMoneyBill1Wave,
  FaPiggyBank,
  FaTwitter,
} from "react-icons/fa6";

import { NavLink } from "react-router-dom";

interface propType {
  showSideBar: boolean;
}

const SideBar: React.FC<propType> = ({ showSideBar }) => {
  return (
    <div className="">
      <div
        className={`fixed shadow md:w-2/12 w-9/12 h-screen bg-white flex flex-col items-start p-3 z-30 ease-in-out duration-300 md:translate-x-0 ${
          showSideBar ? "translate-x-0 " : "-translate-x-full"
        }`}
      >
        <div className="brand">
          <a
            href="https://www.libra-finance.com"
            className="brand flex items-center justify-between ml-[-20px]"
          >
            <img src="./img/logo.png" width={70} alt="" />
            &nbsp;
            <h2 className="text-blue-800 tracking-widest self-center md:text-xl font-semibold whitespace-nowrap ml-[-20px] text-lg">
              LIBRA
            </h2>
          </a>
        </div>

        <div className="mt-5 border-b border-solid">
          <h2 className="text-lg text-[#3C3E43]">Menu</h2>
          <div className="links text-[#AEAEB1] my-2">
            <NavLink to="/" className="my-1 w-full inline-block pl-3">
              <span className="flex items-center gap-2 px-3 p-2 rounded-md">
                <FaHome /> Overview
              </span>
            </NavLink>
            <NavLink to="/bank" className="my-1 w-full inline-block pl-3">
              <span className="flex items-center gap-2 px-3 p-2 rounded-md">
                <FaPiggyBank /> Bank
              </span>
            </NavLink>
            <NavLink to="/stake" className="my-1 w-full  inline-block pl-3">
              <span className="flex items-center gap-2 rounded-md  p-2 px-3 ">
                <FaCoins /> Stake
              </span>
            </NavLink>
            <NavLink to="/revShare" className="my-1 w-full inline-block pl-3">
              <span className="flex items-center gap-2 rounded-md p-2 px-3">
                <FaMoneyBill1Wave /> AutoStake
              </span>
            </NavLink>
            <NavLink
              to="/apyCalculator"
              className="my-1 w-full inline-block pl-3"
            >
              <span className="flex items-center gap-2 rounded-md p-2 px-3">
                <FaCalculator /> Apy Calculator
              </span>
            </NavLink>
          </div>
        </div>
        <div className="absolute bottom-0 w-full right-0 p-4 text-xl text-[#0D47A1]">
          <div className="flex items-center justify-around">
            <a
              href="https://t.me/libraprotocolsol"
              className="hover:scale-125 transition-all"
            >
              <FaTelegramPlane />
            </a>
            <a
              href="https://twitter.com/librafinanceSol"
              className="hover:scale-125 transition-all"
            >
              <FaTwitter />
            </a>
            <a
              href="https://librafinance.gitbook.io/"
              className="hover:scale-125 transition-all"
            >
              <FaBook />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SideBar;
