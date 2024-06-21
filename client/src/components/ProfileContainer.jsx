import React from "react";
import OwnProfile from "./OwnProfile";
import GroupProfile from "./GroupProfile";
import FriendProfile from "./FriendProfile";
import { useSelector } from "react-redux";

const ProfileContainer = () => {
  const profile = useSelector((store) => store?.ui?.profile);
  const isGroupChat = useSelector(
    (store) => store?.ui?.selectedChat?.isGroupchat
  );
  const renderProfile = () => {
    if (profile === "friend" && isGroupChat) {
      return <GroupProfile />;
    }
    switch (profile) {
      case "own":
        return <OwnProfile />;
      case "friend":
        return <FriendProfile />;

      default:
        return null;
    }
  };

  return <div className="w-full h-full">{renderProfile()}</div>;
};

export default ProfileContainer;
