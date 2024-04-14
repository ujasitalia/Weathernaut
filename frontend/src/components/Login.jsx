import axios from "axios";
import React, { useEffect, useState, useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import UserContext from "./UserContext";
import { emailValidator, passwordValidator } from "../helpers";

function Login() {
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const user = useContext(UserContext);
  const location = useLocation();
  const message = location.state?.message;

  // if the user is already logged in, take them to home page
  useEffect(() => {
    if (JSON.parse(localStorage.getItem("token_data"))) {
      navigate("/");
    }

    if (message) {
      setError(message);
    }
  });

  // useEffect to clear the error message
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(""), 4000);
      // when the component unmounts, we need to clear the timer
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // validate email and password
    if (!email || !password) {
      setError("All fields are required");
      return;
    }
    if (!emailValidator(email)) {
      setError("Invalid email");
      return;
    }
    if (!passwordValidator(password)) {
      setError("Invalid password");
      return;
    }

    // send the data to the server
    try {
      const res = await axios.post(
        "https://weathernaut-api.onrender.com/user/login",
        {
          email,
          password,
        }
      );
      localStorage.setItem("token_data", JSON.stringify(res.data.token));
      user.setEmail(res.data.email);
      navigate("/");
    } catch (error) {
      console.log(error);
      setError(error.response.data.error[1]);
    }
  };

  return (
    <div>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        {error && (
          <div className="bg-red-500 text-white py-2 px-4 rounded mb-5">
            <p>{error}</p>
          </div>
        )}
        <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-[200px]">
          <h2 className="font-semibold text-2xl mb-4">Login</h2>
          <input
            type="email"
            placeholder="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-lg"
            required
          />
          <input
            type="password"
            placeholder="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-lg mt-4"
            required
          />
          <button
            className="button bg-gray-700  hover:bg-black text-white font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-4 block"
            onClick={handleSubmit}
          >
            Login
          </button>
          <Link
            to="/register"
            className="link inline-block align-baseline font-thin text-sm text-gray-600 hover:text-blue-800 mt-4"
          >
            Don't have an account? Go to Register
          </Link>
        </form>
      </div>
    </div>
  );
}

export default Login;
