import { useState } from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
// import MainApp from "./components/MainApp";
import { Routes, Route } from "react-router-dom";
import Stake from "./pages/Stake";
import Bank from "./pages/Bank";
import SuccessPopup from "./components/SuccessPopup";
import ErrorPopup from "./components/ErrorPopup";
import RevShare from "./components/RevShare/RevShare";
import SideBar from "./components/SideBar";
import Overlay from "./components/Overlay";
// import LiveSoon from "./components/LiveSoon";
// import Init from "./components/RevShare/Init";

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
              {/* <Route path="/" element={<MainApp />} /> */}
              <Route path="/" element={<Stake />} />
              <Route path="/stake" element={<Bank />} />
              <Route path="/revShare" element={<RevShare />} />
              {/*<Route path="/revShare/init" element={<Init />} />*/}
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
