import React from "react";
import Sidebar from "./Sidebar";
import Conversation from "./Conversation";
import { useSelector } from "react-redux";
import AddFriends from "./AddFriends";
import CreateGroup from "./CreateGroup";
import ProfileContainer from "./ProfileContainer";
import AddNewMembers from "./AddNewMembers";

const HomePage = () => {
  const { activeComponent, selectedChat } = useSelector((state) => state.ui);
  const { isDarkMode } = useSelector((state) => state.theme);

  return (
    <div className={`h-screen  w-screen flex justify-center items-center  `}>
      <div
        className={`flex w-full h-full  ${
          isDarkMode ? "bg-darkBg" : "bg-lightBg"
        }  border border-gray-100 overflow-hidden`}
      >
        <div
          className={`w-full transition-transform lg:w-96 ${
            activeComponent === "sidebar" ? "block" : "hidden"
          } lg:block`}
        >
          <Sidebar />
        </div>
        <div
          className={`transition-transform fixed w-full h-full lg:w-96 left-0 top-0 z-20  ${
            activeComponent === "createGroup"
              ? "transform translate-x-0 w-full lg:w-1/4"
              : "hidden-profile"
          }`}
        >
          <CreateGroup />
        </div>

        <div
          className={`transition-transform fixed w-full h-full lg:w-96 left-0 top-0 z-20 ${
            activeComponent === "addFriend"
              ? "transform translate-x-0 w-full lg:w-1/4"
              : "hidden-profile"
          }`}
        >
          <AddFriends />
        </div>
        <div
          className={`flex-grow h-full transition-width  ${
            activeComponent === "chat" || activeComponent === "group"
              ? "block"
              : "hidden"
          } lg:block `}
        >
          {selectedChat?.username ? (
            <Conversation />
          ) : (
            <div className="flex items-center justify-center h-full text-center text-gray-500">
              Select a chat to start messaging
            </div>
          )}
        </div>
        <div
          className={`transition-transform fixed lg:relative right-0 top-0 h-full ${
            activeComponent === "profile"
              ? "transform translate-x-0 w-full lg:w-1/4"
              : "hidden-profile"
          }`}
        >
          <ProfileContainer />
        </div>
        <div
          className={`transition-transform fixed lg:relative right-0 top-0 h-full ${
            activeComponent === "addNewMembers"
              ? "transform translate-x-0 w-full lg:w-1/4"
              : "hidden-profile"
          }`}
        >
          <AddNewMembers />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
