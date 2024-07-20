import React, { useEffect, useState } from "react";
import { FaArrowLeft } from "react-icons/fa6";
import { TbCameraPlus } from "react-icons/tb";
import { useSelector } from "react-redux";
import { useUpdateGroupProfile } from "../utils/hooks/useUpdateGroupProfile";

const EditGroupProfile = ({ onBack }) => {
  const [profileDetails, setProfileDetails] = useState({
    chatname: "",
    profilePic: "",
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [file, setFile] = useState(null); // State to hold the actual file
  const chat = useSelector((store) => store?.ui);
  const { update, isLoading } = useUpdateGroupProfile();
  const { isDarkMode } = useSelector((state) => state.theme);

  useEffect(() => {
    if (chat?.profile === "friend") {
      setProfileDetails({
        username: chat?.selectedChat?.username,
        profilePic: chat?.selectedChat?.profilePic,
      });
    }
  }, [chat]);

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImage(URL.createObjectURL(file));
      setFile(file); // Set the actual file here
    }
  };

  const handleNameChange = (e) => {
    const { name, value } = e.target;
    setProfileDetails((prevFormValue) => ({
      ...prevFormValue,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    await update(profileDetails?.username, file, chat?.selectedChat?.FriendId); // Pass the actual file object
  };

  return (
    <div className="transition-all duration-500 relative w-full h-full items-center scrollbar-none overflow-y-auto overflow-x-hidden md:border-l border-gray-400">
      <div
        className={`flex gap-6 justify-center items-center w-full md:py-3 pt-2.5 pb-1.5 sticky shadow-lg ${
          isDarkMode ? "bg-darkBg  " : "bg-lightBg"
        } top-0 z-10`}
      >
        <FaArrowLeft
          onClick={onBack}
          className={`w-6 h-6 absolute left-4 ${
            isDarkMode ? "text-darkText1" : "text-lightText1"
          }  cursor-pointer`}
        />
        <p
          className={`text-lg ${
            isDarkMode ? "text-darkText1" : "text-lightText1"
          }`}
        >
          Edit profile
        </p>
      </div>

      <div className="flex flex-col justify-center items-center pt-8">
        <div className="relative">
          <div className="w-56 h-56 rounded-full overflow-hidden border-2 border-gray-300">
            <img
              src={
                selectedImage ||
                `https://res.cloudinary.com/dyja4tbmu/${profileDetails?.profilePic}.jpg`
              }
              alt=""
              className="w-full h-full object-center object-cover"
            />
          </div>
          <label className="absolute bottom-3 right-2 bg-gray-500 p-2 rounded-full cursor-pointer">
            <TbCameraPlus className="text-white w-6 h-6 " />
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
              multiple={false}
            />
          </label>
        </div>

        <div className="relative my-3">
          <input
            required
            name="username"
            value={profileDetails?.username}
            onChange={handleNameChange}
            id="username"
            className={`peer  md:w-64 w-52 font-light text ${
              isDarkMode
                ? "bg-darkBg text-darkText1"
                : "bg-lightBg text-lightText1"
            } border-b border-green-500 py-2 placeholder-transparent placeholder-shown:border-gray-500 focus:border-green-500 focus:outline-none`}
            type="text"
            placeholder="enter your name"
          />
          <label
            htmlFor="username"
            className={`absolute left-0 top-1.5 cursor-text font-extralight text-sm ${
              isDarkMode ? "text-darkText1" : "text-lightText1"
            }  transition-all duration-[250ms] peer-valid:-top-3 peer-valid:text-sm peer-valid:text-green-500 peer-focus:-top-3 peer-focus:text-sm peer-focus:text-green-500`}
          >
            Update group name
          </label>
        </div>
        <button
          disabled={isLoading}
          onClick={handleSubmit}
          className="btn bg-green-500 text-white hover:bg-green-600"
        >
          Update
        </button>
      </div>
    </div>
  );
};

export default EditGroupProfile;
