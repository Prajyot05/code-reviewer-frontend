import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import LoginBtn from "../components/FillerBtn";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { isAuthenticated, loading, login } = useContext(AuthContext)!;

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
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/login`,
        { email, password }
      );

      const { token } = response.data;

      if (token) {
        login(token);
        toast.success("Successfully logged in!");
        navigate("/");
      }
    } catch (err) {
      toast.error("Invalid credentials. Please try again.");
      setError("Invalid credentials. Please try again.");
    }
  };

  return (
    <div className="bg-gray-900 text-white min-h-[90vh] flex items-center justify-center">
      <div className="max-w-md w-full px-6 py-8 bg-gray-800 rounded-xl shadow-lg">
        <div className="max-w-md w-full h-20 mb-4">
          <h1 className="text-4xl font-semibold text-center text-indigo-400">
            Login
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
          <div className="w-full flex justify-center">
            <LoginBtn text="Login" />
          </div>
        </form>
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-400">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-indigo-400 hover:text-indigo-600"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
