import React from "react";
import { useAddFriend } from "../utils/hooks/useAddFriend";
import { useRemoveFriend } from "../utils/hooks/useRemoveFriend";
import { useSelector } from "react-redux";

const SearchedUsers = ({ results }) => {
  const { addFriend, isLoadingAdd } = useAddFriend();
  const { remove, isLoadingRemove } = useRemoveFriend();
  const { isDarkMode } = useSelector((state) => state.theme);

  const handleAddFriend = async (id) => {
    await addFriend(id);
  };
  const handleRemoveFriend = async (id) => {
    await remove(id);
  };
  return (
    <div className="w-full h-full overflow-y-auto">
      {results.map((res, i) => {
        return (
          <div key={i} className="w-full    ">
            <div
              className={`w-[92%] my-3 p-3 ${
                isDarkMode ? "bg-neutral-700" : "bg-gray-300"
              }  bg-neutral-700 mx-auto flex items-center  rounded-lg space-x-4  `}
            >
              {/* avatar */}
              <div className="avatar relative ">
                <div className="w-14 h-14 rounded-full">
                  <img
                    src={`https://res.cloudinary.com/dyja4tbmu/${res?.profilePic}.jpg`}
                    alt=""
                  />
                </div>
              </div>
              {/* add and remove Friend */}
              <div>
                <p
                  className={`text-lg ${
                    isDarkMode ? "text-darkText1" : "text-lightText1"
                  }`}
                >
                  {res?.username}
                </p>
                <div>
                  <button
                    disabled={isLoadingAdd}
                    onClick={() => handleAddFriend(res?._id)}
                    className="px-3 py-1 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-white shadow-lg"
                  >
                    Add Friend
                  </button>
                  <button
                    disabled={isLoadingRemove}
                    onClick={() => handleRemoveFriend(res?._id)}
                    className="px-3 py-1 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-white shadow-lg"
                  >
                    Unfriend
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SearchedUsers;
