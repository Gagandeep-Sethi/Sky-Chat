import "./App.css";
import Signup from "./components/Signup";

function App() {
  return (
    <div className=" bg-[url('./images/background.jpg')] min-w-fit h-screen flex justify-center items-center">
      <div className="w-[80%] h-[80%] ">
        <Signup />
      </div>
    </div>
  );
}

export default App;
