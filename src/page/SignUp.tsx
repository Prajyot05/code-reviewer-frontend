import React, { useContext, useEffect, useState } from "react";
import LoginBtn from "../components/FillerBtn";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";

const SignUp: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { isAuthenticated, loading } = useContext(AuthContext)!;

  useEffect(() => {
    const handleRedirection = () => {
      if (!loading && isAuthenticated) {
        return navigate("/");
      }
    };
    handleRedirection();
  }, [loading, isAuthenticated]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      if (!email || !password || !confirmPassword) {
        setError("Please enter all fields!");
        return;
      }
      if (password.length < 6) {
        setError("Password should have a minimum of 6 characters!");
        return;
      }
      if (password !== confirmPassword) {
        setError("Passwords do not match!");
        return;
      }

      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/register`,
        { email, password }
      );

      if (response.data.success) {
        toast.success("Successfully signed up!");
        navigate("/login");
      } else {
        toast.error(response.data.message || "Something went wrong!");
        setError(response.data.message);
      }
    } catch (error: any) {
      toast.error("Failed to sign up, please try again.");
      setError("Failed to sign up");
    }

    setEmail("");
    setPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="bg-gray-900 text-white min-h-[90vh] flex items-center justify-center">
      <div className="max-w-md w-full px-6 py-8 bg-gray-800 rounded-xl shadow-lg">
        <div className="max-w-md w-full h-20 mb-4">
          <h1 className="text-4xl font-semibold text-center text-indigo-400 mt-4">
            Sign Up
          </h1>
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300"
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300"
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300"
            />
          </div>
          <div className="w-full flex justify-center">
            {/* <button
              type="submit"
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-500 rounded-lg transition duration-300"
            >
              Sign Up
            </button> */}
            <LoginBtn text="Sign Up" />
          </div>
        </form>
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-400">
            Already have an account?{" "}
            <Link to="/login" className="text-indigo-400 hover:text-indigo-600">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
