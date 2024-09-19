import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Chatroom from "./components/Chatroom";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/chat" element={<Chatroom />} />
      </Routes>
    </BrowserRouter>
  );
}
