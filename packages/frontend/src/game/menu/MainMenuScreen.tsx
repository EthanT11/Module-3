import { useEffect, useRef, useState } from "react";
import { Engine, Scene, ArcRotateCamera } from "@babylonjs/core";
import { AdvancedDynamicTexture } from "@babylonjs/gui";
import { createMenuEnvironment } from "./utility/createMenuEnvironment";
import { createRoomMenuUI } from "./room_menu/drawRoomMenuUI";
import { drawStartMenuUI } from "./start_menu/drawStartMenuUI";
import { useNavigate } from "react-router";
import { useRoomContext } from "../../context/RoomContext";

interface MenuEnvironment {
  engine: Engine;
  scene: Scene;
  camera: ArcRotateCamera;
}

interface GUIManager {
  texture: AdvancedDynamicTexture | null;
  dispose: (() => void) | null;
}

type DisposableType = 'ui' | 'env' | 'all';
type MenuType = "start" | "room";
// Probably a lot more efficient to just use a single function
// but I wanted to try out the switch statement
// and it might be nice to have a disposal manager later
const disposeType = (type: DisposableType, guiManager?: GUIManager, menuEnvironment?: MenuEnvironment | null) => {
  const disposeUI = () => {
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
    case 'ui':
      disposeUI();
      break;
    
    case 'env':
      disposeEnv();
      break;
    
    case 'all':
      disposeUI();
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
  const [showMenu, setShowMenu] = useState<MenuType>("start");
  // Context & Router
  const { createRoom, getAvailableRooms, joinRoom } = useRoomContext();
  const navigate = useNavigate();

  const handleCreateMatch = async () => {
    try {
      const newRoom = await createRoom();
      if (newRoom) {
        navigate(`/lobby/${newRoom.roomId}`);
      }
    } catch (error) {
      console.error("Error creating match:", error);
    }
  };

  const handleJoinMatch = async (roomId: string) => {
    try {
      const joinedRoom = await joinRoom(roomId);
      if (joinedRoom) {
        navigate(`/lobby/${joinedRoom.roomId}`);
      }
    } catch (error) {
      console.error("Error joining match:", error);
    }
  };

  const handleGoBack = () => {
    setShowMenu("start");
  };

  
  const setUI = async (scene: Scene, showMenu: MenuType) => {
    const setGuiRef = (texture: AdvancedDynamicTexture, dispose: () => void) => {
      guiManagerRef.current.texture = texture;
      guiManagerRef.current.dispose = dispose;
    };
    // Dispose the current gui
    disposeType('ui', guiManagerRef.current, menuEnvironmentRef.current);

    if (showMenu === "room") {
      const { roomMenuUI, dispose } = createRoomMenuUI({ scene, getAvailableRooms, handleJoinMatch, handleGoBack });
      setGuiRef(roomMenuUI, dispose);
    } else if (showMenu === "start")  {
      const { startMenuUI, dispose } = await drawStartMenuUI(scene, { 
        onJoinMatch: () => setShowMenu("room"),
        onCreateMatch: handleCreateMatch
      });
      setGuiRef(startMenuUI, dispose);
    } else {
      throw new Error(`Invalid menu type: ${showMenu}`);
    }
  };

  useEffect(() => {
    const initializeMenuEnvironment = async () => {
      if (canvasRef.current && !menuEnvironmentRef.current) {
        // Initialize the engine, scene and camera & set them to the ref
        const { engine, scene, camera } = await createMenuEnvironment(canvasRef.current);
        menuEnvironmentRef.current = { engine, scene, camera };
        await setUI(scene, "start");
      }
    };

    initializeMenuEnvironment();

    // Cleanup when component unmounts
    return () => {
      disposeType('all', guiManagerRef.current);
    };
  }, []); // Only run once

  useEffect(() => {
    // Set the UI based on the current menu
    if (menuEnvironmentRef.current) {
      setUI(menuEnvironmentRef.current.scene, showMenu);
    }
  }, [showMenu]);

  return (
    <div className="h-screen w-screen">
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
};

export default MainMenuScreen; 