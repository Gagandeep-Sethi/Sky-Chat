import { useState } from "react";
import { Fetch_Uri } from "../constants";

export const useForgotPassword = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);

  const forgot = async (formValue) => {
    const { email } = formValue;
    setIsLoading(true);
    setError(null);
    const response = await fetch(`${Fetch_Uri}/api/auth/forgotPassword`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const json = await response.json();

    if (!response.ok) {
      setIsLoading(false);
      setError(json.message || "Some error occured please try again");
    }
    if (response.ok) {
      setError(
        json.message || "Reset password link sent to your email please checkout"
      );
      setIsLoading(false);
    }
  };
  return { forgot, isLoading, error };
};
