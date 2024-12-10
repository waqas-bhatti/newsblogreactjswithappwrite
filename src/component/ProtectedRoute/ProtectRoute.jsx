import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

function ProtectRoute({ children }) {
  const isAuthenticate = useSelector((state) => state.post.isAuthenticated);

  if (!isAuthenticate) {
    return <Navigate to="/login" replace></Navigate>;
  }
  return children;
}

export default ProtectRoute;
