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

export default function OwnerDetails() {
  const [stepsValue, setStepsValue] = useState("pending");
  const [stepsValue2, setStepsValue2] = useState("pending");
  const [activeTab, setActiveTab] = useState("booking"); // State to track active tab
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [confirmationAction, setConfirmationAction] = useState("");
  const [editOwner, setEditOwner] = useState(null);
  const [ownerData, setOwnerData] = useState([]);
  const [activeBookings, setActiveBookings] = useState(0);
  const [cancelledBookings, setCancelledBookings] = useState(0);
  const [completedBookings, setCompletedBookings] = useState(0);
  const [bookingRequests, setBookingRequests] = useState([]);
  const [parkingData, setParkingData] = useState([]);
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [isReviewPopupOpen, setIsReviewPopupOpen] = useState(false);
  const [reviewData, setReviewData] = useState("");

  const fetchOwnerData = async () => {
    try {
      const q = query(collection(db, "owners"), where("id", "==", id));

      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const data = querySnapshot.docs[0].data();
        setOwnerData(data);
        const ownerId = data.id;

        // Step 3: Query the Booked Parking collection
        const bookingQuery = query(
          collection(db, "BookedParking"),
          where("ownerId", "==", ownerId)
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
          setBookingRequests(validBookingRequests);
          setLoading(false);
        }
        if (bookingQuerySnapshot.empty) {
          console.log("No bookings found for the user.");
        }
      } else {
        console.log("No user found with the provided ID.");
      }
    } catch (error) {
      console.error("Error fetching users data:", error);
    }
  };

  const fetchParkingData = async () => {
    try {
      const q = query(collection(db, "Parkings"), where("ownerId", "==", id));

      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const data = querySnapshot.docs.map((doc) => doc.data());
        setParkingData(data);
      }
      if (querySnapshot.empty) {
        console.log("No parking found for the user.");
      }
      setLoading(false);
    } catch (error) {
      toast.error("Error fetching data");
      console.error("Error fetching users data:", error);
    }
  };

  useEffect(() => {
    fetchOwnerData();
    fetchParkingData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const filteredData = bookingRequests.filter((item) =>
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
  const filteredParkingData = parkingData.filter((item) =>
    stepsValue2 === "pending"
      ? item.status === "Pending"
      : stepsValue2 === "active"
      ? item.status === "Active"
      : stepsValue2 === "inactive"
      ? item.status === "Inactive"
      : true
  );

  const openEditPopup = (user) => {
    setEditOwner(user);
    setIsPopupOpen(true);
  };

  const closeEditPopup = () => {
    setEditOwner(null);
    setIsPopupOpen(false);
    fetchOwnerData();
  };

  useEffect(() => {
    if (editOwner) {
      setUsername(editOwner.username);
      setEmail(editOwner.email);
      // setContact(editUser.contact);
    }
  }, [editOwner]);

  const saveOwnerDetails = async () => {
    try {
      setLoading(true);
      const userDocRef = doc(db, "owners", editOwner.id);
      await updateDoc(userDocRef, {
        username: username,
        email: email,
        // contact: contact
      });
      toast.success("Owner details updated successfully");
      setLoading(false);
      closeEditPopup();
    } catch (error) {
      console.error("Error updating owner details:", error);
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
      const userDocRef = doc(db, "owners", id);
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
    fetchOwnerData();
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
      {/* Owner Details Card */}
      <div className="bg-white p-4 rounded-2xl flex items-center justify-between h-[150px]">
        <img
          src="/Frame 1.png"
          alt=""
          className="border rounded-full object-contain w-[100px] h-[100px]"
        />
        <div className="">
          <h1 className="text-sm text-gray-400">Ownername</h1>
          <h1 className="text-sm pb-2">{ownerData.username}</h1>
          <h1 className="text-sm text-gray-400">Active Bookings</h1>
          <h1 className="text-sm">{activeBookings}</h1>
        </div>
        <div className="">
          <h1 className="text-sm text-gray-400">Email</h1>
          <h1 className="text-sm pb-2">{ownerData.email}</h1>
          <h1 className="text-sm text-gray-400">Cancelled Bookings</h1>
          <h1 className="text-sm">{cancelledBookings}</h1>
        </div>
        <div className="">
          <h1 className="text-sm text-gray-400">Contact</h1>
          <h1 className="text-sm pb-2">{ownerData.contact || "N/A"}</h1>
          <h1 className="text-sm text-gray-400">Completed Bookings</h1>
          <h1 className="text-sm">{completedBookings}</h1>
        </div>
        <div className="text-sm text-white flex gap-2">
        {ownerData.status === "Active" ? (
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
            onClick={() => openEditPopup(ownerData)}
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
            onClick={() => openEditPopup(ownerData)}
          >
            <AiFillEdit size={15} />
          </button>
          </>
          )
        }
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
                      stepsValue === "cancelled"
                        ? "bg-[#006CE3] text-white"
                        : ""
                    }`}
                    onClick={() => {
                      setStepsValue("cancelled");
                    }}
                  >
                    Cancelled
                  </td>
                  <td
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
                            ? "No Pending Bookings"
                            : stepsValue === "onGoing"
                            ? "No Ongoing Bookings"
                            : stepsValue === "cancelled"
                            ? "No Cancelled Bookings"
                            : "No Completed Bookings"}
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
          )}
          {activeTab === "parking" && (
            <table className="w-full rounded-2xl bg-white">
              {/* Parking Space Table */}
              <thead>
                <tr className="flex gap-4 items-center px-4 w-full text-md  my-4">
                  <td
                    className={`hover:bg-[#006CE3] hover:text-white px-3 py-1 rounded-full cursor-pointer ${
                      stepsValue2 === "pending" ? "bg-[#006CE3] text-white" : ""
                    }`}
                    onClick={() => setStepsValue2("pending")}
                  >
                    Pending Approval
                  </td>
                  <td
                    className={`hover:bg-[#006CE3] hover:text-white px-3 py-1 rounded-full cursor-pointer ${
                      stepsValue2 === "active" ? "bg-[#006CE3] text-white" : ""
                    }`}
                    onClick={() => setStepsValue2("active")}
                  >
                    Active
                  </td>
                  <td
                    className={`hover:bg-[#006CE3] hover:text-white px-3 py-1 rounded-full cursor-pointer ${
                      stepsValue2 === "inactive"
                        ? "bg-[#006CE3] text-white"
                        : ""
                    }`}
                    onClick={() => setStepsValue2("inactive")}
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
                        <td colSpan="10" className="py-4">
                          {stepsValue2 === "pending"
                            ? "No Pending Approvals"
                            : stepsValue2 === "active"
                            ? "No Active Parking Spaces"
                            : "No Inactive Parking Spaces"}
                        </td>
                      </tr>
                    ) : (
                      <>
                        {filteredParkingData.map((item, index) => (
                          <tr
                            key={index}
                            className="text-sm flex justify-between text-center px-5 py-2 mt-2 border-b"
                          >
                            <td className="w-[15%]">{item.title}</td>
                            <td className="w-[14%]">{item.location}</td>
                            <td className="w-[15%]">zzz</td>
                            <td className="w-[13%]">{item.slots}</td>
                            <td className="w-[15%]">{ownerData.username}</td>
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
                                    onClick={() =>
                                      openConfirmation("approve", item)
                                    }
                                  >
                                    Approve
                                  </button>
                                  <button
                                    className="px-2 py-1 bg-red-600 text-white text-xs rounded-full"
                                    onClick={() =>
                                      openConfirmation("cancel", item)
                                    }
                                  >
                                    Cancel
                                  </button>
                                </>
                              )}
                              {item.status === "Active" && (
                                <>
                                  <button
                                    className="px-2 py-1 bg-[#006CE3] text-white text-xs rounded-full"
                                    onClick={() =>
                                      openConfirmation("deactivate", item)
                                    }
                                  >
                                    Deactivate
                                  </button>
                                  <button
                                    className="px-2 py-1 bg-black text-white rounded-full"
                                    onClick={() => openEditPopup(item)}
                                  >
                                    <AiFillEdit size={15} />
                                  </button>
                                </>
                              )}
                              {item.status === "Inactive" && (
                                <>
                                  <button
                                    className="px-2 py-1 bg-[#006CE3] text-white text-xs rounded-full"
                                    onClick={() =>
                                      openConfirmation("activate", item)
                                    }
                                  >
                                    Activate
                                  </button>
                                  <button
                                    className="px-2 py-1 bg-black text-white rounded-full"
                                    onClick={() => openEditPopup(item)}
                                  >
                                    <AiFillEdit szie={15} />
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
          )}
        </div>
      </div>

      {/* Popup Modal */}
      {isPopupOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3 relative">
            <button className="absolute text-sm" onClick={closeEditPopup}>
              Cancel
            </button>
            <h2 className="text-xl mb-6 text-center">Edit Owner</h2>
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
                onClick={saveOwnerDetails}
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
                : ""}{" "}
              this owner?
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
