import React from "react";
import { FaCalendarAlt } from "react-icons/fa";

const Header = ({ username }) => {
  return (
    <header className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
              <p className="text-sm text-gray-500">
                Welcome back,
                <span className="font-medium text-indigo-600 ml-1">
                  {username || "User"}
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-6">
            <FaCalendarAlt className="text-gray-500" />
            <div className="text-right">
              <p className="text-sm font-medium text-gray-500">
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
