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
import {
  initializeSocket,
  updateOnlineUsers,
  clearSocket,
} from "./redux/socketSlice";
import { Fetch_Uri } from "./utils/constants";
//import { socket } from "./socketService";
import { io } from "socket.io-client";

function App() {
  const user = useSelector((store) => store?.user?.username);

  const dispatch = useDispatch();
  //console.log(socket, "socket");
  useEffect(() => {
    if (user) {
      dispatch(initializeSocket());
    } else {
      dispatch(clearSocket());
    }
  }, [dispatch, user]);
  // useEffect(() => {
  //   if (user) {
  //     const socket = io(Fetch_Uri, {
  //       withCredentials: true,
  //     });
  //     //dispatch(addSocket(socketio));
  //     console.log(socket, "socket");
  //     socket.on("getOnlineUsers", (onlineUsers) => {
  //       console.log(onlineUsers, "onlineusers");
  //       if (onlineUsers.length > 0) dispatch(updateOnlineUsers(onlineUsers));
  //     });
  //     return () => socket.close();
  //   } else if (!user) {
  //     //return () => socket.close();
  //   }
  // }, [user, dispatch]);
  // //console.log(socket, "socket");

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
