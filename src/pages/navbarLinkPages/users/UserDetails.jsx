import { useState, useEffect } from "react";
import { db } from "../../../firebase/FirebaseConfig";
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { useParams } from "react-router-dom";
import Loading from "../../../components/loadingComponent/LoadingSpinner";
import { toast } from "react-toastify";
import { AiFillEdit } from "react-icons/ai";

export default function UserDetails() {
  const [stepsValue, setStepsValue] = useState("pending");
  // const [data, setData] = useState([]);
  const [userData, setUserData] = useState([]);
  const [activeBookings, setActiveBookings] = useState(0);
  const [cancelledBookings, setCancelledBookings] = useState(0);
  const [completedBookings, setCompletedBookings] = useState(0);
  const [bookings, setBookings] = useState([]);
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [editUser, setEditUser] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [confirmationAction, setConfirmationAction] = useState("");
  const [isReviewPopupOpen, setIsReviewPopupOpen] = useState(false);
  const [reviewData, setReviewData] = useState("");

  const fetchUserData = async () => {
    try {
      const q = query(collection(db, "users"), where("id", "==", id));

      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const data = querySnapshot.docs[0].data();
        setUserData(data);
        const userId = data.id;

        // Step 3: Query the Booked Parking collection
        const bookingQuery = query(
          collection(db, "BookedParking"),
          where("userId", "==", userId)
        );
        const bookingQuerySnapshot = await getDocs(bookingQuery);

        if (!bookingQuerySnapshot.empty) {
          const bookings = bookingQuerySnapshot.docs.map((doc) => doc.data());
          const activeBookings = bookings.filter(
            (booking) => booking.status === "onGoing"
          );
          setActiveBookings(activeBookings.length);
          const cancelledbookings = bookings.filter(
            (booking) => booking.status === "canceled"
          );
          setCancelledBookings(cancelledbookings.length);
          const completedBookings = bookings.filter(
            (booking) => booking.status === "completed"
          );
          setCompletedBookings(completedBookings.length);
        }
        const bookingRequests = await Promise.all(
          bookingQuerySnapshot.docs.map(async (bookingDoc) => {
            const data = bookingDoc.data();
            const date = data.date.toDate();
            const formattedDate = date.toLocaleDateString("en-US", {
              day: "numeric",
              month: "short",
              year: "numeric",
            });
            const formattedTime = date.toLocaleTimeString("en-US", {
              hour: "numeric",
              minute: "numeric",
              hour12: true,
            });
            const { parkId, ownerId, userId } = data;

            // Ensure the IDs exist before attempting to fetch data
            if (!parkId || !ownerId || !userId) {
              console.warn(
                "Missing parkingId, ownerId, or userId in document:",
                bookingDoc.id
              );
              return null;
            }

            //  Fetch location and price from `Parkings` collection
            const parkingDocRef = doc(db, "Parkings", parkId);
            const parkingDoc = await getDoc(parkingDocRef);
            const parkingData = parkingDoc.exists() ? parkingDoc.data() : {};

            // Fetch owner details from `owners` collection
            const ownerDocRef = doc(db, "owners", ownerId);
            const ownerDoc = await getDoc(ownerDocRef);
            const ownerData = ownerDoc.exists() ? ownerDoc.data() : {};

            // Fetch user details from `users` collection
            const userDocRef = doc(db, "users", userId);
            const userDoc = await getDoc(userDocRef);
            const userData = userDoc.exists() ? userDoc.data() : {};

            // Step 6: Combine all data into a single object
            return {
              ...data, // Data from `BookedParking`
              formattedDate,
              formattedTime,
              location: parkingData.location || "N/A",
              price: parkingData.price || "N/A",
              slots: parkingData.slots || "N/A",
              ownerName: ownerData.name || "N/A",
              userName: userData.username || "N/A",
            };
          })
        );

        // Filter out any null entries
        const validBookingRequests = bookingRequests.filter(Boolean);
        setBookings(validBookingRequests);
        setLoading(false);

        if (bookingQuerySnapshot.empty) {
          console.log("No bookings found for the user.");
        }
      } else {
        console.log("No user found with the provided ID.");
      }
    } catch (error) {
      toast.error("Error fetching users data");
      console.error("Error fetching users data:", error);
    }
  };

  useEffect(() => {
    fetchUserData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const filteredData = bookings.filter((item) =>
    stepsValue === "pending"
      ? item.status === "pending"
      : stepsValue === "onGoing"
      ? item.status === "onGoing"
      : stepsValue === "cancelled"
      ? item.status === "canceled"
      : stepsValue === "completed"
      ? item.status === "completed"
      : true
  );

  const openEditPopup = (user) => {
    setEditUser(user);
    setIsPopupOpen(true);
  };

  const closeEditPopup = () => {
    setEditUser(null);
    setIsPopupOpen(false);
    fetchUserData();
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

  const openConfirmation = (action) => {
    setConfirmationAction(action);
    setIsConfirmationOpen(true);
  };

  const closeConfirmation = () => {
    setConfirmationAction("");
    setIsConfirmationOpen(false);
  };

  const confirmAction = () => {
    try {
      const userDocRef = doc(db, "users", id);
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
    fetchUserData();
  };

  const fetchUserReview = async (userId) => {
    try {
      setLoading(true);
      const reviewsRef = collection(db, "reviews");
      const q = query(reviewsRef, where("userId", "==", userId));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const review = querySnapshot.docs[0].data();
        setReviewData(review);
      } else {
        console.log("No reviews found for this user.");
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  return (
    <div className="p-4">
      <div className="bg-white p-4 rounded-2xl flex items-center justify-between h-[150px]">
        <img
          src="/Frame 1.png"
          alt=""
          className="border rounded-full object-contain w-[100px] h-[100px]"
        />
        <div className="">
          <h1 className="text-sm text-gray-400">Username</h1>
          <h1 className="text-sm">{userData.username}</h1>
          <h1 className="text-sm text-gray-400">Active Bookings</h1>
          <h1 className="text-sm">{activeBookings}</h1>
        </div>
        <div className="">
          <h1 className="text-sm text-gray-400">Email</h1>
          <h1 className="text-sm">{userData.email}</h1>
          <h1 className="text-sm text-gray-400">Cancelled Bookings</h1>
          <h1 className="text-sm">{cancelledBookings}</h1>
        </div>
        <div className="">
          <h1 className="text-sm text-gray-400">Contact</h1>
          <h1 className="text-sm">{userData.contact || "N/A"}</h1>
          <h1 className="text-sm text-gray-400">Completed Bookings</h1>
          <h1 className="text-sm">{completedBookings}</h1>
        </div>
        <div className="text-sm text-white flex gap-2">
          {userData.status === "Active" ? (
            <>
              <button
                className="bg-[#0066FF] px-4 py-1 rounded-full"
                onClick={() => openConfirmation("deactivate")}
              >
                Deactivate
              </button>
              {/* <button className="bg-black px-2 py-1 rounded-full">Block</button> */}
              <button
                className="bg-black px-2 py-1 rounded-full"
                onClick={() => openEditPopup(userData)}
              >
                <AiFillEdit size={15} />
              </button>
            </>
          ) : (
            <>
              <button
                className="bg-[#0066FF] px-4 py-1 rounded-full"
                onClick={() => openConfirmation("activate")}
              >
                Activate
              </button>
              {/* <button className="bg-black px-2 py-1 rounded-full">Block</button> */}
              <button
                className="bg-black px-2 py-1 rounded-full"
                onClick={() => openEditPopup(userData)}
              >
                <AiFillEdit size={15} />
              </button>
            </>
          )}
        </div>
      </div>

      <div className="mt-4">
        <table className="w-full rounded-2xl bg-white">
          {/* Table Header */}
          <thead>
            <tr className="flex gap-4 items-center px-4 w-full text-md  my-4">
              <td
                className={`hover:bg-[#006CE3] hover:text-white px-3 py-1 rounded-full cursor-pointer ${
                  stepsValue === "pending" ? "bg-[#006CE3] text-white" : ""
                }`}
                onClick={() => {
                  setStepsValue("pending");
                }}
              >
                Pending
              </td>
              <td
                className={`hover:bg-[#006CE3] hover:text-white px-3 py-1 rounded-full cursor-pointer ${
                  stepsValue === "onGoing" ? "bg-[#006CE3] text-white" : ""
                }`}
                onClick={() => {
                  setStepsValue("onGoing");
                }}
              >
                On Going
              </td>
              <td
                className={`hover:bg-[#006CE3] hover:text-white px-3 py-1 rounded-full cursor-pointer ${
                  stepsValue === "cancelled" ? "bg-[#006CE3] text-white" : ""
                }`}
                onClick={() => {
                  setStepsValue("cancelled");
                }}
              >
                Cancelled
              </td>
              <td
                className={`hover:bg-[#006CE3] hover:text-white px-3 py-1 rounded-full cursor-pointer ${
                  stepsValue === "completed" ? "bg-[#006CE3] text-white" : ""
                }`}
                onClick={() => {
                  setStepsValue("completed");
                }}
              >
                Completed
              </td>
            </tr>
            <tr className="text-sm text-blue-500 bg-blue-50 flex justify-between items-center px-5 rounded-full py-2 mt-2">
              <th className="w-[20%]">Booking ID</th>
              <th className="w-[5%] ">Price</th>
              <th className="w-[10%]">User</th>
              <th className="w-[10%]">Date</th>
              <th className="w-[10%]">Duration</th>
              <th className="w-[8%] ">Time</th>
              <th className="w-[10%]">Parking Area</th>
              <th className="w-[5%] ">Parking Slot</th>
              <th className="w-[8%] ">Owner</th>
              <th className="w-[8%] ">Status</th>
            </tr>
          </thead>
          {/* Table Body */}
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
                      {stepsValue === "pending"
                        ? "No pending requests"
                        : stepsValue === "onGoing"
                        ? "No on going bookings"
                        : stepsValue === "cancelled"
                        ? "No cancelled bookings"
                        : "No completed bookings"}
                    </td>
                  </tr>
                ) : (
                  <>
                    {filteredData.map((item, index) => (
                      <tr
                        key={index}
                        className="text-sm flex justify-between items-center text-center px-5 py-2 mt-2 border-b"
                      >
                        <td className="w-[20%]">{item.parkingId}</td>
                        <td className="w-[5%] ">{item.price}</td>
                        <td className="w-[10%]">{item.userName}</td>
                        <td className="w-[10%]">{item.formattedDate}</td>
                        <td className="w-[10%]">{item.totalDuration}</td>
                        <td className="w-[8%] ">{item.formattedTime}</td>
                        <td className="w-[10%]">{item.location}</td>
                        <td className="w-[5%] ">{item.slots}</td>
                        <td className="w-[8%] ">{item.ownerName}</td>
                        <td
                          className={`w-[8%]  ${
                            stepsValue === "pending"
                              ? "text-red-500"
                              : stepsValue === "onGoing"
                              ? "text-green-500"
                              : stepsValue === "cancelled"
                              ? "text-yellow-500"
                              : stepsValue === "completed"
                              ? "text-blue-500 cursor-pointer"
                              : ""
                          }`}
                          onClick={
                            item.status === "completed"
                              ? () =>
                                  fetchUserReview(item.userId) &&
                                  setIsReviewPopupOpen(true)
                              : null
                          }
                        >
                          {item.status === "pending"
                            ? "Pending"
                            : item.status === "onGoing"
                            ? "On Going"
                            : item.status === "canceled"
                            ? "Cancelled"
                            : item.status === "completed"
                            ? "View Review"
                            : ""}
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
            ) : (
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
                : // : confirmationAction === "block"
                // ? "Block"
                confirmationAction === "activate"
                ? "Activate"
                : // : confirmationAction === "unblock"
                  // ? "Unblock"
                  ""}{" "}
              User
            </h2>
            <h2 className="text-sm text-gray-400 mb-6 text-center">
              Are you sure you want to{" "}
              {confirmationAction === "deactivate"
                ? "deactivate"
                : // : confirmationAction === "block"
                // ? "block"
                confirmationAction === "activate"
                ? "activate"
                : // : confirmationAction === "unblock"
                  // ? "unblock"
                  ""}{" "}
              this user?
            </h2>
            <div className="flex justify-between w-full">
              <button
                className={`px-4 py-2 ${
                  confirmationAction === "deactivate"
                    ? "bg-[#006CE3]"
                    : // : confirmationAction === "block"
                    // ? "bg-[#006CE3]"
                    confirmationAction === "activate"
                    ? "bg-[#006CE3]"
                    : // : confirmationAction === "unblock"
                      // ? "bg-[#006CE3]"
                      ""
                } text-white rounded-full  w-full`}
                onClick={confirmAction}
              >
                {confirmationAction === "deactivate"
                  ? "Deactivate"
                  : // : confirmationAction === "block"
                  // ? "Block"
                  confirmationAction === "activate"
                  ? "Activate"
                  : // : confirmationAction === "unblock"
                    // ? "Unblock"
                    ""}
              </button>
            </div>
          </div>
        </div>
      )}

      {isReviewPopupOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative max-h-[80vh] overflow-y-auto">
            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-900 text-sm"
              onClick={() => setIsReviewPopupOpen(false)}
            >
              X
            </button>
            <h2 className="text-xl font-semibold text-center mb-4">
              User Review
            </h2>
            <div className="">
              {loading ? (
                <Loading />
              ) : !reviewData || Object.keys(reviewData).length === 0 ? (
                <p className="text-center text-gray-500">No review found</p>
              ) : (
                <p className="text-gray-700">{reviewData.description}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
