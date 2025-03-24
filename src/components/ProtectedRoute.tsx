import { FC, ReactNode, useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

interface ProtectedRouteProps {
  element: ReactNode;
}

const ProtectedRoute: FC<ProtectedRouteProps> = ({ element }) => {
  const { isAuthenticated, loading } = useContext(AuthContext)!;

  if (loading) {
    return null;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return <>{element}</>;
};

export default ProtectedRoute;
