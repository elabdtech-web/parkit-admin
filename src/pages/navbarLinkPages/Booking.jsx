import {useState, useEffect} from "react";
import { db } from "../../firebase/FirebaseConfig";
import { collection, getDocs, query,doc, getDoc } from "firebase/firestore";


export default function Booking() {
    const [stepsValue,setStepsValue] = useState("pending")
    const [bookingRequests, setBookingRequests] = useState([]);


    const fetchBookingRequests = async () => {
      try {
        const bookedParkingQuery = query(
          collection(db, "BookedParking")
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
            })
            const formattedTime = date.toLocaleTimeString("en-US", {
              hour: "numeric",
              minute: "numeric",
              hour12: true,
            });
            const { parkId, ownerId, userId } = data;
    
            // Ensure the IDs exist before attempting to fetch data
            if (!parkId || !ownerId || !userId) {
              console.warn("Missing parkingId, ownerId, or userId in document:", bookingDoc.id);
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
    
        console.log("Booking requests:", validBookingRequests);
        setBookingRequests(validBookingRequests); // Update state with fetched data
      } catch (error) {
        console.log("Error fetching pending requests:", error);
      }
    }

    useEffect(() => {
      fetchBookingRequests();
    }, [])


  const filteredData = bookingRequests.filter((item) =>
    stepsValue === "pending"
      ? item.status === "pending"
      : stepsValue === "onGoing"
      ? item.status === "onGoing"
      : stepsValue === "cancelled"
      ? item.status === "cancelled"
      : stepsValue === "completed"
      ? item.status === "completed"
      : true
  );

  return (
    <div className="p-4 h-[calc(100vh-12vh)] overflow-y-auto">
      <div>
        <table className="w-full rounded-2xl bg-white  overflow-x-auto max-[1350px]:overflow-x-scroll">
          {/* Table Header */}
          <thead>
            <tr className="flex gap-4 items-center px-4 w-full text-md  my-4">
                <button className={`hover:bg-[#006CE3] hover:text-white px-3 py-1 rounded-full cursor-pointer ${stepsValue=== "pending" ? "bg-[#006CE3] text-white" : ""}`}  onClick={()=>{setStepsValue("pending")}}>Pending</button>
                <button className={`hover:bg-[#006CE3] hover:text-white px-3 py-1 rounded-full cursor-pointer ${stepsValue=== "onGoing" ? "bg-[#006CE3] text-white" : ""}`}   onClick={()=>{setStepsValue("onGoing")}}>On Going</button>
                <button className={`hover:bg-[#006CE3] hover:text-white px-3 py-1 rounded-full cursor-pointer ${stepsValue=== "cancelled" ?"bg-[#006CE3] text-white" : ""}`}   onClick={()=>{setStepsValue("cancelled")}}>Cancelled</button>
                <button className={`hover:bg-[#006CE3] hover:text-white px-3 py-1 rounded-full cursor-pointer ${stepsValue=== "completed" ?"bg-[#006CE3] text-white" : ""}`}   onClick={()=>{setStepsValue("completed")}}>Completed</button>
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
                <td className={`w-[8%]  ${item.status === "pending" ? "text-red-500" : item.status === "onGoing" ? "text-green-500" : item.status === "cancelled" ? "text-yellow-500" : item.status === "completed" ? "text-blue-500 cursor-pointer" : ""}`}>{item.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
