import { useState } from "react";
import { CiSearch } from "react-icons/ci";
import { FiMenu } from "react-icons/fi";
export default function Topbar({ toggleSidebar, isOpen }) {
  const [search, setSearch] = useState("");

  return (
    <div className="flex items-center h-[12vh]">
      {!isOpen && (
        <div className="flex items-center ml-3">
          <button onClick={toggleSidebar} className="text-3xl ">
            <FiMenu />
          </button>
        </div>
      )}
      <div className="flex justify-center py-4 w-full">
        <div className="relative">
        <input
          type="text"
          className="md:w-[400px] w-[200px] max-md:text-xs max-md:py-2 rounded-full md:py-3 py-1 px-2"
          placeholder="Smart Search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <CiSearch className="absolute md:left-[360px] left-[160px] top-[-4px] bg-blue-700 cursor-pointer rounded-full md:w-[55px] w-[40px] md:h-[55px] h-[40px] p-3 text-white" />
        </div>
      </div>
      <div className="flex items-center mr-3">
      <img src="/Admin.png" alt="" className="rounded-full border object-contain md:w-[46px] w-[52px] h-[43px] bg-white" />
      </div>
    </div>
  );
}
