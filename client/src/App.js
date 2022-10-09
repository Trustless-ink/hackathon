import Home from "./pages/home/Home";
import NewProject from "./pages/newProjects/NewProject";
import "./app.scss";

import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <div className="app">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/newproject" element={<NewProject />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
