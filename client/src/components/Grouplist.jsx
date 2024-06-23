import React, { useEffect, useState } from "react";
import { Fetch_Uri } from "../utils/constants";
import Search from "./Search";
import { fetchWrapper } from "../utils/helpers/functions";
import toast from "react-hot-toast";
import { removeUser } from "../redux/userSlice";
import { clearBlocked, clearFriends } from "../redux/userRelationsSlice";
import { useDispatch } from "react-redux";

const Grouplist = () => {
  const [list, setList] = useState([]);
  const dispatch = useDispatch();

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
  console.log(list, "list11");
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
      ) : null}
    </div>
  );
};

export default Grouplist;
