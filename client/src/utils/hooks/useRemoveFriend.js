import { useState } from "react";
import { Fetch_Uri } from "../constants";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { setFriends } from "../../redux/userRelationsSlice";

export const useRemoveFriend = () => {
  const [isLoadingRemove, setIsLoading] = useState(null);
  const dispatch = useDispatch();

  const remove = async (id) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${Fetch_Uri}/api/user/removeFriend/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        //body: formData,
        credentials: "include", //this will let it set cookie
      });
      const json = await response.json();

      if (!response.ok) {
        console.log(json, "error json");
        toast.error(json?.message);
        setIsLoading(false);
      }
      if (response.ok) {
        console.log(json, " json");
        dispatch(setFriends(json?.friends));
        setIsLoading(false);
      }
    } catch (error) {}
  };
  return { remove, isLoadingRemove };
};
