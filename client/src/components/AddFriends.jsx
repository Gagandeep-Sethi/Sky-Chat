// AddFriends.js
import React, { useState } from "react";
import SearchUsers from "./SearchedUsers";
import { FaArrowLeft } from "react-icons/fa6";
import { setActiveComponent } from "../redux/uiSlice";
import { useDispatch } from "react-redux";
import { Fetch_Uri } from "../utils/constants";
import toast from "react-hot-toast";
//import Usersfound from './Usersfound'; // Assuming you have this component

const AddFriends = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const dispatch = useDispatch();

  const handleSearch = async (event) => {
    setSearchTerm(event.target.value);

    if (event.target.value) {
      try {
        const response = await fetch(
          `${Fetch_Uri}/api/user/search?query=${event.target.value}`,
          {
            method: "Get",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(),
            credentials: "include", //this will let it set cookie
          }
        );
        const data = await response.json();

        if (!response.ok) {
          console.log("error");
          toast.error(data?.message);

          throw new Error("Network response was not ok");
        }

        console.log(data, "data");
        setResults(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    } else {
      setResults([]);
    }
  };
  const handleArrowClicked = () => {
    dispatch(setActiveComponent("sidebar"));
  };

  return (
    <div className="p-4 relative w-full scrollbar-none  overflow-y-auto   bg-neutral-900 h-full">
      <div className=" w-full sticky bg-neutral-900 top-0  z-10 ">
        <div className="flex gap-6  justify-center items-center w-full md:py-3 pt-2.5 pb-1.5">
          <FaArrowLeft
            onClick={handleArrowClicked}
            className=" w-6 h-6 absolute left-4 text-white cursor-pointer"
          />
          <p className="text-lg cursor-pointer ">Profile</p>
        </div>
        <div>
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Search for friends by username or email..."
            className="w-full p-2 border border-gray-300 rounded-xl focus:outline-blue-400"
          />
        </div>
      </div>

      {/* Render Usersfound component with results */}
      <SearchUsers results={results} />
    </div>
  );
};

export default AddFriends;
