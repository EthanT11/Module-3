import { Button } from "@babylonjs/gui";
import { startScreenConfig } from "../start_menu/startScreenConfig";

export const drawButton = (name: string, text: string, type: "primary" | "secondary") => {
  const button = Button.CreateSimpleButton(name, text);
  button.width = "120px";
  button.height = "40px";
  button.background = startScreenConfig.UI_CONFIG.BUTTON.BACKGROUND;
  button.cornerRadius = startScreenConfig.UI_CONFIG.BUTTON.CORNER_RADIUS;
  if (type === "primary") {
    button.color = startScreenConfig.UI_CONFIG.BUTTON.TEXT_COLOR;
  } else {
    button.color = startScreenConfig.UI_CONFIG.BUTTON.COLOR;
  }
  return button;
}