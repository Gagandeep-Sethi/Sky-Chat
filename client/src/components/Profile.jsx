import React, { useEffect, useState } from "react";
import { FaArrowLeft } from "react-icons/fa6";
import { useSelector } from "react-redux";

const Profile = ({ profile }) => {
  const [profileDetails, setProfileDetails] = useState({
    username: "",
    profilePic: "",
    email: "",
  });
  const chat = useSelector((store) => store?.ui);
  const user = useSelector((store) => store?.user);

  useEffect(() => {
    if (chat?.profile === "friend") {
      console.log("yes");
      return setProfileDetails({
        username: chat?.selectedChat.username,
        profilePic: chat?.selectedChat.profilePic,
      });
    } else if (chat?.profile === "own") {
      setProfileDetails({
        username: user?.username,
        profilePic: user?.profilePic,
        email: user?.email,
      });
    }
  }, [chat, user]);

  return (
    <div className=" transition-all duration-500 it relative w-full h-full items-center scrollbar-none overflow-y-auto overflow-x-hidden md:border-r border-gray-400">
      <div className=" flex gap-6  justify-center items-center w-full md:py-3 pt-2.5 pb-1.5 sticky bg-neutral-900 top-0  z-10 ">
        <FaArrowLeft className=" w-6 h-6 absolute left-4 text-white cursor-pointer" />
        <p className="text-lg cursor-pointer ">Profile</p>
      </div>
      <div className="flex flex-col justify-center items-center pt-8">
        <div className="avatar">
          <div className="w-56 rounded-full">
            <img
              src={`https://res.cloudinary.com/dyja4tbmu/${profileDetails?.profilePic}.jpg`}
              alt=""
            />
          </div>
        </div>
        <p className="text-xl py-3">{profileDetails?.username}</p>
        <div>
          <div>
            <button className="btn   bg-blue-600 text-white hover:bg-blue-500">
              Add friend
            </button>
            <button className="btn  bg-blue-600 text-white hover:bg-blue-500">
              Remove friend
            </button>
          </div>
          <div className="flex justify-center ">
            <button className="btn  bg-blue-600 text-white hover:bg-blue-500">
              Block User
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
