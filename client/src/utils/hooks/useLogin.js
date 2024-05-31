import { useState } from "react";
//import { useDispatch } from "react-redux"
//import { addUser } from "../store/userSlice"
import { Fetch_Uri } from "../constants";

export const useLogin = (formValue) => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);

  //const dispatch=useDispatch()
  const login = async (formValue) => {
    const { email, password } = formValue;

    setIsLoading(true);
    setError(null);
    const response = await fetch(`${Fetch_Uri}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      credentials: "include", //this will let it set cookie
    });
    const json = await response.json();

    if (!response.ok) {
      console.log(json, "error json");
      setIsLoading(false);
      setError(json.mesage);
    }
    if (response.ok) {
      console.log(json, "json");
      localStorage.setItem("user", JSON.stringify(json)); //to store item in local storage of browser by name user
      //dispatch(addUser(json))
      setIsLoading(false);
    }
  };
  return { login, isLoading, error };
};
