import { useState } from "react";
import { Fetch_Uri } from "../constants";
import toast from "react-hot-toast";
import { fetchWrapper } from "../helpers/functions";
import { removeUser } from "../../redux/userSlice";
import { clearBlocked, clearFriends } from "../../redux/userRelationsSlice";
import { useDispatch } from "react-redux";

export const useUpdateGroupProfile = () => {
  const [isLoading, setIsLoading] = useState(null);
  const dispatch = useDispatch();
  const update = async (chatName, profilePic, chatId) => {
    const formData = new FormData();
    formData.append("chatName", chatName);
    formData.append("profilePic", profilePic);
    formData.append("chatId", chatId);

    setIsLoading(true);
    try {
      const response = await fetchWrapper(
        `${Fetch_Uri}/api/group/updateGroupProfile`,
        {
          method: "PUT",
          body: formData,
        }
      );

      if (response.unauthorized) {
        dispatch(removeUser());
        dispatch(clearFriends());
        dispatch(clearBlocked());
      } else if (response.error) {
        toast.error("error updating profile");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setIsLoading(false);
    }
  };
  return { update, isLoading };
};
