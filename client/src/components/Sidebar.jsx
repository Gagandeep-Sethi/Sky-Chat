import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setActiveComponent, setProfile } from "../redux/uiSlice";
import Dropdown from "./Dropdown";
import AddDropdown from "./AddDropdown";
import Toggle from "./Toggle";

const Sidebar = () => {
  const dispatch = useDispatch();
  const user = useSelector((store) => store?.user);
  const { isDarkMode } = useSelector((state) => state.theme);
  function handleProfileClick() {
    dispatch(setProfile("own"));
    dispatch(setActiveComponent("profile"));
  }

  return (
    <div className="h-full w-full relative  scrollbar-none  overflow-y-auto     md:border-r border-gray-400">
      {/* Sticky header */}
      <div className="sticky backdrop-blur-md top-0 py-1.5  z-10 shadow-lg">
        <div className="flex justify-between  items-center  px-3">
          <Dropdown />

          <div>
            <img
              src={`${isDarkMode ? "/logo-white.png" : "/Logo.png"}`}
              alt="Logo"
              className="w-36 h-8"
            />
          </div>

          <div onClick={handleProfileClick} className="avatar relative">
            <div className="w-9 cursor-pointer rounded-full  ring-offset-base-100 ring-offset-2">
              <img
                src={`https://res.cloudinary.com/dyja4tbmu/${user?.profilePic}.jpg`}
                alt="Avatar"
              />
            </div>
          </div>
        </div>
      </div>
      {/* <div className="divider my-0 divide-white" /> */}
      <div>
        <Toggle />
      </div>
      <div className="fixed lg:left-80 left-[360px] z-10 bottom-10 ">
        <AddDropdown />
      </div>
    </div>
  );
};

export default Sidebar;
