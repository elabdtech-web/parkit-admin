import React,{ useState } from "react";
import { IoEyeSharp, IoEyeOffSharp } from "react-icons/io5";
import {useNavigate} from "react-router-dom"

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [visible, setVisible] = useState(false);
    const navigate = useNavigate()

    const forgetPassword = () => {
        navigate("/forgetPassword")
    }
        

  return (
    <div className="h-screen w-full flex flex-col justify-center items-center relative">
        <img src="/Frame 2.png" alt="" className="md:w-[150px] w-[80px] absolute top-4 left-4"/>
      <div className="sm:w-[450px] w-[300px] ">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-semibold mb-1">Welcome Back!</h1>
          <h2 className="text-xs text-[#999999]">
            Login in to your credential account
          </h2>
        </div>
        <div className="sm:p-10 p-6 bg-white rounded-2xl">
          <h5 className="mb-1">Email</h5>
          <input
            type="email"
            placeholder="Enter your email"
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            className="w-full p-2 rounded-full border"
          />
          <h5 className="mt-3 mb-1">Password</h5>
          <div className="relative">
            <input
              type={visible ? "text" : "password"}
              placeholder="Enter your password"
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              className="w-full p-2 rounded-full border"
            />
            <div
              className="absolute right-5 top-3 cursor-pointer"
              onClick={() => setVisible(!visible)}
            >
              {visible ? <IoEyeSharp /> : <IoEyeOffSharp />}
            </div>
          </div>
          <button className="w-full p-2 mt-12 rounded-full bg-[#006CE3] text-white">
            Sign In
          </button>
        </div>
        <h5 className="text-center mt-5 text-xs text-[#999999]" onClick={() => {forgetPassword()}}>
          Do not remember password?{" "}
          <span className="text-[#006CE3] cursor-pointer">Forgot</span>
        </h5>
      </div>
    </div>
  );
}
