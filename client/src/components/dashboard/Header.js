import React from 'react';

const Header = ({ username }) => {
  return (
    <header className="bg-gradient-to-r from-blue-500 to-indigo-600 shadow-lg">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">TaskMaster</h1>
            <p className="text-blue-100 mt-1">Organize your tasks efficiently</p>
          </div>
          <div className="text-right">
            <p className="text-white text-lg">
              Welcome, <span className="font-semibold">{username || 'User'}</span>!
            </p>
            <p className="text-blue-100 text-sm mt-1">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;