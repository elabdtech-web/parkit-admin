import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/auth/Login";
import ForgetPassword from "./pages/auth/ForgetPassword";
import Layout from "./layout/Layout";
import Home from "./pages/home/Home";


export default function App() {
  return (
    <div className="App bg-[#E1E1E1] ">
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/forgetPassword" element={<ForgetPassword />} />
          <Route element={<Layout/>} >
            <Route path="/" element={<Home/>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}
