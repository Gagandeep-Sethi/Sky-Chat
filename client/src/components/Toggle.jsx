import React, { useState } from "react";
import FriendList from "./FriendList";
import Grouplist from "./Grouplist";

const Toggle = () => {
  const [activeComponent, setActiveComponent] = useState("friend");

  return (
    <div className="p-4">
      <div className="flex justify-center ">
        <button
          className={`px-4 py-2 rounded-l-full   ${
            activeComponent === "friend"
              ? "bg-blue-500 text-white"
              : "bg-slate-500 text-gray-300"
          }`}
          onClick={() => setActiveComponent("friend")}
        >
          Friends
        </button>
        <button
          className={`px-4 py-2 rounded-r-full  ${
            activeComponent === "group"
              ? "bg-blue-500 text-white"
              : "bg-slate-500 text-gray-300"
          }`}
          onClick={() => setActiveComponent("group")}
        >
          Groups
        </button>
      </div>
      <div>
        {activeComponent === "friend" && <FriendList />}
        {activeComponent === "group" && <Grouplist />}
      </div>
    </div>
  );
};

export default Toggle;
