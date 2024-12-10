import React from "react";
import { logout } from "../../ReduxStore/UserSlice";
import { useSelector, useDispatch } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import authservice from "../../AppwriteStore/auth";
function LogoutBtn() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      await authservice.logout();
      dispatch(logout());
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div>
      <button
        onClick={handleLogout}
        className="px-4 py-2 text-sm rounded-full font-bold text-white border-2 border-red-500 bg-red-500 transition-all ease-in-out duration-300 hover:bg-transparent hover:text-red-500"
      >
        Logout
      </button>
    </div>
  );
}

export default LogoutBtn;
