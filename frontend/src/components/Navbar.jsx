import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import UserContext from "./UserContext";

function Navbar() {
  const context = useContext(UserContext);
  const email = context.email || null;
  const navigate = useNavigate();

  // to logout: clear the token and redirect to login
  const handleLogout = (e) => {
    localStorage.clear();
    context.setEmail(null);
    navigate("/login");
  };

  return (
    <div className="bg-white shadow-lg p-4 flex justify-between items-center font-semibold">
      <Link to="/" className="text-black hover:text-gray-700 px-2 py-1">
        Weathernaut
      </Link>
      <div className="flex items-center">
        {/* if email: display username or else register*/}
        {email ? (
          <p className="text-black hover:text-gray-700 px-2 py-1 font-semibold">
            {email.split("@")[0]}
          </p>
        ) : (
          <Link
            to="/register"
            className="text-black hover:text-gray-700 px-2 py-1 font-semibold"
          >
            Register
          </Link>
        )}
        {/* if email: display logout or else login  */}
        {email ? (
          <p
            className="text-black hover:text-gray-700 px-2 py-1 cursor-pointer font-semibold"
            onClick={handleLogout}
          >
            Logout
          </p>
        ) : (
          <Link
            to="/login"
            className="text-black hover:text-gray-700 px-2 py-1 font-semibold"
          >
            Login
          </Link>
        )}
      </div>
    </div>
  );
}

export default Navbar;
