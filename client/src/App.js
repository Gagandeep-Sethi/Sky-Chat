import "./App.css";
import { Outlet } from "react-router-dom";
function App() {
  return (
    <div className="scroll-smooth">
      <div className="text-white">
        <Outlet />
      </div>
    </div>
  );
}

export default App;
