import React, { useEffect, useState } from "react";
import { Fetch_Uri } from "../utils/constants";
import Search from "./Search";
import { fetchWrapper } from "../utils/helpers/functions";
import toast from "react-hot-toast";
import { removeUser } from "../redux/userSlice";
import { clearBlocked, clearFriends } from "../redux/userRelationsSlice";
import { useDispatch } from "react-redux";

const FriendList = () => {
  const [list, setList] = useState([]);
  const dispatch = useDispatch();
  useEffect(() => {
    async function getData() {
      try {
        const response = await fetchWrapper(
          `${Fetch_Uri}/api/user/getFriends`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
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
          console.log(response, "json");
          setList(response);
        }
      } catch (error) {}
    }
    getData();
  }, [dispatch]);
  console.log(list, "friendlist");
  return (
    <div className="relative">
      {list.length > 0 ? (
        <Search
          initialResults={list}
          name="friend"
          searchKey="username"
          type="chat"
        />
      ) : null}
    </div>
  );
};

export default FriendList;
