import React, { useContext } from "react";
import { AppContext } from "../context/AppContext";
import { FaUser, FaUserCircle } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";

const Sidebar = () => {
  const { userData, users } = useContext(AppContext);
  const userList = Array.isArray(users) ? users : [];
  const navigate = useNavigate();
  const { receiverId } = useParams();

  return (
    <div className="w-64 fixed top-0 left-0 h-screen bg-gray-800 text-gray-100 flex flex-col shadow-xl">
      {/* Logged user info */}
      <div className="p-6 border-b border-gray-700 mb-4">
        {userData ? (
          <div className="flex flex-col items-center gap-2">
            <FaUserCircle className="w-12 h-12 text-gray-400 hover:text-white transition-colors" />
            <h3 className="text-lg font-semibold truncate max-w-full">
              {userData.username}
            </h3>
            <p className="text-sm text-gray-400 truncate max-w-full">
              {userData.email}
            </p>
          </div>
        ) : (
          <div className="text-center p-4 text-gray-400 animate-pulse">
            Loading user info...
          </div>
        )}
      </div>

      {/* Users list */}
      <div className="flex-1 overflow-y-auto px-2">
        <ul className="space-y-1">
          {userList.length > 0 ? (
            userList.map((user) => {
              const isActive = String(receiverId) === String(user._id);

              return (
                <li
                  key={user._id}
                  onClick={() => navigate(`/chat/${user._id}`)}
                  className={`flex capitalize items-center px-4 py-3 rounded-lg transition-colors
                    cursor-pointer group 
                    ${
                      isActive
                        ? "bg-gray-900 text-white"
                        : "hover:bg-gray-700/50"
                    }`}
                >
                  <FaUser
                    className={`w-4 h-4 ${
                      isActive ? "text-white" : "text-gray-400"
                    } group-hover:text-white`}
                  />
                  <span className="ml-3 truncate">{user.username}</span>
                </li>
              );
            })
          ) : (
            <li className="px-4 py-2 text-gray-400 italic">No users online</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
