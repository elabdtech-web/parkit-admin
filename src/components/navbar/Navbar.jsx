import { useState } from "react";
import { TfiMenuAlt } from "react-icons/tfi";
import { PiNotepadLight, PiUser, PiMoneyLight } from "react-icons/pi";
import { LuUsersRound } from "react-icons/lu";
import { CiParking1 } from "react-icons/ci";
import { IoSettingsOutline } from "react-icons/io5";
import { MdRequestPage } from "react-icons/md";
import { FiLogOut } from "react-icons/fi";
import { RiCloseLargeLine } from "react-icons/ri";
import { useNavigate, NavLink } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase/FirebaseConfig";

export default function Navbar({ toggleNavbar, isOpen }) {
  const navigate = useNavigate();
  const [stepsValue, setStepsValue] = useState("dashboard");

  const handleLogin = () => {
    signOut(auth);
    navigate("/login");
  };

  return (
    <div
      className={`lg:relative h-[97vh] rounded-3xl m-2 bg-white flex flex-col justify-between transform ${
        isOpen ? "translate-x-0" : "-translate-x-[110%]"
      } transition-transform duration-300 ease-in-out z-50 w-[250px] fixed`}
    >
      <div>
        <div className="p-4 flex justify-between items-center">
          <img src="/Admin.png" alt="" className=" w-[100px] mx-auto" />
          <RiCloseLargeLine className="cursor-pointer lg:hidden" onClick={toggleNavbar} />
        </div>
        <div className="border"></div>
        <div className="mt-5 pl-4 pt-4">
          <h6 className="text-[#999999] text-xs">Menu</h6>
          <div className="mt-2">
            <ul className="flex flex-col gap-3">
              <li className="">
                <NavLink to="/admin/dashboard" end>
                  <div className="flex gap-2 items-center text-xl" onClick={() => setStepsValue("dashboard")}>
                    <TfiMenuAlt className={`${stepsValue === "dashboard" ? "text-black" : "text-gray-400"}`}/>
                    <p>Dashboard</p>
                  </div>
                </NavLink>
              </li>
              <li className="">
                <NavLink to="/admin/booking">
                <div className="flex gap-2 items-center text-xl" onClick={() => setStepsValue("booking")}>
                  <PiNotepadLight className={`${stepsValue === "booking" ? "text-black" : "text-gray-400"}`}/>
                  <p>Booking</p>
                </div>
                </NavLink>
              </li>
              <li className="">
                <NavLink to="/admin/users">
                <div className="flex gap-2 items-center text-xl" onClick={() => setStepsValue("users")}>
                  <PiUser className={`${stepsValue === "users" ? "text-black" : "text-gray-400"}`}/>
                  <p>Users</p>
                </div>
                </NavLink>
              </li>
              <li className="">
                <NavLink to="/admin/owners"> 
                <div className="flex gap-2 items-center text-xl" onClick={() => setStepsValue("owners")}>
                  <LuUsersRound className={`${stepsValue === "owners" ? "text-black" : "text-gray-400"}`}/>
                  <p>Owners</p>
                </div>
                </NavLink>
              </li>
              <li className="">
                <NavLink to="/admin/parkingSpace">
                <div className="flex gap-2 items-center text-xl" onClick={() => setStepsValue("parkingSpace")}>
                  <CiParking1 className={`${stepsValue === "parkingSpace" ? "text-black" : "text-gray-400"}`}/>
                  <p>Parking Space</p>
                </div>
                </NavLink>
              </li>
              <li className="">
                <NavLink to="/admin/earning">
                <div className="flex gap-2 items-center text-xl" onClick={() => setStepsValue("earning")}>
                  <PiMoneyLight className={`${stepsValue === "earning" ? "text-black" : "text-gray-400"}`}/>
                  <p>Earning</p>
                </div>
                </NavLink>
              </li>
              <li className="">
                <NavLink to="/admin/payoutRequests">
                <div className="flex gap-2 items-center text-xl" onClick={() => setStepsValue("payoutRequests")}>
                  <MdRequestPage className={`${stepsValue === "payoutRequests" ? "text-black" : "text-gray-400"}`}/>
                  <p>Payout Requests</p>
                </div>
                </NavLink>
              </li>
              <li className="">
                <NavLink to="/admin/settings">
                <div className="flex gap-2 items-center text-xl" onClick={() => setStepsValue("settings")}>
                  <IoSettingsOutline className={`${stepsValue === "settings" ? "text-black" : "text-gray-400"}`}/>
                  <p>Settings</p>
                </div>
                </NavLink>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div
        className="flex gap-2 items-center justify-center text-xl m-4 py-2 text-[#E50000] rounded-full bg-gray-100 cursor-pointer"
        onClick={() => {
          handleLogin();
        }}
      >
        <FiLogOut />
        Login
      </div>
    </div>
  );
}
