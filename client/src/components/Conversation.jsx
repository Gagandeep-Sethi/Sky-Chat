import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Fetch_Uri } from "../utils/constants";
import { FaArrowLeft } from "react-icons/fa6";
import Chatting from "./Chatting";
import SendMessage from "./SendMessage";
import { setActiveComponent, setProfile } from "../redux/uiSlice";

const Conversation = () => {
  const { selectedChat } = useSelector((state) => state.ui);
  const [chat, setChat] = useState([]);
  const dispatch = useDispatch();
  function handleProfileClick() {
    dispatch(setProfile("friend"));
    dispatch(setActiveComponent("profile"));
  }
  useEffect(() => {
    async function getData() {
      const response = await fetch(
        `${Fetch_Uri}/api/message/${selectedChat.friendId}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include", //this will let it set cookie
        }
      );
      const json = await response.json();
      console.log(json, "json");
      setChat(json);
    }
    if (selectedChat) getData();
  }, [selectedChat]);
  return (
    <div className="relative w-full h-full items-center scrollbar-none overflow-y-auto overflow-x-hidden md:border-r border-gray-400">
      <div className=" flex gap-6 md:justify-center items-center w-full md:py-3 pt-2.5 pb-1.5 sticky bg-neutral-900 top-0  z-10 ">
        <FaArrowLeft className="md:hidden w-6 h-6 ml-6" />

        <div className="avatar ">
          <div className="w-9 rounded-full">
            <img
              src={`https://res.cloudinary.com/dyja4tbmu/${selectedChat?.profilePic}.jpg`}
              alt=""
            />
          </div>
        </div>
        <p onClick={handleProfileClick} className="text-lg cursor-pointer">
          {selectedChat?.username}
        </p>
      </div>

      <div className="w-full flex-grow">
        <Chatting chat={chat} friendPic={selectedChat?.profilePic} />
      </div>
      <div className="   sticky bottom-1 w-full  ">
        <SendMessage id={selectedChat.friendId} />
      </div>
    </div>
  );
};

export default Conversation;
