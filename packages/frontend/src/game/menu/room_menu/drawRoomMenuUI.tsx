import { Scene } from "@babylonjs/core";
import { AdvancedDynamicTexture, StackPanel, TextBlock } from "@babylonjs/gui";

export const createRoomMenuUI = (scene: Scene) => {
  const roomMenuUI = AdvancedDynamicTexture.CreateFullscreenUI("UI", true, scene);

  const mainPanel = new StackPanel();
  mainPanel.width = "100%";
  mainPanel.height = "100%";
  roomMenuUI.addControl(mainPanel);

  const title = new TextBlock();
  title.text = "Available Rooms";
  title.height = "50px";
  title.color = "white";
  title.fontSize = 24;
  mainPanel.addControl(title);

  // Return both the texture and a dispose function
  return {
    roomMenuUI,
    dispose: () => {
      roomMenuUI.dispose();
    }
  };
}; 