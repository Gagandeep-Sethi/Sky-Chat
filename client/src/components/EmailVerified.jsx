import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Fetch_Uri } from "../utils/constants";

const EmailVerification = () => {
  const [verificationStatus, setVerificationStatus] = useState(null);
  const [message, setMessage] = useState("");
  const location = useLocation();

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const token = query.get("token");
    const action = query.get("action");

    if (!token || !action) {
      setMessage("Invalid verification link.");
      setVerificationStatus("error");
      return;
    }

    const verifyEmail = async () => {
      try {
        const response = await fetch(
          `${Fetch_Uri}/api/auth/verify?token=${token}&action=${action}`
        );
        const data = await response.json();

        if (response.ok) {
          if (action === "verify-email") {
            setMessage(
              "Verification Successful! Thank you for verifying your email."
            );
            setVerificationStatus("success");
          } else if (action === "reset-password") {
            setMessage("Redirecting to password reset page...");
            setVerificationStatus("redirect");
            window.location.href = `/user/resetPassword?email=${encodeURIComponent(
              data.email
            )}&token=${encodeURIComponent(token)}`;
          }
        } else {
          setMessage(data.message);
          setVerificationStatus("error");
        }
      } catch (error) {
        setMessage("Error verifying email. Please try again later.");
        setVerificationStatus("error");
      }
    };
    verifyEmail();
  }, [location.search]);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-customSkin">
      {verificationStatus === "success" ? (
        <>
          <p className="text-4xl font-bold text-customCyan mb-8 text-center">
            Verification Successful!
          </p>
          <p className="text-lg text-gray-700 mb-12 text-center">
            Thank you for verifying your email.
          </p>
          <Link to="/login">
            <button className="btn bg-black text-white">Login</button>
          </Link>
        </>
      ) : (
        <div className="h-full w-full flex flex-col items-center justify-center">
          <p className="text-3xl text-black mb-12 text-center">{message}</p>
          <Link to="/login">
            <button className="btn bg-black text-white">Login</button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default EmailVerification;
