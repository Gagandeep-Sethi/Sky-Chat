import { useState } from "react";
import { Fetch_Uri } from "../constants";
import toast from "react-hot-toast";

export const useSendMsg = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);

  const sendMsg = async (content, id) => {
    setIsLoading(true);
    setError(null);
    const response = await fetch(`${Fetch_Uri}/api/message/send/${id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
      credentials: "include", //this will let it set cookie
    });
    const json = await response.json();

    if (!response.ok) {
      console.log(json, "error json");
      toast.error("error sending message");
      setIsLoading(false);
      setError(json.mesage);
    }
    if (response.ok) {
      setError(json.mesage);
      console.log(json, " json");
      setIsLoading(false);
    }
  };
  return { sendMsg, isLoading, error };
};
