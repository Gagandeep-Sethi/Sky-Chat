import React from "react";
import Sidebar from "./Sidebar";
import Conversation from "./Conversation";
import FriendProfile from "./FriendProfile";
import { useSelector } from "react-redux";
import OwnProfile from "./OwnProfile";

const HomePage = () => {
  const { activeComponent, selectedChat } = useSelector((state) => state.ui);
  const profile = useSelector((store) => store?.ui?.profile);

  // const handleProfileClick = () => {
  //   dispatch(setActiveComponent("profile"));
  // };

  return (
    <div className=" h-screen  w-screen flex justify-center items-center  bg-[url('./images/chatBackground.jpg')]">
      <div className="flex w-full h-full  bg-neutral-900  border border-gray-100 overflow-hidden">
        <div
          className={`w-full transition-width lg:w-96 ${
            activeComponent === "sidebar" ? "block" : "hidden"
          } lg:block`}
        >
          <Sidebar />
        </div>
        <div
          className={`flex-grow h-full transition-width ${
            activeComponent === "chat" ? "block" : "hidden"
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
          {profile === "friend" ? <FriendProfile /> : <OwnProfile />}
        </div>
      </div>
    </div>
  );
  // return (
  //   <div className=" bg-[url('./images/bg.png')] bg-cover bg-center   w-screen h-screen">
  //     <div className="bg-[url('./images/light.png')] w-full h-full">
  //       {/* <img src="/light.png" alt="" className="" /> */}
  //     </div>
  //   </div>
  //   <div className="w-screen h-screen bg-neutral-900">
  //     <div className="bg-[url('./images/dark.png')] w-full h-full"></div>
  //   </div>
  // );
};

export default HomePage;
