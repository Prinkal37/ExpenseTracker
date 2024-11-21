import React, { useState, useEffect, useRef } from "react";
import { CgProfile } from "react-icons/cg";
import { IoMdLogOut } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";

// this syntax is to let typescript know that Navbar is a React Functional Component
const Topbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const navigate = useNavigate();  // Define navigate outside the function

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const handleLogout = () => {
    // Clear session data (e.g., token, user info)
    localStorage.removeItem("accessToken");
    sessionStorage.removeItem("user");

    // Log out message (optional for debugging)
    console.log("User logged out");

    // Redirect the user to the Signin page
    navigate("/signin");  // Redirect using the navigate hook
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="border-b-2 border-black bg-white h-[3rem] flex items-center justify-between p-4 sticky top-0">
      <header className="text-2xl font-semibold">Expense Tracker</header>
      <div className="relative" ref={menuRef}>
        <CgProfile className="text-3xl cursor-pointer" onClick={toggleMenu} />
        {isMenuOpen && (
          <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-300 rounded shadow-lg">
            <ul className="py-1">
              <li className="px-4 py-2 text-sm text-gray-700 font-bold hover:bg-gray-100 cursor-pointer flex items-center gap-2">
                <Link to="/" className="flex items-center gap-2">
                  Home
                </Link>
              </li>
              <li className="px-4 py-2 text-sm text-gray-700 font-bold hover:bg-gray-100 cursor-pointer flex items-center gap-2">
                <Link to="/add" className="flex items-center gap-2">
                  Add Transactions
                </Link>
              </li>
              <li
                className="px-4 py-2 text-sm text-gray-700 font-bold hover:bg-gray-100 cursor-pointer flex items-center gap-2"
                onClick={handleLogout}
              >
                <IoMdLogOut className="text-red-700" />
                Log out
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Topbar;
