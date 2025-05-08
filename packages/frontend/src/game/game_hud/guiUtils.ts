import { TextBlock, Control, Rectangle, StackPanel } from "@babylonjs/gui";

// Core design constants
const STANDARD_ELEMENT_HEIGHT = "50px";
const STANDARD_ELEMENT_WIDTH = "200px";
const STANDARD_PADDING = "20px";
const STANDARD_RADIUS = 8;
const STANDARD_BORDER_THICKNESS = 2;

const MAX_VISIBLE_PLAYERS = 4; // Maximum visible players (including title)

export const GUI_FONT_SIZES = {
    title: 50,      // For timer and important titles
    subtitle: 24,   // For section headers (HP, Players)
    regular: 20,    // For standard text
    small: 18,      // For list items and minor text
};

export const GUI_COLORS = {
    // Primary colors
    background: "rgba(0, 0, 0, 0.3)",
    text: "white",
    highlight: "gold",
    accent: "#ff3333",
    
    // Element-specific colors
    timerColor: "white",
    hpBar: "#cc0000",
    hpBarBackground: "rgba(0, 0, 0, 0.5)",
    playerListBackground: "rgba(0, 0, 0, 0.5)",
    playerEntryBackground: "rgba(255, 255, 255, 0.1)",
};

export const GUI_DIMENSIONS = {
    // Standard values
    elementHeight: STANDARD_ELEMENT_HEIGHT,
    padding: STANDARD_PADDING,
    borderRadius: STANDARD_RADIUS,
    borderThickness: STANDARD_BORDER_THICKNESS,
    
    // Element-specific dimensions
    timerWidth: STANDARD_ELEMENT_WIDTH,
    timerHeight: STANDARD_ELEMENT_HEIGHT,
    
    // HP Bar
    hpBarContainerWidth: STANDARD_ELEMENT_WIDTH,
    hpBarWidth: "150px",
    hpBarHeight: STANDARD_ELEMENT_HEIGHT,
    hpLabelWidth: "50px",
    hpLabelHeight: STANDARD_ELEMENT_HEIGHT,
    
    // Player list
    playerListWidth: "220px", // Slightly wider
    playerListTitleHeight: "40px",
    playerEntryHeight: "35px", // Slightly taller for better readability
    playerEntryPadding: "5px",
    playerListPadding: "10px",
    maxVisiblePlayers: MAX_VISIBLE_PLAYERS,
    
    // Congratulations message
    congratsHeight: "120px", 
    congratsWidth: "500px",
};

// TextBlock
export interface TextBlockOptions {
    name?: string;
    width?: string | number;
    height?: string | number;
    color?: string;
    fontSize?: string | number;
    text?: string;
    horizontalAlignment?: number;
    verticalAlignment?: number;
    fontWeight?: string;
    textHorizontalAlignment?: number;
    textVerticalAlignment?: number;
}

export function createTextBlock(options: TextBlockOptions): TextBlock {
    // We set the default values to the standard values and override if needed
    const { 
        name = "",
        width = "100px",
        height = GUI_DIMENSIONS.elementHeight,
        color = GUI_COLORS.text,
        fontSize = GUI_FONT_SIZES.regular,
        text = "",
        horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT,
        verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP,
        fontWeight = "normal",
        textHorizontalAlignment,
        textVerticalAlignment
    } = options;

    const textBlock = new TextBlock(name);
    textBlock.width = width;
    textBlock.height = height;
    textBlock.color = color;
    textBlock.fontSize = fontSize;
    textBlock.text = text;
    textBlock.horizontalAlignment = horizontalAlignment;
    textBlock.verticalAlignment = verticalAlignment;
    textBlock.fontWeight = fontWeight;
    
    if (textHorizontalAlignment !== undefined) {
        textBlock.textHorizontalAlignment = textHorizontalAlignment;
    }
    
    if (textVerticalAlignment !== undefined) {
        textBlock.textVerticalAlignment = textVerticalAlignment;
    }
    
    return textBlock;
}

// Rectangle
export interface RectangleOptions {
    name?: string;
    width?: string | number;
    height?: string | number;
    color?: string;
    thickness?: number;
    background?: string;
    horizontalAlignment?: number;
    verticalAlignment?: number;
    cornerRadius?: number;
    top?: string | number;
    left?: string | number;
    right?: string | number;
    bottom?: string | number;
    alpha?: number;
}

export function createRectangle(options: RectangleOptions): Rectangle {
    const {
        name = "",
        width = "100px",
        height = GUI_DIMENSIONS.elementHeight,
        color = GUI_COLORS.text,
        thickness = GUI_DIMENSIONS.borderThickness,
        background = undefined,
        horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT,
        verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP,
        cornerRadius = GUI_DIMENSIONS.borderRadius,
        top = undefined,
        left = undefined,
        alpha = 1
    } = options;
    
    const rect = new Rectangle(name);
    rect.width = width;
    rect.height = height;
    rect.color = color;
    rect.thickness = thickness;
    if (background) rect.background = background; // check if background is defined || one liners are very cool
    rect.horizontalAlignment = horizontalAlignment;
    rect.verticalAlignment = verticalAlignment;
    rect.cornerRadius = cornerRadius;
    
    // Check if top and left are defined || babylon js only use top and left
    if (top !== undefined) rect.top = top;
    if (left !== undefined) rect.left = left;
    
    rect.alpha = alpha;
    
    return rect;
}

// Helper to create a container with background
export function createContainer(options: RectangleOptions): Rectangle {
    const defaults = {
        background: GUI_COLORS.background,
        thickness: 1,
        cornerRadius: GUI_DIMENSIONS.borderRadius
    };
    
    return createRectangle({...defaults, ...options});
}

// Helper to create a panel with elements already spaced
export function createPanel(name: string, isVertical: boolean = true): StackPanel {
    const panel = new StackPanel(name);
    panel.isVertical = isVertical;
    return panel;
}

// Helper to create a player entry with standard styling
export function createPlayerEntry(playerId: string, displayText: string): TextBlock {
    const playerText = createTextBlock({
        name: `player_${playerId}`,
        text: displayText,
        color: GUI_COLORS.text,
        fontSize: GUI_FONT_SIZES.regular,
        height: GUI_DIMENSIONS.playerEntryHeight,
        width: "100%",
        textHorizontalAlignment: Control.HORIZONTAL_ALIGNMENT_LEFT,
        textVerticalAlignment: Control.VERTICAL_ALIGNMENT_CENTER
    });
    
    // Add a small left padding for better readability
    playerText.paddingLeft = "5px";
    
    return playerText;
}
