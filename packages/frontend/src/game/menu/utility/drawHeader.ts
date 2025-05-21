import { TextBlock } from "@babylonjs/gui";
import { startScreenConfig } from "../start_menu/startScreenConfig";
import { startScreenUIDimensions } from "../start_menu/startScreenConfig";

export const drawHeader = (text: string) => {
  const header = new TextBlock();
  header.text = text;
  header.fontSize = startScreenConfig.UI_CONFIG.INPUT_HEADER.FONT_SIZE
  header.color = startScreenConfig.UI_CONFIG.INPUT_HEADER.COLOR;
  header.shadowColor = startScreenConfig.UI_CONFIG.INPUT_HEADER.SHADOW_COLOR;
  header.shadowBlur = startScreenConfig.UI_CONFIG.INPUT_HEADER.SHADOW_BLUR;
  header.shadowOffsetX = startScreenConfig.UI_CONFIG.INPUT_HEADER.SHADOW_OFFSET_X;
  header.shadowOffsetY = startScreenConfig.UI_CONFIG.INPUT_HEADER.SHADOW_OFFSET_Y;
  header.height = startScreenUIDimensions.ELEMENT_HEIGHT;
  header.textHorizontalAlignment = TextBlock.HORIZONTAL_ALIGNMENT_CENTER;       
  return header;
}