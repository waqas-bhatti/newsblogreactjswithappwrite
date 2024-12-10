import React from "react";
import { Outlet } from "react-router-dom";
// import { SignedIn, SignedOut } from "@clerk/clerk-react";
import Header from "../HomeSide/Header";
import Footer from "../HomeSide/Footer";

function Layout() {
  return (
    <>
      {/* Render Header for both signed-in and signed-out states */}

      {/* Content that varies based on authentication status */}
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
      </div>
    </>
  );
}

export default Layout;
