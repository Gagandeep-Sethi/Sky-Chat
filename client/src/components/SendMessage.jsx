import React, { useState } from "react";
import { LuSendHorizonal } from "react-icons/lu";
import { useSendMsg } from "../utils/hooks/useSendMsg";
const SendMessage = ({ id }) => {
  const [content, setContent] = useState("");
  const { sendMsg, isLoading } = useSendMsg();
  const handleSubmit = async (e) => {
    e.preventDefault();
    await sendMsg(content, id);
  };
  const handleChange = (e) => {
    setContent(e.target.value);
  };

  return (
    <div className="w-full relative ">
      <form onSubmit={handleSubmit}>
        <input
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
