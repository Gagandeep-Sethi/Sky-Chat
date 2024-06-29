import { useState } from "react";
import { Fetch_Uri } from "../constants";
import toast from "react-hot-toast";
import { fetchWrapper } from "../helpers/functions";
import { addUser, removeUser } from "../../redux/userSlice";
import { clearBlocked, clearFriends } from "../../redux/userRelationsSlice";
import { useDispatch } from "react-redux";

export const useUpdateProfile = () => {
  const [isLoading, setIsLoading] = useState(null);
  const dispatch = useDispatch();
  const update = async (username, profilePic) => {
    const formData = new FormData();
    formData.append("username", username);
    formData.append("profilePic", profilePic);
    setIsLoading(true);
    try {
      const response = await fetchWrapper(`${Fetch_Uri}/api/user/update`, {
        method: "POST",
        body: formData,
      });

      if (response.unauthorized) {
        dispatch(removeUser());
        dispatch(clearFriends());
        dispatch(clearBlocked());
      } else if (response.error) {
        toast.error(response?.error?.message);
      } else {
        toast.success("Profile Updated");
        dispatch(addUser(response));
      }
    } catch (error) {
      console.error("Fetch error:", error);
      toast.error("An error occurred");
    } finally {
      setIsLoading(false);
    }
  };
  return { update, isLoading };
};
