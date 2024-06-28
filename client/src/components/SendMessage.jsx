import React, { useEffect, useState } from "react";
import { LuSendHorizonal } from "react-icons/lu";
import { useSendMsg } from "../utils/hooks/useSendMsg";
import { useSelector } from "react-redux";
const SendMessage = ({ id, onFirstMessageSent, chatId }) => {
  const [content, setContent] = useState("");
  const { sendMsg, isLoading } = useSendMsg();
  const { socket } = useSelector((store) => store?.socket);
  const [typingTimeout, setTypingTimeout] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    await sendMsg(content, id, onFirstMessageSent, chatId);
    setContent("");
    socket.emit("stop typing", chatId);
  };
  const handleChange = (e) => {
    setContent(e.target.value);
  };
  useEffect(() => {
    if (!socket || !chatId) return;

    const handleTyping = () => {
      socket.emit("typing", chatId);

      if (typingTimeout) clearTimeout(typingTimeout);

      setTypingTimeout(
        setTimeout(() => {
          socket.emit("stop typing", chatId);
        }, 3000)
      ); // Stop typing after 3 seconds of no activity
    };

    const handleStopTyping = () => {
      socket.emit("stop typing", chatId);
    };

    const handleKeyDown = () => {
      handleTyping();
    };

    const handleBlur = () => {
      handleStopTyping();
    };

    const inputField = document.getElementById("messageInput");
    inputField.addEventListener("keydown", handleKeyDown);
    inputField.addEventListener("blur", handleBlur);

    return () => {
      inputField.removeEventListener("keydown", handleKeyDown);
      inputField.removeEventListener("blur", handleBlur);
    };
  }, [socket, chatId, typingTimeout]);

  return (
    <div className="w-full relative ">
      <form onSubmit={handleSubmit}>
        <input
          id="messageInput"
          required
          value={content}
          onChange={handleChange}
          className="w-full h-12 input rounded-3xl focus:outline-none "
          type="text"
          placeholder="Send a message..."
        />
        <button
          disabled={isLoading}
          className="absolute right-1 top-1 rounded-full bg-blue-500 p-2 text-center"
        >
          {isLoading ? (
            <span className="loading text-white loading-dots loading-xs"></span>
          ) : (
            <LuSendHorizonal className="text-white w-6 h-6" />
          )}
        </button>
      </form>
    </div>
  );
};

export default SendMessage;
