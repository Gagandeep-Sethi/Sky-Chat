import React, { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="w-full h-full md:flex bg-red-200 rounded-2xl overflow-hidden">
      <div className="w-full md:w-1/2 md:h-full h-[40%]  bg-[#cad2c5] items-center flex ">
        <img
          src="/chatting-animate.svg"
          alt=""
          className="md:w-[600px] md:h-[600px] "
        />
      </div>
      <div className="w-full md:w-1/2  h-[60%] md:h-full    bg-customSkin   flex flex-col justify-center items-center">
        <h1 className="font-mono text-3xl mb-10 text-customCyan">SignUp</h1>
        <div>
          <form className="md:space-y-8 space-y-6 w-full h-full flex flex-col items-center  ">
            <div class="relative">
              <input
                required
                id="username"
                className="peer text-slate-600 md:w-64 w-52 font-light text bg-customSkin rounded-lg border  border-customCyan px-2 py-1 placeholder-transparent placeholder-shown:border-gray-500 focus:border-customCyan focus:outline-none "
                type="text"
                placeholder="enter your name"
              />
              <label
                for="username"
                className="absolute left-2 top-1.5 cursor-text font-extralight text-sm text-gray-400 transition-all duration-[250ms] peer-valid:-top-3 peer-valid:bg-customSkin peer-valid:text-sm peer-valid:text-customCyan peer-focus:-top-3 peer-focus:bg-customSkin peer-focus:text-sm peer-focus:text-customCyan"
              >
                Enter your name
                <span className="text-red-600 ">*</span>
              </label>
            </div>
            <div class="relative">
              <input
                required
                id="email"
                className="peer text-slate-600 md:w-64 w-52 bg-customSkin rounded-lg border border-customCyan px-2 py-1 placeholder-transparent placeholder-shown:border-gray-500 focus:border-customCyan focus:outline-none "
                type="text"
                placeholder="enter your email"
              />
              <label
                for="email"
                className="absolute left-2 top-1.5 cursor-text font-extralight text-sm text-gray-400 transition-all duration-[250ms] peer-valid:-top-3 peer-valid:bg-customSkin peer-valid:text-sm peer-valid:text-customCyan peer-focus:-top-3 peer-focus:bg-customSkin peer-focus:text-sm peer-focus:text-customCyan"
              >
                Enter your email
                <span className="text-red-600 ">*</span>
              </label>
            </div>
            <div class="relative">
              <input
                required
                id="password"
                className="peer text-slate-600 md:w-64 w-52  bg-customSkin rounded-lg border border-customCyan px-2 py-1 placeholder-transparent placeholder-shown:border-gray-500 focus:border-customCyan focus:outline-none "
                type={showPassword ? "text" : "password"}
                placeholder="password"
              />
              <button
                type="button"
                className="absolute top-2.5 -right-2 flex items-center px-3"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? (
                  <div className="">
                    <FiEye className=" w-5 h-4 text-customCyan" />
                  </div>
                ) : (
                  <div className="">
                    <FiEyeOff className=" w-5 h-4 text-customCyan" />
                  </div>
                )}
              </button>
              <label
                for="password"
                className="absolute left-2 top-1.5 cursor-text font-extralight text-sm text-gray-400 transition-all duration-[250ms] peer-valid:-top-3 peer-valid:bg-customSkin peer-valid:text-sm peer-valid:text-customCyan peer-focus:-top-3 peer-focus:bg-customSkin peer-focus:text-sm peer-focus:text-customCyan"
              >
                Password
                <span className="text-red-600 ">*</span>
              </label>
            </div>
            <div class="relative">
              <input
                required
                id="confirmPassword"
                className="peer text-slate-600 md:w-64 w-52   bg-customSkin rounded-lg border border-customCyan px-2 py-1 placeholder-transparent placeholder-shown:border-gray-500 focus:border-customCyan focus:outline-none "
                type="password"
                placeholder="confirm password"
              />

              <label
                for="confirmPassword"
                className="absolute left-2 top-1.5 cursor-text font-extralight text-sm text-gray-400 transition-all duration-[250ms] peer-valid:-top-3 peer-valid:bg-customSkin peer-valid:text-sm peer-valid:text-customCyan peer-focus:-top-3 peer-focus:bg-customSkin peer-focus:text-sm peer-focus:text-customCyan"
              >
                Confirm Password
                <span className="text-red-600 ">*</span>
              </label>
            </div>
            <button className="btn btn-md   text-white hover:bg-cyan-700 bg-customCyan font-medium border-none rounded-3xl px-6 ">
              Signup
            </button>
          </form>
          <p className="text-center text-sm  text-gray-400 -mt-2">
            Already have account ?{" "}
            <span className=" cursor-pointer text-blue-800 hover:underline">
              {/* <Link href="/user/login">SignIn</Link> */} Login
            </span>
          </p>
        </div>
        <div></div>
      </div>
    </div>
  );
};

export default Signup;
// bg-[#cad2c5]
// bg-[#fffcf2]
