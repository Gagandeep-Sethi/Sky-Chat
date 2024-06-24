import React, { useEffect, useState } from "react";
import { FaArrowLeft } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { setActiveComponent } from "../redux/uiSlice";
import { useAddFriend } from "../utils/hooks/useAddFriend";
import { useRemoveFriend } from "../utils/hooks/useRemoveFriend";
import { useBlockFriend } from "../utils/hooks/useBlockFriend";
import { useUnBlockFriend } from "../utils/hooks/useUnblockFriend";

const FriendProfile = () => {
  const [profileDetails, setProfileDetails] = useState({
    username: "",
    profilePic: "",
  });
  const [isFriend, setIsFriend] = useState(true);
  const [isBlocked, setIsBlocked] = useState(false);
  const chat = useSelector((store) => store?.ui);
  const dispatch = useDispatch();
  const { addFriend, isLoadingAdd } = useAddFriend();
  const { remove, isLoadingRemove } = useRemoveFriend();
  const { block, isLoadingBlock } = useBlockFriend();
  const { UnBlock, isLoadingUnBlock } = useUnBlockFriend();
  const { isDarkMode } = useSelector((state) => state.theme);
  const { friends, blocked } = useSelector((store) => store?.userRelations);

  useEffect(() => {
    if (chat?.profile === "friend") {
      return setProfileDetails({
        username: chat?.selectedChat.username,
        profilePic: chat?.selectedChat.profilePic,
      });
    }
  }, [chat]);
  useEffect(() => {
    if (friends.includes(chat?.selectedChat?.FriendId)) {
      setIsFriend(true);
    } else {
      setIsFriend(false);
    }
  }, [chat?.selectedChat?.FriendId, friends]);
  useEffect(() => {
    if (blocked.includes(chat?.selectedChat?.FriendId)) {
      setIsBlocked(true);
    } else {
      setIsBlocked(false);
    }
  }, [chat?.selectedChat?.FriendId, blocked]);
  const handleArrowClicked = () => {
    dispatch(setActiveComponent("chat"));
  };
  const handleAddFriend = async () => {
    await addFriend(chat?.selectedChat?.FriendId);
  };
  const handleRemoveFriend = async () => {
    await remove(chat?.selectedChat?.FriendId);
  };
  const handleBlockFriend = async () => {
    await block(chat?.selectedChat?.FriendId);
  };
  const handleUnBlockFriend = async () => {
    await UnBlock(chat?.selectedChat?.FriendId);
  };

  return (
    <div className="  relative w-full h-full items-center scrollbar-none overflow-y-auto overflow-x-hidden md:border-l border-gray-400">
      <div
        className={`flex gap-6 md:justify-center items-center w-full md:py-3 pt-2.5 pb-1.5 sticky shadow-lg ${
          isDarkMode ? "bg-neutral-900  " : "bg-white"
        } top-0 z-10`}
      >
        <FaArrowLeft
          onClick={handleArrowClicked}
          className={`w-6 h-6 absolute left-4 ${
            isDarkMode ? "text-white" : "text-black"
          }  cursor-pointer`}
        />
        <p
          className={`text-lg ${
            isDarkMode ? "text-darkText1" : "text-lightText1"
          } `}
        >
          Profile
        </p>
      </div>
      <div className="flex flex-col justify-center items-center pt-8">
        <div className="avatar">
          <div className="w-56 rounded-full">
            <img
              src={`https://res.cloudinary.com/dyja4tbmu/${profileDetails?.profilePic}.jpg`}
              alt=""
            />
          </div>
        </div>
        <p
          className={`text-lg ${
            isDarkMode ? "text-white" : "text-black"
          } font-extralight py-3`}
        >
          {profileDetails?.username}
        </p>
        <div className="space-y-3">
          <div className="flex justify-center ">
            {!isFriend ? (
              <button
                disabled={isLoadingAdd}
                onClick={handleAddFriend}
                className="btn   bg-blue-600 text-white hover:bg-blue-500"
              >
                {isLoadingAdd ? (
                  <span className="loading loading-spinner loading-xs"></span>
                ) : null}
                Add friend
              </button>
            ) : (
              <button
                onClick={handleRemoveFriend}
                disabled={isLoadingRemove}
                className="btn  bg-blue-600 text-white hover:bg-blue-500"
              >
                Remove friend
              </button>
            )}
          </div>
          <div className="flex justify-center ">
            {!isBlocked ? (
              <button
                disabled={isLoadingBlock}
                onClick={handleBlockFriend}
                className="btn  bg-blue-600 text-white hover:bg-blue-500"
              >
                Block User
              </button>
            ) : (
              <button
                disabled={isLoadingUnBlock}
                onClick={handleUnBlockFriend}
                className="btn  bg-blue-600 text-white hover:bg-blue-500"
              >
                Unblock User
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FriendProfile;
