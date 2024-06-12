import React, { useEffect, useState } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa6";
import { setActiveComponent } from "../redux/uiSlice";
import { useDispatch } from "react-redux";
import { Fetch_Uri } from "../utils/constants";
import toast from "react-hot-toast";

const UserSelection = ({ onProceed }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [initialUsers, setInitialUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`${Fetch_Uri}/api/user/getFriends`, {
          method: "Get",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(),
          credentials: "include", //this will let it set cookie
        });
        const data = await response.json();
        console.log(data, "data11");

        if (!response.ok) {
          console.log("error");
          toast.error(data?.message);
        }
        setInitialUsers(data);
        setFilteredUsers(data);
      } catch (error) {}
    };

    fetchUsers();
  }, []);

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

  return (
    <div className="p-4 relative w-full scrollbar-none  overflow-y-auto   bg-neutral-900 h-full">
      <div className=" w-full sticky bg-neutral-900 top-0  z-10 ">
        <div className="flex gap-6  justify-center items-center w-full md:py-3 pt-2.5 pb-1.5">
          <FaArrowLeft
            onClick={handleArrowClicked}
            className=" w-6 h-6 absolute left-4 text-white cursor-pointer"
          />
          <p className="text-lg cursor-pointer ">Select members</p>
        </div>
        <div>
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Search for friends..."
            className="w-full p-2 border border-gray-300 rounded-xl focus:outline-blue-400"
          />
        </div>
      </div>
      {selectedUsers.length > 0 && (
        <div className="mt-4">
          <h3 className="text-lg font-bold mb-2">People Selected:</h3>
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
                <span className="ml-2">{user.username}</span>
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

      <div className="my-4">
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
              <span className="ml-2">{user.username}</span>
            </div>
          </div>
        ))}
      </div>
      <button
        disabled={selectedUsers.length < 2}
        onClick={handleProceed}
        className="mt-4 px-2 py-1 bg-blue-500 text-white rounded-xl fixed right-4 z-10 bottom-10"
      >
        <FaArrowRight className="w-6 h-6" />
      </button>
    </div>
  );
};

export default UserSelection;
