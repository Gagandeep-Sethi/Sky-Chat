import { useState } from "react";
import { useDispatch } from "react-redux";
import { Fetch_Uri } from "../constants";
import { addUser } from "../../redux/userSlice";
import { setBlocked, setFriends } from "../../redux/userRelationsSlice";

export const useLogin = (formValue) => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);

  const dispatch = useDispatch();
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
      setIsLoading(false);
      setError(json.message);
    }
    if (response.ok) {
      //basic details of user
      dispatch(addUser(json));
      //user friends array
      dispatch(setFriends(json?.friends));
      //user blocked friends array
      dispatch(setBlocked(json?.blocked));
      //user auth token
      localStorage.setItem("token", json?.token);
      setIsLoading(false);
    }
  };
  return { login, isLoading, error };
};
