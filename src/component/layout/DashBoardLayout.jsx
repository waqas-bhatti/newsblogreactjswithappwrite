import React, { useEffect, useState } from "react";
import Sidebar from "../dashboard/Sidebar";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import authservice from "../../AppwriteStore/auth";
import appwriteService from "../../AppwriteStore/appStorageService";

const DashBoardLayout = () => {
  const location = useLocation(); // Correct way to track location
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);

  // Check the current route to display the welcome message
  const isDashboardPage = location.pathname === "/dashboard";

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const isAdmin = await authservice.getUserTeams();
        setIsAdmin(isAdmin);
      } catch (error) {
        console.error("Error checking admin role:", error);
        setIsAdmin(false);
      }
    };

    checkAdmin();
  }, []);

  return (
    <>
      <div className="flex h-screen">
        <Sidebar isAdmin={isAdmin} />

        <div className="flex-1 p-6 bg-gray-100 overflow-y-auto">
          {isDashboardPage && isAdmin && (
            <div>
              <h1>Welcome to the Admin Dashboard</h1>
            </div>
          )}

          {isDashboardPage && !isAdmin && (
            <div>
              <h1>Welcome to Your Profile</h1>
            </div>
          )}

          <div className="flex-1 p-6 bg-gray-100 overflow-y-auto">
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
};

export default DashBoardLayout;
