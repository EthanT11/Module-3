import { useEffect, useRef, useState } from "react";
import { Engine, Scene, ArcRotateCamera } from "@babylonjs/core";
import { drawStartMenuUI } from "./start_menu/drawStartMenuUI";
import { createRoomScreenGUI } from "./room_menu/drawRoomMenu";
import { Room } from "colyseus.js";
import CreateGameEnvironment from "../CreateGameEnvironment";
import { AdvancedDynamicTexture } from "@babylonjs/gui";
import { createMenuEnvironment } from "./utility/createMenuEnvironment";

interface MenuEnvironment {
  engine: Engine;
  scene: Scene;
  camera: ArcRotateCamera;
}

interface GUIManager {
  texture: AdvancedDynamicTexture | null;
  dispose: (() => void) | null;
}

// Probably a lot more efficient to just use a single function
// but I wanted to try out the switch statement
// and it might be nice to have a disposal manager later
type DisposableType = 'gui' | 'env' | 'all';
const disposeType = (type: DisposableType, guiManager?: GUIManager, menuEnvironment?: MenuEnvironment | null) => {
  const disposeGUI = () => {
    if (guiManager?.texture) {
      guiManager.texture.dispose();
      guiManager.texture = null;
    }
    if (guiManager?.dispose) {
      guiManager.dispose();
      guiManager.dispose = null;
    }
  }
  const disposeEnv = () => {
    if (menuEnvironment) {
      menuEnvironment.engine.dispose();
    }
    menuEnvironment = null;
  }

  switch (type) {
    case 'gui':
      disposeGUI();
      break;
    
    case 'env':
      disposeEnv();
      break;
    
    case 'all':
      disposeGUI();
      disposeEnv();
      break;
    default:
      throw new Error(`Invalid dispose type: ${type} or missing parameters \n
        guiManager: ${guiManager} \n
        menuEnvironment: ${menuEnvironment}`);
  }
};

const MainMenuScreen = () => {
  // Refs
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const menuEnvironmentRef = useRef<MenuEnvironment | null>(null);
  const guiManagerRef = useRef<GUIManager>({ texture: null, dispose: null });
  // States
  const [showRooms, setShowRooms] = useState(false);

  useEffect(() => {
    const initializeMenuEnvironment = async () => {
      if (canvasRef.current && !menuEnvironmentRef.current) {
        // Initialize the engine, scene and camera & set them to the ref
        const { engine, scene, camera } = await createMenuEnvironment(canvasRef.current);
        menuEnvironmentRef.current = { engine, scene, camera };
        // Create the start screen GUI initially
        const { startMenuUI } = await drawStartMenuUI(scene, {
          onJoinMatch: () => setShowRooms(true),
          onCreateMatch: () => console.log("Creating match")
        });
        guiManagerRef.current.texture = startMenuUI;
      }
    };

    initializeMenuEnvironment();

    // Cleanup when component unmounts
    return () => {
      disposeType('all', guiManagerRef.current);
    };
  }, []); // Only run once

  useEffect(() => {
    const updateGUI = async () => {
      if (menuEnvironmentRef.current) {
        // Dispose the current gui
        disposeType('gui', guiManagerRef.current, menuEnvironmentRef.current);
        // Keep the scene from the menu environment ref
        const { scene } = menuEnvironmentRef.current;
        if (showRooms) {
          const { roomScreenUI, dispose } = createRoomScreenGUI(scene);
          guiManagerRef.current.texture = roomScreenUI;
          guiManagerRef.current.dispose = dispose;
        } else {
          const { startMenuUI, dispose } = await drawStartMenuUI(scene, {
            onJoinMatch: () => setShowRooms(true),
            onCreateMatch: () => console.log("Creating match")
          });
          guiManagerRef.current.texture = startMenuUI;
          guiManagerRef.current.dispose = dispose;
        }
      }
    };
    updateGUI();
  }, [showRooms]);

  // if (currentRoom) {
  //   return <CreateGameEnvironment room={currentRoom} isHost={false} />;
  // }

  return (
    <div className="h-screen w-screen">
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
};

export default MainMenuScreen; 