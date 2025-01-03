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
import PayoutRequests from "./pages/navbarLinkPages/PayoutRequests";
import ErrorPage from "./pages/errorPage/ErrorPage";
import LandingPage from "./pages/landingPage/LandingPage";

export default function App() {
  return (
    <div className="App bg-[#E1E1E1] font-sora h-screen">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgetPassword" element={<ForgetPassword />} />
          <Route path="/admin" element={<Layout/>} >
            <Route path="dashboard" element={<Dashboard/>} />
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
            <Route path="payoutRequests" element={<PayoutRequests/>} />
          </Route>
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}
