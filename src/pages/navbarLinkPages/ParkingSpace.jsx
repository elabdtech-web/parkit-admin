import { useState, useEffect } from "react";
import { db } from "../../firebase/FirebaseConfig";
import {
  collection,
  getDocs,
  query,
  getDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import {toast} from "react-toastify";
import Loading from "../../components/loadingComponent/LoadingSpinner";
import { AiFillEdit } from "react-icons/ai";

export default function ParkingSpace() {
  const [stepsValue, setStepsValue] = useState("pending");
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [confirmationAction, setConfirmationAction] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [editParking, setEditParking] = useState(null);
  const [parkingData, setParkingData] = useState([]);
  const [location, setLocation] = useState("");
  const [title, setTitle] = useState("");
  const [slots, setSlots] = useState("");
  const [loading, setLoading] = useState(true);


  const fetchParkingData = async () => {
    try {
      const parkingQuery = query(collection(db, "Parkings"));
      const parkingSnapshot = await getDocs(parkingQuery);

      if (!parkingSnapshot.empty) {
        const parkingData = await Promise.all(
          parkingSnapshot.docs.map(async (parkingDoc) => {
            const parking = parkingDoc.data();
            const ownerId = parking.ownerId;

            const ownerDoc = await getDoc(doc(db, "owners", ownerId));
            const ownerName = ownerDoc.exists()
              ? ownerDoc.data().username
              : "Unknown";

            return {
              ...parking,
              ownerName, 
            };
          })
        );

        setParkingData(parkingData);
        setLoading(false);
      } else {
        console.log("No parking data found.");
      }
    } catch (error) {
      toast.error("Error fetching parking data");
      console.error("Error fetching parking data:", error);
    }
  };

  useEffect(() => {
    fetchParkingData();
  }, []);

  const filteredParkingData = parkingData.filter((item) =>
    stepsValue === "pending"
      ? item.status === "Pending"
      : stepsValue === "active"
      ? item.status === "Active"
      : stepsValue === "inactive"
      ? item.status === "Inactive"
      : true
  );

  const openEditPopup = (user) => {
    setEditParking(user);
    setIsPopupOpen(true);
  };

  const closeEditPopup = () => {
    setEditParking(null);
    setIsPopupOpen(false);
    fetchParkingData();
  };

  useEffect(() => {
    if (editParking) {
      setTitle(editParking.title);
      setLocation(editParking.location);
      setSlots(editParking.slots);
    }
  }, [editParking]);
  

  const saveParkingDetails = async () => {
    try {
      const ParkingDocRef = doc(db, "Parkings", editParking.id);
      await updateDoc(ParkingDocRef, {
        title: title,
        location: location,
        slots: Number(slots),
      });
      closeEditPopup();
      fetchParkingData();
      toast.success("Updated Successfully");
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
        <table className="w-full rounded-2xl bg-white">
          {/* Parking Space Table */}
          <thead>
            <tr className="flex gap-4 items-center px-4 w-full text-md  my-4">
              <td
                className={`hover:bg-[#006CE3] hover:text-white px-3 py-1 rounded-full cursor-pointer ${
                  stepsValue === "pending" ? "bg-[#006CE3] text-white" : ""
                }`}
                onClick={() => setStepsValue("pending")}
              >
                Pending Approval
              </td>
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
          {loading ? (
              <tr className="text-center">
                <td colSpan="10" className="py-4">
                  <Loading />
                </td>
              </tr>
            ) : (
              <>
          {filteredParkingData.length === 0 ? (
              <tr className="text-center">
                <td colSpan="10" className="py-4">{stepsValue === "pending" ? "No Pending Approvals" : stepsValue === "active" ? "No Active Parking Spaces" : "No Inactive Parking Spaces"}</td>
              </tr>
            ) : (
              <>
            {filteredParkingData.map((item, index) => (
              <tr
                key={index}
                className="text-sm flex justify-between items-center text-center px-5 py-2 mt-2 border-b"
              >
                <td className="w-[15%]">{item.title}</td>
                <td className="w-[14%]">{item.location}</td>
                <td className="w-[15%]">zzz</td>
                <td className="w-[13%]">{item.slots}</td>
                <td className="w-[15%]">{item.ownerName}</td>
                <td
                  className={`w-[10%] ${
                    item.status === "Active"
                      ? "text-green-500"
                      : item.status === "Inactive"
                      ? "text-red-500"
                      : "text-yellow-500"
                  }`}
                >
                  {item.status}
                </td>
                <td className="w-[30%] flex justify-center items-center gap-2">
                  {item.status === "Pending" && (
                    <>
                      <button
                        className="px-2 py-1 bg-[#006CE3] text-white text-xs rounded-full"
                        onClick={() => openConfirmation("approve", item)}
                      >
                        Approve
                      </button>
                      <button
                        className="px-2 py-1 bg-red-600 text-white text-xs rounded-full"
                        onClick={() => openConfirmation("cancel", item)}
                      >
                        Cancel
                      </button>
                    </>
                  )}
                  {item.status === "Active" && (
                    <>
                      <button
                        className="px-2 py-1 bg-[#006CE3] text-white text-xs rounded-full"
                        onClick={() => openConfirmation("deactivate", item)}
                      >
                        Deactivate
                      </button>
                      <button
                        className="px-2 py-1 bg-black text-white rounded-full"
                        onClick={() => openEditPopup(item)}
                      >
                        <AiFillEdit size={15}/> 
                      </button>
                    </>
                  )}
                  {item.status === "Inactive" && (
                    <>
                      <button
                        className="px-2 py-1 bg-[#006CE3] text-white text-xs rounded-full"
                        onClick={() => openConfirmation("activate", item)}
                      >
                        Activate
                      </button>
                      <button
                        className="px-2 py-1 bg-black text-white rounded-full"
                        onClick={() => openEditPopup(item)}
                      >
                        <AiFillEdit size={15}/>
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
            </>
            )}
            </>
            )}
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
              name="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border p-3 w-full text-sm rounded-full mb-3"
            />

            <label className="mb-2 text-sm text-gray-400">Location:</label>
            <input
              type="Location"
              name="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="border p-3 w-full text-sm rounded-full mb-3"
            />
            <label className="mb-2 text-sm text-gray-400">Availibility:</label>
            <input
              type="number"
              name="slots"
              value={slots}
              onChange={(e) => setSlots(e.target.value)}
              className="border p-3 w-full text-sm rounded-full mb-6"
            />

            <button
              className="px-4 py-2 bg-blue-500 text-white rounded-full text-sm w-full"
              onClick={saveParkingDetails}
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
