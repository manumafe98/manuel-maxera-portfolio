import React from "react";
import ReactDOM from "react-dom/client";
import { Portfolio } from "./Portfolio";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
    <BrowserRouter>
      <Routes>
        <Route path="/*" element={<Portfolio/>}/>
      </Routes>
    </BrowserRouter>
)
