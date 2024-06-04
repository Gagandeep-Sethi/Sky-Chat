import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import App from "./App";
import store from "./redux/Store";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import HomePage from "./components/HomePage";
import Signin from "./components/Signin";
import Signup from "./components/Signup";
import { Toaster } from "react-hot-toast";

const root = ReactDOM.createRoot(document.getElementById("root"));

const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/login",
        element: <Signin />,
      },
      {
        path: "/signup",
        element: <Signup />,
      },
      {
        path: "/",
        element: <HomePage />,
      },
    ],
    //errorElement:<Error/>
  },
]);
root.render(
  <Provider store={store}>
    <Toaster position="top-center" reverseOrder={false} />{" "}
    <RouterProvider router={appRouter} />
  </Provider>
);
