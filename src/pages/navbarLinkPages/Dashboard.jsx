import Card from "../../components/dashboardComponents/Card";
import { TiFilter } from "react-icons/ti";
import { useState, useEffect } from "react";
import { db } from "../../firebase/FirebaseConfig";
import {
  or,
  collection,
  query,
  getDocs,
  where,
  getDoc,
  doc,
} from "firebase/firestore";
import Loading from "../../components/loadingComponent/LoadingSpinner";
import { toast } from "react-toastify";


export default function Dashboard() {
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalOwners, setTotalOwners] = useState(0);
  const [activeBookings, setActiveBookings] = useState(0);
  const [thisMonthEarning, setThisMonthEarning] = useState(0);
  const [bookingRequests, setBookingRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTotalUsers = async () => {
    try {
      const q = query(collection(db, "users"));
      const querySnapshot = await getDocs(q);
      setTotalUsers(querySnapshot.size);
    } catch (error) {
      console.error("Error fetching total users data:", error);
    }
  };

  const fetchTotalOwners = async () => {
    try {
      const q = query(collection(db, "owners"));
      const querySnapshot = await getDocs(q);
      setTotalOwners(querySnapshot.size);
    } catch (error) {
      console.error("Error fetching total owners data:", error);
    }
  };

  const fetchActiveBookings = async () => {
    try {
      const q = query(
        collection(db, "BookedParking"),
        or(where("status", "==", "onGoing"), where("status", "==", "pending"))
      );
      const querySnapshot = await getDocs(q);
      setActiveBookings(querySnapshot.size);
    } catch (error) {
      console.error("Error fetching active bookings data:", error);
    }
  };

  const fetchBookingRequests = async () => {
    try {
      const bookedParkingQuery = query(
        collection(db, "BookedParking"),
        where("status", "==", "pending")
      );

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
      setBookingRequests(validBookingRequests); // Update state with fetched data
      setLoading(false);
    } catch (error) {
      toast.error("Error fetching booking requests");
      console.log("Error fetching pending requests:", error);
    }
  };

  const fetchThisMonthEarning = async () => {
    try {
      const now = new Date();
      const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const lastDayOfMonth = new Date(
        now.getFullYear(),
        now.getMonth() + 1,
        0,
        23,
        59,
        59
      );

      const q = query(
        collection(db, "BookedParking"),
        where("status", "==", "completed"),
        where("date", ">=", firstDayOfMonth),
        where("date", "<=", lastDayOfMonth)
      );

      const querySnapshot = await getDocs(q);
      const totalEarnings = querySnapshot.docs.reduce((sum, doc) => {
        const data = doc.data();
        const price = data.totalAmount;

        if (typeof price === "string") {
          const parsedPrice = parseFloat(price.replace(/[^0-9.]/g, ""));
          return sum + (parsedPrice || 0);
        } else if (typeof price === "number") {
          return sum + price;
        }
        return sum;
      }, 0);
      setThisMonthEarning(Math.floor(totalEarnings));
    } catch (error) {
      console.log("Error fetching this month earning:", error);
    }
  };

  useEffect(() => {
    fetchTotalUsers();
    fetchTotalOwners();
    fetchActiveBookings();
    fetchThisMonthEarning();
    fetchBookingRequests();
  }, []);

  {
    /* Card Data */
  }
  const cardData = [
    {
      id: 1,
      icon: <img src="/Vector (2).png" alt="" />,
      title: "Total Users",
      number: totalUsers,
    },
    {
      id: 2,
      icon: <img src="/Vector (3).png" alt="" />,
      title: "Total Owners",
      number: totalOwners,
    },
    {
      id: 3,
      icon: <img src="/Vector (4).png" alt="" />,
      title: "Active Bookings",
      number: activeBookings,
    },
    {
      id: 4,
      icon: <img src="/Vector (5).png" alt="" />,
      title: "This Month Earning",
      number: "$" + thisMonthEarning,
    },
  ];

  return (
    <div className="p-4 h-[calc(100vh-12vh)] overflow-y-auto">
      {/* Dashboard Cards */}
      <div className="grid lg:grid-cols-4 gap-3 grid-cols-2 ">
        {cardData.map((item) => (
          <Card
            key={item.id}
            icon={item.icon}
            title={item.title}
            number={item.number}
          />
        ))}
      </div>

      {/* Table */}
      <div className="mt-5">
        <table className="w-full rounded-2xl bg-white ">
          {/* Table Header */}
          <thead>
            <tr className="flex justify-between items-center px-4 w-full text-xl mt-3">
              <th className="font-normal">New Booking Request</th>
              <th>
                <TiFilter
                  color="white"
                  className="bg-[#006CE3] rounded-full w-[25px] h-[25px] p-1"
                />
              </th>
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
                {bookingRequests.length === 0 ? (
                  <tr className="text-center">
                    <td colSpan="10" className="py-4">
                      No Booking Requests
                    </td>
                  </tr>
                ) : (
                  <>
                    {bookingRequests.map((item, index) => (
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
                        <td className="w-[8%] text-red-600">{item.status}</td>
                      </tr>
                    ))}
                  </>
                )}
              </>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
