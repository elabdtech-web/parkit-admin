import { TfiMenuAlt } from "react-icons/tfi";
import { PiNotepadLight, PiUser, PiMoneyLight } from "react-icons/pi";
import { LuUsersRound } from "react-icons/lu";
import { CiParking1 } from "react-icons/ci";
import { IoSettingsOutline } from "react-icons/io5";
import { FiLogOut } from "react-icons/fi";
import { RiCloseLargeLine } from "react-icons/ri";
import { useNavigate, NavLink } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase/FirebaseConfig";

export default function Navbar({ toggleNavbar, isOpen }) {
  const navigate = useNavigate();

  const handleLogin = () => {
    signOut(auth);
    navigate("/");
  };

  return (
    <div
      className={`md:relative h-[97vh] rounded-3xl m-2 bg-white flex flex-col justify-between transform ${
        isOpen ? "translate-x-0" : "-translate-x-[110%]"
      } transition-transform duration-300 ease-in-out z-50 w-70 fixed`}
    >
      <div>
        <div className="p-4 flex justify-between items-center">
          <img src="/Frame 2.png" alt="" className=" w-[50%]" />
          <RiCloseLargeLine className="cursor-pointer" onClick={toggleNavbar} />
        </div>
        <div className="border"></div>
        <div className="mt-5 p-4">
          <h6 className="text-[#999999] text-xs">Menu</h6>
          <div className="mt-2">
            <ul className="flex flex-col gap-3">
              <li className=" ">
                <NavLink to="/dashboard" end>
                  <div className="flex gap-2 items-center text-xl">
                    <TfiMenuAlt className="" />
                    <p>Dashboard</p>
                  </div>
                </NavLink>
              </li>
              <li className="">
                <NavLink to="/dashboard/booking">
                <div className="flex gap-2 items-center text-xl">
                  <PiNotepadLight />
                  <p>Booking</p>
                </div>
                </NavLink>
              </li>
              <li className="">
                <NavLink to="/dashboard/users">
                <div className="flex gap-2 items-center text-xl">
                  <PiUser />
                  <p>Users</p>
                </div>
                </NavLink>
              </li>
              <li className="">
                <NavLink to="/dashboard/owners"> 
                <div className="flex gap-2 items-center text-xl">
                  <LuUsersRound />
                  <p>Owners</p>
                </div>
                </NavLink>
              </li>
              <li className="">
                <NavLink to="/dashboard/parkingSpace">
                <div className="flex gap-2 items-center text-xl">
                  <CiParking1 />
                  <p>Parking Space</p>
                </div>
                </NavLink>
              </li>
              <li className="">
                <NavLink to="/dashboard/earning">
                <div className="flex gap-2 items-center text-xl">
                  <PiMoneyLight />
                  <p>Earning</p>
                </div>
                </NavLink>
              </li>
              <li className="">
                <NavLink to="/dashboard/settings">
                <div className="flex gap-2 items-center text-xl">
                  <IoSettingsOutline />
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
