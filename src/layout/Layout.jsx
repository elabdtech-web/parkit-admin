import { useState, useEffect } from "react";
import Navbar from "../components/navbar/Navbar";
import Topbar from "../components/topbar/Topbar";
import { Outlet } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/FirebaseConfig";

export default function Layout() {
  const [isNavbarOpen, setNavbarOpen] = useState(false);
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
        navigate("/admin/dashboard");
      }
      if (!currentUser) {
        navigate("/login");
      }
    });
    return () => unsubscribe();
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
        <Topbar toggleSidebar={toggleNavbar} isOpen={isNavbarOpen} />
        <Outlet />
      </div>
    </div>
  );
}
