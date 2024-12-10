import { useState } from "react";
import Sidebar from "./component/dashboard/Sidebar";
import DashboardContent from "./component/dashboard/DashboardContent";
import Header from "./component/HomeSide/Header.jsx";
import Home from "./component/HomeSide/Home.jsx";

function App() {
  return (
    <>
      <Header />
      <Home />
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex flex-col flex-grow">
          <h1 className="flex p-4 font-extrabold text-3xl text-green-700 border-b border-cyan-600">
            Dashboard Content
          </h1>
          <DashboardContent />
        </div>
      </div>
    </>
  );
}

export default App;
