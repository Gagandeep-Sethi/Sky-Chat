import React from "react";
import FriendList from "./FriendList";
import { useDispatch } from "react-redux";
import { setActiveComponent, setProfile } from "../redux/uiSlice";

const Sidebar = () => {
  const dispatch = useDispatch();
  function handleProfileClick() {
    dispatch(setProfile("own"));
    dispatch(setActiveComponent("profile"));
  }
  return (
    <div className="h-full w-full relative  scrollbar-none  overflow-y-auto    md:border-r border-gray-400">
      {/* Sticky header */}
      <div className="sticky backdrop-blur-md top-0  z-10">
        <div className="flex justify-between items-center py-4 px-3">
          <div>
            <img src="/logo-white.png" alt="Logo" className="w-32 h-7" />
          </div>
          <div className="flex gap-4">
            <div onClick={handleProfileClick} className="avatar relative">
              <div className="w-7 cursor-pointer rounded-full ring ring-white ring-offset-base-100 ring-offset-2">
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
