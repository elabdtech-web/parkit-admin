import { useState } from "react";
import { CiSearch } from "react-icons/ci";
export default function Topbar() {
  const [search, setSearch] = useState("");

  return (
    <div className="flex h-[12vh]">
      <div className="flex justify-center py-4 w-full">
        <div className="relative">
        <input
          type="text"
          className="md:w-[400px] w-[200px] rounded-full md:py-3 py-1 px-2"
          placeholder="Search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <CiSearch className="absolute md:left-[360px] left-[160px] top-[-4px] bg-blue-700 cursor-pointer rounded-full md:w-[55px] w-[40px] md:h-[55px] h-[40px] p-3 text-white" />
        </div>
      </div>
      <div className="flex items-center mr-3">
      <img src="/Frame 2.png" alt="" className="rounded-full border object-contain md:w-[46px] w-[52px] h-[43px] bg-white" />
      </div>
    </div>
  );
}
