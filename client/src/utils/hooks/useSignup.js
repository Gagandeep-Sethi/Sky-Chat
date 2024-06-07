import { useState } from "react";
import { Fetch_Uri } from "../constants";

export const useSignup = (formValue) => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);

  const signup = async (formValue) => {
    const { email, password, confirmPassword, username } = formValue;

    setIsLoading(true);
    setError(null);
    const response = await fetch(`${Fetch_Uri}/api/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, username, confirmPassword }),
      credentials: "include", //this will let it set cookie
    });
    const json = await response.json();

    if (!response.ok) {
      console.log(json, "error json");
      setIsLoading(false);
      setError(json.message);
    }
    if (response.ok) {
      console.log(json, "json");
      setIsLoading(false);
    }
  };
  return { signup, isLoading, error };
};
