import { Button, Image, Rectangle, StackPanel, TextBlock } from "@babylonjs/gui";
import { RoomAvailable } from "colyseus.js";
import { startScreenConstants } from "../start_menu/startScreenConfig";

export const createRoomCard = (room: RoomAvailable, handleJoinMatch: (roomId: string) => void) => {
    const roomCardContainer = new Rectangle();
    roomCardContainer.width = "290px";
    roomCardContainer.height = "80px";
    roomCardContainer.thickness = 0.3;
    roomCardContainer.cornerRadius = 10;
    roomCardContainer.background = "rgba(0, 0, 0, 0.1)";
    roomCardContainer.color = startScreenConstants.COLOR.BORDER;
    
    roomCardContainer.paddingTop = "10px";
    roomCardContainer.paddingBottom = "10px";
    roomCardContainer.paddingLeft = "20px";
    roomCardContainer.paddingRight = "20px";

    // Horizontal StackPanel for room info and join button
    const roomInfoContainer = new StackPanel();
    roomInfoContainer.isVertical = false;
    roomInfoContainer.width = "300px";
    roomInfoContainer.height = "400px";
    roomInfoContainer.spacing = 10;
    roomCardContainer.addControl(roomInfoContainer);

    const roomInfo = new TextBlock();
    roomInfo.text = `Room ID: ${room.roomId}\nPlayers: ${room.clients}/${room.maxClients}`;
    roomInfo.color = startScreenConstants.COLOR.TEXT;
    roomInfo.fontSize = startScreenConstants.FONT_SIZE.SMALL;
    roomInfo.width = "210px";
    roomInfo.height = "40px";
    // roomInfo.textHorizontalAlignment = 0;
    roomInfoContainer.addControl(roomInfo);

    // TODO: Add failsafe if no image is found

    const imgPath = "icons/fist.png";
    const joinButton = Button.CreateImageOnlyButton("joinButton", imgPath);
    joinButton.width = "40px";
    joinButton.height = "40px";
    joinButton.cornerRadius = 25;
    joinButton.thickness = 0;
    joinButton.background = "rgba(221, 221, 221, 0.1)";
    if (joinButton.image) {
      joinButton.image.stretch = Image.STRETCH_UNIFORM;
      // joinButton.image.width = "20px";
      // joinButton.image.height = "20px";
    }
    joinButton.onPointerEnterObservable.add(() => {
      // rgba(206, 19, 19, 0.8)
      if (joinButton.image) {
        joinButton.background = "rgba(241, 209, 27, 0.8)";
        joinButton.shadowColor = "rgba(241, 209, 27, 0.8)";
        joinButton.shadowBlur = 5;
        joinButton.thickness = 0.8;
        roomCardContainer.thickness = 1;
      }
    });
    joinButton.onPointerOutObservable.add(() => {
      if (joinButton.image) {
        joinButton.background = "rgba(221, 221, 221, 0.1)";
        joinButton.shadowBlur = 0;
        roomCardContainer.background = "rgba(0, 0, 0, 0.1)";
        joinButton.thickness = 0;
        roomCardContainer.thickness = 0.3;
      }
    });

    roomInfoContainer.addControl(joinButton);

    joinButton.onPointerClickObservable.add(async () => {
      handleJoinMatch(room.roomId);
    });

    return roomCardContainer;
  };