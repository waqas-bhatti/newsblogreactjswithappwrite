import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import authservice from "../../AppwriteStore/auth";
import { useSelector, useDispatch } from "react-redux";
import { login, logout } from "../../ReduxStore/UserSlice";
import { Oval } from "react-loader-spinner";
import { FaBars } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import LogoutBtn from "./LogoutBtn";

function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useSelector((state) => state.post.isAuthenticated);
  const [loading, setLoading] = useState(false);
  const [dropDownOpen, setDropDownOpen] = useState(false);

  // Fetch the current user session on component mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await authservice.getCurrentUser();
        if (user) {
          dispatch(login({ user }));
        }
      } catch (error) {
        console.log("No active session found:", error);
      }
    };

    fetchUser();
  }, [dispatch]);

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);

    // Redirect to login page
    setTimeout(() => {
      setLoading(false);
      navigate("/login");
    }, 300);
  };

  const toggleDropDown = () => setDropDownOpen(!dropDownOpen);

  return (
    <header className="flex py-4 px-4 sm:px-10 bg-gray-800 font-[sans-serif] min-h-[70px] tracking-wide relative z-50">
      <div className="flex items-center justify-between w-full">
        {/* Logo */}
        <a href="#" className="flex-shrink-0">
          <img
            src="https://png.pngtree.com/png-vector/20230304/ourmid/pngtree-colorful-blog-speech-bubble-vector-png-image_6633021.png"
            alt="logo"
            className="w-16 lg:block "
          />
        </a>

        {/* Navigation - Desktop View */}
        <nav className="hidden md:flex flex-grow items-center justify-center space-x-5">
          <ul className="hidden md:flex gap-x-5">
            <li>
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `${
                    isActive ? "text-red-400 font-semibold " : "text-white"
                  } hover:text-blue-700`
                }
              >
                Home
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/blog"
                className={({ isActive }) =>
                  `${
                    isActive ? "text-red-400 font-semibold " : "text-white"
                  } hover:text-blue-700`
                }
              >
                News
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/sports"
                className={({ isActive }) =>
                  `${
                    isActive ? "text-red-400 font-semibold " : "text-white"
                  } hover:text-blue-700`
                }
              >
                Sports
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/travel"
                className={({ isActive }) =>
                  `${
                    isActive ? "text-red-400 font-semibold " : "text-white"
                  } hover:text-blue-700`
                }
              >
                Travel
              </NavLink>
            </li>
            {isAuthenticated && (
              <li>
                <NavLink
                  to="/dashboard"
                  className={({ isActive }) =>
                    `${
                      isActive ? "text-red-400 font-semibold " : "text-white"
                    } hover:text-blue-700`
                  }
                >
                  Dashboard
                </NavLink>
              </li>
            )}
          </ul>
        </nav>

        {/* Hamburger Icon for Mobile */}
        <div className="md:hidden flex items-center">
          <div
            className="text-white text-2xl cursor-pointer"
            onClick={toggleDropDown}
          >
            {dropDownOpen ? <IoMdClose size={24} /> : <FaBars size={24} />}{" "}
          </div>
        </div>

        {/* Auth Buttons (Login/Logout) */}
        <div className="flex items-center ml-auto space-x-3">
          {isAuthenticated ? (
            <LogoutBtn />
          ) : (
            <button
              onClick={handleLogin}
              className="px-4 py-2 text-sm rounded-full font-bold text-white border-2 border-[#007bff] bg-[#007bff] transition-all ease-in-out duration-300 hover:bg-transparent hover:text-[#007bff]"
            >
              {loading ? (
                <Oval
                  visible={true}
                  height="18"
                  width="18"
                  color="#fff"
                  ariaLabel="loading"
                  wrapperClass="flex justify-center items-center"
                />
              ) : (
                "Login"
              )}
            </button>
          )}
        </div>
      </div>

      {/* Mobile Dropdown Menu */}

      {dropDownOpen && (
        <>
          <div className="absolute top-20 left-0 w-full bg-gray-800 z-40 md:hidden sm:block">
            <ul className="flex flex-col items-center py-8 gap-y-3">
              <li>
                <NavLink
                  to="/"
                  className={({ isActive }) =>
                    `${
                      isActive ? "text-red-400 font-semibold " : "text-white"
                    } hover:text-blue-700`
                  }
                >
                  Home
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/blog"
                  className={({ isActive }) =>
                    `${
                      isActive ? "text-red-400 font-semibold " : "text-white"
                    } hover:text-blue-700`
                  }
                >
                  News
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/sports"
                  className={({ isActive }) =>
                    `${
                      isActive ? "text-red-400 font-semibold " : "text-white"
                    } hover:text-blue-700`
                  }
                >
                  Sports
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/travel"
                  className={({ isActive }) =>
                    `${
                      isActive ? "text-red-400 font-semibold " : "text-white"
                    } hover:text-blue-700`
                  }
                >
                  Travel
                </NavLink>
              </li>
              {isAuthenticated && (
                <li>
                  <NavLink
                    to="/dashboard"
                    className={({ isActive }) =>
                      `${
                        isActive ? "text-red-400 font-semibold " : "text-white"
                      } hover:text-blue-700`
                    }
                  >
                    Dashboard
                  </NavLink>
                </li>
              )}
            </ul>
          </div>
        </>
      )}
    </header>
  );
}

export default Header;
