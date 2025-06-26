import { Control, Rectangle, TextBlock, Button, StackPanel } from "@babylonjs/gui";
import { 
    createTextBlock, 
    createRectangle,
    createContainer,
    GUI_COLORS, 
    GUI_FONT_SIZES,
    GUI_DIMENSIONS 
} from "../guiUtils";

export class LobbyComponent {
    container: Rectangle;
    private readyButton: Button;
    private startButton: Button;
    private mainMenuButton: Button;
    private isVisible: boolean = false;

    constructor(parent: Rectangle) {
        // Main lobby container (centered)
        this.container = createContainer({
            name: "lobbyContainer",
            width: "400px",
            height: "300px",
            horizontalAlignment: Control.HORIZONTAL_ALIGNMENT_CENTER,
            verticalAlignment: Control.VERTICAL_ALIGNMENT_CENTER,
            background: GUI_COLORS.background,
            alpha: 0.9,
            cornerRadius: GUI_DIMENSIONS.borderRadius,
            thickness: 2
        });
        parent.addControl(this.container);
        
        // Title
        const title = createTextBlock({
            name: "lobbyTitle",
            width: "100%",
            height: "60px",
            color: GUI_COLORS.highlight,
            fontSize: GUI_FONT_SIZES.title,
            text: "LOBBY",
            textHorizontalAlignment: Control.HORIZONTAL_ALIGNMENT_CENTER,
            textVerticalAlignment: Control.VERTICAL_ALIGNMENT_CENTER
        });
        this.container.addControl(title);
        
        // Button panel
        const buttonPanel = new StackPanel();
        buttonPanel.width = "80%";
        buttonPanel.height = "200px";
        buttonPanel.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
        buttonPanel.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
        buttonPanel.isVertical = true;
        buttonPanel.spacing = 10;
        this.container.addControl(buttonPanel);
        
        // Ready button
        this.readyButton = Button.CreateSimpleButton("readyButton", "Ready");
        this.readyButton.width = "100%";
        this.readyButton.height = "50px";
        this.readyButton.color = GUI_COLORS.text;
        this.readyButton.fontSize = GUI_FONT_SIZES.subtitle;
        this.readyButton.background = GUI_COLORS.accent;
        this.readyButton.cornerRadius = GUI_DIMENSIONS.borderRadius;
        this.readyButton.thickness = 2;
        buttonPanel.addControl(this.readyButton);
        
        // Start button
        this.startButton = Button.CreateSimpleButton("startButton", "Start");
        this.startButton.width = "100%";
        this.startButton.height = "50px";
        this.startButton.color = "#666666";
        this.startButton.fontSize = GUI_FONT_SIZES.subtitle;
        this.startButton.background = GUI_COLORS.background;
        this.startButton.cornerRadius = GUI_DIMENSIONS.borderRadius;
        this.startButton.thickness = 2;
        this.startButton.isEnabled = false;
        buttonPanel.addControl(this.startButton);
        
        // Main Menu button
        this.mainMenuButton = Button.CreateSimpleButton("mainMenuButton", "Main Menu");
        this.mainMenuButton.width = "100%";
        this.mainMenuButton.height = "50px";
        this.mainMenuButton.color = GUI_COLORS.text;
        this.mainMenuButton.fontSize = GUI_FONT_SIZES.subtitle;
        this.mainMenuButton.background = GUI_COLORS.background;
        this.mainMenuButton.cornerRadius = GUI_DIMENSIONS.borderRadius;
        this.mainMenuButton.thickness = 2;
        buttonPanel.addControl(this.mainMenuButton);
        
        // Initially hide the lobby
        this.hide();
    }
    
    show(): void {
        this.container.isVisible = true;
        this.isVisible = true;
    }
    
    hide(): void {
        this.container.isVisible = false;
        this.isVisible = false;
    }
    
    isShown(): boolean {
        return this.isVisible;
    }
    
    // Event handlers
    onReadyClick(callback: () => void): void {
        this.readyButton.onPointerClickObservable.add(callback);
    }
    
    onStartClick(callback: () => void): void {
        this.startButton.onPointerClickObservable.add(callback);
    }
    
    onMainMenuClick(callback: () => void): void {
        this.mainMenuButton.onPointerClickObservable.add(callback);
    }

    setStartButtonEnabled(enabled: boolean): void {
        this.startButton.isEnabled = enabled;
        this.startButton.background = enabled ? GUI_COLORS.highlight : GUI_COLORS.background;
        this.startButton.color = enabled ? GUI_COLORS.text : "#666666";
    }
}
