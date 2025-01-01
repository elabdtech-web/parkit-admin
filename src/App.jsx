import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/auth/Login";
import ForgetPassword from "./pages/auth/ForgetPassword";
import Layout from "./layout/Layout";
import Dashboard from "./pages/navbarLinkPages/Dashboard";
import Booking from "./pages/navbarLinkPages/Booking";
import Users from "./pages/navbarLinkPages/users/Users";
import UserDetails from "./pages/navbarLinkPages/users/UserDetails";
import Owners from "./pages/navbarLinkPages/owners/Owners";
import OwnerDetails from "./pages/navbarLinkPages/owners/OwnerDetails";
import Earning from "./pages/navbarLinkPages/Earning";
import Settings from "./pages/navbarLinkPages/Settings";
import ParkingSpace from "./pages/navbarLinkPages/ParkingSpace";
import ErrorPage from "./pages/errorPage/ErrorPage";

export default function App() {
  return (
    <div className="App bg-[#E1E1E1] font-sora">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/forgetPassword" element={<ForgetPassword />} />
          <Route path="/dashboard" element={<Layout/>} >
            <Route index element={<Dashboard/>} />
            <Route path="booking" element={<Booking/>} />
            <Route path="users" element={<Users/>} >
              <Route path=":id" element={<UserDetails/>} />
            </Route>
            <Route path="owners" element={<Owners/>} >
              <Route path=":id" element={<OwnerDetails/>} />
            </Route>
            <Route path="earning" element={<Earning/>} />
            <Route path="settings" element={<Settings/>} />
            <Route path="parkingSpace" element={<ParkingSpace/>} />
          </Route>
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}
