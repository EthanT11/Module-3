import "./App.css";
import CreateEnvironment from "./components/CreateEnvironment";

const StartScreen = () => (
  <div className="flex flex-col items-center justify-center h-screen">
    <h1 className="text-4xl font-bold text-center text-black">Start Screen</h1>
  </div>
);

export default () => (
  <div>
    <StartScreen />
    {/* <CreateEnvironment /> */}
  </div>
);