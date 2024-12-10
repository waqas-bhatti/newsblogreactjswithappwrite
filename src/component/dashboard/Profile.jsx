import React, { useEffect, useState } from "react";
import authservice from "../../AppwriteStore/auth";
import { useNavigate } from "react-router-dom";
import { LineWave } from "react-loader-spinner";

function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        // Fetch the user from the auth service
        const loggedInUser = await authservice.getCurrentUser();

        if (!loggedInUser) {
          // If no user is found, redirect to login page
          navigate("/login");
          return;
        }

        setUser(loggedInUser); // Set the full user object to state
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false); // Ensure loading is stopped in all cases
      }
    };

    fetchUser();
  }, [history]);

  // Update the rendering to handle null checks for `user`
  if (loading) {
    return (
      <div className="flex justify-center mt-6">
        <LineWave
          visible={true}
          height="100"
          width="100"
          color="#4fa94d"
          ariaLabel="line-wave-loading"
        />
      </div>
    );
  }

  if (!user) {
    return null; // Optional: You can handle this case more gracefully
  }

  async function handleDeleteAccount() {
    const confirmation = window.confirm(
      "Are you sure you want to delete your account?"
    );
    if (confirmation) {
      try {
        await authservice.deletAccount();
        alert("Your account has been deleted successfully.");
        navigate("/"); // Redirect to the home page
      } catch (error) {
        console.error("Failed to delete account:", error.message);
        alert("Something went wrong. Please try again.");
      }
    }
  }

  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center p-6">
      <div className="bg-white shadow-lg rounded-lg w-full max-w-4xl">
        {/* Profile Header */}
        <div className="flex items-center p-6 border-b border-gray-200">
          <div className="flex-shrink-0">
            <img
              src="https://via.placeholder.com/100"
              alt="Profile"
              className="w-24 h-24 rounded-full border-2 border-gray-300"
            />
          </div>
          <div className="ml-4">
            <h1 className="text-2xl font-bold text-gray-800">{user.name}</h1>
            <p className="text-gray-600">{user.email}</p>
          </div>
        </div>

        {/* Profile Details */}
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Profile Details
          </h2>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Username:</span>
              <span className="font-medium text-gray-800">{user.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">email:</span>
              <span className="font-medium text-gray-800">{user.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Phone Number:</span>
              <span className="font-medium text-gray-800">{user.phone}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Address:</span>
              <span className="font-medium text-gray-800">
                123 Main St, Anytown, USA
              </span>
            </div>
          </div>
        </div>

        {/* Account Settings */}
        {/* <div className="p-6 border-t border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Account Settings
          </h2>
          <div className="space-y-4">
            <button className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
              Change Password
            </button>
            <button
              onClick={handleDeleteAccount}
              className="w-full bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              Delete Account
            </button>
          </div>
        </div> */}
      </div>
    </div>
  );
}

export default Profile;
