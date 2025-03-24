import { Link, useNavigate } from "react-router-dom";
import GoBackBtn from "./GoBackBtn";
import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";
import LogoutBtn from "./LogoutBtn";
import { toast } from "react-toastify";

const Navbar = () => {
  const { isAuthenticated, logout } = useContext(AuthContext)!;
  const navigate = useNavigate();

  const handleLogout = async () => {
    if (isAuthenticated) {
      logout();
      toast.success("Logged Out Successfully");
      return navigate("/login");
    }
  };

  return (
    <div className="bg-gray-900 py-2 px-5 border-b-2 h-[10vh] flex w-full justify-between items-center">
      <Link className="hidden md:block" to="/">
        <img className="w-20" src="/CodeReviewer.png" alt="" />
      </Link>
      {/* <Link className="scale-50 -mr-28" to="/submissions"> */}
      <div className="flex relative items-center">
        <Link className={`${isAuthenticated && "mr-32"}`} to="/submissions">
          {/* <SubmissionsBtn text="My Submissions" /> */}
          <GoBackBtn text="My Submissions" />
        </Link>
        {isAuthenticated && <LogoutBtn onClick={handleLogout} />}
      </div>
    </div>
  );
};

export default Navbar;
