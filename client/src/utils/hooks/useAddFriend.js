import { useState } from "react";
import { Fetch_Uri } from "../constants";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { setFriends } from "../../redux/userRelationsSlice";

export const useAddFriend = () => {
  const [isLoadingAdd, setIsLoading] = useState(null);
  const dispatch = useDispatch();
  const addFriend = async (id) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${Fetch_Uri}/api/user/addFriend/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(),
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
        toast.success("User added to friend list");

        dispatch(setFriends(json?.friends));
        setIsLoading(false);
      }
    } catch (error) {}
  };
  return { addFriend, isLoadingAdd };
};
