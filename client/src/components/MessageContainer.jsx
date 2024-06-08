import React from "react";
import Message from "./Message";

const MessageContainer = ({ list }) => {
  console.log(list, "list");
  return (
    <div className="w-full h-full    overflow-y-auto space-y-3 ">
      {list.map((res, i) => {
        return (
          <div key={i} className="w-full    ">
            <div className="w-[92%] mx-auto transition-all duration-200 rounded-lg  :bg-blue-300">
              <Message msg={res} />
            </div>
          </div>
        );
      })}

      {list.map((res, i) => {
        return (
          <div key={i} className="w-full flex   ">
            <div className="w-[92%] mx-auto ">
              <Message msg={res} />
            </div>
          </div>
        );
      })}
      {list.map((res, i) => {
        return (
          <div key={i} className="w-full flex   ">
            <div className="w-[92%] mx-auto">
              <Message msg={res} />
            </div>
          </div>
        );
      })}
      {list.map((res, i) => {
        return (
          <div key={i} className="w-full flex   ">
            <div className="w-[92%] mx-auto">
              <Message msg={res} />
            </div>
          </div>
        );
      })}
      {list.map((res, i) => {
        return (
          <div key={i} className="w-full flex   ">
            <div className="w-[92%] mx-auto">
              <Message msg={res} />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MessageContainer;
