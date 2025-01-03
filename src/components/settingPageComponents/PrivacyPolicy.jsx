import { useState, useEffect } from "react";
import { db } from "../../firebase/FirebaseConfig";
import { query, collection, getDocs, doc, updateDoc } from "firebase/firestore";
import Loading from "../../components/loadingComponent/LoadingSpinner";
import { toast } from "react-toastify";

export default function AboutUs() {
  const [privacyPolicy, setPrivacyPolicy] = useState({});
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [edit, setEdit] = useState(null);
  const [privacyPolicyText, setPrivacyPolicyText] = useState("");
  const [termsText, setTermsText] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchPrivacyPolicy = async () => {
    const q = query(collection(db, "privacyAndPolicy"));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const data = querySnapshot.docs[0].data();
      setPrivacyPolicy(data);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrivacyPolicy();
  }, []);

  const openEditPopup = (text) => {
    setEdit(text);
    setIsPopupOpen(true);
  };

  const closeEditPopup = () => {
    setEdit(null);
    setIsPopupOpen(false);
    fetchPrivacyPolicy();
  };

  useEffect(() => {
    if (edit) {
      setPrivacyPolicyText(edit.privacypolicyText);
      setTermsText(edit.termstext);
    }
  }, [edit]);

  const saveUpdates = async () => {
    try {
      setLoading(true);
      const updateDocRef = doc(db, "privacyAndPolicy", "privacyPolicyDoc");
      await updateDoc(updateDocRef, {
        privacypolicyText: privacyPolicyText,
        termstext: termsText,
      });
      toast.success("Updated Successfully");
      setLoading(false);
      closeEditPopup();
      fetchPrivacyPolicy();
    } catch (error) {
      toast.error("An error occurred while updating the document.");
      console.error("Error updating document:", error);
    }
  };

  return (
    <div>
      <div className="">
        {loading ? (
          <Loading />
        ) : (
          <>
            {privacyPolicy ? (
              <>
                <div className="font-sans text-gray-800 w-full rounded-lg p-3">
                  <h1 className="text-2xl font-bold text-gray-900 mb-4">
                    Privacy Policy
                  </h1>
                  <p className="text-base leading-relaxed mb-6">
                    {privacyPolicy.privacypolicyText}
                  </p>

                  <h1 className="text-2xl font-bold text-gray-900 mb-4">
                    Terms
                  </h1>
                  <p className="text-base leading-relaxed mb-6">
                    {privacyPolicy.termstext}
                  </p>

                  <button
                    className="px-3 py-1 bg-[#006CE3] text-white font-medium rounded transition-colors duration-200"
                    onClick={() => openEditPopup(privacyPolicy)}
                  >
                    Edit
                  </button>
                </div>
              </>
            ) : (
              <>
                <h1>Privacy Policy Is Not Available</h1>
              </>
            )}
          </>
        )}
      </div>

      {/* Popup Modal */}
      {isPopupOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3 relative">
            <button className="absolute text-sm" onClick={closeEditPopup}>
              Cancel
            </button>
            <h2 className="text-xl mb-6 text-center">Edit Privacy Document</h2>
            <label className="mb-2 text-sm text-gray-400">
              Privacy Policy :
            </label>
            <textarea 
              rows="3"
              type="text-area"
              name="privacyPolicyText"
              value={privacyPolicyText}
              onChange={(e) => setPrivacyPolicyText(e.target.value)}
              className="border p-3 w-full text-sm rounded-md mb-3"
            />
            <label className="mb-2 text-sm text-gray-400">Terms :</label>
            <textarea
              rows="3"
              type="text-area"
              name="termsText"
              value={termsText}
              onChange={(e) => setTermsText(e.target.value)}
              className="border p-3 w-full text-sm rounded-md mb-3"
            />
            {loading ? (
              <Loading />
            ) : (
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded-full text-sm w-full"
                onClick={saveUpdates}
              >
                Update
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
