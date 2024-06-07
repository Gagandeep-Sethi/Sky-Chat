import React, { useState, useRef, useEffect } from "react";
import { RxHamburgerMenu } from "react-icons/rx";
import { IoExitOutline, IoMoonSharp } from "react-icons/io5";
import { IoIosSunny } from "react-icons/io";
import { useLogout } from "../utils/hooks/useLogout";

const Dropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { logout, isLoading } = useLogout();

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
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
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className="inline-flex justify-center w-full px-4 py-2 text-sm font-medium  "
      >
        <RxHamburgerMenu className="w-7 h-7" />
      </button>
      {isOpen && (
        <div className="absolute left-0 z-10 mt-2 w-48 origin-top-right bg-white border border-gray-300 rounded-md shadow-lg">
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
                className="items-center flex mx-auto   py-2 gap-2   text-gray-700 hover:bg-gray-100"
                role="menuitem"
                //onClick={() => setIsOpen(false)}
              >
                <IoExitOutline className="w-5 h-5 " /> Logout
              </button>
            </div>
            <div className="flex items-center">
              <p className="text-black mr-2">Theme</p>

              <label className="flex cursor-pointer gap-2">
                {/* <IoIosSunny className=" text-yellow-400 w-6 h-6" /> */}
                <input
                  type="checkbox"
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
// {/* <label className="swap swap-rotate text-black">
//                 {/* this hidden checkbox controls the state */}
//                 <input
//                   type="checkbox"
//                   className="theme-controller"
//                   value="synthwave"
//                 />

//                 {/* sun icon */}
//                 <IoIosSunny className="swap-off fill-current text-yellow-400 w-10 h-10" />

//                 {/* moon icon */}
//                 <IoMoonSharp className="swap-on text-indigo-700 fill-current w-10 h-10" />
//               </label> */}
