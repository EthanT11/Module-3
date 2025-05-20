import { Scene } from "@babylonjs/core";
import { AdvancedDynamicTexture, StackPanel, TextBlock, Button, Rectangle, Control } from "@babylonjs/gui";
import { Client, RoomAvailable } from "colyseus.js";
import { BACKEND_URL } from "../../../networking/setupMultiplayer";
import { startScreenConstants, startScreenConfig } from "../start_menu/startScreenConfig";
import { drawTitle } from "../utility/drawTitle";

export const createRoomMenuUI = (scene: Scene) => {
  const colyseusClient = new Client(BACKEND_URL);
  const roomMenuUI = AdvancedDynamicTexture.CreateFullscreenUI("UI", true, scene);
  drawTitle(roomMenuUI);

  const dispose = () => {
    clearInterval(interval);
    roomMenuUI.dispose();
  }

  // const mainPanel = new StackPanel();
  // mainPanel.width = "100%";
  // mainPanel.height = "100%";
  // roomMenuUI.addControl(mainPanel);

  // Menu Container
  const menuContainer = new Rectangle();
  menuContainer.width = "300px";
  menuContainer.height = "450px";
  menuContainer.background = startScreenConfig.UI_CONFIG.MENU_CONTAINER.BACKGROUND;
  menuContainer.cornerRadius = startScreenConfig.UI_CONFIG.MENU_CONTAINER.CORNER_RADIUS;
  menuContainer.thickness = startScreenConfig.UI_CONFIG.MENU_CONTAINER.BORDER_THICKNESS;
  menuContainer.color = startScreenConfig.UI_CONFIG.MENU_CONTAINER.COLOR;
  menuContainer.shadowColor = startScreenConfig.UI_CONFIG.MENU_CONTAINER.SHADOW_COLOR;
  menuContainer.shadowBlur = startScreenConfig.UI_CONFIG.MENU_CONTAINER.SHADOW_BLUR;
  menuContainer.shadowOffsetX = startScreenConfig.UI_CONFIG.MENU_CONTAINER.SHADOW_OFFSET_X;
  menuContainer.shadowOffsetY = startScreenConfig.UI_CONFIG.MENU_CONTAINER.SHADOW_OFFSET_Y;
  menuContainer.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER; 
  menuContainer.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
  // menuContainer.top = "5%";
  roomMenuUI.addControl(menuContainer);

  const roomsPanel = new StackPanel();
  // roomsPanel.width = "80%";
  // roomsPanel.height = "80%";
  roomsPanel.horizontalAlignment = 0; // Center horizontally
  menuContainer.addControl(roomsPanel);

  // Function to create a room button
  const createRoomButton = (room: RoomAvailable) => {
    const roomContainer = new Rectangle();
    // roomContainer.width = "100%";
    // roomContainer.height = "80px";
    roomContainer.thickness = 1;
    roomContainer.cornerRadius = 5;
    roomContainer.background = "#333333";
    roomContainer.paddingTop = "10px";
    roomContainer.paddingBottom = "10px";
    roomContainer.paddingLeft = "20px";
    roomContainer.paddingRight = "20px";

    const roomInfo = new TextBlock();
    roomInfo.text = `Room ID: ${room.roomId}\nPlayers: ${room.clients}/${room.maxClients}`;
    roomInfo.color = "white";
    roomInfo.fontSize = 18;
    roomInfo.textHorizontalAlignment = 0; // Left align
    roomContainer.addControl(roomInfo);

    const joinButton = Button.CreateSimpleButton("joinButton", "Join Game");
    joinButton.width = "120px";
    joinButton.height = "40px";
    joinButton.color = "white";
    joinButton.background = "#4CAF50";
    joinButton.cornerRadius = 5;
    joinButton.horizontalAlignment = 2; // Right align
    joinButton.verticalAlignment = 0; // Center vertically
    roomContainer.addControl(joinButton);

    joinButton.onPointerClickObservable.add(async () => {
      try {
        const joinedRoom = await colyseusClient.joinById(room.roomId);
        console.log("Joined room:", joinedRoom.roomId);
        // You'll need to handle the room joining logic here
      } catch (error) {
        console.error("Error joining room:", error);
      }
    });

    return roomContainer;
  };

  // Function to update rooms list
  const updateRooms = async () => {
    try {
      const availableRooms = await colyseusClient.getAvailableRooms();
      roomsPanel.clearControls();
      
      if (availableRooms.length === 0) {
        const noRoomsText = new TextBlock();
        noRoomsText.text = "No rooms available";
        noRoomsText.color = "white";
        noRoomsText.fontSize = 18;
        roomsPanel.addControl(noRoomsText);
      } else {
        availableRooms.forEach(room => {
          roomsPanel.addControl(createRoomButton(room));
        });
      }
    } catch (error) {
      console.error("Error fetching rooms:", error);
    }
  };

  // Initial rooms fetch
  updateRooms();

  // Update rooms every 5 seconds
  const interval = setInterval(updateRooms, 5000);

  // Return both the texture and a dispose function
  return {
    roomMenuUI,
    dispose
  };
}; 