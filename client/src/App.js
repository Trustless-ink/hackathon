import Home from "./pages/home/Home";
import NewProject from "./pages/NewProject";
import FundProject from "./pages/FundProject";

import "./app.scss";

import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <div className="app">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/newproject" element={<NewProject />} />
          <Route path="/fundproject" element={<FundProject />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
