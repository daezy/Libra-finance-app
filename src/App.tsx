import {} from "react";
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
// import LiveSoon from "./components/LiveSoon";
// import Init from "./components/RevShare/Init";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        {/* <Route path="/" element={<MainApp />} /> */}
        <Route path="/" element={<Bank />} />
        <Route path="/bank" element={<Stake />} />
        <Route path="/revShare" element={<RevShare />} />
        {/*<Route path="/revShare/init" element={<Init />} />*/}
      </Routes>
      <SuccessPopup />
      <ErrorPopup />

      <Footer />
    </>
  );
}

export default App;
