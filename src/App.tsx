import "./App.css";
import { Routes, Route } from "react-router-dom";
import Stake from "./pages/Stake";
import Bank from "./pages/Bank";
import RevShare from "./components/RevShare/RevShare";
import ApyCalculator from "./components/ApyCalculator";
import OverView from "./components/OverView";
import { useState, useEffect, useContext } from "react";
import Overlay from "./components/Overlay";
import SideBar from "./components/SideBar";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import AOS from "aos";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "aos/dist/aos.css";

import { AppContext } from "./context/App-Context";
import Preloader from "./components/Preloader";

const App = () => {
  AOS.init({ duration: 700 });
  const ctx = useContext(AppContext);
  const [loading, setLoading] = useState<boolean>(true);

  const [sideBarOpen, setSideBarOpen] = useState<boolean>(false);

  const toggleSideBar = () => {
    setSideBarOpen((side) => !side);
  };

  useEffect(() => {
    const delay = setTimeout(() => {
      setLoading(false);
    }, 3000);

    return () => clearTimeout(delay);
  }, []);

  useEffect(() => {
    if (ctx.errorMsg) {
      toast.error(ctx.errorMsg, {
        position: "bottom-right",
      });
    } else if (ctx.successMsg) {
      toast.success(ctx.successMsg, {
        position: "bottom-right",
      });
    }
  }, [ctx.errorMsg, ctx.successMsg]);

  {
    return loading ? (
      <Preloader />
    ) : (
      <>
        {sideBarOpen && <Overlay handleSidebar={toggleSideBar} />}
        <div className="flex flex-col md:flex-row">
          <div className="md:w-2/12 w-full relative block">
            <SideBar showSideBar={sideBarOpen} />
          </div>
          <div className="md:w-10/12">
            <Navbar handleSidebar={toggleSideBar} />
            <div className="">
              <Routes>
                <Route path="/" element={<OverView />} />
                <Route path="/bank" element={<Stake />} />
                <Route path="/stake" element={<Bank />} />
                <Route path="/revShare" element={<RevShare />} />
                <Route path="/apyCalculator" element={<ApyCalculator />} />
              </Routes>

              <ToastContainer position="bottom-right" />
              {/* <SuccessPopup />
            <ErrorPopup /> */}

              <Footer />
            </div>
          </div>
        </div>
      </>
    );
  }
};

export default App;
