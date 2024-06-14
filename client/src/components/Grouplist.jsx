import React, { useEffect, useState } from "react";
import { Fetch_Uri } from "../utils/constants";
import Search from "./Search";

const Grouplist = () => {
  const [list, setList] = useState([]);
  useEffect(() => {
    async function getData() {
      const response = await fetch(`${Fetch_Uri}/api/group/get`, {
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
  console.log(list, "list11");
  return (
    <div className="relative">
      {/* {list.length > 0 ? <Search initialResults={list} name="group" /> : null} */}
      {list.length > 0 ? (
        <Search initialResults={list} name="group" searchKey="chatName" />
      ) : null}
      grouplist
    </div>
  );
};

export default Grouplist;
