import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Star from "./pages/star";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Star />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
