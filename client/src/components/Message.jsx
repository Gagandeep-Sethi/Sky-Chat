import React, { useEffect, useState } from "react";
import { formatChatTime } from "../utils/helpers/functions";
import { useDispatch, useSelector } from "react-redux";
import { setActiveComponent, setSelectedChat } from "../redux/uiSlice";

const Message = ({ msg, type }) => {
  const dispatch = useDispatch();
  const { isDarkMode } = useSelector((state) => state.theme);
  const [isOnline, setIsOnline] = useState(false);
  const { onlineUsers } = useSelector((store) => store.socket?.onlineUsers);

  useEffect(() => {
    if (msg?.FriendId) {
      if (onlineUsers.include(msg?.FriendId)) {
        setIsOnline(true);
      }
    }
  }, [msg?.FriendId, onlineUsers]);

  const handleChatSelect = (FriendId) => {
    dispatch(setSelectedChat(FriendId));
    dispatch(setActiveComponent(type));
  };

  return (
    <div
      onClick={() =>
        handleChatSelect({
          FriendId: msg?.friendId ? msg?.friendId : msg?.groupId,
          username: msg?.username ? msg?.username : msg?.chatName,
          profilePic: msg?.profilePic,
          isGroupchat: msg?.friendId ? false : true,
        })
      }
      className=" w-full cursor-pointer border-dashed border-b border-b-gray-600    px-1 py-2 flex gap-4 items-center  overflow-hidden "
    >
      <div className="avatar relative ">
        <div className="w-14 h-14 rounded-full">
          <img
            src={`https://res.cloudinary.com/dyja4tbmu/${msg?.profilePic}.jpg`}
            alt=""
          />
        </div>
        {isOnline && (
          <div className="bg-green-500 absolute rounded-full border-white border w-3 right-0"></div>
        )}
      </div>

      <div className="flex justify-between flex-1 items-center">
        <div>
          <p
            className={` text-lg ${
              isDarkMode ? "text-darkText1" : "text-lightText1"
            }`}
          >
            {msg?.username ? msg?.username : msg?.chatName}
          </p>
          <p className="text-zinc-400 font-thin text-sm  font truncate text-ellipsis w-40">
            {msg?.latestMessage}
          </p>
        </div>
        <div>
          <p className=" text-xs  text-zinc-400">
            {msg?.chatTime ? formatChatTime(msg?.chatTime) : null}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Message;
