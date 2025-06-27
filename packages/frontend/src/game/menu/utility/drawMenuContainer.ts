import { Control, Rectangle } from "@babylonjs/gui";
import { startScreenConfig, startScreenUIDimensions } from "../start_menu/startScreenConfig";

export const drawMenuContainer = () => {
    const menuContainer = new Rectangle();
    menuContainer.width = startScreenUIDimensions.MENU_CONTAINER.WIDTH;
    menuContainer.height = startScreenUIDimensions.MENU_CONTAINER.HEIGHT;
    menuContainer.thickness = startScreenConfig.UI_CONFIG.MENU_CONTAINER.BORDER_THICKNESS;
    menuContainer.cornerRadius = startScreenConfig.UI_CONFIG.MENU_CONTAINER.CORNER_RADIUS;
    menuContainer.background = startScreenConfig.UI_CONFIG.MENU_CONTAINER.BACKGROUND;
    menuContainer.color = startScreenConfig.UI_CONFIG.MENU_CONTAINER.COLOR;
    
    menuContainer.shadowColor = startScreenConfig.UI_CONFIG.MENU_CONTAINER.SHADOW_COLOR;
    menuContainer.shadowBlur = startScreenConfig.UI_CONFIG.MENU_CONTAINER.SHADOW_BLUR;
    menuContainer.shadowOffsetX = startScreenConfig.UI_CONFIG.MENU_CONTAINER.SHADOW_OFFSET_X;
    menuContainer.shadowOffsetY = startScreenConfig.UI_CONFIG.MENU_CONTAINER.SHADOW_OFFSET_Y;
    menuContainer.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER; 
    menuContainer.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
    menuContainer.top = startScreenConfig.UI_CONFIG.MENU_CONTAINER.TOP;
    return menuContainer;
}
