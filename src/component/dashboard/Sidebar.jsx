import React, { useState } from "react";
import { FaHome, FaUpload } from "react-icons/fa";
import { LuListTodo } from "react-icons/lu";
import { ImProfile } from "react-icons/im";
import { SiChatbot } from "react-icons/si";
import { MdDashboardCustomize } from "react-icons/md";
import { motion } from "framer-motion";
import { NavLink } from "react-router-dom";
import { RiSidebarUnfoldFill, RiSidebarFoldFill } from "react-icons/ri";

const Sidebar = ({ isAdmin }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="relative">
      {/* Sidebar Container */}
      <motion.div
        animate={{ width: isCollapsed ? "70px" : "220px" }}
        className="h-screen bg-gray-800 text-white flex flex-col space-y-6 py-4 px-2 overflow-hidden"
      >
        {/* Sidebar Header */}
        <motion.div
          className="flex items-center justify-start space-x-3 p-4"
          initial={{ opacity: 1 }}
          animate={{ opacity: isCollapsed ? 0 : 1 }}
          transition={{ duration: 0.3 }}
        ></motion.div>

        {/* Sidebar Menu */}
        <ul className="space-y-4">
          <li>
            <NavLink
              to="/dashboard"
              className="flex items-center space-x-3 hover:bg-gray-700 rounded-md p-3 transition-all"
            >
              <MdDashboardCustomize className="text-2xl" />
              {!isCollapsed && <span>Dashboard</span>}
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/"
              className="flex items-center space-x-3 hover:bg-gray-700 rounded-md p-3 transition-all"
            >
              <FaHome className="text-xl" />
              {!isCollapsed && <span>Home</span>}
            </NavLink>
          </li>

          {isAdmin && (
            <>
              <li>
                <NavLink
                  to="/dashboard/upload-file"
                  className="flex items-center space-x-3 hover:bg-gray-700 rounded-md p-3 transition-all"
                >
                  <FaUpload className="text-xl" />
                  {!isCollapsed && <span>Upload</span>}
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/dashboard/todo-list"
                  className="flex items-center space-x-3 hover:bg-gray-700 rounded-md p-3 transition-all"
                >
                  <LuListTodo className="text-xl" />
                  {!isCollapsed && <span>Post List</span>}
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/dashboard/chatbot"
                  className="flex items-center space-x-3 hover:bg-gray-700 rounded-md p-3 transition-all"
                >
                  <SiChatbot className="text-xl" />
                  {!isCollapsed && <span>ChatBot</span>}
                </NavLink>
              </li>
            </>
          )}

          <li>
            <NavLink
              to="/dashboard/profile"
              className="flex items-center space-x-3 hover:bg-gray-700 rounded-md p-3 transition-all"
            >
              <ImProfile className="text-xl" />
              {!isCollapsed && <span>Profile</span>}
            </NavLink>
          </li>
        </ul>
      </motion.div>

      {/* Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className={`absolute top-10 left-full transform -translate-x-1/2 bg-gray-800 text-white text-lg p-2 rounded-full shadow-md focus:outline-none z-10`}
      >
        {isCollapsed ? (
          <RiSidebarUnfoldFill size={22} />
        ) : (
          <RiSidebarFoldFill size={22} />
        )}
      </button>
    </div>
  );
};

export default Sidebar;
