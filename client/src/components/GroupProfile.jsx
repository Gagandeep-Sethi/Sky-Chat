import React, { useEffect, useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { setActiveComponent } from "../redux/uiSlice";
import { removeUser } from "../redux/userSlice";
import { clearBlocked, clearFriends } from "../redux/userRelationsSlice";
import { fetchWrapper } from "../utils/helpers/functions";
import { Fetch_Uri } from "../utils/constants";
import MemberDropdown from "./MemberDropdown";
import GroupDropdown from "./GroupDropdown";
import EditGroupProfile from "./EditGroupProfile";

const GroupProfile = () => {
  const [group, setGroup] = useState(null);
  const [step, setStep] = useState(1);
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const { FriendId } = useSelector((state) => state?.ui?.selectedChat);
  const { isDarkMode } = useSelector((state) => state.theme);

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
    dispatch(setActiveComponent("chat"));
  };
  const isAdmin = (memberId) => {
    return group.groupAdmin.some((admin) => admin._id === memberId);
  };
  const handleEditProfile = () => {
    setStep(2);
  };

  const handleBack = () => {
    setStep(1);
  };

  const isLoggedInUserAdmin = () => {
    return group.groupAdmin.some((admin) => admin.username === user.username);
  };

  if (!group) {
    return <div>Loading...</div>;
  }

  return (
    <div className="h-full w-full">
      {step === 1 && (
        <div className="transition-all duration-500 relative w-full h-full items-center scrollbar-none overflow-y-auto overflow-x-hidden md:border-l border-gray-400">
          <div
            className={`flex gap-6 justify-center items-center w-full md:py-3 pt-2.5 pb-1.5 sticky shadow-lg ${
              isDarkMode ? "bg-neutral-900  " : "bg-white"
            } top-0 z-10`}
          >
            <FaArrowLeft
              onClick={handleArrowClicked}
              className={`w-6 h-6 absolute left-4 ${
                isDarkMode ? "text-white" : "text-black"
              }  cursor-pointer`}
            />
            <p
              className={`text-lg ${
                isDarkMode ? "text-darkText1" : "text-lightText1"
              } `}
            >
              Group Profile
            </p>
            <div className="absolute right-2">
              <GroupDropdown
                chatId={FriendId}
                editProfile={handleEditProfile}
                isGroupAdmin={isLoggedInUserAdmin}
              />
            </div>
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
              <p
                className={`text-lg text-center ${
                  isDarkMode ? "text-darkText1" : "text-lightText1"
                } font-extralight py-3`}
              >
                {group?.chatName}
              </p>
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
                    <p
                      className={`  ${
                        isDarkMode ? "text-darkText1" : "text-lightText1"
                      }`}
                    >
                      {member.username}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 ">
                    {isAdmin(member._id) && (
                      <span className="text-green-500 text-xs p-1 border rounded-lg  border-green-400">
                        Admin
                      </span>
                    )}
                    {isLoggedInUserAdmin && !isAdmin(member._id) && (
                      <MemberDropdown userId={member._id} chatId={FriendId} />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      {step === 2 && <EditGroupProfile onBack={handleBack} />}
    </div>
  );
};

export default GroupProfile;
// import React, { useEffect, useState } from "react";
// import { FaArrowLeft } from "react-icons/fa";
// import { useSelector, useDispatch } from "react-redux";
// import { setActiveComponent } from "../redux/uiSlice";
// import { removeUser } from "../redux/userSlice";
// import { clearBlocked, clearFriends } from "../redux/userRelationsSlice";
// import { fetchWrapper } from "../utils/helpers/functions";
// import { Fetch_Uri } from "../utils/constants";
// import MemberDropdown from "./MemberDropdown";
// import GroupDropdown from "./GroupDropdown";
// import { TbCameraPlus } from "react-icons/tb";

// const GroupProfile = () => {
//   const [group, setGroup] = useState(null);
//   const [selectedImage, setSelectedImage] = useState(null);
//   const [file, setFile] = useState(null); // State to hold the actual file
//   const [groupName, setGroupName] = useState("");
//   const user = useSelector((store) => store.user);
//   const dispatch = useDispatch();
//   const { FriendId } = useSelector((state) => state?.ui?.selectedChat);

//   useEffect(() => {
//     const getGroupData = async () => {
//       try {
//         const response = await fetchWrapper(
//           `${Fetch_Uri}/api/group/groupInfo/${FriendId}`,
//           {
//             method: "GET",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify(),
//           }
//         );
//         if (response.unauthorized) {
//           dispatch(removeUser());
//           dispatch(clearFriends());
//           dispatch(clearBlocked());
//         } else if (response.error) {
//           console.log(response.error, "error json");
//         } else {
//           setGroup(response);
//           setGroupName(response.chatName); // Set initial group name
//         }
//       } catch (error) {
//         console.error(error);
//       }
//     };

//     getGroupData();
//   }, [FriendId, dispatch]);

//   const handleArrowClicked = () => {
//     dispatch(setActiveComponent("chat"));
//   };

//   const isAdmin = (memberId) => {
//     return group.groupAdmin.some((admin) => admin._id === memberId);
//   };

//   const isLoggedInUserAdmin = () => {
//     return group.groupAdmin.some((admin) => admin.username === user.username);
//   };

//   const handleImageChange = (e) => {
//     if (e.target.files && e.target.files[0]) {
//       const file = e.target.files[0];
//       setSelectedImage(URL.createObjectURL(file));
//       setFile(file); // Set the actual file here
//     }
//   };

//   const handleGroupNameChange = (e) => {
//     setGroupName(e.target.value);
//   };

//   const handleSubmit = async () => {
//     // Implement update logic here, similar to the OwnProfile component
//   };

//   if (!group) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <div className="transition-all duration-500 relative w-full h-full items-center scrollbar-none overflow-y-auto overflow-x-hidden md:border-l border-gray-400">
//       <div className="flex gap-6 justify-center items-center w-full md:py-3 pt-2.5 pb-1.5 sticky bg-neutral-900 top-0 z-10">
//         <FaArrowLeft
//           onClick={handleArrowClicked}
//           className="w-6 h-6 absolute left-4 text-white cursor-pointer"
//         />
//         <p className="text-lg ">Group Profile</p>
//         <div className="absolute right-2">
//           <GroupDropdown chatId={FriendId} />
//         </div>
//       </div>
//       <div className="flex flex-col justify-center items-center pt-8">
//         <div className="relative">
//           <div className="w-56 h-56 rounded-full overflow-hidden border-2 border-gray-300">
//             <img
//               src={
//                 selectedImage ||
//                 `https://res.cloudinary.com/dyja4tbmu/${group?.profilePic}.jpg`
//               }
//               alt=""
//               className="w-full h-full object-center object-cover"
//             />
//           </div>
//           {isLoggedInUserAdmin() && (
//             <label className="absolute bottom-3 right-2 bg-gray-500 p-2 rounded-full cursor-pointer">
//               <TbCameraPlus className="text-white w-6 h-6 " />
//               <input
//                 type="file"
//                 accept="image/*"
//                 className="hidden"
//                 onChange={handleImageChange}
//                 multiple={false}
//               />
//             </label>
//           )}
//           <p className="text-lg text-center text-white font-extralight py-3">
//             {groupName}
//           </p>
//           {isLoggedInUserAdmin() && (
//             <div className="relative my-3">
//               <input
//                 required
//                 name="groupName"
//                 value={groupName}
//                 onChange={handleGroupNameChange}
//                 id="groupName"
//                 className="peer text-white md:w-64 w-52 font-light text bg-neutral-900 border-b border-green-500 py-2 placeholder-transparent placeholder-shown:border-gray-500 focus:border-green-500 focus:outline-none"
//                 type="text"
//                 placeholder="Enter group name"
//               />
//               <label
//                 htmlFor="groupName"
//                 className="absolute left-0 top-1.5 cursor-text font-extralight text-sm text-white transition-all duration-[250ms] peer-valid:-top-3 peer-valid:text-sm peer-valid:text-green-500 peer-focus:-top-3 peer-focus:text-sm peer-focus:text-green-500"
//               >
//                 Update group name
//               </label>
//             </div>
//           )}
//         </div>
//         {isLoggedInUserAdmin() && (
//           <button
//             onClick={handleSubmit}
//             className="btn bg-green-500 text-white hover:bg-green-600"
//           >
//             Update
//           </button>
//         )}
//         <div className="w-full px-4">
//           {group?.users.map((member) => (
//             <div
//               key={member._id}
//               className="flex items-center justify-between py-2 border-b border-gray-400"
//             >
//               <div className="flex items-center gap-4">
//                 <img
//                   src={`https://res.cloudinary.com/dyja4tbmu/${member?.profilePic}.jpg`}
//                   alt=""
//                   className="w-10 h-10 rounded-full object-center object-cover"
//                 />
//                 <p className="text-white">{member.username}</p>
//               </div>
//               <div className="flex items-center gap-2 ">
//                 {isAdmin(member._id) && (
//                   <span className="text-green-500 text-xs p-1 border rounded-lg  border-green-400">
//                     Admin
//                   </span>
//                 )}
//                 {isLoggedInUserAdmin() && !isAdmin(member._id) && (
//                   <MemberDropdown userId={member._id} chatId={FriendId} />
//                 )}
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default GroupProfile;
