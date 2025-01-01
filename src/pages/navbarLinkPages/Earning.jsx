import React from "react";
import { HiMiniArrowTrendingUp } from "react-icons/hi2";
import { FaRegEye } from "react-icons/fa";
import { GoDotFill } from "react-icons/go";
import { FaArrowTrendDown } from "react-icons/fa6";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
export default function Earning() {
  return (
    <div className="p-4 h-[calc(100vh-12vh)] overflow-y-auto">
      {/* Cards */}
      <div className="grid xl:grid-cols-3 md:grid-cols-2 gap-4">
        <div className="p-4 bg-[#0065FF]  h-[150px] rounded-2xl text-white flex flex-col justify-between">
          <div className="flex justify-between">
            <h1 className="text-sm">This Month Earning</h1>
            <HiMiniArrowTrendingUp className="" size={22} />
          </div>
          <div className="flex justify-between mb-4 text-lg">
            <h1 className="font-bold">$1000</h1>
            <FaRegEye className="border w-[30px] h-[30px] p-1 text-black bg-white rounded-md" />
          </div>
        </div>
        <div className="p-4  h-[150px] rounded-2xl bg-white flex flex-col justify-between">
          <div className="flex justify-between">
            <h1 className="text-sm">Last Month Earning</h1>
            <HiMiniArrowTrendingUp className="" size={22} />
          </div>
          <div className="flex justify-between mb-4 text-lg">
            <h1 className="font-bold">$1000</h1>
            <FaRegEye className="border w-[30px] h-[30px] p-1 text-white bg-[#0065FF] rounded-md" />
          </div>
        </div>
        <div className="p-4 bg-white  h-[150px] rounded-2xl flex justify-between">
          <div>
            <h1 className="text-sm text-gray-400 pb-3">Statistics</h1>
            <div className="flex items-center pb-1">
              <GoDotFill className="text-[#0065FF]" />
              <h1 className="text-xs text-gray-400">Total Income</h1>
            </div>
            <div className="flex items-center">
              <GoDotFill className="text-blue-300" />
              <h1 className="text-xs text-gray-400">Total Commission</h1>
            </div>
          </div>
          <div className="w-[100px] h-[100px]">
            <CircularProgressbar
              value={60}
              strokeWidth={50}
              styles={buildStyles({
                strokeLinecap: "butt",
              })}
            />
          </div>
        </div>
      </div>

      {/* Graph */}
      <div className="bg-white rounded-2xl mt-4 p-2">
        <div className="flex items-center text-xs text-gray-400">
          <h1 className="pr-10 text-base text-black">Daily Earning</h1>
          <GoDotFill className="text-green-500" />
          <h1 className="pr-6">Total Income</h1>
          <GoDotFill className="text-[#0065FF]" />
          <h1>Commission</h1>
        </div>
        <div className="relative pt-8">
          <img src="/Vector 25.png" alt="" />
          <img src="/Vector 26.png" alt="" className="absolute top-12" />
          <img src="/Frame 92.png" alt="" />
        </div>
      </div>

      {/* Table */}
      <div className="mt-4 flex max-xl:flex-col justify-between gap-4">
        <div className="text-xs xl:w-[70%] bg-white p-2 rounded-2xl order-2 xl:order-1">
          <h1 className="pr-10 pb-3 text-base text-black">Payment History</h1>
          <table className="w-full">
            <thead>
              <tr className="text-xs rounded-full">
                <th className="w-[16%] text-center">Owner</th>
                <th className="w-[16%] text-center ">Price</th>
                <th className="w-[12%] text-center">User</th>
                <th className="w-[12%] text-center">Total</th>
                <th className="w-[12%] text-center">Owner Payout</th>
                <th className="w-[20%] text-center">Commission</th>
              </tr>
            </thead>
            <tbody>
              <tr className="text-sm  text-center border-b py-2">
                <td className="text-center w-[16%]">John Doe</td>
                <td className="text-center w-[16%]">$200</td>
                <td className="text-center w-[12%]">John Doe</td>
                <td className="text-center w-[12%]">$200</td>
                <td className="text-center w-[12%]">$200</td>
                <td className="text-center w-[20%]">$200</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="text-sm xl:w-[28%]  bg-white p-2 rounded-2xl flex flex-col justify-between h-[150px] order-1 xl:order-2" >
          <h1>Total Earning This Year</h1>
          <div className="flex items-center gap-1">
          <h1 className="font-bold text-lg">$100,000.01</h1>
          <FaArrowTrendDown className="rotate-90 text-green-500"/>
          </div>
          <h1>Last Year Earning :<span className="font-bold"> $100,000/02</span></h1>
        </div>
      </div>
    </div>
  );
}
