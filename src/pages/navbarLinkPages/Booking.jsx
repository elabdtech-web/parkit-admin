import { useState, useEffect } from "react";
import { db } from "../../firebase/FirebaseConfig";
import {
  collection,
  getDocs,
  query,
  doc,
  getDoc,
  where,
} from "firebase/firestore";
import Loading from "../../components/loadingComponent/LoadingSpinner";
import { toast } from "react-toastify";

export default function Booking() {
  const [stepsValue, setStepsValue] = useState("pending");
  const [bookingRequests, setBookingRequests] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [reviewData, setReviewData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchBookingRequests = async () => {
    try {
      const bookedParkingQuery = query(collection(db, "BookedParking"));

      const querySnapshot = await getDocs(bookedParkingQuery);

      const bookingRequests = await Promise.all(
        querySnapshot.docs.map(async (bookingDoc) => {
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
    } catch (error) {
      toast.error("Error fetching booking data");
      console.log("Error fetching pending requests:", error);
    }
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

  useEffect(() => {
    fetchBookingRequests();
  }, []);

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

  return (
    <div className="p-4 h-[calc(100vh-12vh)] overflow-y-auto">
      <div>
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
                            item.status === "pending"
                              ? "text-red-600"
                              : item.status === "onGoing"
                              ? "text-green-500"
                              : item.status === "canceled"
                              ? "text-yellow-500"
                              : item.status === "completed"
                              ? "text-blue-500 cursor-pointer"
                              : ""
                          }`}
                          onClick={
                            item.status === "completed"
                              ? () =>
                                  fetchUserReview(item.userId) &&
                                  setIsPopupOpen(true)
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

      {isPopupOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative max-h-[80vh] overflow-y-auto">
            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-900 text-sm"
              onClick={() => setIsPopupOpen(false)}
            >
              X
            </button>
            <h2 className="text-xl font-semibold text-center mb-4">
              User Review
            </h2>
            <div className="">
              {loading ? (
                <Loading />
              ) : !reviewData ? (
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
