import { BrowserRouter, Routes, Route } from "react-router-dom";
import MenuPage from "./pages/MenuPage";
import RestPage from "./pages/RestPage";
import WsPage from "./pages/WsPage";
import HttpPage from "./pages/HttpPage";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MenuPage />} />
          <Route path="/rest" element={<RestPage />} />
          <Route path="/ws" element={<WsPage />} />
          <Route path="/http" element={<HttpPage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
