import { Scene } from "@babylonjs/core";
import { AdvancedDynamicTexture, StackPanel, TextBlock, Button, Rectangle, Image } from "@babylonjs/gui";
import { Client, RoomAvailable } from "colyseus.js";
import { BACKEND_URL } from "../../../networking/setupMultiplayer";
import { startScreenConstants, startScreenConfig, startScreenUIDimensions } from "../start_menu/startScreenConfig";
import { drawTitle, drawInput, drawDivider, drawMenuContainer, drawButton, drawHeader, drawStack, drawInfoMessage } from "../utility";

export const createRoomMenuUI = (scene: Scene) => {
  const colyseusClient = new Client(BACKEND_URL);
  const roomMenuUI = AdvancedDynamicTexture.CreateFullscreenUI("UI", true, scene);
  drawTitle(roomMenuUI);

  const dispose = () => {
    clearInterval(interval);
    roomMenuUI.dispose();
  }

  // Horizontal StackPanel for code and room containers
  const mainPanel = new StackPanel();
  mainPanel.isVertical = false; // Make the stack panel horizontal
  mainPanel.spacing = 10; // Add some space between containers;
  roomMenuUI.addControl(mainPanel);

  // Code Container
  const codeContainer = drawMenuContainer();
  mainPanel.addControl(codeContainer);

  const codeStack = drawStack("top");
  codeContainer.addControl(codeStack);

  const codeHeader = drawHeader("Enter Room Code");
  codeStack.addControl(codeHeader);

  const codeInput = drawInput("YZ2323");
  codeStack.addControl(codeInput);

  const checkText = drawInfoMessage("Please enter a valid room code");
  codeStack.addControl(checkText);

  const codeDivider = drawDivider("20px");
  codeContainer.addControl(codeDivider);

  const buttonStack = drawStack("bottom");
  codeContainer.addControl(buttonStack);

  const joinButton = drawButton("joinButton", "Join Game", "primary");
  buttonStack.addControl(joinButton);

  const goBackButton = drawButton("goBackButton", "Go Back", "secondary");
  buttonStack.addControl(goBackButton);

  // Room Container -------------------------
  const roomContainer = drawMenuContainer();
  mainPanel.addControl(roomContainer);

  const roomStack = drawStack("top");
  roomContainer.addControl(roomStack);

  const roomHeader = drawHeader("Available Rooms");
  roomStack.addControl(roomHeader);

  roomStack.addControl(drawDivider("40px"));

  const roomsPanel = new StackPanel();
  roomsPanel.isVertical = true;
  roomsPanel.width = "300px";
  roomsPanel.height = "450px";
  roomStack.addControl(roomsPanel);

  // Function to create a room button
  const createRoomContainer = (room: RoomAvailable) => {
    const roomContainer = new Rectangle();
    roomContainer.width = "100%";
    roomContainer.height = "80px";
    roomContainer.thickness = 1;
    roomContainer.cornerRadius = 5;
    roomContainer.background = "#333333";
    roomContainer.paddingTop = "10px";
    roomContainer.paddingBottom = "10px";
    roomContainer.paddingLeft = "20px";
    roomContainer.paddingRight = "20px";

    // Horizontal StackPanel for room info and join button
    const roomInfoContainer = new StackPanel();
    roomInfoContainer.isVertical = false;
    roomInfoContainer.width = "230px";
    roomInfoContainer.spacing = 10;
    roomContainer.addControl(roomInfoContainer);

    const roomInfo = new TextBlock();
    roomInfo.text = `Room ID: ${room.roomId}\nPlayers: ${room.clients}/${room.maxClients}`;
    roomInfo.color = "white";
    roomInfo.fontSize = startScreenConstants.FONT_SIZE.SMALL;
    roomInfo.textHorizontalAlignment = 0;
    roomInfoContainer.addControl(roomInfo);

    // TODO: Add failsafe if no image is found

    const buttonHolder = new StackPanel();
    buttonHolder.width = "390px";
    roomInfoContainer.addControl(buttonHolder);

    const imgPath = "icons/fist.png";
    const joinButton = Button.CreateImageOnlyButton("joinButton", imgPath);
    joinButton.width = "70px";
    joinButton.height = "40px";
    if (joinButton.image) {
      joinButton.image.stretch = Image.STRETCH_UNIFORM;
    }
    joinButton.onPointerEnterObservable.add(() => {
      if (joinButton.image) {
        joinButton.image.color = "white";
      }
    });
    joinButton.onPointerOutObservable.add(() => {
      if (joinButton.image) {
        joinButton.image.color = "black";
      }
    });
    buttonHolder.addControl(joinButton);

    // joinButton.onPointerClickObservable.add(async () => {
    //   try {
    //     const joinedRoom = await colyseusClient.joinById(room.roomId);
    //     console.log("Joined room:", joinedRoom.roomId);
    //   } catch (error) {
    //     console.error("Error joining room:", error);
    //   }
    // });

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
          roomsPanel.addControl(createRoomContainer(room));
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