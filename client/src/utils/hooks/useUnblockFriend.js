import { useState } from "react";
import { Fetch_Uri } from "../constants";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { setBlocked } from "../../redux/userRelationsSlice";

export const useUnBlockFriend = () => {
  const [isLoadingUnBlock, setIsLoading] = useState(null);
  const dispatch = useDispatch();
  const UnBlock = async (id) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${Fetch_Uri}/api/user/removeBlockedFriend/${id}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(),
          credentials: "include", //this will let it set cookie
        }
      );
      const json = await response.json();

      if (!response.ok) {
        console.log(json, "error json");
        toast.error(json?.message);
        setIsLoading(false);
      }
      if (response.ok) {
        console.log(json, " json");
        toast.success("User removed from blocked list");
        dispatch(setBlocked(json?.blocked));
        setIsLoading(false);
      }
    } catch (error) {}
  };
  return { UnBlock, isLoadingUnBlock };
};
