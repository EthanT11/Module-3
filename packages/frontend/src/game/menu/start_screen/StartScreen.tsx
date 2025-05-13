import { useEffect, useRef, useState } from "react";
import { createBabylonStartScreen } from "./createStartScreen";
import RoomScreen from "../../../components/pages/RoomScreen";

const BabylonStartScreen = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [showRooms, setShowRooms] = useState(false);

  // This creates a ref to store babylon engine's dispose method
  // When the component unmounts
  const engineRef = useRef<{ dispose: () => void } | null>(null); 

  useEffect(() => {
    if (!showRooms && canvasRef.current) {
      // Get the dispose method from the babylon start screen and pass in the canvas and onStart function
      const { dispose } = createBabylonStartScreen(canvasRef.current, {
        onStart: () => setShowRooms(true)
      });
      // Store the dispose method in the ref
      engineRef.current = { dispose };

      // Cleanup when component unmounts
      return () => {
        if (engineRef.current) {
          engineRef.current.dispose();
        }
      };
    }
  }, [showRooms]);

  // If a room exists, show the room screen
  // TODO: Create LobbyScreen and replace roomscreen
  if (showRooms) {
    return <RoomScreen />;
  }

  return (
    <div className="h-screen w-screen">
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
};

export default BabylonStartScreen; 