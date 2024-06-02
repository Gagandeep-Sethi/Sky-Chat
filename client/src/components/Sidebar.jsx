import React from "react";
import { RiUserAddLine } from "react-icons/ri";
import FriendList from "./FriendList";

const Sidebar = () => {
  return (
    <div className="h-full w-full relative  scrollbar-none  overflow-y-auto    md:border-r border-gray-400">
      {/* Sticky header */}
      <div className="sticky backdrop-blur-md top-0  z-10">
        <div className="flex justify-between items-center py-4 px-3">
          <div>
            <img src="/logo-white.png" alt="Logo" className="w-32 h-7" />
          </div>
          <div className="flex gap-4">
            <div>
              <RiUserAddLine className="w-7 h-7 text-white" />
            </div>
            <div className="avatar relative">
              <div className="w-7 rounded-full ring ring-white ring-offset-base-100 ring-offset-2">
                <img src="/chat-background.jpeg" alt="Avatar" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="divider my-0" />
      <div>
        <FriendList />
      </div>
    </div>
  );
};

export default Sidebar;
