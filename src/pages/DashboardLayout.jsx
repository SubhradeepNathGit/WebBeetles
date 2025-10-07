/* eslint-disable no-unused-vars */
import React from "react";
import { Outlet } from "react-router-dom";
import DashboardSidebar from "../layout/sidebar";

const DashboardLayout = () => {
  return (
    <div className="flex min-h-screen w-full bg-gradient-to-b from-[#25004D]  to-black text-white">
      {/* Sidebar */}
      <DashboardSidebar />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <Outlet /> {/* All nested dashboard pages will render here */}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
