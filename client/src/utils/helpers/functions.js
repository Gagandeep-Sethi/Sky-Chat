import toast from "react-hot-toast";

export const formatChatTime = (chatTime) => {
  const date = new Date(chatTime);
  const now = new Date();
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);

  const isToday = date.toDateString() === now.toDateString();
  const isYesterday = date.toDateString() === yesterday.toDateString();

  if (isToday) {
    const options = { hour: "numeric", minute: "numeric", hour12: true };
    return date.toLocaleTimeString("en-US", options);
  } else if (isYesterday) {
    return "yesterday";
  } else {
    const day = date.getDate();
    const month = date.getMonth() + 1; // Months are zero-indexed
    const year = date.getFullYear().toString().slice(-2); // Get last two digits of the year
    return `${day}/${month}/${year}`;
  }
};
export const ChatTime = (chatTime) => {
  const date = new Date(chatTime);
  const options = { hour: "numeric", minute: "numeric", hour12: true };
  return date.toLocaleTimeString("en-US", options);
};

export const fetchWrapper = async (url, options = {}) => {
  console.log(options, "options");
  try {
    const response = await fetch(url, {
      ...options,
      credentials: "include", // Include credentials (cookies)
    });

    if (!response.ok) {
      console.log("response not ok");
      const error = await response.json();
      if (response.status === 401 || response.status === 403) {
        toast.error("Your login session expired please login again");
        return { unauthorized: true };
      }
      return { error };
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("There was a problem with the fetch operation:", error);
    return { error };
  }
};
