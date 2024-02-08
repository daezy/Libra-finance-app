import {} from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import MainApp from "./components/MainApp";
import { Routes, Route } from "react-router-dom";
import Stake from "./pages/Stake";
import Bank from "./pages/Bank";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<MainApp />} />
        <Route path="/bank" element={<Bank />} />
        <Route path="/stake" element={<Stake />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
