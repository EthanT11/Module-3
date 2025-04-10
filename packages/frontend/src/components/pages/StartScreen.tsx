import { useState } from "react";
import RoomScreen from "./RoomScreen";

// START SCREEN
// TODO: Create separate component
// TODO: Check if there is a better way to show different screens/pages
// TODO: Cool art or maybe a spinning scene if possible and not too laggy
// TODO: Style

const StartScreen = () => {
    const [showRooms, setShowRooms] = useState(false);
  
    if (showRooms) {
      return <RoomScreen />
    }
  
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-teal-900">
        <h1 className="text-4xl font-bold text-center text-black">Start Screen</h1>
        <button 
          className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 mt-4"
          onClick={() => setShowRooms(true)}
        >
          Start
        </button>
      </div>
    )
  };

export default StartScreen;