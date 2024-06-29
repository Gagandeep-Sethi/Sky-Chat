import React, { useEffect, useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { Link, useLocation } from "react-router-dom";
import { useResetPassword } from "../utils/hooks/useResetPassword";
const ResetPassword = () => {
  const [showPassword, setShowPassword] = useState(false);
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const token = query.get("token");
  const email = query.get("email");

  useEffect(() => {
    setFormValue((prevFormValue) => ({
      ...prevFormValue,
      token: token,
    }));
  }, [token]);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const [formValue, setFormValue] = useState({
    token: "",
    newPassword: "",
    confirmPassword: "",
  });
  const { resetPassword, isLoading, error } = useResetPassword();
  const handleSubmit = async (e) => {
    e.preventDefault();
    await resetPassword(formValue);
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
            <h1 className="font-mono text-3xl mb-10 text-customCyan">
              Reset Password
            </h1>
            <p className="mb-4">{email}</p>
            <div>
              <form
                onSubmit={handleSubmit}
                className="md:space-y-8 space-y-6 w-full h-full flex flex-col items-center  "
              >
                <div class="relative ">
                  <input
                    name="newPassword"
                    value={formValue.newPassword}
                    onChange={handleChange}
                    required
                    id="newPassword"
                    className="peer text-slate-600 md:w-64 w-52  bg-customSkin rounded-lg border border-customCyan px-2 py-1 placeholder-transparent placeholder-shown:border-gray-500 focus:border-customCyan focus:outline-none "
                    type={showPassword ? "text" : "password"}
                    placeholder="newPassword"
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
                    htmlFor="newPassword"
                    className="absolute left-2 top-1.5 cursor-text font-extralight text-sm text-gray-400 transition-all duration-[250ms] peer-valid:-top-3 peer-valid:bg-customSkin peer-valid:text-sm peer-valid:text-customCyan peer-focus:-top-3 peer-focus:bg-customSkin peer-focus:text-sm peer-focus:text-customCyan"
                  >
                    New Password
                    <span className="text-red-600 ">*</span>
                  </label>
                </div>
                <div class="relative ">
                  <input
                    name="confirmPassword"
                    value={formValue.confirmPassword}
                    onChange={handleChange}
                    required
                    id="confirmPassword"
                    className="peer text-slate-600 md:w-64 w-52  bg-customSkin rounded-lg border border-customCyan px-2 py-1 placeholder-transparent placeholder-shown:border-gray-500 focus:border-customCyan focus:outline-none "
                    type="password"
                    placeholder="Confirm password"
                  />

                  <label
                    htmlFor="confirmPassword"
                    className="absolute left-2 top-1.5 cursor-text font-extralight text-sm text-gray-400 transition-all duration-[250ms] peer-valid:-top-3 peer-valid:bg-customSkin peer-valid:text-sm peer-valid:text-customCyan peer-focus:-top-3 peer-focus:bg-customSkin peer-focus:text-sm peer-focus:text-customCyan"
                  >
                    Confirm password
                    <span className="text-red-600 ">*</span>
                  </label>
                  {error && (
                    <p className="text-red-600  text-center mt-3  text-sm  animate-bounce">
                      {error} !!
                    </p>
                  )}
                </div>

                <button
                  disabled={isLoading}
                  className="btn btn-md   text-white hover:bg-cyan-700 bg-customCyan font-medium border-none rounded-3xl px-6 "
                >
                  {isLoading ? (
                    <span className="loading loading-spinner loading-xs"></span>
                  ) : null}
                  ResetPassword
                </button>
              </form>
              <p className="text-center text-sm  text-gray-400 -mt-2">
                Login here{" "}
                <Link to="/login">
                  <span className=" cursor-pointer text-customCyan underline">
                    Login
                  </span>
                </Link>
              </p>
            </div>
            <div></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
