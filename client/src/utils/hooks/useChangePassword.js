import { useState } from "react";
import { fetchWrapper } from "../helpers/functions";
import { removeUser } from "../../redux/userSlice";
import { clearBlocked, clearFriends } from "../../redux/userRelationsSlice";
import { useDispatch } from "react-redux";
import { Fetch_Uri } from "../constants";
import toast from "react-hot-toast";

export const useChangePassword = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const dispatch = useDispatch();

  const changePassword = async (formValue) => {
    try {
      const { currentPassword, newPassword, confirmPassword } = formValue;

      setIsLoading(true);
      setError(null);
      const response = await fetchWrapper(
        `${Fetch_Uri}/api/auth/changePassword`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            currentPassword,
            newPassword,
            confirmPassword,
          }),
        }
      );

      if (response.unauthorized) {
        console.log("unauth got");
        dispatch(removeUser());
        dispatch(clearFriends());
        dispatch(clearBlocked()); // Perform the logout if the fetch wrapper indicates an unauthorized response
      } else if (response.error) {
        setError(response.error.message);
      } else {
        dispatch(removeUser());
        dispatch(clearFriends());
        dispatch(clearBlocked());
        toast.success("Password Changed please login again");
      }
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };
  return { changePassword, isLoading, error };
};
