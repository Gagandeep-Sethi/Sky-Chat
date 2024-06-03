import React from "react";
import { LuSendHorizonal } from "react-icons/lu";

const SendMessage = () => {
  return (
    <div className="w-full relative ">
      <form>
        <input
          required
          className="w-full h-12 input rounded-3xl focus:outline-none "
          type="text"
          placeholder="Send a message..."
        />
        <button className="absolute right-1 top-1 rounded-full bg-blue-500 p-2 text-center">
          <LuSendHorizonal className="text-white w-6 h-6" />
        </button>
      </form>
    </div>
  );
};

export default SendMessage;
