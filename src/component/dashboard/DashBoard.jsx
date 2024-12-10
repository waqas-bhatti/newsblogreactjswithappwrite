import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function DashBoard() {
  return (
    <div>
      {/* {showPostButton && ( */}
      <div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold">Page Views</h2>
          <div className="mt-4">
            <p>
              📅 <strong>Today's Views:</strong> {views}
            </p>
          </div>
        </div>
      </div>
      {/* )} */}
    </div>
  );
}

export default DashBoard;
