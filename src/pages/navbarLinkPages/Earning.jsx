import { useState, useEffect } from "react";
import { HiMiniArrowTrendingUp } from "react-icons/hi2";
import { FaRegEye } from "react-icons/fa";
import { GoDotFill } from "react-icons/go";
import { FaArrowTrendDown } from "react-icons/fa6";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { db } from "../../firebase/FirebaseConfig";
import {
  collection,
  query,
  getDocs,
  where,
  doc,
  getDoc,
} from "firebase/firestore";
import Loading from "../../components/loadingComponent/LoadingSpinner";
import { toast } from "react-toastify";

export default function Earning() {
  const [thisMonthEarning, setThisMonthEarning] = useState(0);
  const [lastMonthEarning, setLastMonthEarning] = useState(0);
  const [thisYearEarning, setThisYearEarning] = useState(0);
  const [lastYearEarning, setLastYearEarning] = useState(0);
  const [payoutDetails, setPayoutDetails] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMonthsEarning = async () => {
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
      const firstDayOfLastMonth = new Date(
        now.getFullYear(),
        now.getMonth() - 1,
        1
      );
      const lastDayOfLastMonth = new Date(
        now.getFullYear(),
        now.getMonth(),
        0,
        23,
        59,
        59
      );
      const firstDayOfThisYear = new Date(now.getFullYear(), 0, 1);
      const lastDayOfThisYear = new Date(now.getFullYear(), 11, 31, 23, 59, 59);

      const firstDayOfLastYear = new Date(now.getFullYear() - 1, 0, 1);
      const lastDayOfLastYear = new Date(
        now.getFullYear() - 1,
        11,
        31,
        23,
        59,
        59
      );

      const q = query(
        collection(db, "BookedParking"),
        where("status", "==", "completed")
      );

      const querySnapshot = await getDocs(q);
      let thisMonthEarnings = 0;
      let lastMonthEarnings = 0;
      let thisYearEarnings = 0;
      let lastYearEarnings = 0;

      querySnapshot.docs.forEach((doc) => {
        const data = doc.data();
        const price = data.totalAmount;
        const date = data.date?.toDate();

        if (date >= firstDayOfMonth && date <= lastDayOfMonth) {
          if (typeof price === "string") {
            const parsedPrice = parseFloat(price.replace(/[^0-9.]/g, ""));
            thisMonthEarnings += parsedPrice || 0;
          }
        }
        if (date >= firstDayOfLastMonth && date <= lastDayOfLastMonth) {
          if (typeof price === "string") {
            const parsedPrice = parseFloat(price.replace(/[^0-9.]/g, ""));
            lastMonthEarnings += parsedPrice || 0;
          }
        }
        if (date >= firstDayOfThisYear && date <= lastDayOfThisYear) {
          if (typeof price === "string") {
            const parsedPrice = parseFloat(price.replace(/[^0-9.]/g, ""));
            thisYearEarnings += parsedPrice || 0;
          }
        }
        if (date >= firstDayOfLastYear && date <= lastDayOfLastYear) {
          if (typeof price === "string") {
            const parsedPrice = parseFloat(price.replace(/[^0-9.]/g, ""));
            lastYearEarnings += parsedPrice || 0;
          }
        }
      });

      setThisMonthEarning(Math.floor(thisMonthEarnings));
      setLastMonthEarning(Math.floor(lastMonthEarnings));
      setThisYearEarning(Math.floor(thisYearEarnings));
      setLastYearEarning(Math.floor(lastYearEarnings));
    } catch (error) {
      console.log("Error fetching this month earning:", error);
    }
  };

  const fetchPayoutsDetails = async () => {
    try {
      const q = query(collection(db, "withdrawRequests"),
        where("status", "==", "Confirmed"));
      const querySnapshot = await getDocs(q);
      const PayoutRequests = await Promise.all(
        querySnapshot.docs.map(async (withDrawDoc) => {
          const payoutRequest = withDrawDoc.data();
          const date = payoutRequest.dateTime.toDate();
          const formattedDate = date.toLocaleDateString("en-US", {
            day: "numeric",
            month: "short",
            year: "numeric",
          });

          const { ownerId } = payoutRequest;
          const ownerSnapshot = await getDoc(doc(db, "owners", ownerId));
          const ownerName = ownerSnapshot.exists()
            ? ownerSnapshot.data().username
            : "Unknown";

          return {
            ...payoutRequest,
            formattedDate,
            ownerName,
          };
        })
      );

      setPayoutDetails(PayoutRequests);
      setLoading(false);
    } catch (error) {
      toast.error("Error fetching payouts details");
      console.log("Error fetching payouts details:", error);
    }
  };

  useEffect(() => {
    fetchMonthsEarning();
    fetchPayoutsDetails();
  }, []);

  return (
    <div className="p-4 h-[calc(100vh-12vh)] overflow-y-auto">
      {/* Cards */}
      <div className="grid xl:grid-cols-3 md:grid-cols-2 gap-4">
        <div className="p-4 bg-[#0065FF]  h-[150px] rounded-2xl text-white flex flex-col justify-between">
          <div className="flex justify-between">
            <h1 className="text-sm">This Month Earning</h1>
            <HiMiniArrowTrendingUp className="" size={22} />
          </div>
          <div className="flex justify-between mb-4 text-lg">
            <h1 className="font-bold">{`$${thisMonthEarning}`}</h1>
            <FaRegEye className="border w-[30px] h-[30px] p-1 text-black bg-white rounded-md" />
          </div>
        </div>
        <div className="p-4  h-[150px] rounded-2xl bg-white flex flex-col justify-between">
          <div className="flex justify-between">
            <h1 className="text-sm">Last Month Earning</h1>
            <HiMiniArrowTrendingUp className="" size={22} />
          </div>
          <div className="flex justify-between mb-4 text-lg">
            <h1 className="font-bold">{`$${lastMonthEarning}`}</h1>
            <FaRegEye className="border w-[30px] h-[30px] p-1 text-white bg-[#0065FF] rounded-md" />
          </div>
        </div>
        <div className="p-4 bg-white  h-[150px] rounded-2xl flex justify-between">
          <div>
            <h1 className="text-sm text-gray-400 pb-3">Statistics</h1>
            <div className="flex items-center pb-1">
              <GoDotFill className="text-[#0065FF]" />
              <h1 className="text-xs text-gray-400">Total Income</h1>
            </div>
            <div className="flex items-center">
              <GoDotFill className="text-blue-300" />
              <h1 className="text-xs text-gray-400">Total Commission</h1>
            </div>
          </div>
          <div className="w-[100px] h-[100px]">
            <CircularProgressbar
              value={60}
              strokeWidth={50}
              styles={buildStyles({
                strokeLinecap: "butt",
              })}
            />
          </div>
        </div>
      </div>

      {/* Graph */}
      <div className="bg-white rounded-2xl mt-4 p-2">
        <div className="flex items-center text-xs text-gray-400">
          <h1 className="pr-10 text-base text-black">Daily Earning</h1>
          <GoDotFill className="text-green-500" />
          <h1 className="pr-6">Total Income</h1>
          <GoDotFill className="text-[#0065FF]" />
          <h1>Commission</h1>
        </div>
        <div className="relative pt-8">
          <img src="/Vector 25.png" alt="" />
          <img src="/Vector 26.png" alt="" className="absolute top-12" />
          <img src="/Frame 92.png" alt="" />
        </div>
      </div>

      {/* Table */}
      <div className="mt-4 flex max-xl:flex-col justify-between xl:items-start gap-4">
        <div className="text-xs xl:w-[70%] bg-white p-2 rounded-2xl order-2 xl:order-1">
          <h1 className="pr-10 pb-3 text-base text-black">Payment History</h1>
          <table className="w-full">
            <thead>
              <tr className="text-xs rounded-full">
                <th className="w-[16%] text-center">Date</th>
                <th className="w-[16%] text-center">Owner Name</th>
                <th className="w-[12%] text-center ">Amount</th>
                <th className="w-[24%] text-center">IBAN</th>
                <th className="w-[24%] text-center">Transaction ID</th>
                <th className="w-[20%] text-center">Bank Name</th>
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
                  {payoutDetails.length === 0 ? (
                    <tr className="text-center">
                      <td colSpan="10" className="py-4 text-base">
                        No Payouts Found
                      </td>
                    </tr>
                  ) : (
                    <>
                      {payoutDetails.map((item, index) => (
                        <tr
                          key={index}
                          className="text-sm  text-center border-b py-2"
                        >
                          <td className="text-center w-[16%]">
                            {item.formattedDate}
                          </td>
                          <td className="text-center w-[16%]">{item.ownerName}</td>
                          <td className="text-center w-[12%]">{item.amount}</td>
                          <td className="text-center w-[24%]">
                            {item.selectedCard.iban}
                          </td>
                          <td className="text-center w-[24%]">
                            {item.transactionId}
                          </td>
                          <td className="text-center w-[20%]">
                            {item.selectedCard.bankName}
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
        <div className="text-sm xl:w-[28%]  bg-white p-2 rounded-2xl flex flex-col justify-between h-[150px] order-1 xl:order-2">
          <h1>Total Earning This Year</h1>
          <div className="flex items-center gap-1">
            <h1 className="font-bold text-lg">{`$${thisYearEarning}`}</h1>
            <FaArrowTrendDown className="rotate-90 text-green-500" />
          </div>
          <h1>
            Last Year Earning :
            <span className="font-bold">{`$${lastYearEarning}`}</span>
          </h1>
        </div>
      </div>
    </div>
  );
}
