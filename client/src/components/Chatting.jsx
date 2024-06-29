import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ChatTime } from "../utils/helpers/functions";
import { joinRoom, leaveRoom } from "../redux/socketSlice";

const Chatting = ({ chat, image }) => {
  const user = useSelector((store) => store?.user);
  const ui = useSelector((store) => store?.ui?.activeComponent);
  const { isDarkMode } = useSelector((state) => state.theme);
  const { socket } = useSelector((store) => store?.socket);
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const dispatch = useDispatch();

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    setMessages(chat);
    scrollToBottom();
  }, [chat]);

  useEffect(() => {
    if (!socket) return;

    socket.on("typing", () => {
      setIsTyping(true);
    });
    socket.on("stop typing", () => {
      setIsTyping(false);
    });

    return () => {
      socket.off("typing");
      socket.off("stop typing");
    };
  }, [socket]);

  useEffect(() => {
    if (socket && chat.length > 0) {
      dispatch(joinRoom(chat[0].chatId));
      socket.on("newMessage", (message) => {
        setMessages((prevMessages) => [...prevMessages, message]);
        scrollToBottom();
      });

      return () => {
        if (chat[0].chatId) {
          dispatch(leaveRoom(chat[0].chatId));
        }
        socket.off("newMessage");
      };
    }
  }, [socket, chat, dispatch]);

  useLayoutEffect(() => {
    scrollToBottom();
  }, []);

  return (
    <div className="scrollbar-none  overflow-y-auto overflow-x-hidden  ">
      {messages.length > 0 ? (
        <div>
          {messages?.map((msg) => {
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
                  <div
                    className={`text-xs chat-header opacity-70 ${
                      isDarkMode ? "text-darkText1" : "text-lightText1"
                    } `}
                  >
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
                <div className="chat-footer opacity-70">
                  <time
                    className={`text-xs  ${
                      isDarkMode ? "text-darkText1" : "text-lightText1"
                    } `}
                  >
                    {ChatTime(msg?.createdAt)}
                  </time>
                </div>
              </div>
            );
          })}
          {isTyping && (
            <div className="space-x-2 mx-3">
              <div className="avatar">
                <div className="w-10 rounded-full">
                  <img
                    src={`https://res.cloudinary.com/dyja4tbmu/${image}.jpg`}
                    alt=""
                  />
                </div>
              </div>
              <span
                className={`loading loading-dots ${
                  isDarkMode ? "text-darkText1" : "text-lightText1"
                }  loading-md`}
              ></span>
            </div>
          )}
        </div>
      ) : null}

      <div ref={messagesEndRef} />
    </div>
  );
};

export default Chatting;
