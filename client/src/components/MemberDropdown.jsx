import React, { useEffect, useRef, useState } from "react";
import { FaEllipsisV } from "react-icons/fa";
import { fetchWrapper } from "../utils/helpers/functions";
import { Fetch_Uri } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { clearBlocked, clearFriends } from "../redux/userRelationsSlice";
import toast from "react-hot-toast";
import { removeUser } from "../redux/userSlice";

const MemberDropdown = ({ userId, chatId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const dispatch = useDispatch();
  const { isDarkMode } = useSelector((state) => state.theme);

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
  const handlePromote = async () => {
    try {
      const response = await fetchWrapper(`${Fetch_Uri}/api/group/makeAdmin`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chatId, userId }),
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
        toast.success("User promoted to admin");
      }
    } catch (error) {}
  };
  const handleRemove = async () => {
    try {
      const response = await fetchWrapper(`${Fetch_Uri}/api/group/removeUser`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chatId, userId }),
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
        toast.success("User removed from group ");
      }
    } catch (error) {}
  };

  const toggleDropdown = () => setIsOpen(!isOpen);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <div>
        <button onClick={toggleDropdown} type="button" className="text-center">
          <FaEllipsisV
            className={`${
              isDarkMode ? "text-darkText1" : "text-lightText1"
            } h-4`}
          />
        </button>
      </div>

      {isOpen && (
        <div className="origin-top-right z-10 absolute right-0 mt-2 w-40 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
          <div className="py-1">
            <button
              onClick={() => handlePromote()}
              className="block px-4 py-2 text-sm text-black hover:bg-gray-200 w-full text-left"
            >
              Promote to Admin
            </button>
            <button
              onClick={() => handleRemove()}
              className="block px-4 py-2 text-sm text-black hover:bg-gray-200 w-full text-left"
            >
              Remove Member
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MemberDropdown;
