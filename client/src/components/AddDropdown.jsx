import React, { useState, useRef, useEffect } from "react";
import { LuPlusCircle } from "react-icons/lu";
import { HiUserGroup } from "react-icons/hi2";
import { PiUserCirclePlusFill } from "react-icons/pi";
import { useDispatch } from "react-redux";
import { setActiveComponent } from "../redux/uiSlice";
import { RxCross2 } from "react-icons/rx";

const AddDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const dispatch = useDispatch();

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };
  function handleAddFriendClicked() {
    setIsOpen(false);
    dispatch(setActiveComponent("addFriend"));
  }
  function handleCreateGroupClicked() {
    setIsOpen(false);
    dispatch(setActiveComponent("createGroup"));
  }

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <label
        onClick={toggleDropdown}
        className="inline-flex transition-all duration-500 justify-center rounded-full w-full p-2 bg-green-500 "
      >
        {isOpen ? (
          <RxCross2 className="w-7 h-7 text-black" />
        ) : (
          <LuPlusCircle className="w-7 h-7 text-black" />
        )}
      </label>
      {isOpen && (
        <div className="absolute right-9 z-10 mb-2 w-48 bottom-6 bg-white border border-gray-300 rounded-md shadow-lg">
          <div
            className="py-1 items-center flex flex-col justify-center"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="options-menu"
          >
            <div
              onClick={handleAddFriendClicked}
              className="mx-auto w-44 hover:bg-gray-300 rounded-xl"
            >
              <button
                className="items-center flex mx-auto   py-2 gap-2   text-gray-700 "
                role="menuitem"
              >
                <PiUserCirclePlusFill className="text-black w-5 h-5" /> Add
                friend
              </button>
            </div>
            <div
              onClick={handleCreateGroupClicked}
              className="mx-auto w-44 hover:bg-gray-300 rounded-xl "
            >
              <button
                className="items-center flex mx-auto   py-2 gap-2   text-gray-700 "
                role="menuitem"
              >
                <HiUserGroup className="text-black w-5 h-5" /> Create group
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddDropdown;

// {/* <button onClick={toggleDropdown}>
//         <label className=" swap swap-rotate text-black  btn-circle bg-green-500 ">
//           <input type="checkbox" />
//           <LuPlusCircle className="w-7 h-7 swap-off" />
//           <RxCross2 className="w-7 h-7 swap-on" />
//         </label>
//       </button> */}
