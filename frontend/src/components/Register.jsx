import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { emailValidator, passwordValidator } from "../helpers";
import axios from "axios";
import UserContext from "./UserContext";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const user = useContext(UserContext);
  const navigate = useNavigate();

  // if the user is already logged in, take them to home page
  useEffect(() => {
    if (JSON.parse(localStorage.getItem("token_data"))) {
      navigate("/");
    }
  });

  // to clear the error message
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
    if (!email || !password || !confirmPassword) {
      setError("All fields are required");
      return;
    }
    if (!emailValidator(email)) {
      setError("Invalid email");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (!passwordValidator(password) || !passwordValidator(confirmPassword)) {
      setError("Invalid password");
      return;
    }

    // send the data to the server
    try {
      const res = await axios.post("http://localhost:5000/user/register", {
        email,
        password,
      });
      localStorage.setItem("token_data", JSON.stringify(res.data.token));
      // localStorage.setItem("id", JSON.stringify(res.data.id));
      user.setEmail(res.data.email);
      navigate('/')
    } catch (error) {
      setError(error.response.data.error[1]);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      {error && (
        <div className="bg-red-500 text-white py-2 px-4 rounded mb-5">
          <p>{error}</p>
        </div>
      )}
      <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-[200px]">
        <h2 className="font-semibold text-2xl mb-4">Register</h2>
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
        <input
          type="password"
          placeholder="confirm password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="input shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-lg mt-4"
          required
        />
        <button
          onClick={handleSubmit}
          className="button bg-gray-700 hover:bg-black text-white font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-4 block"
        >
          Register
        </button>
        <Link
          to="/login"
          className="link inline-block align-baseline font-thin text-sm text-gray-600 hover:text-blue-800 mt-4"
        >
          Already have an account? Go to Login
        </Link>
      </form>
    </div>
  );
}

export default Register;
