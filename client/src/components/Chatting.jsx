import React from "react";
import { useSelector } from "react-redux";
import { ChatTime } from "../utils/helpers/functions";

const Chatting = ({ chat }) => {
  const user = useSelector((store) => store?.user);
  const ui = useSelector((store) => store?.ui?.activeComponent);
  const { isDarkMode } = useSelector((state) => state.theme);
  return (
    <div className="overflow-y-auto overflow-x-hidden  scrollbar-none">
      {chat.length > 0 ? (
        <div>
          {chat?.map((msg) => {
            return (
              <div
                key={msg?._id}
                className={`chat md:mx-6 mx-3 my-3 ${
                  msg?.senderId?.username === user?.username
                    ? "chat-end"
                    : "chat-start"
                }`}
              >
                <div className="chat-image avatar">
                  <div className="w-10 rounded-full">
                    <img
                      alt=""
                      src={`https://res.cloudinary.com/dyja4tbmu/${msg?.senderId?.profilePic}.jpg`}
                    />
                  </div>
                </div>
                {ui === "group" ? (
                  <div className="chat-header text-xs">
                    {msg?.senderId?.username}
                  </div>
                ) : null}
                <div
                  className={`chat-bubble ${
                    msg?.senderId?.username === user?.username
                      ? isDarkMode
                        ? "bg-darkchatBubble1 text-darkchatMsg1"
                        : "bg-lightchatBubble1 text-lightchatMsg1"
                      : isDarkMode
                      ? "bg-darkchatBubble2 text-darkchatMsg2"
                      : "bg-lightchatBubble2 text-lightchatMsg2"
                  } max-w-60 md:max-w-72 break-words overflow-hidden `}
                >
                  {msg?.content}
                </div>
                <div className="chat-footer opacity-50">
                  <time className="text-xs opacity-50">
                    {ChatTime(msg?.createdAt)}
                  </time>
                </div>
              </div>
            );
          })}
        </div>
      ) : null}
    </div>
  );
};

export default Chatting;
