import React, { useEffect, useState } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa6";
import { setActiveComponent } from "../redux/uiSlice";
import { useDispatch, useSelector } from "react-redux";
import { Fetch_Uri } from "../utils/constants";
import toast from "react-hot-toast";
import { fetchWrapper } from "../utils/helpers/functions";
import { removeUser } from "../redux/userSlice";
import { clearBlocked, clearFriends } from "../redux/userRelationsSlice";
import { LuPlusCircle } from "react-icons/lu";

const UserSelection = ({ onProceed }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [initialUsers, setInitialUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const dispatch = useDispatch();
  const { isDarkMode } = useSelector((state) => state.theme);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetchWrapper(
          `${Fetch_Uri}/api/user/getFriends`,
          {
            method: "Get",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(),
          }
        );

        if (response.unauthorized) {
          dispatch(removeUser());
          dispatch(clearFriends());
          dispatch(clearBlocked());
        } else if (response.error) {
          toast.error(response.error?.message || "An error occurred");
        }
        setInitialUsers(response);
        setFilteredUsers(response);
      } catch (error) {}
    };

    fetchUsers();
  }, [dispatch]);

  const handleSearch = (event) => {
    const term = event.target.value;
    setSearchTerm(term);

    if (term) {
      const filtered = initialUsers.filter(
        (user) =>
          (user.username &&
            user.username.toLowerCase().includes(term.toLowerCase())) ||
          (user.email && user.email.toLowerCase().includes(term.toLowerCase()))
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers(initialUsers);
    }
  };
  const handleProceed = () => {
    onProceed(selectedUsers);
  };
  const handleSelectUser = (user) => {
    if (
      !selectedUsers.find((selected) => selected.friendId === user.friendId)
    ) {
      setSelectedUsers([...selectedUsers, user]);
    }
  };

  const handleRemoveUser = (friendId) => {
    setSelectedUsers(
      selectedUsers.filter((user) => user.friendId !== friendId)
    );
  };
  const handleArrowClicked = () => {
    dispatch(setActiveComponent("sidebar"));
  };
  if (initialUsers.length === 0) {
    return (
      <div>
        <div
          className={`w-full sticky shadow-lg ${
            isDarkMode ? "bg-darkBg  " : "bg-lightBg"
          } top-0  z-10 `}
        >
          <div className="flex gap-6  justify-center items-center w-full md:py-3 pt-2.5 pb-1.5">
            <FaArrowLeft
              onClick={handleArrowClicked}
              className={`w-6 h-6 absolute left-4 ${
                isDarkMode ? "text-white" : "text-black"
              }  cursor-pointer`}
            />
            <p
              className={`text-lg  ${
                isDarkMode ? "text-darkText1" : "text-lightText1"
              }`}
            >
              Select members
            </p>
          </div>
        </div>
        <div className="flex flex-col items-center space-y-6 justify-center h-screen">
          <p
            className={`text-lg ${
              isDarkMode ? "text-darkText1" : "text-lightText1"
            }`}
          >
            Add friends to create a group....
          </p>
          <div className="bg-green-500 rounded-full p-2 cursor-pointer">
            <LuPlusCircle
              onClick={() => dispatch(setActiveComponent("addFriend"))}
              className="w-7 h-7  text-black "
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className=" relative w-full scrollbar-none  overflow-y-auto   h-full">
      <div
        className={`w-full sticky shadow-lg mb-3 ${
          isDarkMode ? "bg-darkBg  " : "bg-lightBg"
        } top-0  z-10 `}
      >
        <div className="flex gap-6  justify-center items-center w-full md:py-3 pt-2.5 pb-1.5">
          <FaArrowLeft
            onClick={handleArrowClicked}
            className={`w-6 h-6 absolute left-4 ${
              isDarkMode ? "text-white" : "text-black"
            }  cursor-pointer`}
          />
          <p
            className={`text-lg  ${
              isDarkMode ? "text-darkText1" : "text-lightText1"
            }`}
          >
            Select members
          </p>
        </div>
      </div>
      {initialUsers.length > 0 && (
        <div className="m-3">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Search for friends..."
            className="w-full p-2  border border-gray-300 rounded-xl focus:outline-blue-400"
          />
        </div>
      )}
      {selectedUsers.length > 0 && (
        <div className="mt-4 px-2">
          <h3
            className={`text-lg  mb-2 ${
              isDarkMode ? "text-darkText1" : "text-lightText1"
            }`}
          >
            People Selected:
          </h3>
          <div className="flex flex-wrap">
            {selectedUsers.map((user) => (
              <div
                key={user.friendId}
                className="flex items-center p-2 border border-gray-300 rounded-xl mr-2 mb-2"
              >
                <img
                  src={`https://res.cloudinary.com/dyja4tbmu/${user?.profilePic}.jpg`}
                  alt=""
                  className="w-8 h-8 rounded-full"
                />
                <span
                  className={`ml-2 ${
                    isDarkMode ? "text-darkText1" : "text-lightText1"
                  }`}
                >
                  {user.username}
                </span>
                <button
                  onClick={() => handleRemoveUser(user.friendId)}
                  className="ml-2 text-red-500 "
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="m-4">
        {filteredUsers.map((user) => (
          <div
            key={user.friendId}
            className="flex items-center justify-between p-2 border border-gray-300 rounded-xl mb-2 cursor-pointer hover:bg-gray-400"
            onClick={() => handleSelectUser(user)}
          >
            <div className="flex items-center">
              <img
                src={`https://res.cloudinary.com/dyja4tbmu/${user?.profilePic}.jpg`}
                alt={user.username}
                className="w-10 h-10 rounded-full"
              />
              <span
                className={`ml-2 ${
                  isDarkMode ? "text-darkText1" : "text-lightText1"
                }`}
              >
                {user.username}
              </span>
            </div>
          </div>
        ))}
      </div>
      <button
        disabled={selectedUsers.length < 1}
        onClick={handleProceed}
        className="mt-4 px-2 py-1 bg-blue-500 text-white rounded-xl fixed right-4 z-10 bottom-10"
      >
        <FaArrowRight className="w-6 h-6" />
      </button>
    </div>
  );
};

export default UserSelection;
