import React from "react";
import { NavLink } from "react-router-dom";
function Footer() {
  return (
    <div>
      <footer className="bg-gray-800 text-white">
        <div className="container mx-auto px-6 text-center">
          <p>&copy; 2024 MyBlog. All rights reserved.</p>
          <div className="space-x-6 mt-4">
            <a href="#" className="hover:text-gray-400"></a>
            <NavLink
              to="/about"
              className={({ isActive }) =>
                `${
                  isActive ? "text-red-400 font-semibold " : "text-white"
                } hover:text-blue-700`
              }
            >
              Privacy Policy
            </NavLink>
            <NavLink
              to="/contact"
              className={({ isActive }) =>
                `${
                  isActive ? "text-red-400 font-semibold " : "text-white"
                } hover:text-blue-700`
              }
            >
              Contact
            </NavLink>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Footer;
