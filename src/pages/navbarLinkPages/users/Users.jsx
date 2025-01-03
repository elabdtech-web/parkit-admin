import { useState, useEffect } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { db } from "../../../firebase/FirebaseConfig";
import { collection, query, getDocs, doc, updateDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import Loading from "../../../components/loadingComponent/LoadingSpinner";
import { AiFillEdit } from "react-icons/ai";

export default function Users() {
  const location = useLocation();
  const isUsersPage = location.pathname === "/admin/users";
  const [stepsValue, setStepsValue] = useState("active");
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [confirmationAction, setConfirmationAction] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [editUser, setEditUser] = useState(null);
  const [data, setData] = useState([]);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  // const [contact, setContact] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchUsersData = async () => {
    try {
      const q = query(collection(db, "users"));
      const querySnapshot = await getDocs(q);
      setData(querySnapshot.docs.map((doc) => doc.data()));
      setLoading(false);
    } catch (error) {
      toast.error("Error fetching users data");
      console.error("Error fetching users data:", error);
    }
  };

  useEffect(() => {
    fetchUsersData();
  }, []);

  // Filter the data based on the selected status
  const filteredData = data.filter((item) =>
    stepsValue === "active"
      ? item.status === "Active"
      : stepsValue === "inactive"
      ? item.status === "Inactive"
      // : stepsValue === "blocked"
      // ? item.Status === "Blocked"
      : true
  );

  const openEditPopup = (user) => {
    setEditUser(user);
    setIsPopupOpen(true);
  };

  const closeEditPopup = () => {
    setEditUser(null);
    setIsPopupOpen(false);
    fetchUsersData();
  };

  useEffect(() => {
    if (editUser) {
      setUsername(editUser.username);
      setEmail(editUser.email);
      // setContact(editUser.contact);
    }
  }, [editUser]);

  const saveUserDetails = async () => {
    try {
      setLoading(true);
      const userDocRef = doc(db, "users", editUser.id);
      await updateDoc(userDocRef, {
        username: username,
        email: email,
        // contact: contact
      });
      toast.success("User details updated successfully");
      setLoading(false);
      closeEditPopup();
    } catch (error) {
      console.error("Error updating user details:", error);
    }
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
    try {
      const userDocRef = doc(db, "users", selectedUser.id);
      if (confirmationAction === "deactivate") {
        updateDoc(userDocRef, { status: "Inactive" });
      }
      if (confirmationAction === "activate") {
        updateDoc(userDocRef, { status: "Active" });
      }
    } catch (error) {
      toast.error("An error occurred while updating user status.");
      console.error("Error updating user status:", error);
    }
    closeConfirmation();
    fetchUsersData();
  };

  return (
    <div className="p-4 h-[calc(100vh-12vh)] overflow-y-auto">
      <div>
        {isUsersPage ? (
          <table className="w-full rounded-2xl bg-white ">
            <thead>
              <tr className="flex gap-4 items-center px-4 w-full text-md my-4">
                <td
                  className={`hover:bg-[#006CE3] hover:text-white px-3 py-1 rounded-full cursor-pointer ${
                    stepsValue === "active" ? "bg-[#006CE3] text-white" : ""
                  }`}
                  onClick={() => setStepsValue("active")}
                >
                  Active
                </td>
                <td
                  className={`hover:bg-[#006CE3] hover:text-white px-3 py-1 rounded-full cursor-pointer ${
                    stepsValue === "inactive" ? "bg-[#006CE3] text-white" : ""
                  }`}
                  onClick={() => setStepsValue("inactive")}
                >
                  Inactive
                </td>
                {/* <td
                  className={`hover:bg-[#006CE3] hover:text-white px-3 py-1 rounded-full cursor-pointer ${
                    stepsValue === "blocked" ? "bg-[#006CE3] text-white" : ""
                  }`}
                  onClick={() => setStepsValue("blocked")}
                >
                  Blocked
                </td> */}
              </tr>
              <tr className="text-sm text-blue-500 bg-blue-50 flex justify-between px-5 rounded-full py-2 mt-2">
                <th className="w-[20%]">UserName</th>
                <th className="w-[30%]">Email</th>
                {/* <th className="w-[20%]">Contact</th> */}
                <th className="w-[10%]">Status</th>
                <th className="w-[30%]">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr className="text-center">
                  <td colSpan="10" className="py-4">
                    <Loading />
                  </td>
                </tr>
              ) : (
                <>
                  {filteredData.length === 0 ? (
                    <tr className="text-center">
                      <td colSpan="10" className="py-4">
                        {stepsValue === "active"
                          ? "No Active users found"
                          : stepsValue === "inactive"
                          ? "No Inactive users found"
                          // : stepsValue === "blocked"
                          // ? "No blocked users found"
                          : "No users found"}
                      </td>
                    </tr>
                  ) : (
                    <>
                      {filteredData.map((item, index) => (
                        <tr
                          key={index}
                          className="text-sm flex justify-between items-center text-center px-5 py-2 mt-2 border-b hover:text-[#006CE3] cursor-pointer"
                        >
                          <td className="w-[20%]">
                            <Link to={`./${item.id}`}>{item.username}</Link>
                          </td>
                          <td className="w-[30%]">
                            <Link to={`./${item.id}`}>{item.email}</Link>
                          </td>
                          {/* <td className="w-[20%]">
                    <Link to={`./${item.id}`}>{item.Contact}</Link>
                  </td> */}
                          <td
                            className={`w-[10%] ${
                              stepsValue === "active"
                                ? "text-green-500"
                                : stepsValue === "inactive"
                                ? "text-red-500"
                                : "text-yellow-500"
                            }`}
                          >
                            {stepsValue === "active"
                              ? "Active"
                              : stepsValue === "inactive"
                              ? "Inactive"
                              // : "Blocked"}
                              : ""}
                          </td>
                          <td className="w-[30%] flex justify-center items-center gap-2">
                            {stepsValue === "active" && (
                              <>
                                <button
                                  className="px-2 py-1 bg-[#006CE3] text-white rounded-full"
                                  onClick={() =>
                                    openConfirmation("deactivate", item)
                                  }
                                >
                                  Deactivate
                                </button>
                                {/* <button
                                  className="px-2 py-1 bg-[#006CE3] text-white rounded-full"
                                  onClick={() =>
                                    openConfirmation("block", item)
                                  }
                                >
                                  Block
                                </button> */}
                                <button
                                  className="px-2 py-1 bg-black text-white rounded-full"
                                  onClick={() => openEditPopup(item)}
                                >
                                  <AiFillEdit size={15} />
                                </button>
                              </>
                            )}
                            {stepsValue === "inactive" && (
                              <>
                                <button
                                  className="px-2 py-1 bg-[#006CE3] text-white rounded-full"
                                  onClick={() =>
                                    openConfirmation("activate", item)
                                  }
                                >
                                  Activate
                                </button>
                                {/* <button
                                  className="px-2 py-1 bg-[#006CE3] text-white rounded-full"
                                  onClick={() =>
                                    openConfirmation("block", item)
                                  }
                                >
                                  Block
                                </button> */}
                                <button
                                  className="px-2 py-1 bg-black text-white rounded-full"
                                  onClick={() => openEditPopup(item)}
                                >
                                  <AiFillEdit size={15} />
                                </button>
                              </>
                            )}
                            {/* {stepsValue === "blocked" && (
                              <button
                                className="px-2 py-1 bg-[#006CE3] text-white rounded-full"
                                onClick={() =>
                                  openConfirmation("unblock", item)
                                }
                              >
                                Unblock
                              </button>
                            )} */}
                          </td>
                        </tr>
                      ))}
                    </>
                  )}
                </>
              )}
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
            <h2 className="text-xl mb-6 text-center">Edit User</h2>
            <label className="mb-2 text-sm text-gray-400">Username:</label>
            <input
              type="text"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="border p-3 w-full text-sm rounded-full mb-3"
            />
            <label className="mb-2 text-sm text-gray-400">Email:</label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border p-3 w-full text-sm rounded-full mb-3"
            />
            {/* <label className="mb-2 text-sm text-gray-400">Contact:</label>
          <input
            type="text"
            name="contact"
            value={editUser.contact}
            onChange={(e)=>setContact(e.target.value)}
            className="border p-3 w-full text-sm rounded-full mb-6"
          /> */}
            {loading ? (
              <Loading />
            ):(
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded-full text-sm w-full"
              onClick={saveUserDetails}
            >
              Update
            </button>
            )}
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
                // : confirmationAction === "block"
                // ? "Block"
                : confirmationAction === "activate"
                ? "Activate"
                // : confirmationAction === "unblock"
                // ? "Unblock"
                : ""}{" "}
              User
            </h2>
            <h2 className="text-sm text-gray-400 mb-6 text-center">
              Are you sure you want to{" "}
              {confirmationAction === "deactivate"
                ? "deactivate"
                // : confirmationAction === "block"
                // ? "block"
                : confirmationAction === "activate"
                ? "activate"
                // : confirmationAction === "unblock"
                // ? "unblock"
                : ""}{" "}
              this user?
            </h2>
            <div className="flex justify-between w-full">
              <button
                className={`px-4 py-2 ${
                  confirmationAction === "deactivate"
                    ? "bg-[#006CE3]"
                    // : confirmationAction === "block"
                    // ? "bg-[#006CE3]"
                    : confirmationAction === "activate"
                    ? "bg-[#006CE3]"
                    // : confirmationAction === "unblock"
                    // ? "bg-[#006CE3]"
                    : ""
                } text-white rounded-full  w-full`}
                onClick={confirmAction}
              >
                {confirmationAction === "deactivate"
                  ? "Deactivate"
                  // : confirmationAction === "block"
                  // ? "Block"
                  : confirmationAction === "activate"
                  ? "Activate"
                  // : confirmationAction === "unblock"
                  // ? "Unblock"
                  : ""}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
