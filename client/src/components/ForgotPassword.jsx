import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useForgotPassword } from "../utils/hooks/useForgotPassword";
const ForgotPassword = () => {
  const [formValue, setFormValue] = useState({
    email: "",
  });
  const { forgot, isLoading, error } = useForgotPassword();
  const handleSubmit = async (e) => {
    e.preventDefault();
    await forgot(formValue);
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValue((prevFormValue) => ({
      ...prevFormValue,
      [name]: value,
    }));
  };

  return (
    <div className=" bg-[url('./images/background.jpg')] min-w-fit h-screen flex justify-center items-center">
      <div className="w-[80%] h-[80%] ">
        <div className="w-full h-full md:flex  rounded-2xl overflow-hidden">
          <div className="w-full md:w-1/2 md:h-full h-[40%]   bg-customGreen relative items-center flex ">
            <img
              src="/Logo.png"
              alt=""
              className="w-36 left-1/4 md:left-2/3 md:top-6 top-3  md:w-72 md:h-18 absolute"
            />
            <img
              src="/chatting-animate.svg"
              alt=""
              className="md:w-[600px] md:h-[600px] "
            />
          </div>

          <div className="w-full md:w-1/2  h-[60%] md:h-full    bg-customSkin   flex flex-col justify-center items-center">
            <h1 className="font-mono text-3xl mb-10 text-customCyan">Login</h1>
            <div>
              <form
                onSubmit={handleSubmit}
                className="md:space-y-8 space-y-6 w-full h-full flex flex-col items-center  "
              >
                <div class="relative">
                  <input
                    name="email"
                    value={formValue.email}
                    onChange={handleChange}
                    required
                    id="email"
                    className="peer text-slate-600 md:w-64 w-52 bg-customSkin rounded-lg border border-customCyan px-2 py-1 placeholder-transparent placeholder-shown:border-gray-500 focus:border-customCyan focus:outline-none "
                    type="text"
                    placeholder="enter your email"
                  />
                  <label
                    htmlFor="email"
                    className="absolute left-2 top-1.5 cursor-text font-extralight text-sm text-gray-400 transition-all duration-[250ms] peer-valid:-top-3 peer-valid:bg-customSkin peer-valid:text-sm peer-valid:text-customCyan peer-focus:-top-3 peer-focus:bg-customSkin peer-focus:text-sm peer-focus:text-customCyan"
                  >
                    Enter your email
                    <span className="text-red-600 ">*</span>
                  </label>
                </div>
                {error && (
                  <p className="text-red-600  text-center mt-3  text-sm  animate-bounce">
                    {error} !!
                  </p>
                )}

                <button
                  disabled={isLoading}
                  className="btn btn-md   text-white hover:bg-cyan-700 bg-customCyan font-medium border-none rounded-3xl px-6 "
                >
                  {isLoading ? (
                    <span className="loading loading-spinner loading-xs"></span>
                  ) : null}
                  Send verify link
                </button>
              </form>
              <p className="text-center text-sm  text-gray-400 -mt-2">
                Already have account ?{" "}
                <Link to="/login">
                  <span className=" cursor-pointer text-customCyan underline">
                    Login
                  </span>
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
