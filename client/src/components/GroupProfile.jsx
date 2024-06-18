import React, { useEffect, useState } from "react";
import { FaArrowLeft, FaEllipsisV } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { setActiveComponent } from "../redux/uiSlice";
import { removeUser } from "../redux/userSlice";
import { clearBlocked, clearFriends } from "../redux/userRelationsSlice";
import { fetchWrapper } from "../utils/helpers/functions";
import { Fetch_Uri } from "../utils/constants";

const GroupProfile = () => {
  const [group, setGroup] = useState(null);
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const { FriendId } = useSelector((state) => state?.ui?.selectedChat);

  useEffect(() => {
    const getGroupData = async () => {
      try {
        const response = await fetchWrapper(
          `${Fetch_Uri}/api/group/groupInfo/${FriendId}`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(),
          }
        );
        console.log(response, "resss");

        if (response.unauthorized) {
          dispatch(removeUser());
          dispatch(clearFriends());
          dispatch(clearBlocked()); // Perform the logout if the fetch wrapper indicates an unauthorized response
        } else if (response.error) {
          console.log(response.error, "error json");
        } else {
          console.log(response, "response group");
          setGroup(response);
        }
      } catch (error) {
        console.error(error);
      }
    };

    getGroupData();
  }, [FriendId, dispatch]);

  const handleArrowClicked = () => {
    dispatch(setActiveComponent("sidebar"));
  };

  const handleMakeAdmin = async (memberId) => {
    // Function to handle making a member an admin
  };

  if (!group) {
    return <div>Loading...</div>;
  }

  return (
    <div className="transition-all duration-500 relative w-full h-full items-center scrollbar-none overflow-y-auto overflow-x-hidden md:border-l border-gray-400">
      <div className="flex gap-6 justify-center items-center w-full md:py-3 pt-2.5 pb-1.5 sticky bg-neutral-900 top-0 z-10">
        <FaArrowLeft
          onClick={handleArrowClicked}
          className="w-6 h-6 absolute left-4 text-white cursor-pointer"
        />
        <p className="text-lg cursor-pointer">Group Profile</p>
      </div>
      <div className="flex flex-col justify-center items-center pt-8">
        <div className="relative">
          <div className="w-56 h-56 rounded-full overflow-hidden border-2 border-gray-300">
            <img
              src={`https://res.cloudinary.com/dyja4tbmu/${group?.profilePic}.jpg`}
              alt=""
              className="w-full h-full object-center object-cover"
            />
          </div>
          <p className="text-lg font-extralight py-3">{group?.chatName}</p>
        </div>
        <div className="w-full px-4">
          {group?.users.map((member) => (
            <div
              key={member._id}
              className="flex items-center justify-between py-2 border-b border-gray-400"
            >
              <div className="flex items-center gap-4">
                <img
                  src={`https://res.cloudinary.com/dyja4tbmu/${member?.profilePic}.jpg`}
                  alt=""
                  className="w-10 h-10 rounded-full object-center object-cover"
                />
                <p className="text-white">{member.username}</p>
              </div>
              <div className="flex items-center gap-2">
                {group.groupAdmin.includes(member._id) && (
                  <span className="text-green-500">Admin</span>
                )}
                {group.groupAdmin.includes(user._id) && (
                  <FaEllipsisV
                    className="text-white cursor-pointer"
                    onClick={() => handleMakeAdmin(member._id)}
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GroupProfile;
