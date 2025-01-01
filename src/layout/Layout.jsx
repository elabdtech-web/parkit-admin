import { useState, useEffect } from "react";
import Navbar from "../components/navbar/Navbar";
import Topbar from "../components/topbar/Topbar";
import { Outlet } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/FirebaseConfig";

export default function Layout() {
  const [isNavbarOpen, setNavbarOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      const isMdOrAbove = window.matchMedia("(min-width: 768px)").matches;
      setNavbarOpen(isMdOrAbove);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        navigate("/dashboard");
      }
      if (!currentUser) {
        navigate("/");
      }
    });
    return () => unsubscribe();
  }, []);

  const toggleNavbar = () => {
    setNavbarOpen(!isNavbarOpen);
  };
  return (
    <div className="flex">
      {isNavbarOpen && (
        <Navbar toggleNavbar={toggleNavbar} isOpen={isNavbarOpen} />
      )}
      <div className="flex-1">
        <Topbar />
        <Outlet />
      </div>
    </div>
  );
}
