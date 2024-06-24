import React, { useState, useEffect } from "react";
import SearchedUsers from "./SearchedUsers";
import { FaArrowLeft } from "react-icons/fa6";
import { setActiveComponent } from "../redux/uiSlice";
import { useDispatch, useSelector } from "react-redux";
import { Fetch_Uri } from "../utils/constants";
import toast from "react-hot-toast";
import { fetchWrapper } from "../utils/helpers/functions";
import { useLogout } from "../utils/hooks/useLogout";

const AddFriends = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const dispatch = useDispatch();
  const { logout } = useLogout();
  const { isDarkMode } = useSelector((state) => state.theme);
  const userRelations = useSelector((state) => state.userRelations);

  const filterResults = (results, friends) => {
    return results.filter((user) => !friends.includes(user._id));
  };

  const handleSearch = async (event) => {
    setSearchTerm(event.target.value);

    if (event.target.value) {
      try {
        const response = await fetchWrapper(
          `${Fetch_Uri}/api/user/search?query=${event.target.value}`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          }
        );

        if (response.unauthorized) {
          await logout(); // Perform the logout if the fetch wrapper indicates an unauthorized response
        } else if (response.error) {
          console.log("error");
          toast.error(response.error?.message || "An error occurred");
        } else {
          setResults(filterResults(response, userRelations.friends));
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    } else {
      setResults([]);
    }
  };

  useEffect(() => {
    setResults((prevResults) =>
      filterResults(prevResults, userRelations.friends)
    );
  }, [userRelations.friends]);

  const handleArrowClicked = () => {
    dispatch(setActiveComponent("sidebar"));
  };

  return (
    <div
      className={`relative w-full scrollbar-none overflow-y-auto ${
        isDarkMode ? "bg-darkBg" : "bg-lightBg"
      } h-full`}
    >
      <div
        className={`flex gap-6 md:justify-center items-center w-full md:py-3 pt-2.5 pb-1.5 sticky shadow-lg ${
          isDarkMode ? "bg-darkBg" : "bg-lightBg"
        } top-0 z-10`}
      >
        <FaArrowLeft
          onClick={handleArrowClicked}
          className={`w-6 h-6 absolute left-4 ${
            isDarkMode ? "text-white" : "text-black"
          } cursor-pointer`}
        />
        <p
          className={`text-lg ${
            isDarkMode ? "text-darkText1" : "text-lightText1"
          }`}
        >
          Add new friends
        </p>
      </div>
      <div className="m-3">
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearch}
          placeholder="Search for friends by username or email..."
          className="w-full p-2 border border-gray-300 rounded-xl focus:outline-blue-400"
        />
      </div>

      <SearchedUsers results={results} />
    </div>
  );
};

export default AddFriends;
