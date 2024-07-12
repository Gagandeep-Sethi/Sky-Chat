import React, { useEffect, useState } from "react";
import { Fetch_Uri } from "../utils/constants";
import Search from "./Search";
import { fetchWrapper } from "../utils/helpers/functions";
import toast from "react-hot-toast";
import { removeUser } from "../redux/userSlice";
import { clearBlocked, clearFriends } from "../redux/userRelationsSlice";
import { useDispatch, useSelector } from "react-redux";

const FriendList = () => {
  const [list, setList] = useState([]);
  const dispatch = useDispatch();
  const { isDarkMode } = useSelector((state) => state.theme);
  const { friends } = useSelector((store) => store?.userRelations);
  useEffect(() => {
    async function getData() {
      try {
        const response = await fetchWrapper(
          `${Fetch_Uri}/api/user/getFriends`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
          }
        );
        if (response.unauthorized) {
          dispatch(removeUser());
          dispatch(clearFriends());
          dispatch(clearBlocked());
        } else if (response.error) {
          toast.error(response.error?.message || "An error occurred");
        } else {
          setList(response);
        }
      } catch (error) {}
    }
    getData();
  }, [dispatch, friends]);
  return (
    <div className="relative h-full">
      {list.length > 0 ? (
        <Search
          initialResults={list}
          name="friend"
          searchKey="username"
          type="chat"
        />
      ) : (
        <div className="flex justify-center items-center h-96  ">
          <p
            className={`text-lg ${
              isDarkMode ? "text-darkText1" : "text-lightText1"
            } `}
          >
            Add friends to chat them with...
          </p>
        </div>
      )}
    </div>
  );
};

export default FriendList;
