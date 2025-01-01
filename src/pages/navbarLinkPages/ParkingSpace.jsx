import { useState } from "react";
export default function ParkingSpace() {
  const [stepsValue, setStepsValue] = useState("pending");
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [confirmationAction, setConfirmationAction] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [editUser, setEditUser] = useState(null);
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
    <div>
      <div className="p-4 h-[calc(100vh-12vh)] overflow-y-auto">
        <table className="w-full rounded-2xl bg-white overflow-x-auto max-[1350px]:overflow-x-scroll">
          {/* Parking Space Table */}
          <thead>
            <tr className="flex gap-4 items-center px-4 w-full text-md  my-4">
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
            </tr>
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
      </div>
      {isPopupOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3 relative">
            <button className="absolute text-sm" onClick={closeEditPopup}>
              Cancel
            </button>
            <h2 className="text-xl  mb-6 text-center">Edit Parking Space</h2>
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
              Parking Space
            </h2>
            <h2 className="text-sm text-gray-400 mb-6 text-center">
              Are you sure you want to{" "}
              {confirmationAction === "deactivate"
                ? "deactivate"
                : confirmationAction === "activate"
                ? "activate"
                : confirmationAction === "approve"
                ? "Approve"
                : ""}{" "}
              this parking space?
            </h2>
            <div className="flex justify-between w-full">
              <button
                className={`px-4 py-2 ${
                  confirmationAction === "deactivate"
                    ? "bg-[#006CE3]"
                    : confirmationAction === "activate"
                    ? "bg-[#006CE3]"
                    : confirmationAction === "approve"
                    ? "bg-[#006CE3]"
                    : ""
                } text-white rounded-full  w-full`}
                onClick={confirmAction}
              >
                {confirmationAction === "deactivate"
                  ? "Deactivate"
                  : confirmationAction === "activate"
                  ? "Activate"
                  : confirmationAction === "approve"
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
