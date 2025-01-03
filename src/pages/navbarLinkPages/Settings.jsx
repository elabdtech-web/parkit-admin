import { useState } from "react";
import PrivacyPolicy from "../../components/settingPageComponents/PrivacyPolicy";
import AboutUs from "../../components/settingPageComponents/AboutUs";
import Accounts from "../../components/settingPageComponents/Accounts";

export default function Settings() {
  const [stepsValue, setStepsValue] = useState("privacypolicy");
  return (
    <div className="h-[calc(100vh-12vh)] overflow-y-auto">
      <div className="p-4">
        <div className="w-full rounded-2xl p-4 bg-white">
          <div className="flex gap-4 items-center w-full text-md ">
            <button
              className={`hover:bg-[#006CE3] hover:text-white px-3 py-1 rounded-full cursor-pointer ${
                stepsValue === "privacypolicy" ? "bg-[#006CE3] text-white" : ""
              }`}
              onClick={() => setStepsValue("privacypolicy")}
            >
              Privacy Policy
            </button>
            <button
              className={`hover:bg-[#006CE3] hover:text-white px-3 py-1 rounded-full cursor-pointer ${
                stepsValue === "aboutus" ? "bg-[#006CE3] text-white" : ""
              }`}
              onClick={() => setStepsValue("aboutus")}
            >
              About Us
            </button>
            <button
              className={`hover:bg-[#006CE3] hover:text-white px-3 py-1 rounded-full cursor-pointer ${
                stepsValue === "accounts" ? "bg-[#006CE3] text-white" : ""
              }`}
              onClick={() => setStepsValue("accounts")}
            >
              Accounts
            </button>
          </div>
          <div className="pt-4">{stepsValue === "privacypolicy" && <><PrivacyPolicy/></>}{stepsValue === "aboutus" && <><AboutUs/></>}{stepsValue === "accounts" && <><Accounts/></>}</div>
        </div>
      </div>
    </div>
  );
}
