import { Vector3 } from "@babylonjs/core";

export const startScreenFontSizes = {
    LARGE: 82,
    MEDIUM: 20,
    SMALL: 15,
}

export const startScreenColors = {
    TEXT: "white",
    HIGHLIGHT: "yellow",
    BUTTON_BACKGROUND: "green",
}

export const startScreenConfig = {
    // Arc Camera
    // alpha - rotation angle
    // beta - vertical angle
    // radius - distance from target
    // target - point to rotate around
    // lowerRadiusLimit - minimum radius
    // upperRadiusLimit - maximum radius
    // wheelDeltaPercentage - scroll speed
    CAMERA: {
        ALPHA: 0,
        BETA: Math.PI / 3,
        RADIUS: 45,
        TARGET: new Vector3(0, 5, 0),
        LOWER_RADIUS_LIMIT: 30,
        UPPER_RADIUS_LIMIT: 60,
        WHEEL_DELTA_PERCENTAGE: 0.01,
        FOV: 0.3, // 0.8 is good for a far view | 0.3 is good for a close view
        CAMERA_SPEED: 0.001,
    },
    UI_CONFIG: {
        // Top StackPanel
        // Title
        TITLE_TEXT: "PUNCH MAZE",
        TITLE_FONT_SIZE: startScreenFontSizes.LARGE,
        TITLE_COLOR: startScreenColors.TEXT,
        TITLE_SHADOW_COLOR: startScreenColors.HIGHLIGHT,
        TITLE_SHADOW_OFFSET_X: 2,
        TITLE_SHADOW_OFFSET_Y: 2,
        TITLE_SHADOW_BLUR: 10,

        // Input Header
        INPUT_HEADER_TEXT: "Contestant Name",
        INPUT_HEADER_FONT_SIZE: startScreenFontSizes.MEDIUM,
        INPUT_HEADER_COLOR: startScreenColors.TEXT,

        // Input
        INPUT_COLOR: startScreenColors.TEXT,
        INPUT_FONT_SIZE: startScreenFontSizes.MEDIUM,

        // Name Check Text
        CHECK_TEXT: "Name must be at least 3 characters long and less than 10 characters",
        CHECK_TEXT_COLOR: startScreenColors.TEXT,
        CHECK_TEXT_FONT_SIZE: startScreenFontSizes.SMALL,
        CHECK_TEXT_ALPHA: 0.2,

        // Divider
        DIVIDER_WIDTH: 0.2, // Ask joel his opinion on divider width
        DIVIDER_COLOR: startScreenColors.TEXT,
        DIVIDER_CORNER_RADIUS: 10,

        // Bottom StackPanel
        // Buttons
        BUTTON_HEIGHT: "50px",
        BUTTON_COLOR: startScreenColors.TEXT,  
        BUTTON_BACKGROUND: startScreenColors.BUTTON_BACKGROUND,
        BUTTON_CORNER_RADIUS: 10,

        // SelfPlug
        SELF_PLUG_TEXT: "Made with ❤️ by Ethan Tracey \n GetBuilding 2025",
        SELF_PLUG_FONT_SIZE: startScreenFontSizes.SMALL,
        SELF_PLUG_COLOR: startScreenColors.TEXT,
        SELF_PLUG_ALPHA: 0.2,
    }
}