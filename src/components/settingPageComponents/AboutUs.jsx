import { useState, useEffect } from "react";
import { db } from "../../firebase/FirebaseConfig";
import { getDoc, doc, updateDoc } from "firebase/firestore";
import Loading from "../../components/loadingComponent/LoadingSpinner";
import { toast } from "react-toastify";

export default function AboutUs() {
  const [aboutUs, setAboutUs] = useState({});
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [edit, setEdit] = useState(null);
  const [aboutText, setAboutText] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchAboutUs = async () => {
    const docRef = doc(db, "about_us", "aboutUsDoc");
    const docSnapshot = await getDoc(docRef);
    if (!docSnapshot.empty) {
      const data = docSnapshot.data();
      setAboutUs(data);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAboutUs();
  }, []);

  const openEditPopup = (text) => {
    setEdit(text);
    setIsPopupOpen(true);
  };

  const closeEditPopup = () => {
    setEdit(null);
    setIsPopupOpen(false);
    fetchAboutUs();
  };

  useEffect(() => {
    if (edit) {
      setAboutText(edit.aboutText);
    }
  }, [edit]);

  const saveUpdates = async () => {
    try {
      setLoading(true);
      const updateDocRef = doc(db, "about_us", "aboutUsDoc");
      await updateDoc(updateDocRef, {
        aboutText: aboutText,
      });
      toast.success("Updated Successfully");
      setLoading(false);
      closeEditPopup();
      fetchAboutUs();
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
            {aboutUs ? (
              <>
                <div className="font-sans text-gray-800 w-full rounded-lg p-3">
                  <h1 className="text-2xl font-bold text-gray-900 mb-4">
                    About Us
                  </h1>
                  <p className="text-base leading-relaxed mb-6">
                    {aboutUs.aboutText}
                  </p>

                  <button
                    className="px-3 py-1 bg-[#006CE3] text-white font-medium rounded transition-colors duration-200"
                    onClick={() => openEditPopup(aboutUs)}
                  >
                    Edit
                  </button>
                </div>
              </>
            ) : (
              <>
                <h1>About Us Text Is Not Available</h1>
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
            <h2 className="text-xl mb-6 text-center">Edit About Us Document</h2>
            <label className="mb-2 text-sm text-gray-400">
              About Us :
            </label>
            <textarea 
              rows="10"
              type="text-area"
              name="aboutText"
              value={aboutText}
              onChange={(e) => setAboutText(e.target.value)}
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
