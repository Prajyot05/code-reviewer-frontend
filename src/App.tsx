import React, { useContext } from "react";
import { Route, Routes } from "react-router-dom";
import JobList from "./page/JobList";
import Interview from "./page/Interview";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthContext } from "./context/AuthContext";
import Login from "./page/Login";
import SignUp from "./page/SignUp";
import { ToastContainer } from "react-toastify";
import Submissions from "./page/Submissions";
import NotFound from "./page/NotFound";

const App: React.FC = () => {
  const { loading } = useContext(AuthContext)!;
  if (loading) {
    return (
      <div className="h-screen bg-[#111828] w-full flex justify-center items-center"></div>
    );
  }
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<JobList />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route
          path="/interview/:id"
          element={<ProtectedRoute element={<Interview mode="interview" />} />}
        />
        <Route
          path="/submissions"
          element={<ProtectedRoute element={<Submissions />} />}
        />
        <Route
          path="/submission/:id"
          element={<Interview mode="submission" />}
        />
        <Route path="/random" element={<Interview mode="random" />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <ToastContainer />
    </>
  );
};

export default App;
