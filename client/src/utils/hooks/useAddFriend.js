import { useState } from "react";
import { Fetch_Uri } from "../constants";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import {
  clearBlocked,
  clearFriends,
  setFriends,
} from "../../redux/userRelationsSlice";
import { fetchWrapper } from "../helpers/functions";
import { removeUser } from "../../redux/userSlice";

export const useAddFriend = () => {
  const [isLoadingAdd, setIsLoading] = useState(null);
  const dispatch = useDispatch();

  const addFriend = async (id) => {
    setIsLoading(true);
    try {
      const response = await fetchWrapper(
        `${Fetch_Uri}/api/user/addFriend/${id}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(),
        }
      );

      if (response.unauthorized) {
        dispatch(removeUser());
        dispatch(clearFriends());
        dispatch(clearBlocked()); // Perform the logout if the fetch wrapper indicates an unauthorized response
      } else if (response.error) {
        toast.error(response.error?.message || "An error occurred");
      } else {
        toast.success("User added to friend list");
        dispatch(setFriends(response?.friends));
        setIsLoading(false);
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setIsLoading(false);
    }
  };
  return { addFriend, isLoadingAdd };
};
