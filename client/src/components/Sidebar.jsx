import React from "react";
import FriendList from "./FriendList";
import { useDispatch } from "react-redux";
import { setActiveComponent, setProfile } from "../redux/uiSlice";
import Dropdown from "./Dropdown";
import { PiUserCirclePlusFill } from "react-icons/pi";

const Sidebar = () => {
  const dispatch = useDispatch();
  function handleProfileClick() {
    dispatch(setProfile("own"));
    dispatch(setActiveComponent("profile"));
  }
  function handleAddFriendClicked() {
    dispatch(setActiveComponent("addFriend"));
  }
  return (
    <div className="h-full w-full relative  scrollbar-none  overflow-y-auto    md:border-r border-gray-400">
      {/* Sticky header */}
      <div className="sticky backdrop-blur-md top-0  z-10">
        <div className="flex justify-between  items-center py-4 px-3">
          <Dropdown />

          <div>
            <img src="/logo-white.png" alt="Logo" className="w-32 h-7" />
          </div>

          <div onClick={handleProfileClick} className="avatar relative">
            <div className="w-7 cursor-pointer rounded-full ring ring-white ring-offset-base-100 ring-offset-2">
              <img src="/chat-background.jpeg" alt="Avatar" />
            </div>
          </div>
        </div>
      </div>
      <div className="divider my-0" />
      <div>
        <FriendList />
      </div>
      <button
        onClick={handleAddFriendClicked}
        className="bg-green-400 p-2 rounded-full fixed lg:left-80 left-[360px] z-10 bottom-10 "
      >
        <PiUserCirclePlusFill className="text-black w-8 h-8" />
      </button>
    </div>
  );
};

export default Sidebar;

// <div className="drawer">
//   <input id="my-drawer" type="checkbox" className="drawer-toggle" />
//   <div className="drawer-content">
//     {/* Page content here */}
//     <label htmlFor="my-drawer" className="btn btn-primary drawer-button">
//       Open drawer
//     </label>
//   </div>
//   <div className="drawer-side">
//     <label
//       htmlFor="my-drawer"
//       aria-label="close sidebar"
//       className="drawer-overlay"
//     ></label>
//     <ul className="menu p-4 w-80 min-h-full bg-base-200 text-base-content">
//       {/* Sidebar content here */}
//       <li>Sidebar Item 1</li>
//       <li>Sidebar Item 2</li>
//     </ul>
//   </div>
// </div>;
