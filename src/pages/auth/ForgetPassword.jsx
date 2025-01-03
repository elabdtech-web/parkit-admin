import { useState } from "react";
import {useNavigate} from "react-router-dom"

export default function ForgetPassword() {
    const [email, setEmail] = useState("");
    const navigate = useNavigate()

    const handleResetPassword = () => {
        navigate("/login")
    }


  return (
    <div className="h-screen w-full  flex flex-col justify-center items-center relative">
        <img src="/Admin.png" alt="" className="md:w-[150px] w-[80px] absolute top-4 left-4"/>
      <div className="sm:w-[450px] w-[300px]">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-semibold mb-1">Forgot Password!</h1>
          <h2 className="text-xs text-[#999999]">
            Recover your access
          </h2>
        </div>
        <div className="sm:p-10 p-6 bg-white rounded-2xl sm:h-[320px] h-[290px] flex flex-col justify-between">
            <div>
          <h5 className="mb-1">Email</h5>
          <input
            type="email"
            value={email}
            placeholder="Enter your email"
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            className="w-full p-2 rounded-full border"
          />
          </div>
          <div>
          <button className="w-full p-2 mt-12 rounded-full bg-[#006CE3] text-white" onClick={() => {handleResetPassword()}}>
            Reset Password
          </button>
          </div>
        </div>
        <h5 className="text-center mt-5 text-xs text-[#999999] cursor-pointer" onClick={() => {navigate("/login")}}>
          Login
        </h5>
      </div>
    </div>
  );
}
