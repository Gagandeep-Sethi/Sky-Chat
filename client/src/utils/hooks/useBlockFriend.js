import { useState } from "react";
import { Fetch_Uri } from "../constants";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { setBlocked } from "../../redux/userRelationsSlice";

export const useBlockFriend = () => {
  const [isLoadingBlock, setIsLoading] = useState(null);
  const dispatch = useDispatch();
  const block = async (id) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${Fetch_Uri}/api/user/blockFriend/${id}`, {
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
        dispatch(setBlocked(json?.blocked));
        setIsLoading(false);
      }
    } catch (error) {}
  };
  return { block, isLoadingBlock };
};
