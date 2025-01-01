import { useState } from "react";

export default function OwnerDetails() {
  const [stepsValue, setStepsValue] = useState("pending");
  const [activeTab, setActiveTab] = useState("booking"); // State to track active tab
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [confirmationAction, setConfirmationAction] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [editUser, setEditUser] = useState(null);

  {
    /* Dummy Data */
  }
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
      BookingID: "5678",
      Price: "$300",
      User: "Jane Smith",
      Date: "2023-02-01",
      Duration: "3 hours",
      Time: "12:00 PM",
      Parking_Area: "B2",
      Parking_Slot: "2",
      Owner: "Jane Smith",
      Status: "View Review",
    },
  ];

  const [parkingData, setParkingData] = useState([
    {
      id: 1,
      Title: "John Doe",
      Location: "123 Main St",
      Type: "Car",
      Availability: "Available",
      Owner: "John Doe",
      Status: "Active",
    },
    {
      id: 2,
      Title: "Jane Smith",
      Location: "456 Elm St",
      Type: "Motorcycle",
      Availability: "Unavailable",
      Owner: "Jane Smith",
      Status: "Pending",
    },
  ]);

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

  const filteredParkingData = parkingData.filter((item) =>
    stepsValue === "pending"
      ? item.Status === "Pending"
      : stepsValue === "active"
      ? item.Status === "Active"
      : stepsValue === "inactive"
      ? item.Status === "Inactive"
      : true
  );

  const openEditPopup = (user) => {
    setEditUser(user);
    setIsPopupOpen(true);
  };

  const closeEditPopup = () => {
    setEditUser(null);
    setIsPopupOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditUser((prevUser) => ({ ...prevUser, [name]: value }));
  };

  const saveUserDetails = () => {
    setParkingData((prevData) =>
      prevData.map((user) => (user.id === editUser.id ? { ...editUser } : user))
    );
    closeEditPopup();
  };

  const openConfirmation = (action, user) => {
    setConfirmationAction(action);
    setSelectedUser(user);
    setIsConfirmationOpen(true);
  };

  const closeConfirmation = () => {
    setConfirmationAction("");
    setSelectedUser(null);
    setIsConfirmationOpen(false);
  };

  const confirmAction = () => {
    setParkingData((prevData) =>
      prevData.map((user) =>
        user.id === selectedUser.id
          ? {
              ...user,
              Status:
                confirmationAction === "deactivate"
                  ? "Inactive"
                  : confirmationAction === "activate"
                  ? "Active"
                  : user.Status,
            }
          : user
      )
    );
    closeConfirmation();
  };

  return (
    <div className="p-4 h-[calc(100vh-12vh)] overflow-y-auto">
      <div className="bg-white p-4 rounded-2xl flex items-center justify-between h-[150px]">
        <img
          src="/Frame 1.png"
          alt=""
          className="border rounded-full object-contain w-[100px] h-[100px]"
        />
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
          <button className="bg-[#0066FF] px-4 py-1 rounded-full">
            Deactivate
          </button>
          <button className="bg-black px-2 py-1 rounded-full">Block</button>
          <button className="bg-black px-2 py-1 rounded-full">Edit</button>
        </div>
      </div>

      <div className="mt-4 bg-white rounded-2xl">
        {/* Tab Buttons */}
        <div className="px-8 text-sm flex gap-4 items-center relative">
          {/* Curved Indicator */}
          <div
            className={`absolute top-0 h-1 w-10 bg-[#006CE3] rounded-t-full transition-all duration-300 ${
              activeTab === "booking"
                ? "left-[40px]"
                : activeTab === "parking"
                ? "left-[140px]"
                : "opacity-0"
            }`}
          ></div>

          {/* Buttons */}
          <button
            className={`pt-2 ${
              activeTab === "booking" ? "text-[#006CE3]" : "text-gray-600"
            }`}
            onClick={() => setActiveTab("booking")}
          >
            Booking
          </button>
          <button
            className={`pt-2 ${
              activeTab === "parking" ? "text-[#006CE3]" : "text-gray-600"
            }`}
            onClick={() => setActiveTab("parking")}
          >
            Parking Space
          </button>
        </div>

        {/* Conditional Rendering of Tables */}
        <div>
          {activeTab === "booking" && (
            <table className="w-full">
              {/* Booking Table */}
              <thead>
                <tr className="flex gap-4 items-center px-4 w-full text-md  my-4">
                  <button
                    className={`hover:bg-[#006CE3] hover:text-white px-3 py-1 rounded-full cursor-pointer ${
                      stepsValue === "pending" ? "bg-[#006CE3] text-white" : ""
                    }`}
                    onClick={() => {
                      setStepsValue("pending");
                    }}
                  >
                    Pending
                  </button>
                  <button
                    className={`hover:bg-[#006CE3] hover:text-white px-3 py-1 rounded-full cursor-pointer ${
                      stepsValue === "confirmed"
                        ? "bg-[#006CE3] text-white"
                        : ""
                    }`}
                    onClick={() => {
                      setStepsValue("confirmed");
                    }}
                  >
                    Confirmed
                  </button>
                  <button
                    className={`hover:bg-[#006CE3] hover:text-white px-3 py-1 rounded-full cursor-pointer ${
                      stepsValue === "cancelled"
                        ? "bg-[#006CE3] text-white"
                        : ""
                    }`}
                    onClick={() => {
                      setStepsValue("cancelled");
                    }}
                  >
                    Cancelled
                  </button>
                  <button
                    className={`hover:bg-[#006CE3] hover:text-white px-3 py-1 rounded-full cursor-pointer ${
                      stepsValue === "completed"
                        ? "bg-[#006CE3] text-white"
                        : ""
                    }`}
                    onClick={() => {
                      setStepsValue("completed");
                    }}
                  >
                    Completed
                  </button>
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
                    <td
                      className={`w-[10%] ${
                        item.Status === "Pending"
                          ? "text-yellow-500"
                          : item.Status === "Confirmed"
                          ? "text-green-500"
                          : item.Status === "Cancelled"
                          ? "text-red-500"
                          : item.Status === "View Review"
                          ? "text-blue-500 cursor-pointer"
                          : ""
                      }`}
                    >
                      {item.Status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {activeTab === "parking" && (
            <table className="w-full rounded-2xl bg-white overflow-x-auto max-[1350px]:overflow-x-scroll">
              {/* Parking Space Table */}
              <thead>
                <div className="flex gap-4 items-center px-4 w-full text-md  my-4">
                  <button
                    className={`hover:bg-[#006CE3] hover:text-white px-3 py-1 rounded-full cursor-pointer ${
                      stepsValue === "pending" ? "bg-[#006CE3] text-white" : ""
                    }`}
                    onClick={() => setStepsValue("pending")}
                  >
                    Pending Approval
                  </button>
                  <button
                    className={`hover:bg-[#006CE3] hover:text-white px-3 py-1 rounded-full cursor-pointer ${
                      stepsValue === "active" ? "bg-[#006CE3] text-white" : ""
                    }`}
                    onClick={() => setStepsValue("active")}
                  >
                    Active
                  </button>
                  <button
                    className={`hover:bg-[#006CE3] hover:text-white px-3 py-1 rounded-full cursor-pointer ${
                      stepsValue === "inactive" ? "bg-[#006CE3] text-white" : ""
                    }`}
                    onClick={() => setStepsValue("inactive")}
                  >
                    Inactive
                  </button>
                </div>
                <tr className="text-sm text-blue-500 bg-blue-50 flex justify-between px-5 rounded-full py-2 mt-2">
                  <th className="w-[15%]">Title</th>
                  <th className="w-[14%]">Location</th>
                  <th className="w-[15%]">Type</th>
                  <th className="w-[13%]">Availability</th>
                  <th className="w-[15%]">Owner</th>
                  <th className="w-[10%]">Status</th>
                  <th className="w-[30%]">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredParkingData.map((item, index) => (
                  <tr
                    key={index}
                    className="text-sm flex justify-between text-center px-5 py-2 mt-2 border-b"
                  >
                    <td className="w-[15%]">{item.Title}</td>
                    <td className="w-[14%]">{item.Location}</td>
                    <td className="w-[15%]">{item.Type}</td>
                    <td className="w-[13%]">{item.Availability}</td>
                    <td className="w-[15%]">{item.Owner}</td>
                    <td
                      className={`w-[10%] ${
                        item.Status === "Active"
                          ? "text-green-500"
                          : item.Status === "Inactive"
                          ? "text-red-500"
                          : "text-yellow-500"
                      }`}
                    >
                      {item.Status}
                    </td>
                    <td className="w-[30%] flex justify-center items-center gap-2">
                      {item.Status === "Pending" && (
                        <>
                        <button
                          className="px-2 py-1 bg-[#006CE3] text-white rounded-full"
                          onClick={() => openConfirmation("approve", item)}
                        >
                          Approve
                        </button>
                        <button
                          className="px-2 py-1 bg-red-600 text-white rounded-full"
                          onClick={() => openConfirmation("cancel", item)}
                        >
                          Cancel
                        </button>
                      </>
                      )}
                      {item.Status === "Active" && (
                        <>
                          <button
                            className="px-2 py-1 bg-[#006CE3] text-white rounded-full"
                            onClick={() => openConfirmation("deactivate", item)}
                          >
                            Deactivate
                          </button>
                          <button
                            className="px-2 py-1 bg-[#006CE3] text-white rounded-full"
                            onClick={() => openEditPopup(item)}
                          >
                            Edit
                          </button>
                        </>
                      )}
                      {item.Status === "Inactive" && (
                        <>
                          <button
                            className="px-2 py-1 bg-[#006CE3] text-white rounded-full"
                            onClick={() => openConfirmation("activate", item)}
                          >
                            Activate
                          </button>
                          <button
                            className="px-2 py-1 bg-[#006CE3] text-white rounded-full"
                            onClick={() => openEditPopup(item)}
                          >
                            Edit
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {isPopupOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3 relative">
            <button className="absolute text-sm" onClick={closeEditPopup}>
              Cancel
            </button>
            <h2 className="text-xl  mb-6 text-center">Edit User</h2>
            <label className="mb-2 text-sm text-gray-400">Title:</label>
            <input
              type="text"
              name="Title"
              value={editUser.Title}
              onChange={handleInputChange}
              className="border p-3 w-full text-sm rounded-full mb-3"
            />

            <label className="mb-2 text-sm text-gray-400">Location:</label>
            <input
              type="Location"
              name="Location"
              value={editUser.Location}
              onChange={handleInputChange}
              className="border p-3 w-full text-sm rounded-full mb-3"
            />
            <label className="mb-2 text-sm text-gray-400">Availibility:</label>
            <input
              type="text"
              name="Availability"
              value={editUser.Availability}
              onChange={handleInputChange}
              className="border p-3 w-full text-sm rounded-full mb-6"
            />

            <button
              className="px-4 py-2 bg-blue-500 text-white rounded-full text-sm w-full"
              onClick={saveUserDetails}
            >
              Update
            </button>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {isConfirmationOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 ">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3 h-[200px] flex flex-col justify-center items-center relative">
            <button
              className="absolute top-3 left-3 text-sm"
              onClick={closeConfirmation}
            >
              Cancel
            </button>
            <h2 className="text-xl">
              {confirmationAction === "deactivate"
                ? "Deactivate"
                : confirmationAction === "activate"
                ? "Activate"
                : confirmationAction === "approve"
                ? "Approve"
                : ""}{" "}
              Owner
            </h2>
            <h2 className="text-sm text-gray-400 mb-6 text-center">
              Are you sure you want to{" "}
              {confirmationAction === "deactivate"
                ? "deactivate"
                : confirmationAction === "activate"
                ? "activate"
                : confirmationAction === "approve"
                ? "Approve"
                :  ""}{" "}
              this owner?
            </h2>
            <div className="flex justify-between w-full">
              <button
                className={`px-4 py-2 ${
                  confirmationAction === "deactivate"
                    ? "bg-[#006CE3]"
                    : confirmationAction === "activate"
                    ? "bg-[#006CE3]"
                    :  confirmationAction === "approve"
                    ? "bg-[#006CE3]"
                    :  ""
                } text-white rounded-full  w-full`}
                onClick={confirmAction}
              >
                {confirmationAction === "deactivate"
                  ? "Deactivate"
                  : confirmationAction === "activate"
                  ? "Activate"
                  :  confirmationAction === "approve"
                  ? "Approve"
                  : ""}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
