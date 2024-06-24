import React, { useEffect, useState } from "react";
import { FaArrowLeft } from "react-icons/fa6";
import { setActiveComponent } from "../redux/uiSlice";
import { useDispatch, useSelector } from "react-redux";
import { Fetch_Uri } from "../utils/constants";
import toast from "react-hot-toast";
import { fetchWrapper } from "../utils/helpers/functions";
import { removeUser } from "../redux/userSlice";
import { clearBlocked, clearFriends } from "../redux/userRelationsSlice";

const AddNewMembers = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [initialUsers, setInitialUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const dispatch = useDispatch();
  const chatId = useSelector((state) => state.ui?.selectedChat?.FriendId);
  const { isDarkMode } = useSelector((state) => state.theme);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetchWrapper(
          `${Fetch_Uri}/api/user/getFriends`,
          {
            method: "Get",
            headers: { "Content-Type": "application/json" },
          }
        );

        if (response.unauthorized) {
          dispatch(removeUser());
          dispatch(clearFriends());
          dispatch(clearBlocked());
        } else if (response.error) {
          toast.error(response.error?.message || "An error occurred");
        } else {
          setInitialUsers(response);
          setFilteredUsers(response);
        }
      } catch (error) {
        console.error(error);
      }
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
  console.log(selectedUsers, "selectdusersssss");
  const handleAddMembers = async () => {
    const userIds = selectedUsers.map((user) => user.friendId);
    try {
      const response = await fetchWrapper(`${Fetch_Uri}/api/group/addUsers`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chatId, userIds }),
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
        toast.success("Members added in group ");
      }
    } catch (error) {}
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
    dispatch(setActiveComponent("profile"));
  };

  return (
    <div className=" relative w-full scrollbar-none overflow-x-hidden overflow-y-auto  h-full md:border-l border-gray-400">
      <div className="w-full sticky  top-0 z-10 shadow-lg">
        <div
          className={`flex gap-6 justify-center items-center w-full md:py-3 pt-2.5 pb-1.5`}
        >
          <FaArrowLeft
            onClick={handleArrowClicked}
            className={`w-6 h-6 absolute ${
              isDarkMode ? "text-darkText1" : "text-lightText1"
            } left-4 cursor-pointer`}
          />
          <p
            className={`text-lg ${
              isDarkMode ? "text-darkText1" : "text-lightText1"
            } cursor-pointer`}
          >
            Add Members to Group
          </p>
        </div>
      </div>
      <div className="m-3">
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearch}
          placeholder="Search for friends..."
          className="w-full p-2 border  border-gray-300 rounded-xl focus:outline-blue-400"
        />
      </div>

      {selectedUsers.length > 0 && (
        <div className="mt-4 px-2">
          <h3
            className={`text-lg font-bold mb-2 ${
              isDarkMode ? "text-darkText1" : "text-lightText1"
            }`}
          >
            People Selected:
          </h3>
          <div className="flex flex-wrap">
            {selectedUsers.map((user) => (
              <div
                key={user.friendId}
                className="flex items-center p-2  border border-gray-300 rounded-xl mr-2 mb-2"
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
                  className="ml-2 text-red-500"
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
            className="flex items-center justify-between p-2 border border-gray-300 rounded-xl mb-2 cursor-pointer hover:bg-gray-100"
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
        onClick={handleAddMembers}
        className=" px-2 py-1 bg-blue-500 text-white rounded-xl fixed  z-10 bottom-8 left-36"
      >
        Add members
      </button>
    </div>
  );
};

export default AddNewMembers;
