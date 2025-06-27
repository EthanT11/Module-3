import { Rectangle } from "@babylonjs/gui";
import { startScreenConfig, startScreenUIDimensions } from "../start_menu/startScreenConfig";

export const drawDivider = (top: string) => {
  const divider = new Rectangle();
  divider.width = startScreenUIDimensions.ELEMENT_WIDTH;
  divider.height = "2px";
  divider.top = top;
  divider.color = startScreenConfig.UI_CONFIG.MENU_CONTAINER.COLOR;
  divider.cornerRadius = startScreenConfig.UI_CONFIG.MENU_CONTAINER.CORNER_RADIUS;
  divider.shadowColor = startScreenConfig.UI_CONFIG.MENU_CONTAINER.SHADOW_COLOR;
  divider.shadowBlur = startScreenConfig.UI_CONFIG.MENU_CONTAINER.SHADOW_BLUR;
  divider.shadowOffsetX = startScreenConfig.UI_CONFIG.MENU_CONTAINER.SHADOW_OFFSET_X;
  divider.shadowOffsetY = startScreenConfig.UI_CONFIG.MENU_CONTAINER.SHADOW_OFFSET_Y;
  return divider;
}