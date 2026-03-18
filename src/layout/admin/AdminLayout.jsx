import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

export default function AdminLayout() {
    return (
        <div className="h-screen flex bg-black text-white overflow-hidden">
            {/* Sidebar - Fixed on the left, full height */}
            <div className="hidden md:flex flex-shrink-0">
                <Sidebar />
            </div>

            {/* Right side: Navbar fixed at top + scrollable content below */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Navbar is sticky within this column */}
                <div className="flex-shrink-0">
                    <Navbar />
                </div>

                {/* Scrollable main content */}
                <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6 lg:p-8 bg-black">
                    <div className="max-w-full">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
}
