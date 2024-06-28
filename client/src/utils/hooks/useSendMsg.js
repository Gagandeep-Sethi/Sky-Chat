import { useState } from "react";
import { Fetch_Uri } from "../constants";
import toast from "react-hot-toast";
import { fetchWrapper } from "../helpers/functions";
import { removeUser } from "../../redux/userSlice";
import { clearBlocked, clearFriends } from "../../redux/userRelationsSlice";
import { useDispatch } from "react-redux";

export const useSendMsg = () => {
  const [isLoading, setIsLoading] = useState(null);
  const dispatch = useDispatch();

  const sendMsg = async (content, id, onFirstMessageSent, chatId) => {
    setIsLoading(true);
    try {
      const response = await fetchWrapper(
        `${Fetch_Uri}/api/message/send/${id}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content }),
        }
      );

      if (response.unauthorized) {
        dispatch(removeUser());
        dispatch(clearFriends());
        dispatch(clearBlocked());
      } else if (response.error) {
        toast.error("error sending message");
      } else {
        console.log(response, " json");
        if (!chatId) {
          onFirstMessageSent();
        }
      }
    } catch (error) {
      console.error("Fetch error:", error);
      toast.error("An error occurred");
    } finally {
      setIsLoading(false);
    }
  };
  return { sendMsg, isLoading };
};
