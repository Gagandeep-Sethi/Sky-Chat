import React from "react";
import Message from "./Message";

const MessageContainer = ({ list, type }) => {
  console.log(list, "list");
  return (
    <div className="w-full h-full    overflow-y-auto space-y-3 ">
      {list.length === 0 ? (
        <div className="flex items-center justify-center  text-center text-gray-500">
          Add Friends to start chatting
        </div>
      ) : (
        list.map((res, i) => {
          return (
            <div key={i} className="w-full    ">
              <div className="w-full mx-auto transition-all duration-200 rounded-lg  :bg-blue-300">
                <Message msg={res} type={type} />
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default MessageContainer;
