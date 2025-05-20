import { Vector3 } from "@babylonjs/core";

export const pxToNum = (px: string): number => {
    return parseInt(px.replace("px", ""));
}

export const startScreenConstants = {
    ALPHA: 0.2,
    CORNER_RADIUS: 10,
    SHADOW_BLUR: 10,
    SHADOW_OFFSET_X: 2,
    SHADOW_OFFSET_Y: 2,
    
    COLOR: {
        TEXT: "yellow",
        BORDER: "orange",
        SHADOW: "orange",
        BUTTON_BACKGROUND: "rgba(0, 0, 0, 0.2)",
        INPUT_BACKGROUND: "rgba(0, 0, 0, 0.2)",
        MENU_CONTAINER_BACKGROUND: "rgba(0, 0, 0, 0.2)",
    },
    FONT_SIZE: {
        TITLE: 82,
        LARGE: 32,
        MEDIUM: 20,
        SMALL: 15,
    },
    TEXT: {
        TITLE: "PUNCH MAZE",
        INPUT_HEADER: "Contestant Name",
        INPUT_PLACEHOLDER: "Choose your name",
        CHECK_TEXT: "Name must be at least 3 characters long and less than 10 characters",
        SELF_PLUG: "Made with ❤️ by Ethan Tracey \n GetBuilding 2025",
    }
}

export const startScreenUIDimensions = {
    PADDING: "20px",
    SPACING: 15,
    ELEMENT_WIDTH: "200px",
    ELEMENT_HEIGHT: "40px",

    MENU_CONTAINER: {
      HEIGHT: "450px",
      WIDTH: "300px",
      TOP: "60px",
    },
    TOP_STACK: {
      HEIGHT: "400px",
      WIDTH: "300px",
    },
    BOTTOM_STACK: {
      WIDTH: "300px",
      HEIGHT: "200px",
      TOP: "140px",
    }
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
        TITLE: {
            WIDTH: "800px", // TODO: Make this dynamic
            HEIGHT: "100px",
            TOP: "30px",
            COLOR: startScreenConstants.COLOR.TEXT,
            FONT_SIZE: startScreenConstants.FONT_SIZE.TITLE,
            TEXT: startScreenConstants.TEXT.TITLE,
            SHADOW_BLUR: startScreenConstants.SHADOW_BLUR,
            SHADOW_COLOR: startScreenConstants.COLOR.SHADOW,
            SHADOW_OFFSET_X: startScreenConstants.SHADOW_OFFSET_X,
            SHADOW_OFFSET_Y: startScreenConstants.SHADOW_OFFSET_Y,
        },

        INPUT_HEADER: { 
            COLOR: startScreenConstants.COLOR.TEXT,
            FONT_SIZE: startScreenConstants.FONT_SIZE.LARGE,
            TEXT: startScreenConstants.TEXT.INPUT_HEADER,
            SHADOW_COLOR: startScreenConstants.COLOR.SHADOW,
            SHADOW_BLUR: startScreenConstants.SHADOW_BLUR,
            SHADOW_OFFSET_X: startScreenConstants.SHADOW_OFFSET_X,
            SHADOW_OFFSET_Y: startScreenConstants.SHADOW_OFFSET_Y,
        },

        INPUT: {
            BACKGROUND: startScreenConstants.COLOR.INPUT_BACKGROUND,
            FOCUSED_BACKGROUND: startScreenConstants.COLOR.INPUT_BACKGROUND,
            COLOR: startScreenConstants.COLOR.BORDER,
            FONT_SIZE: startScreenConstants.FONT_SIZE.MEDIUM,
            PLACEHOLDER_TEXT: startScreenConstants.TEXT.INPUT_PLACEHOLDER,
            PLACEHOLDER_COLOR: startScreenConstants.COLOR.TEXT,
            HIGHLIGHT_COLOR: startScreenConstants.COLOR.BORDER,
            TEXT_HIGHLIGHT_COLOR: startScreenConstants.COLOR.TEXT,
            SHADOW_COLOR: startScreenConstants.COLOR.SHADOW,
            SHADOW_BLUR: startScreenConstants.SHADOW_BLUR,
            SHADOW_OFFSET_X: startScreenConstants.SHADOW_OFFSET_X,
            SHADOW_OFFSET_Y: startScreenConstants.SHADOW_OFFSET_Y,
        },

        CHECK_TEXT: {
            ALPHA: startScreenConstants.ALPHA,
            COLOR: startScreenConstants.COLOR.TEXT,
            FONT_SIZE: startScreenConstants.FONT_SIZE.SMALL,
            TEXT: startScreenConstants.TEXT.CHECK_TEXT,
        },

        DIVIDER: {
            COLOR: startScreenConstants.COLOR.BORDER,
            CORNER_RADIUS: startScreenConstants.CORNER_RADIUS,
        },

        // Bottom StackPanel
        MENU_CONTAINER: {
            BACKGROUND: startScreenConstants.COLOR.MENU_CONTAINER_BACKGROUND,
            BORDER_THICKNESS: 4,
            COLOR: startScreenConstants.COLOR.BORDER,
            CORNER_RADIUS: startScreenConstants.CORNER_RADIUS,
            HEIGHT: startScreenUIDimensions.MENU_CONTAINER.HEIGHT,
            SHADOW_BLUR: startScreenConstants.SHADOW_BLUR,
            SHADOW_COLOR: startScreenConstants.COLOR.SHADOW,
            SHADOW_OFFSET_X: startScreenConstants.SHADOW_OFFSET_X,
            SHADOW_OFFSET_Y: startScreenConstants.SHADOW_OFFSET_Y,
            TOP: startScreenUIDimensions.MENU_CONTAINER.TOP,
            WIDTH: startScreenUIDimensions.MENU_CONTAINER.WIDTH,
        },
        BUTTON: {
            HEIGHT: "50px",
            COLOR: startScreenConstants.COLOR.BORDER,  
            TEXT_COLOR: startScreenConstants.COLOR.TEXT,
            BACKGROUND: startScreenConstants.COLOR.BUTTON_BACKGROUND,
            CORNER_RADIUS: startScreenConstants.CORNER_RADIUS,
        },

        SELF_PLUG: {
            TEXT: startScreenConstants.TEXT.SELF_PLUG,
            FONT_SIZE: startScreenConstants.FONT_SIZE.SMALL,
            COLOR: startScreenConstants.COLOR.TEXT,
            ALPHA: startScreenConstants.ALPHA,
        },
    }
}