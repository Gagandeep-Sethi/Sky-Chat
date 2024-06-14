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
        `${Fetch_Uri}/api/message/${selectedChat?.FriendId}`,
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
  function handleArrowClicked() {
    dispatch(setActiveComponent("sidebar"));
  }

  return (
    // <div className="h-full w-full bg-[url('./images/bg.png')] bg-cover bg-center">
    //   <div className="flex flex-col h-full w-full bg-[url('./images/light.png')] bg-cover bg-center  items-center scrollbar-none overflow-y-auto overflow-x-hidden md:border-r border-gray-400">
    <div className="h-full w-full bg-neutral-900">
      <div className="flex flex-col h-full w-full  items-center scrollbar-none overflow-y-auto overflow-x-hidden ">
        <div className="flex gap-6 md:justify-center items-center w-full md:py-3 pt-2.5 pb-1.5 sticky bg-neutral-900 top-0 z-10">
          <FaArrowLeft
            onClick={handleArrowClicked}
            className="lg:hidden w-6 h-6 ml-6"
          />

          <div className="avatar">
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

        <div className="flex-1 w-full overflow-y-auto">
          <Chatting chat={chat} />
        </div>
        <div className="sticky bottom-1 w-full ">
          <SendMessage id={selectedChat?.FriendId} />
        </div>
      </div>
    </div>
  );
};

export default Conversation;
