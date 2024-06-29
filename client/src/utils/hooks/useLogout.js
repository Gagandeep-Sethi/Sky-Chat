import { useState } from "react";
import { useDispatch } from "react-redux";
import { Fetch_Uri } from "../constants";
import { removeUser } from "../../redux/userSlice";
import { clearBlocked, clearFriends } from "../../redux/userRelationsSlice";
import toast from "react-hot-toast";

export const useLogout = () => {
  const [isLoading, setIsLoading] = useState(null);

  const dispatch = useDispatch();
  const logout = async () => {
    setIsLoading(true);

    const response = await fetch(`${Fetch_Uri}/api/auth/logout`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(),
      credentials: "include", //this will let it set cookie
    });
    const json = await response.json();

    if (!response.ok) {
      toast.error(json?.message);
      setIsLoading(false);
    }
    if (response.ok) {
      dispatch(removeUser());
      dispatch(clearFriends());
      dispatch(clearBlocked());
      setIsLoading(false);
    }
  };
  return { logout, isLoading };
};
