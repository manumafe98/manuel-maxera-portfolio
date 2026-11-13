import { Route, Routes } from "react-router-dom";
import { HomePage } from "./pages/HomePage";
import { MissingPage } from "./pages/MissingPage";

export const Portfolio = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="*" element={<MissingPage />}></Route>
    </Routes>
  );
};
