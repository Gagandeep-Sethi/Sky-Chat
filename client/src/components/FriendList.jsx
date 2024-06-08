import React, { useEffect, useState } from "react";
import MessageContainer from "./MessageContainer";
import { Fetch_Uri } from "../utils/constants";
import Search from "./Search";

const FriendList = () => {
  const [list, setList] = useState([]);
  useEffect(() => {
    async function getData() {
      const response = await fetch(`${Fetch_Uri}/api/user/getFriends`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include", //this will let it set cookie
      });
      const json = await response.json();
      console.log(json, "json");
      setList(json);
    }
    getData();
  }, []);
  return (
    <div>
      <p className="text-lg px-4 py-3">All Chat</p>
      {list.length > 0 ? <Search initialResults={list} /> : null}
      {/* {list.length > 0 ? <MessageContainer list={list} /> : null} */}
    </div>
  );
};

export default FriendList;
