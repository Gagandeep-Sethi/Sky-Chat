import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export const useResetPassword = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const navigate = useNavigate(); // Use useNavigate hook

  const resetPassword = async (formValue) => {
    const { token, newPassword, confirmPassword } = formValue;

    setIsLoading(true);
    setError(null);
    const response = await fetch(`/api/auth/resetPassword`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, newPassword, confirmPassword }),
    });
    const json = await response.json();

    if (!response.ok) {
      setIsLoading(false);
      setError(json.message);
    }
    if (response.ok) {
      setIsLoading(false);
      toast.success("Password reset please login with new password");
      navigate("/login"); // Redirect to /login page
    }
  };

  return { resetPassword, isLoading, error };
};
