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

export const useRemoveFriend = () => {
  const [isLoadingRemove, setIsLoading] = useState(null);
  const dispatch = useDispatch();

  const remove = async (id) => {
    setIsLoading(true);

    try {
      const response = await fetchWrapper(
        `${Fetch_Uri}/api/user/removeFriend/${id}`,
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
        console.log(response.error, "error json");
        toast.error(response.error?.message || "An error occurred");
      } else {
        console.log(response, " json");
        toast.success("User removed from friend list");
        dispatch(setFriends(response?.friends));
      }
    } catch (error) {
      console.error("Fetch error:", error);
      toast.error("An error occurred");
    } finally {
      setIsLoading(false);
    }
  };
  return { remove, isLoadingRemove };
};
