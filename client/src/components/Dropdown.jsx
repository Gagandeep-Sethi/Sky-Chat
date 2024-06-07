import React, { useState, useRef, useEffect } from "react";
import { RxHamburgerMenu } from "react-icons/rx";
import { IoMoonSharp } from "react-icons/io5";
import { IoIosSunny } from "react-icons/io";

const Dropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
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
            <div>
              <button
                className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                role="menuitem"
                onClick={() => setIsOpen(false)}
              >
                Button 1
              </button>
            </div>
            <div>
              <p>Theme</p>

              <label className="swap swap-rotate text-black">
                {/* this hidden checkbox controls the state */}
                <input
                  type="checkbox"
                  className="theme-controller"
                  value="synthwave"
                />

                {/* sun icon */}
                <IoIosSunny className="swap-off fill-current text-yellow-400 w-10 h-10" />

                {/* moon icon */}
                <IoMoonSharp className="swap-on text-indigo-700 fill-current w-10 h-10" />
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dropdown;
