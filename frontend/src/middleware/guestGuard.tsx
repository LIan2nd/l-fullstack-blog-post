import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

const GuestGuard = () => {
  const { user } = useAuthStore();

  if (user) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default GuestGuard;