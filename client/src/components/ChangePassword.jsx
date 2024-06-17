import React, { useState } from "react";
import { FaArrowLeft } from "react-icons/fa6";
import { useChangePassword } from "../utils/hooks/useChangePassword";
import { FiEye, FiEyeOff } from "react-icons/fi";

const ChangePassword = ({ onBack }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [formValue, setFormValue] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const { changePassword, isLoading, error } = useChangePassword();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValue((prevFormValue) => ({
      ...prevFormValue,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await changePassword(formValue);
  };

  return (
    <div className="transition-all duration-500 relative w-full h-full items-center scrollbar-none overflow-y-auto overflow-x-hidden md:border-l border-gray-400">
      <div className="flex gap-6 justify-center items-center w-full md:py-3 pt-2.5 pb-1.5 sticky bg-neutral-900 top-0 z-10">
        <FaArrowLeft
          onClick={onBack}
          className="w-6 h-6 absolute left-4 text-white cursor-pointer"
        />
        <p className="text-lg cursor-pointer">Change Password</p>
      </div>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col justify-center items-center pt-8"
      >
        <div className="relative my-3">
          <input
            required
            name="currentPassword"
            value={formValue?.currentPassword}
            onChange={handleChange}
            id="currentPassword"
            className="peer text-white md:w-64 w-52 font-light text bg-neutral-900 border-b border-green-500 py-2 placeholder-transparent placeholder-shown:border-gray-500 focus:border-green-500 focus:outline-none"
            type="password"
            placeholder="Enter current password"
          />
          <label
            htmlFor="currentPassword"
            className="absolute left-0 top-1.5 cursor-text font-extralight text-sm text-white transition-all duration-[250ms] peer-valid:-top-3 peer-valid:text-sm peer-valid:text-green-500 peer-focus:-top-3 peer-focus:text-sm peer-focus:text-green-500"
          >
            Current Password
          </label>
        </div>
        <div className="relative my-3">
          <input
            required
            name="newPassword"
            value={formValue?.newPassword}
            onChange={handleChange}
            id="newPassword"
            className="peer text-white md:w-64 w-52 font-light text bg-neutral-900 border-b border-green-500 py-2 placeholder-transparent placeholder-shown:border-gray-500 focus:border-green-500 focus:outline-none"
            type={showPassword ? "text" : "password"}
            placeholder="Enter new password"
          />
          <button
            type="button"
            className="absolute top-2.5 -right-2 flex items-center px-3"
            onClick={togglePasswordVisibility}
          >
            {showPassword ? (
              <div className="">
                <FiEye className=" w-5 h-4 text-green-500" />
              </div>
            ) : (
              <div className="">
                <FiEyeOff className=" w-5 h-4 text-green-500" />
              </div>
            )}
          </button>
          <label
            htmlFor="newPassword"
            className="absolute left-0 top-1.5 cursor-text font-extralight text-sm text-white transition-all duration-[250ms] peer-valid:-top-3 peer-valid:text-sm peer-valid:text-green-500 peer-focus:-top-3 peer-focus:text-sm peer-focus:text-green-500"
          >
            New Password
          </label>
        </div>
        <div className="relative my-3">
          <input
            required
            name="confirmPassword"
            value={formValue?.confirmPassword}
            onChange={handleChange}
            id="confirmPassword"
            className="peer text-white md:w-64 w-52 font-light text bg-neutral-900 border-b border-green-500 py-2 placeholder-transparent placeholder-shown:border-gray-500 focus:border-green-500 focus:outline-none"
            type="password"
            placeholder="Confirm new password"
          />
          <label
            htmlFor="confirmPassword"
            className="absolute left-0 top-1.5 cursor-text font-extralight text-sm text-white transition-all duration-[250ms] peer-valid:-top-3 peer-valid:text-sm peer-valid:text-green-500 peer-focus:-top-3 peer-focus:text-sm peer-focus:text-green-500"
          >
            Confirm New Password
          </label>
        </div>
        {error && (
          <p className="text-red-600  text-center mt-3  text-sm  animate-bounce">
            {error} !!
          </p>
        )}
        <button
          disabled={isLoading}
          className="btn bg-green-500 text-white hover:bg-green-600"
          type="submit"
        >
          Change Password
        </button>
      </form>
    </div>
  );
};

export default ChangePassword;
