import React, { useState, useRef, useEffect } from "react";
import { RxHamburgerMenu } from "react-icons/rx";
import { IoExitOutline } from "react-icons/io5";
import { useLogout } from "../utils/hooks/useLogout";
import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "../redux/themeSlice";

const Dropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { logout, isLoading } = useLogout();
  const { isDarkMode } = useSelector((state) => state.theme);
  const dispatch = useDispatch();

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };
  const handleTheme = () => {
    dispatch(toggleTheme());
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };
  const handleLogout = async () => {
    await logout();
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      className={`relative inline-block text-left ${
        isDarkMode ? "text-darkText1" : "text-lightText1"
      }`}
      ref={dropdownRef}
    >
      <button
        onClick={toggleDropdown}
        className="inline-flex justify-center w-full  py-2 text-sm font-medium  "
      >
        <RxHamburgerMenu className={`w-8 h-8 `} />
      </button>
      {isOpen && (
        <div
          className={`absolute left-0 z-10 mt-2 w-48 origin-top-right ${
            isDarkMode ? "bg-gray-900" : "bg-white"
          }  bg-clip-padding backdrop-filter backdrop-blur-3xl bg-opacity-80 border-gray-300 rounded-md shadow-lg`}
        >
          <div
            className="py-1 items-center flex flex-col justify-center"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="options-menu"
          >
            <div className="mx-auto w-44 hover:bg-gray-100 ">
              <button
                disabled={isLoading}
                onClick={handleLogout}
                className="items-center flex mx-auto   py-2 gap-2    hover:bg-gray-100"
                role="menuitem"
                //onClick={() => setIsOpen(false)}
              >
                <IoExitOutline className="w-5 h-5 " /> Logout
              </button>
            </div>
            <div className="flex items-center">
              <p className=" mr-2">Theme</p>

              <label className="flex cursor-pointer gap-2">
                {/* <IoIosSunny className=" text-yellow-400 w-6 h-6" /> */}
                <input
                  type="checkbox"
                  onClick={handleTheme}
                  value="synthwave"
                  className="toggle theme-controller bg-amber-300 border-sky-400 [--tglbg:theme(colors.sky.500)] checked:bg-blue-300 checked:border-blue-800 checked:[--tglbg:theme(colors.blue.900)] row-start-1 col-start-1 col-span-2"
                />
                {/* <IoMoonSharp className=" text-indigo-700  w-6 h-6" /> */}
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dropdown;
