import "./App.css";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import HomePage from "./components/HomePage";
import Signup from "./components/Signup";
import Signin from "./components/Signin";
import { useDispatch, useSelector } from "react-redux";
import Error from "./components/Error";
import EmailVerified from "./components/EmailVerified";
import ResetPassword from "./components/ResetPassword";
import { useEffect } from "react";
import { io } from "socket.io-client";
import { Fetch_Uri } from "./utils/constants";
import { addSocket, updateOnlineUsers } from "./redux/socketSlice";

function App() {
  const user = useSelector((store) => store?.user?.username);
  const socket = useSelector((store) => store?.socket.socket);
  const dispatch = useDispatch();
  useEffect(() => {
    if (user) {
      const socket = io(Fetch_Uri, {
        withCredentials: true,
      });
      dispatch(addSocket(socket));
      socket.on("getOnlineUsers", (onlineUsers) => {
        console.log(onlineUsers, "onlineusers");
        if (onlineUsers.length > 0) dispatch(updateOnlineUsers(onlineUsers));
      });
      return () => socket.close();
    } else if (socket && !user) {
      return () => socket.close();
    }
  }, [user, dispatch, socket]);
  console.log(socket, "socket");

  return (
    <div className="scroll-smooth">
      <Router>
        <Routes>
          <Route
            path="/"
            element={!user ? <Navigate to="/login" /> : <HomePage />}
          />
          <Route
            path="/login"
            element={user ? <Navigate to="/" /> : <Signin />}
          />
          <Route
            path="/signup"
            element={user ? <Navigate to="/" /> : <Signup />}
          />
          <Route path="/verify" element={<EmailVerified />} />
          <Route path="/user/resetPassword" element={<ResetPassword />} />
          <Route path="*" element={<Error />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
