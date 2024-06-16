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
import { useSelector } from "react-redux";
import Error from "./components/Error";

function App() {
  const user = useSelector((store) => store?.user?.username);

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
          <Route path="*" element={<Error />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
