import { useState } from "react";
import { Fetch_Uri } from "../constants";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import {
  clearBlocked,
  clearFriends,
  setBlocked,
} from "../../redux/userRelationsSlice";
import { fetchWrapper } from "../helpers/functions";
import { removeUser } from "../../redux/userSlice";

export const useUnBlockFriend = () => {
  const [isLoadingUnBlock, setIsLoading] = useState(null);
  const dispatch = useDispatch();

  const UnBlock = async (id) => {
    setIsLoading(true);
    try {
      const response = await fetchWrapper(
        `${Fetch_Uri}/api/user/removeBlockedFriend/${id}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(),
        }
      );

      if (response.unauthorized) {
        dispatch(removeUser());
        dispatch(clearFriends());
        dispatch(clearBlocked());
      } else if (response.error) {
        toast.error(response.error?.message || "An error occurred");
      } else {
        toast.success("User removed from blocked list");
        dispatch(setBlocked(response?.blocked));
      }
    } catch (error) {
      console.error("Fetch error:", error);
      toast.error("An error occurred");
    } finally {
      setIsLoading(false);
    }
  };
  return { UnBlock, isLoadingUnBlock };
};
