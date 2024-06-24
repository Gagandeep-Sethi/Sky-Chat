import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Fetch_Uri } from "../utils/constants";
import { FaArrowLeft } from "react-icons/fa6";
import Chatting from "./Chatting";
import SendMessage from "./SendMessage";
import { setActiveComponent, setProfile } from "../redux/uiSlice";
import { fetchWrapper } from "../utils/helpers/functions";
import toast from "react-hot-toast";
import { removeUser } from "../redux/userSlice";
import { clearBlocked, clearFriends } from "../redux/userRelationsSlice";

const Conversation = () => {
  const { selectedChat } = useSelector((state) => state.ui);
  const [chat, setChat] = useState([]);
  const dispatch = useDispatch();
  const { isDarkMode } = useSelector((state) => state.theme);

  function handleProfileClick() {
    if (selectedChat.isGroupChat) {
      dispatch(setProfile("group"));
    } else {
      dispatch(setProfile("friend"));
    }
    dispatch(setActiveComponent("profile"));
  }
  useEffect(() => {
    async function getData() {
      const response = await fetchWrapper(
        `${Fetch_Uri}/api/message/${selectedChat?.FriendId}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );
      if (response.unauthorized) {
        dispatch(removeUser());
        dispatch(clearFriends());
        dispatch(clearBlocked());
      } else if (response.error) {
        console.log(response.error, "error json");
        toast.error(response.error?.message || "An error occurred");
      } else {
        console.log(response, "group");
        setChat(response);
      }
    }
    if (selectedChat) getData();
  }, [selectedChat, dispatch]);
  function handleArrowClicked() {
    dispatch(setActiveComponent("sidebar"));
  }

  return (
    <div
      className={`h-full w-full scrollbar-track-red-400 scrollbar-thumb-red-700 overflow-y-auto ${
        !isDarkMode ? "bg-[url('./images/bg.png')] bg-cover" : "bg-neutral-950"
      }  bg-center`}
    >
      <div
        className={`flex flex-col h-full w-full ${
          isDarkMode
            ? "bg-[url('./images/dark.png')]"
            : "bg-[url('./images/light.png')]"
        } bg-contain bg-center  items-center overflow-y-auto overflow-x-hidden md:border-r border-gray-400 `}
      >
        <div
          className={`flex gap-6 md:justify-center items-center w-full md:py-3 pt-2.5 pb-1.5 sticky backdrop-blur-sm  shadow-lg top-0 z-10`}
        >
          <FaArrowLeft
            onClick={handleArrowClicked}
            className={`lg:hidden w-6 h-6 ml-6 ${
              isDarkMode ? "text-white" : "text-black"
            }`}
          />

          <div className="avatar">
            <div className="w-9 rounded-full">
              <img
                src={`https://res.cloudinary.com/dyja4tbmu/${selectedChat?.profilePic}.jpg`}
                alt=""
              />
            </div>
          </div>
          <p
            onClick={handleProfileClick}
            className={`text-lg cursor-pointer ${
              isDarkMode ? "text-white" : "text-black"
            }`}
          >
            {selectedChat?.username}
          </p>
        </div>

        <div className="flex-1 w-full overflow-y-auto ">
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
