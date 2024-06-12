import { Fetch_Uri } from "../utils/constants";
import { FaArrowLeft } from "react-icons/fa6";
import React, { useState } from "react";
import { TbCameraPlus } from "react-icons/tb";

const GroupCreation = ({ selectedUsers, onBack }) => {
  const [groupName, setGroupName] = useState("");
  const [profilePic, setProfilePic] = useState(null);
  const [previewPic, setPreviewPic] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateGroup = async () => {
    setIsLoading(true);

    const formData = new FormData();
    formData.append("groupName", groupName);
    formData.append("profilePic", profilePic);
    selectedUsers.forEach((user) => {
      formData.append("users", user.friendId);
    });
    try {
      const response = await fetch(`${Fetch_Uri}/api/group/create`, {
        method: "POST",
        //headers: { "Content-Type": "application/json" },
        body: formData,
        credentials: "include", //this will let it set cookie
      });
      const json = await response.json();
      console.log(json, "json");
      setIsLoading(false);
    } catch (error) {}
  };

  const handleProfilePicChange = (event) => {
    const file = event.target.files[0];
    setProfilePic(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewPic(reader.result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="w-full relative h-full pt-8">
      <FaArrowLeft
        onClick={onBack}
        className=" w-6 h-6 absolute left-8    text-white cursor-pointer"
      />
      <div className="flex w-full h-full  flex-col justify-center items-center">
        <div className="relative">
          <div className="w-56 h-56 rounded-full overflow-hidden border-2 border-gray-300">
            {previewPic ? (
              <img
                src={previewPic}
                alt="Select profile"
                className="w-full h-full object-center object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-200">
                <TbCameraPlus className="text-gray-500 w-20 h-20" />
              </div>
            )}
          </div>
          <label className="absolute bottom-3 right-2 bg-gray-500 p-2 rounded-full cursor-pointer">
            <TbCameraPlus className="text-white w-6 h-6" />
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleProfilePicChange}
              multiple={false}
            />
          </label>
        </div>
        <div className="relative my-3">
          <input
            required
            name="groupName"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            id="groupName"
            className="peer text-white md:w-64 w-52 font-light text bg-neutral-900 border-b border-green-500 py-2 placeholder-transparent placeholder-shown:border-gray-500 focus:border-green-500 focus:outline-none"
            type="text"
            placeholder="Enter group name"
          />
          <label
            htmlFor="groupName"
            className="absolute left-0 top-1.5 cursor-text font-extralight text-sm text-white transition-all duration-[250ms] peer-valid:-top-3 peer-valid:text-sm peer-valid:text-green-500 peer-focus:-top-3 peer-focus:text-sm peer-focus:text-green-500"
          >
            Group name
          </label>
        </div>
        <button
          disabled={isLoading}
          onClick={handleCreateGroup}
          className="btn bg-green-500 text-white hover:bg-green-600"
        >
          {isLoading ? (
            <span className="loading loading-spinner loading-xs"></span>
          ) : null}
          Create Group
        </button>
      </div>
    </div>
  );
};

export default GroupCreation;
