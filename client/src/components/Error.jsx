import React from "react";
import { Link } from "react-router-dom";

const Error = () => {
  return (
    <div className="h-screen bg-customSkin w-screen flex flex-col justify-center items-center">
      <img
        src="/404-animate.svg"
        alt=""
        className="md:w-[600px] md:h-[600px] "
      />
      <Link to="/">
        <button className="btn text-white ">Back to homepage</button>
      </Link>
    </div>
  );
};

export default Error;
