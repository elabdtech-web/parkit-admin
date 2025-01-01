import { useState } from "react";

export default function UserDetails() {
    const [stepsValue,setStepsValue] = useState("pending")
  
      {/* Dummy Data */}
    const data = [
      {
        id: 1,
        BookingID: "1234",
        Price: "$200",
        User: "John Doe",
        Date: "2023-01-01",
        Duration: "2 hours",
        Time: "10:00 AM",
        Parking_Area: "A1",
        Parking_Slot: "1",
        Owner: "John Doe",
        Status: "Pending",
      },
      {
        id: 2,
        BookingID: "1234",
        Price: "$200",
        User: "John Doe",
        Date: "2023-01-01",
        Duration: "2 hours",
        Time: "10:00 AM",
        Parking_Area: "A1",
        Parking_Slot: "1",
        Owner: "John Doe",
        Status: "View Review",
      },
    ];
  
    const filteredData = data.filter((item) =>
      stepsValue === "pending"
        ? item.Status === "Pending"
        : stepsValue === "confirmed"
        ? item.Status === "Confirmed"
        : stepsValue === "cancelled"
        ? item.Status === "Cancelled"
        : stepsValue === "completed"
        ? item.Status === "View Review"
        : true
    );

  return (
    <div className="p-4 ">
      <div className="bg-white p-4 rounded-2xl flex items-center justify-between h-[150px]">
        <img src="/Frame 1.png" alt="" className="border rounded-full object-contain w-[100px] h-[100px]"/>
        <div className="">
          <h1 className="text-sm">Username</h1>
          <h1 className="text-sm">zz</h1>
          <h1 className="text-sm">Active Bookings</h1>
          <h1 className="text-sm"></h1>
        </div>
        <div className="">
          <h1 className="text-sm">Email</h1>
          <h1 className="text-sm">zzzz</h1>
          <h1 className="text-sm">Cancelled Bookings</h1>
          <h1 className="text-sm"></h1>
        </div>
        <div className="">
          <h1 className="text-sm">Username</h1>
          <h1 className="text-sm">zzz</h1>
          <h1 className="text-sm">Active Bookings</h1>
          <h1 className="text-sm"></h1>
        </div>
        <div className="text-sm text-white">
          <button className="bg-[#0066FF] px-4 py-1 rounded-full">Deactivate</button>
          <button className="bg-black px-2 py-1 rounded-full">Block</button>
          <button className="bg-black px-2 py-1 rounded-full">Edit</button>
        </div>
      </div>

      <div className="mt-4">
        <table className="w-full rounded-2xl bg-white  overflow-x-auto max-[1350px]:overflow-x-scroll">
          {/* Table Header */}
          <thead>
            <tr className="flex gap-4 items-center px-4 w-full text-md  my-4">
                <button className={`hover:bg-[#006CE3] hover:text-white px-3 py-1 rounded-full cursor-pointer ${stepsValue=== "pending" ? "bg-[#006CE3] text-white" : ""}`}  onClick={()=>{setStepsValue("pending")}}>Pending</button>
                <button className={`hover:bg-[#006CE3] hover:text-white px-3 py-1 rounded-full cursor-pointer ${stepsValue=== "confirmed" ? "bg-[#006CE3] text-white" : ""}`}   onClick={()=>{setStepsValue("confirmed")}}>Confirmed</button>
                <button className={`hover:bg-[#006CE3] hover:text-white px-3 py-1 rounded-full cursor-pointer ${stepsValue=== "cancelled" ?"bg-[#006CE3] text-white" : ""}`}   onClick={()=>{setStepsValue("cancelled")}}>Cancelled</button>
                <button className={`hover:bg-[#006CE3] hover:text-white px-3 py-1 rounded-full cursor-pointer ${stepsValue=== "completed" ?"bg-[#006CE3] text-white" : ""}`}   onClick={()=>{setStepsValue("completed")}}>Completed</button>
            </tr>
            <tr className="text-sm text-blue-500 bg-blue-50 flex justify-between px-5 rounded-full py-2 mt-2">
              <th className="w-[12%]">Booking ID</th>
              <th className="w-[5%]">Price</th>
              <th className="w-[10%]">User</th>
              <th className="w-[10%]">Date</th>
              <th className="w-[10%]">Duration</th>
              <th className="w-[10%]">Time</th>
              <th className="w-[10%]">Parking Area</th>
              <th className="w-[10%]">Parking Slot</th>
              <th className="w-[10%]">Owner</th>
              <th className="w-[10%]">Status</th>
            </tr>
          </thead>
          {/* Table Body */}
          <tbody>
            {filteredData.map((item, index) => (
              <tr
                key={index}
                className="text-sm flex justify-between text-center px-5 py-2 mt-2 border-b"
              >
                <td className="w-[12%]">{item.BookingID}</td>
                <td className="w-[5%]">{item.Price}</td>
                <td className="w-[10%]">{item.User}</td>
                <td className="w-[10%]">{item.Date}</td>
                <td className="w-[10%]">{item.Duration}</td>
                <td className="w-[10%]">{item.Time}</td>
                <td className="w-[10%]">{item.Parking_Area}</td>
                <td className="w-[10%]">{item.Parking_Slot}</td>
                <td className="w-[10%]">{item.Owner}</td>
                <td className={`w-[10%] ${item.Status === "Pending" ? "text-yellow-500" : item.Status === "Confirmed" ? "text-green-500" : item.Status === "Cancelled" ? "text-red-500" : item.Status === "View Review" ? "text-blue-500 cursor-pointer" : ""}`}>{item.Status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
