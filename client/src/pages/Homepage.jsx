import React from "react";
import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";

const Homepage = () => {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 text-white">
        <Sidebar />
      </div>

      {/* Content Area */}
      <div className="flex-1 bg-white overflow-auto">
        <Outlet /> {/* Render ChatBox component here */}
      </div>
    </div>
  );
};

export default Homepage;
