import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FaHome, FaTasks, FaUser, FaSignOutAlt } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/slices/userSlice'; 

const Sidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const handleLogout = async () => {
    await dispatch(logout()); // Uncomment when you have the logout action
    navigate('/');
  };
  
  return (
    <aside className="bg-gray-800 text-white w-64 min-h-screen p-4">
      <div className="mb-8">
        <h2 className="text-2xl font-bold">TaskMaster</h2>
      </div>
      
      <nav>
        <ul className="space-y-2">
          <li>
            <NavLink 
              to="/dashboard" 
              className={({isActive}) => `flex items-center p-3 rounded-lg transition-colors ${
                isActive ? 'bg-blue-600' : 'hover:bg-gray-700'
              }`}
            >
              <FaHome className="mr-3" />
              Dashboard
            </NavLink>
          </li>
          
          <li>
            <NavLink 
              to="/tasks" 
              className={({isActive}) => `flex items-center p-3 rounded-lg transition-colors ${
                isActive ? 'bg-blue-600' : 'hover:bg-gray-700'
              }`}
            >
              <FaTasks className="mr-3" />
              Tasks
            </NavLink>
          </li>
          
          <li>
            <NavLink 
              to="/profile" 
              className={({isActive}) => `flex items-center p-3 rounded-lg transition-colors ${
                isActive ? 'bg-blue-600' : 'hover:bg-gray-700'
              }`}
            >
              <FaUser className="mr-3" />
              Profile
            </NavLink>
          </li>
          
          <li className="mt-8">
            <button 
              onClick={handleLogout}
              className="flex items-center w-full p-3 rounded-lg hover:bg-gray-700 transition-colors text-left"
            >
              <FaSignOutAlt className="mr-3" />
              Logout
            </button>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;