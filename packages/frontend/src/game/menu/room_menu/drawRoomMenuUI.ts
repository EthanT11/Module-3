import { Scene } from "@babylonjs/core";
import { AdvancedDynamicTexture, StackPanel, ScrollViewer, ScrollBar } from "@babylonjs/gui";
import { RoomAvailable } from "colyseus.js";
import { drawTitle, drawInput, drawDivider, drawMenuContainer, drawButton, drawHeader, drawStack, drawInfoMessage } from "../utility";
import { createRoomCard } from "../utility/createRoomCard";
interface RoomMenuUIProps {
  scene: Scene;
  getAvailableRooms: () => Promise<RoomAvailable[]>;
  handleJoinMatch: (roomId: string) => void;
  handleGoBack: () => void;
}

export const createRoomMenuUI = ({ scene, getAvailableRooms, handleJoinMatch, handleGoBack }: RoomMenuUIProps) => {
  const roomMenuUI = AdvancedDynamicTexture.CreateFullscreenUI("UI", true, scene);
  drawTitle(roomMenuUI);

  const dispose = () => {
    clearInterval(interval);
    roomMenuUI.dispose();
  }

  // Update available rooms
  const updateRooms = async () => {
    try {
      const availableRooms = await getAvailableRooms();
      roomsPanel.clearControls();
      
      if (availableRooms.length === 0) {
        // TODO: Fix placement to match Enter Room Info Message placement | Due to different stack panels
        const noRoomText = drawInfoMessage("No rooms available");
        roomsPanel.addControl(noRoomText);
      } else {
        availableRooms.forEach((room: RoomAvailable) => {
          roomsPanel.addControl(createRoomCard(room, handleJoinMatch));
        });
      }
    } catch (error) {
      console.error("Error fetching rooms:", error);
    }
  };

  // Horizontal StackPanel for code and room containers
  const mainPanel = new StackPanel();
  mainPanel.isVertical = false; // Make the stack panel horizontal
  mainPanel.spacing = 10; // Add some space between containers;
  roomMenuUI.addControl(mainPanel);

  // Code Container ---------------------
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

  const joinByCodeButton = drawButton("joinByCodeButton", "Join Game", "primary");
  buttonStack.addControl(joinByCodeButton);

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

  // TODO: Add ScrollBar to ScrollViewer. Seems a bit weird to set up so will leave this for after
  const scrollViewer = new ScrollViewer("", true);
  scrollViewer.width = "300px";
  scrollViewer.height = "450px";
  scrollViewer.thickness = 0;
  roomStack.addControl(scrollViewer);


  const roomsPanel = new StackPanel();
  roomsPanel.isVertical = true;
  roomsPanel.width = "300px";
  roomsPanel.height = "400px";
  scrollViewer.addControl(roomsPanel);


  // Initial rooms fetch
  updateRooms();

  // Update rooms every 5 seconds
  const interval = setInterval(updateRooms, 5000);

  // Update the join button click handler
  joinByCodeButton.onPointerClickObservable.add(async () => {
    const roomCode = codeInput.text.trim();
    if (roomCode) {
      handleJoinMatch(roomCode);  
    } else {
      checkText.text = "Please enter a room code";
    }
  });

  goBackButton.onPointerClickObservable.add(() => {
    handleGoBack();
  });

  // Return both the texture and a dispose function
  return {
    roomMenuUI,
    dispose
  };
};