import { useContext, useState } from "react";
import { FaWallet } from "react-icons/fa6";
import { AppContext } from "../context/App-Context";
import { AppContextType } from "../types";

interface propType {
  handleSidebar: () => void;
}

const Navbar: React.FC<propType> = ({ handleSidebar }) => {
  const [dropOpen, setDropOpen] = useState<boolean>(false);
  const ctx = useContext<AppContextType>(AppContext);

  const toggleDropdown = () => {
    setDropOpen((drop) => !drop);
  };
  return (
    <>
      <nav className="bg-[#F6F9FF] shadow-sm w-full left-0 top-0 z-10 border-b border-solid border-[#7F9ECF4D]">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4 ">
          <a
            href="https://www.libra-finance.com"
            className="brand flex items-center justify-between ml-[-20px]"
          ></a>
          <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse items-center">
            <div className="dropdown">
              <button
                className="text-slate-800 border border-solid border-[#0D47A1] py-3 px-3 rounded  flex justify-between gap-3 items-center mr-3 capitalize"
                onClick={() => toggleDropdown()}
              >
                <img
                  src="./img/sol.png"
                  className="max-w-full"
                  width={27}
                  alt="sol"
                />{" "}
                <span className="hidden md:block">
                  {ctx.network && ctx.network}
                </span>
              </button>
              <div
                id="myDropdown"
                className={`dropdown-content ${dropOpen ? "show" : ""}`}
              >
                {/* <a
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
                </a> */}
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
              className="text-slate-100 bg-gradient-to-r from-[#4E6BF4] to-[#0D47A1] py-3 px-6 rounded hover:bg-blue-800 flex justify-between gap-3 items-center"
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
              onClick={handleSidebar}
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
        </div>
      </nav>
    </>
  );
};

export default Navbar;
