import { useState, useEffect } from "react";
import { db } from "../../firebase/FirebaseConfig";
import { getDoc, doc, updateDoc } from "firebase/firestore";
import Loading from "../../components/loadingComponent/LoadingSpinner";
import { toast } from "react-toastify";
import { FaFacebookSquare,FaLinkedin } from "react-icons/fa";
import { SiGmail,SiInstagram } from "react-icons/si";
import { FaSquareXTwitter } from "react-icons/fa6";

export default function AboutUs() {
  const [contactUs, setContactUs] = useState({});
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [edit, setEdit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [facebookUrl, setFacebookUrl] = useState("");
  const [instaUrl, setInstaUrl] = useState("");
  const [gmail, setGmail] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [xUrl, setXUrl] = useState("");

  const fetchAccounts = async () => {
    const docRef = doc(db, "about_us", "contactUsDoc");
    const docSnapshot = await getDoc(docRef);
    if (!docSnapshot.empty) {
      const data = docSnapshot.data();
      setContactUs(data);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  const openEditPopup = (text) => {
    setEdit(text);
    setIsPopupOpen(true);
  };

  const closeEditPopup = () => {
    setEdit(null);
    setIsPopupOpen(false);
    fetchAccounts();
  };

  useEffect(() => {
    if (edit) {
      setFacebookUrl(edit.facebookUrl);
      setInstaUrl(edit.instaUrl);
      setGmail(edit.gmail);
      setLinkedinUrl(edit.linkedinUrl);
      setXUrl(edit.xUrl);
    }
  }, [edit]);

  const saveUpdates = async () => {
    try {
      setLoading(true);
      const updateDocRef = doc(db, "about_us", "contactUsDoc");
      await updateDoc(updateDocRef, {
        facebookUrl: facebookUrl,
        instaUrl: instaUrl,
        gmail: gmail,
        linkedinUrl: linkedinUrl,
        xUrl: xUrl,
      });
      toast.success("Updated Successfully");
      setLoading(false);
      closeEditPopup();
      fetchAccounts();
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
            {contactUs ? (
              <>
                <div className="font-sans text-gray-800 w-full rounded-lg p-3">
                  <h1 className="text-2xl font-bold text-gray-900 mb-4">
                    Contact Us
                  </h1>
                  <p className="flex items-center gap-2 text-base leading-relaxed mb-6">
                    <FaFacebookSquare size={20} />
                    {contactUs.facebookUrl}
                  </p>
                  <p className="flex items-center gap-2 text-base leading-relaxed mb-6">
                    <SiGmail size={20} />
                    {contactUs.gmail}
                  </p>
                  <p className="flex items-center gap-2 text-base leading-relaxed mb-6">
                    <SiInstagram size={20} />
                    {contactUs.instaUrl}
                  </p>
                  <p className="flex items-center gap-2 text-base leading-relaxed mb-6">
                    <FaLinkedin size={20} />
                    {contactUs.linkedinUrl}
                  </p>
                  <p className="flex items-center gap-2 text-base leading-relaxed mb-6">
                    <FaSquareXTwitter size={20} />
                    {contactUs.xUrl}
                  </p>

                  <button
                    className="px-3 py-1 bg-[#006CE3] text-white font-medium rounded transition-colors duration-200"
                    onClick={() => openEditPopup(contactUs)}
                  >
                    Edit
                  </button>
                </div>
              </>
            ) : (
              <>
                <h1>Contact Us Data Is Not Available</h1>
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
            <h2 className="text-xl mb-6 text-center">Edit Accounts</h2>
            <label className="mb-2 text-sm text-gray-400">Facebook Url :</label>
            <input
              type="text"
              value={facebookUrl}
              onChange={(e) => setFacebookUrl(e.target.value)}
              className="w-full p-2 rounded-full border mb-2"
            />
            <label className="mb-2 text-sm text-gray-400">Insta Url :</label>
            <input
              type="text"
              value={instaUrl}
              onChange={(e) => setInstaUrl(e.target.value)}
              className="w-full p-2 rounded-full border mb-2"
            />
            <label className="mb-2 text-sm text-gray-400">Gmail :</label>
            <input
              type="text"
              value={gmail}
              onChange={(e) => setGmail(e.target.value)}
              className="w-full p-2 rounded-full border mb-2"
            />
            <label className="mb-2 text-sm text-gray-400">Linkedin Url :</label>
            <input
              type="text"
              value={linkedinUrl}
              onChange={(e) => setLinkedinUrl(e.target.value)}
              className="w-full p-2 rounded-full border mb-2"
            />
            <label className="mb-2 text-sm text-gray-400">X Url :</label>
            <input
              type="text"
              value={xUrl}
              onChange={(e) => setXUrl(e.target.value)}
              className="w-full p-2 rounded-full border mb-4"
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
