import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { AppContextProvider } from "./context/App-Context.tsx";
import { RevenueContextProvider } from "./components/RevShare/context/Revenue-Context.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AppContextProvider>
      <RevenueContextProvider>
        {" "}
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </RevenueContextProvider>
    </AppContextProvider>
  </React.StrictMode>
);
