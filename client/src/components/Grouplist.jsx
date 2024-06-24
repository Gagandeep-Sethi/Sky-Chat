import React, { useEffect, useState } from "react";
import { Fetch_Uri } from "../utils/constants";
import Search from "./Search";
import { fetchWrapper } from "../utils/helpers/functions";
import toast from "react-hot-toast";
import { removeUser } from "../redux/userSlice";
import { clearBlocked, clearFriends } from "../redux/userRelationsSlice";
import { useDispatch, useSelector } from "react-redux";

const Grouplist = () => {
  const [list, setList] = useState([]);
  const dispatch = useDispatch();
  const { isDarkMode } = useSelector((state) => state.theme);

  useEffect(() => {
    async function getData() {
      try {
        const response = await fetchWrapper(`${Fetch_Uri}/api/group/get`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
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
  return (
    <div className="relative">
      {/* {list.length > 0 ? <Search initialResults={list} name="group" /> : null} */}
      {list.length > 0 ? (
        <Search
          initialResults={list}
          name="group"
          searchKey="chatName"
          type="group"
        />
      ) : (
        <div className="flex justify-center items-center h-96  ">
          <p
            className={`text-lg ${
              isDarkMode ? "text-darkText1" : "text-lightText1"
            } `}
          >
            Create group to chat...
          </p>
        </div>
      )}
    </div>
  );
};

export default Grouplist;
