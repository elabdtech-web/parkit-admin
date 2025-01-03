import { useState, useEffect } from "react";
import { IoEyeSharp, IoEyeOffSharp } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../firebase/FirebaseConfig";
import { collection, query, where, getDocs } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const forgetPassword = () => {
    navigate("/forgetPassword");
  };

  const validateFields = () => {
    let validationErrors = {};

    if (!email || !password) {
      toast.error("Please fill both fields");
      return;
    }
    if (email.length > 0 && !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      validationErrors.email = "Email is invalid";
    }

    if (!password) {
      validationErrors.password = "Password is required";
    }
    Object.values(validationErrors).forEach((error) => {
      console.log("Validation error", error);
      toast.error(error);
    });
    return Object.keys(validationErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateFields()) return;
    setLoading(true);
    try {
      const response = await signInWithEmailAndPassword(auth, email, password);
      if (response) {
        const q = query(collection(db, "admin"), where("email", "==", email));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          navigate("/admin/dashboard");
        }
      }
      if (!response) {
        toast.error("No response from server");
      }
    } catch (error) {
      console.log("Error logging in:", error);
      toast.error("Your credentials Incorrect");
    }
    setLoading(false);
  };

  useEffect (()=>{
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        navigate("/admin/dashboard");
      }
      if (!currentUser) {
        navigate("/login");
      }
    });
    return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  return (
    <div className="h-screen w-full flex flex-col justify-center items-center relative">
      <img
        src="/Admin.png"
        alt=""
        className="md:w-[150px] w-[80px] absolute top-4 left-4"
      />
      <form className="sm:w-[450px] w-[300px] " onSubmit={handleSubmit}>
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
          {loading ? (
            <h1
              className="w-full p-2 mt-12 text-center rounded-full bg-[#006CE3] text-white"
            >
              Loading
            </h1>
          ) : (
            <button
              className="w-full p-2 mt-12 rounded-full bg-[#006CE3] text-white"
              type="submit"
            >
              Sign In
            </button>
          )}
        </div>
        <h5
          className="text-center mt-5 text-xs text-[#999999]"
          onClick={() => {
            forgetPassword();
          }}
        >
          Do not remember password?{" "}
          <span className="text-[#006CE3] cursor-pointer">Forgot</span>
        </h5>
      </form>
    </div>
  );
}
