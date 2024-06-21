import React, { useEffect, useRef, useState } from "react";
import { FaEllipsisV } from "react-icons/fa";
import { fetchWrapper } from "../utils/helpers/functions";
import { Fetch_Uri } from "../utils/constants";
import { useDispatch } from "react-redux";
import { removeUser } from "../../../server/controllers/groupController";
import { clearBlocked, clearFriends } from "../redux/userRelationsSlice";
import toast from "react-hot-toast";
import { setActiveComponent, setSelectedChat } from "../redux/uiSlice";

const GroupDropdown = ({ chatId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const dispatch = useDispatch();
  useEffect(() => {
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);
  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };
  const handleAddNewMembers = () => {};
  const handleLeaveGroup = async () => {
    try {
      const response = await fetchWrapper(`${Fetch_Uri}/api/group/leaveGroup`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(chatId),
      });

      if (response.unauthorized) {
        dispatch(removeUser());
        dispatch(clearFriends());
        dispatch(clearBlocked()); // Perform the logout if the fetch wrapper indicates an unauthorized response
      } else if (response.error) {
        console.log(response.error, "error json");
        toast.error(response.error?.message || "An error occurred");
      } else {
        console.log(response, " json");
        dispatch(setActiveComponent("sidebar"));
        dispatch(
          setSelectedChat({
            username: "",
            profilePic: "",
            FriendId: "",
            isGroupchat: false,
          })
        );
        toast.success("Successfully left the group ");
      }
    } catch (error) {}
  };

  const toggleDropdown = () => setIsOpen(!isOpen);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <div>
        <button onClick={toggleDropdown} type="button" className="text-center">
          <FaEllipsisV className="text-white h-4" />
        </button>
      </div>

      {isOpen && (
        <div className="origin-top-right z-10 absolute right-0 mt-2 w-40 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
          <div className="py-1">
            <button
              onClick={() => handleAddNewMembers()}
              className="block px-4 py-2 text-sm text-black hover:bg-gray-200 w-full text-left"
            >
              Add new members
            </button>
            <button
              onClick={() => handleLeaveGroup()}
              className="block px-4 py-2 text-sm text-black hover:bg-gray-200 w-full text-left"
            >
              Leave group
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupDropdown;
