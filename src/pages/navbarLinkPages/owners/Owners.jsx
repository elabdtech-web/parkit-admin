import { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";

export default function Owners() {
  const location = useLocation();
  const isUsersPage = location.pathname === "/dashboard/owners";
  const [stepsValue, setStepsValue] = useState("pending");
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [confirmationAction, setConfirmationAction] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [editUser, setEditUser] = useState(null);
  const [data, setData] = useState([
    {
      id: 1,
      UserName: "John Doe",
      Email: "john@doe.com",
      Contact: "123456789011",
      Date: "20 Jan 2023",
      Status: "Active",
    },
    {
      id: 2,
      UserName: "Jane Smith",
      Email: "jane@smith.com",
      Contact: "098765432122",
      Date: "22 March 2022",
      Status: "Inactive",
    },
    {
      id: 3,
      UserName: "Bob Johnson",
      Email: "bob@johnson.com",
      Contact: "567890123433",
      Date: "27 April 2023",
      Status: "Blocked",
    },
    {
      id: 4,
      UserName: "Alice Brown",
      Email: "alice@brown.com",
      Contact: "345678901234",
      Date: "15 May 2023",
      Status: "Pending",
    },
  ]);

  // Filter the data based on the selected status
  const filteredData = data.filter((item) =>
    stepsValue === "active"
      ? item.Status === "Active"
      : stepsValue === "inactive"
      ? item.Status === "Inactive"
      : stepsValue === "blocked"
      ? item.Status === "Blocked"
      : stepsValue === "pending"
      ? item.Status === "Pending"
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
    setData((prevData) =>
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
    setData((prevData) =>
      prevData.map((user) =>
        user.id === selectedUser.id
          ? {
              ...user,
              Status:
                confirmationAction === "deactivate"
                  ? "Inactive"
                  : confirmationAction === "block"
                  ? "Blocked"
                  : confirmationAction === "activate"
                  ? "Active"
                  : confirmationAction === "unblock"
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
      <div>
        {isUsersPage ? (
          <table className="w-full rounded-2xl bg-white">
            <thead>
              <tr className="flex gap-4 items-center px-4 w-full text-md my-4">
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
                <button
                  className={`hover:bg-[#006CE3] hover:text-white px-3 py-1 rounded-full cursor-pointer ${
                    stepsValue === "blocked" ? "bg-[#006CE3] text-white" : ""
                  }`}
                  onClick={() => setStepsValue("blocked")}
                >
                  Blocked
                </button>
              </tr>
              <tr className="text-sm text-blue-500 bg-blue-50 flex justify-between px-5 rounded-full py-2 mt-2">
                <th className="w-[20%]">UserName</th>
                <th className="w-[20%]">Email</th>
                <th className="w-[20%]">Contact</th>
                <th className="w-[10%]">
                  {stepsValue === "pending" ? "Date" : "Status"}
                </th>
                <th className="w-[30%]">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item, index) => (
                <tr
                  key={index}
                  className="text-sm flex justify-between items-center text-center px-5 py-2 mt-2 border-b hover:text-[#006CE3] cursor-pointer"
                >
                  <td className="w-[20%]">
                    <Link to={`./${item.id}`}>{item.UserName}</Link>
                  </td>
                  <td className="w-[20%]">
                    <Link to={`./${item.id}`}>{item.Email}</Link>
                  </td>
                  <td className="w-[20%]">
                    <Link to={`./${item.id}`}>{item.Contact}</Link>
                  </td>
                  <td
                    className={`w-[10%] ${
                      stepsValue === "pending"
                        ? ""
                        : item.Status === "Active"
                        ? "text-green-500"
                        : item.Status === "Inactive"
                        ? "text-red-500"
                        : "text-yellow-500"
                    }`}
                  >
                    {stepsValue === "pending" ? item.Date : item.Status}
                  </td>
                  <td className="w-[30%] flex justify-center items-center gap-2">
                    {stepsValue === "pending" ? (
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
                    ) : (
                      <>
                        {item.Status === "Active" && (
                          <>
                            <button
                              className="px-2 py-1 bg-[#006CE3] text-white rounded-full"
                              onClick={() =>
                                openConfirmation("deactivate", item)
                              }
                            >
                              Deactivate
                            </button>
                            <button
                              className="px-2 py-1 bg-[#006CE3] text-white rounded-full"
                              onClick={() => openConfirmation("block", item)}
                            >
                              Block
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
                              onClick={() => openConfirmation("block", item)}
                            >
                              Block
                            </button>
                            <button
                              className="px-2 py-1 bg-[#006CE3] text-white rounded-full"
                              onClick={() => openEditPopup(item)}
                            >
                              Edit
                            </button>
                          </>
                        )}

                        {item.Status === "Blocked" && (
                          <button
                            className="px-2 py-1 bg-[#006CE3] text-white rounded-full"
                            onClick={() => openConfirmation("unblock", item)}
                          >
                            Unblock
                          </button>
                        )}
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <Outlet />
        )}
      </div>

      {/* Popup Modal */}
      {isPopupOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3 relative">
            <button className="absolute text-sm" onClick={closeEditPopup}>
              Cancel
            </button>
            <h2 className="text-xl  mb-6 text-center">Edit User</h2>
            <label className="mb-2 text-sm text-gray-400">Username:</label>
            <input
              type="text"
              name="UserName"
              value={editUser.UserName}
              onChange={handleInputChange}
              className="border p-3 w-full text-sm rounded-full mb-3"
            />

            <label className="mb-2 text-sm text-gray-400">Email:</label>
            <input
              type="email"
              name="Email"
              value={editUser.Email}
              onChange={handleInputChange}
              className="border p-3 w-full text-sm rounded-full mb-3"
            />
            <label className="mb-2 text-sm text-gray-400">Contact:</label>
            <input
              type="text"
              name="Contact"
              value={editUser.Contact}
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
              {confirmationAction === "approve"
                ? "Approve"
                : confirmationAction === "deactivate"
                ? "Deactivate"
                : confirmationAction === "block"
                ? "Block"
                : confirmationAction === "activate"
                ? "Activate"
                : confirmationAction === "unblock"
                ? "Unblock"
                : ""}{" "}
              User
            </h2>
            <h2 className="text-sm text-gray-400 mb-6 text-center">
              Are you sure you want to{" "}
              {confirmationAction === "approve"
                ? "approve"
                : confirmationAction === "deactivate"
                ? "deactivate"
                : confirmationAction === "block"
                ? "block"
                : confirmationAction === "activate"
                ? "activate"
                : confirmationAction === "unblock"
                ? "unblock"
                : ""}{" "}
              this user?
            </h2>
            <div className="flex justify-between w-full">
              <button
                className={`px-4 py-2 ${
                  confirmationAction === "approve"
                    ? "bg-[#006CE3]"
                    : confirmationAction === "deactivate"
                    ? "bg-[#006CE3]"
                    : confirmationAction === "block"
                    ? "bg-[#006CE3]"
                    : confirmationAction === "activate"
                    ? "bg-[#006CE3]"
                    : confirmationAction === "unblock"
                    ? "bg-[#006CE3]"
                    : ""
                } text-white rounded-full  w-full`}
                onClick={confirmAction}
              >
                {confirmationAction === "approve"
                  ? "Approve"
                  : confirmationAction === "deactivate"
                  ? "Deactivate"
                  : confirmationAction === "block"
                  ? "Block"
                  : confirmationAction === "activate"
                  ? "Activate"
                  : confirmationAction === "unblock"
                  ? "Unblock"
                  : ""}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
