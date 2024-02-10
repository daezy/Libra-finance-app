import { useContext, useState } from "react";
import { FaWallet } from "react-icons/fa6";
import { NavLink } from "react-router-dom";
import { AppContext } from "../context/App-Context";
import { AppContextType } from "../types";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [dropOpen, setDropOpen] = useState<boolean>(false);
  const ctx = useContext<AppContextType>(AppContext);

  const toggleDropdown = () => {
    setDropOpen((drop) => !drop);
  };
  return (
    <>
      <nav className="bg-slate-900 fixed w-full top-0 z-10">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4 ">
          <a
            href="https://www.libra-finance.com"
            className="brand flex items-center justify-between ml-[-20px]"
          >
            <img src="./img/logo.png" width={80} alt="" />
            <h2 className="text-slate-100 tracking-widest self-center md:text-xl font-semibold whitespace-nowrap ml-[-20px] text-lg">
              LIBRA
            </h2>
          </a>
          <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse items-center">
            <div className="dropdown">
              <button
                className="text-slate-100 border border-solid border-violet-600 py-4 px-3 rounded-2xl  flex justify-between gap-3 items-center mr-3 capitalize"
                onClick={() => toggleDropdown()}
              >
                <img
                  src="./img/sol.png"
                  className="max-w-full"
                  width={27}
                  alt="sol"
                />{" "}
                {ctx.network && ctx.network}
              </button>
              <div
                  id="myDropdown"
                  className={`dropdown-content ${dropOpen ? "show" : ""}`}
              >
                <a
                    href="#"
                    onClick={() => {
                      ctx.setNetwork("localnet");
                      toggleDropdown();
                    }}
                >
                  Localnet
                </a>
                <a
                    href="#"
                    onClick={() => {
                      ctx.setNetwork("devnet");
                      toggleDropdown();
                    }}
                >
                  Devnet
                </a>
                <a
                    href="#"
                    onClick={() => {
                      ctx.setNetwork("mainnet");
                      toggleDropdown();
                    }}
                >
                  Mainnet
                </a>
              </div>
            </div>
            <button
                className="text-slate-100 bg-violet-600 py-4 px-6 rounded-2xl hover:bg-violet-800 flex justify-between gap-3 items-center"
                onClick={() => {
                  if (!ctx.isWalletConnected) {
                  return ctx.connectWallet();
                } else {
                  return ctx.disconnectWallet();
                }
              }}
            >
              <FaWallet />{" "}
              {ctx.isWalletConnected
                ? ctx.provider?.publicKey.toString().slice(0, 15)
                : "Connect Wallet"}
            </button>
            <button
              data-collapse-toggle="navbar-cta"
              type="button"
              className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
              aria-controls="navbar-cta"
              aria-expanded="false"
              onClick={() => setIsOpen((open) => !open)}
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className="w-5 h-5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 17 14"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M1 1h15M1 7h15M1 13h15"
                />
              </svg>
            </button>
          </div>
          <div
            className={`items-center justify-between ${
              isOpen ? "" : "hidden"
            } w-full md:flex md:w-auto md:order-1`}
            id="navbar-cta"
          >
            <ul className="flex flex-col gap-7 font-medium p-4 md:p-0 mt-4 border border-solid border-slate-400 rounded-lg md:border-0  md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0e bg-transparent text-white uppercase">
              <li>
                <NavLink to="/" className=" hover:text-violet-600 p-4 md:p-0">
                  App
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/stake"
                  className=" hover:text-violet-600 p-4 md:p-0"
                >
                  Stake
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/bank"
                  className=" hover:text-violet-600 p-4 md:p-0"
                >
                  Bank
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/revShare"
                  className=" hover:text-violet-600 p-4 md:p-0"
                >
                  Auto Stake
                </NavLink>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;