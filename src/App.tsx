import "./App.css";
import { Routes, Route } from "react-router-dom";
import Stake from "./pages/Stake";
import Bank from "./pages/Bank";
import RevShare from "./components/RevShare/RevShare";
import ApyCalculator from "./components/ApyCalculator";
import OverView from "./components/OverView";
import { useState } from "react";
import Overlay from "./components/Overlay";
import SideBar from "./components/SideBar";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ErrorPopup from "./components/ErrorPopup";
import SuccessPopup from "./components/SuccessPopup";

const App = () => {
  const [sideBarOpen, setSideBarOpen] = useState<boolean>(false);

  const toggleSideBar = () => {
    setSideBarOpen((side) => !side);
  };
  return (
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

            <SuccessPopup />
            <ErrorPopup />

            <Footer />
          </div>
        </div>
      </div>
    </>
  );
};

export default App;
