import { useState, useEffect } from "react";
import { db } from "../../firebase/FirebaseConfig";
import {
  collection,
  getDocs,
  query,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { toast } from "react-toastify";
import Loading from "../../components/loadingComponent/LoadingSpinner";

export default function PayoutRequests() {
  const [stepsValue, setStepsValue] = useState("Pending");
  const [payoutRequests, setPayoutRequests] = useState([]);
  const [confirmationAction, setConfirmationAction] = useState("");
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [transactionId, setTransactionId] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchPayoutRequests = async () => {
    try {
      const q = query(collection(db, "withdrawRequests"));
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
          const formattedTime = date.toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "numeric",
            hour12: true,
          });

          const { ownerId } = payoutRequest;
          const ownerSnapshot = await getDoc(doc(db, "owners", ownerId));
          const ownerName = ownerSnapshot.exists()
            ? ownerSnapshot.data().username
            : "Unknown";

          return {
            ...payoutRequest,
            formattedDate,
            formattedTime,
            ownerName,
          };
        })
      );
      setPayoutRequests(PayoutRequests);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching payout requests data:", error);
    }
  };

  useEffect(() => {
    fetchPayoutRequests();
  }, []);

  const filteredPayoutRequests = payoutRequests.filter((item) =>
    stepsValue === "Pending"
      ? item.status === "Pending"
      : stepsValue === "Approved"
      ? item.status === "Confirmed" || item.status === "Approved"
      : stepsValue === "Rejected"
      ? item.status === "Rejected" ||
        item.status === "Cancelled" ||
        item.status === "Canceled"
      : true
  );

  const handleReject = async () => {
    try {
      const requestRef = doc(db, "withdrawRequests", selectedRequest.id);
      await updateDoc(requestRef, {
        status: "Cancelled",
      });
      fetchPayoutRequests();
      closeConfirmation();
      toast.success("Payout request rejected successfully.");
    } catch (error) {
      console.error("Error rejecting payout request:", error);
      toast.error("An error occurred while rejecting the payout request.");
    }
  };

  const handleApprove = async () => {
    if (!transactionId) {
      toast.error("Please enter a transaction ID.");
      return;
    }

    try {
      const requestRef = doc(db, "withdrawRequests", selectedRequest.id);
      await updateDoc(requestRef, {
        status: "Confirmed",
        transactionId: transactionId,
      });
      fetchPayoutRequests();
      closeConfirmation();
      toast.success("Payout request approved successfully.");
    } catch (error) {
      console.error("Error approving payout request:", error);
      toast.error("An error occurred while approving the payout request.");
    }
  };

  const openConfirmation = (action, request) => {
    setConfirmationAction(action);
    setSelectedRequest(request);
    setIsConfirmationOpen(true);
  };

  const closeConfirmation = () => {
    setConfirmationAction("");
    setSelectedRequest(null);
    setIsConfirmationOpen(false);
  };

  return (
    <div className="p-4 h-[calc(100vh-12vh)] overflow-y-auto">
      <div className="">
        <table className="w-full rounded-2xl bg-white">
          {/* Parking Space Table */}
          <thead>
            <tr className="flex gap-4 items-center px-4 w-full text-md  my-4">
              <td
                className={`hover:bg-[#006CE3] hover:text-white px-3 py-1 rounded-full cursor-pointer ${
                  stepsValue === "Pending" ? "bg-[#006CE3] text-white" : ""
                }`}
                onClick={() => setStepsValue("Pending")}
              >
                Pending Approval
              </td>
              <td
                className={`hover:bg-[#006CE3] hover:text-white px-3 py-1 rounded-full cursor-pointer ${
                  stepsValue === "Approved" ? "bg-[#006CE3] text-white" : ""
                }`}
                onClick={() => setStepsValue("Approved")}
              >
                Approved
              </td>
              <td
                className={`hover:bg-[#006CE3] hover:text-white px-3 py-1 rounded-full cursor-pointer ${
                  stepsValue === "Rejected" ? "bg-[#006CE3] text-white" : ""
                }`}
                onClick={() => setStepsValue("Rejected")}
              >
                Rejected
              </td>
            </tr>
            <tr className="text-sm text-blue-500 bg-blue-50 flex justify-between items-center px-5 rounded-full py-2 mt-2">
              <th className="w-[12%]">Date </th>
              <th className="w-[8%]">Time</th>
              <th className="w-[10%]">Owner Name</th>
              <th className="w-[13%]">Bank Name</th>
              <th className="w-[17%]">IBAN</th>
              <th className="w-[10%]">Amount</th>
              {stepsValue === "Approved" && (
                <th className="w-[15%]">Transaction ID</th>
              )}
              <th className="w-[20%]">Action</th>
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
                {filteredPayoutRequests.length === 0 ? (
                  <tr className="text-center">
                    <td colSpan="10" className="py-4">
                      {stepsValue === "Pending"
                        ? "No pending payout requests"
                        : stepsValue === "Approved"
                        ? "No approved payout requests"
                        : "No rejected payout requests"}
                    </td>
                  </tr>
                ) : (
                  <>
                    {filteredPayoutRequests.map((item, index) => (
                      <tr
                        key={index}
                        className="text-sm flex justify-between items-center text-center px-5 py-2 mt-2 border-b"
                      >
                        <td className="w-[12%]">{item.formattedDate}</td>
                        <td className="w-[8%]">{item.formattedTime}</td>
                        <td className="w-[10%]">{item.ownerName}</td>
                        <td className="w-[13%]">
                          {item.selectedCard.bankName}
                        </td>
                        <td className="w-[17%]">{item.selectedCard.iban}</td>
                        <td className="w-[10%]">{item.amount}</td>
                        {stepsValue === "Approved" && (
                          <td className="w-[15%]">{item.transactionId}</td>
                        )}
                        <td className="w-[20%] flex justify-center items-center gap-2">
                          {stepsValue === "Pending" && (
                            <>
                              <button
                                className="px-2 py-1 bg-[#006CE3] text-white rounded-full"
                                onClick={() =>
                                  openConfirmation("approve", item)
                                }
                              >
                                Approve
                              </button>
                              <button
                                className="px-2 py-1 bg-red-600 text-white rounded-full"
                                onClick={() => openConfirmation("reject", item)}
                              >
                                Reject
                              </button>
                            </>
                          )}
                          {stepsValue === "Approved" ||
                            (stepsValue === "Rejected" && (
                              <>
                                <h1
                                  className={`${
                                    stepsValue === "Rejected"
                                      ? "text-red-600"
                                      : "text-[#006CE3]"
                                  }`}
                                >
                                  {item.status}
                                </h1>
                              </>
                            ))}
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

      {isConfirmationOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 ">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3 h-[250px] flex flex-col justify-center items-center relative">
            <button
              className="absolute top-3 left-3 text-sm"
              onClick={closeConfirmation}
            >
              Cancel
            </button>
            <h2 className="text-xl">
              {confirmationAction === "approve"
                ? "Approve"
                : confirmationAction === "reject"
                ? "Reject"
                : ""}{" "}
              Payout Request
            </h2>
            {confirmationAction === "approve" ? (
              <>
                <div className="w-full flex flex-col mt-5 text-sm">
                  <label htmlFor="transaction-id" className="text-gray-400">
                    Transaction ID
                  </label>
                  <input
                    type="text"
                    id="transaction-id"
                    value={transactionId}
                    placeholder="Enter Transaction ID"
                    onChange={(e) => setTransactionId(e.target.value)}
                    className="border border-gray-300 rounded-full px-2 py-2 mt-1 mb-5"
                  />
                </div>
                <button
                  className={`px-4 py-2 bg-[#006CE3] text-white rounded-full w-full`}
                  onClick={handleApprove}
                >
                  Approve
                </button>
              </>
            ) : (
              <>
                <h2 className="text-sm text-gray-400 mb-6 text-center">
                  Are you sure you want to {confirmationAction} this request?
                </h2>
                <button
                  className={`px-4 py-2 bg-[#006CE3] text-white rounded-full w-full`}
                  onClick={handleReject}
                >
                  {confirmationAction === "reject" ? "Reject" : ""}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
