import "./App.css";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import Signup from "./pages/Signup";
import Signin from "./pages/Signin";
import { useDispatch, useSelector } from "react-redux";
import Error from "./pages/Error";
import EmailVerified from "./pages/EmailVerified";
import ResetPassword from "./pages/ResetPassword";
import { useEffect } from "react";
import { initializeSocket, clearSocket } from "./redux/socketSlice";
import toast from "react-hot-toast";
import HomePage from "./pages/HomePage";
import ForgotPassword from "./pages/ForgotPassword";

function App() {
  const user = useSelector((store) => store?.user?.username);
  const { socket } = useSelector((store) => store?.socket);
  const { FriendId } = useSelector((state) => state.ui?.selectedChat);

  const dispatch = useDispatch();

  useEffect(() => {
    if (user) {
      dispatch(initializeSocket());
    } else {
      dispatch(clearSocket());
    }
  }, [dispatch, user]);

  function setToast(notificationData) {
    toast.custom((t) => (
      <div
        className={`${
          t.visible ? "animate-enter" : "animate-leave"
        } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
      >
        <div className="flex-1 w-0 p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0 pt-0.5">
              <img
                className="h-10 w-10 rounded-full"
                src={`https://res.cloudinary.com/dyja4tbmu/${notificationData?.message?.senderId?.profilePic}.jpg`}
                alt=""
              />
            </div>
            <div className="ml-3 flex-1">
              <p className="text-sm font-medium text-gray-900">
                {notificationData?.chatName}
              </p>
              <p className="text-xs font-extralight text-gray-900">
                {notificationData?.message?.senderId?.username}
              </p>

              <p className="mt-1 text-sm text-gray-500 truncate w-60">
                {notificationData?.message?.content}
              </p>
            </div>
          </div>
        </div>
        <div className="flex border-l border-gray-200">
          <button
            onClick={() => toast.dismiss(t.id)}
            className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Close
          </button>
        </div>
      </div>
    ));
  }

  useEffect(() => {
    if (!socket) return;

    socket.on("notification", (notificationData) => {
      if (notificationData?.isGroup) {
        if (notificationData?.message?.chatId !== FriendId) {
          setToast(notificationData);
        }
      } else {
        if (notificationData?.message?.senderId?._id !== FriendId) {
          setToast(notificationData);
        }
      }
    });

    return () => {
      socket.off("notification");
    };
  }, [socket, user, FriendId]);

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
          <Route
            path="/user/forgotPassword"
            element={user ? <Navigate to="/" /> : <ForgotPassword />}
          />
          <Route
            path="/user/resetPassword"
            element={user ? <Navigate to="/" /> : <ResetPassword />}
          />
          <Route path="*" element={<Error />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
