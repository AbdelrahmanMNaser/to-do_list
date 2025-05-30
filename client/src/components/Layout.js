import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const Layout = () => {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-4 bg-gray-50 min-h-screen">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;