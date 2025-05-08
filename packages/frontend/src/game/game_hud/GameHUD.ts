import { Scene, PointerEventTypes } from "@babylonjs/core";
import { AdvancedDynamicTexture, StackPanel, Control, TextBlock, Rectangle, Image } from "@babylonjs/gui";
import { 
    createTextBlock, 
    createRectangle,
    createContainer,
    createPanel,
    createPlayerEntry,
    GUI_FONT_SIZES, 
    GUI_COLORS, 
    GUI_DIMENSIONS,
} from "./guiUtils";

export class GameHUD {
    // Public
    gui: AdvancedDynamicTexture;
    isRunning: boolean;

    // Private
    // Timer
    private timer: TextBlock;
    private startTime: number;
    private congratsMessage: TextBlock;

    // Player List
    private playerListContainer: Rectangle;
    private playerList: StackPanel;
    private playerListTitle: TextBlock;
    private players: Map<string, TextBlock>;
    private morePlayersText: TextBlock | null = null;

    // HP Bar
    private hpBar: Rectangle;
    private hpText: TextBlock;

    // FIST
    private fistContainer: Rectangle;
    private fistImage: Image | null = null;
    private fistText: TextBlock | null = null;
    private isActivated: boolean = false;
    private activationTimer: number = 0;

    constructor(scene: Scene) {
        // Create the GUI
        this.gui = AdvancedDynamicTexture.CreateFullscreenUI("gameHUD");
        this.players = new Map();

        // Create main container for the entire HUD
        const mainHUDContainer = new Rectangle("mainHUDContainer");
        mainHUDContainer.width = 1;
        mainHUDContainer.height = 1;
        mainHUDContainer.thickness = 0;
        mainHUDContainer.background = "transparent";
        mainHUDContainer.isPointerBlocker = false;
        this.gui.addControl(mainHUDContainer);

        // Timer container
        const timerContainer = createContainer({
            name: "timerContainer",
            width: GUI_DIMENSIONS.timerWidth,
            height: GUI_DIMENSIONS.timerHeight,
            horizontalAlignment: Control.HORIZONTAL_ALIGNMENT_CENTER,
            verticalAlignment: Control.VERTICAL_ALIGNMENT_TOP,
            top: GUI_DIMENSIONS.padding,
            background: GUI_COLORS.background,
            alpha: 0.7
        });
        mainHUDContainer.addControl(timerContainer);

        // Create timer
        this.timer = createTextBlock({
            name: "gameTimer",
            width: "100%",
            height: "100%",
            color: GUI_COLORS.timerColor,
            fontSize: GUI_FONT_SIZES.title,
            text: "00:00",
            horizontalAlignment: Control.HORIZONTAL_ALIGNMENT_CENTER,
            textHorizontalAlignment: Control.HORIZONTAL_ALIGNMENT_CENTER,
            textVerticalAlignment: Control.VERTICAL_ALIGNMENT_CENTER
        });
        timerContainer.addControl(this.timer);

        // HP Bar container (top left)
        const hpBarContainer = createContainer({
            name: "hpBarContainer",
            width: GUI_DIMENSIONS.hpBarContainerWidth,
            height: GUI_DIMENSIONS.elementHeight,
            horizontalAlignment: Control.HORIZONTAL_ALIGNMENT_LEFT,
            verticalAlignment: Control.VERTICAL_ALIGNMENT_TOP,
            top: GUI_DIMENSIONS.padding,
            left: GUI_DIMENSIONS.padding, // Left padding
            background: GUI_COLORS.background,
            alpha: 0.7
        });
        mainHUDContainer.addControl(hpBarContainer);

        // HP Bar layout
        const hpBarLayout = createPanel("hpBarLayout", false);
        hpBarLayout.width = 1; // Fill container
        hpBarLayout.height = 1;
        hpBarContainer.addControl(hpBarLayout);

        // HP Label
        const hpLabel = createTextBlock({
            name: "hpLabel",
            width: GUI_DIMENSIONS.hpLabelWidth,
            height: "100%",
            color: GUI_COLORS.text,
            fontSize: GUI_FONT_SIZES.subtitle,
            text: "HP",
            textHorizontalAlignment: Control.HORIZONTAL_ALIGNMENT_CENTER,
            textVerticalAlignment: Control.VERTICAL_ALIGNMENT_CENTER
        });
        hpBarLayout.addControl(hpLabel);

        // HP Bar background
        this.hpBar = createRectangle({
            name: "hpBar",
            width: GUI_DIMENSIONS.hpBarWidth,
            height: GUI_DIMENSIONS.hpBarHeight,
            color: GUI_COLORS.text,
            thickness: 2,
            background: GUI_COLORS.hpBar,
            cornerRadius: GUI_DIMENSIONS.borderRadius
        });
        hpBarLayout.addControl(this.hpBar);

        // HP value overlay
        this.hpText = createTextBlock({
            name: "hpText",
            width: "100%",
            height: "100%",
            color: GUI_COLORS.text,
            fontSize: GUI_FONT_SIZES.regular,
            text: "0",
            textHorizontalAlignment: Control.HORIZONTAL_ALIGNMENT_CENTER,
            textVerticalAlignment: Control.VERTICAL_ALIGNMENT_CENTER
        });
        this.hpBar.addControl(this.hpText);

        // Player list container (top right)
        this.playerListContainer = createContainer({
            name: "playerListContainer",
            width: GUI_DIMENSIONS.playerListWidth,
            horizontalAlignment: Control.HORIZONTAL_ALIGNMENT_RIGHT,
            verticalAlignment: Control.VERTICAL_ALIGNMENT_TOP,
            top: GUI_DIMENSIONS.padding,
            right: GUI_DIMENSIONS.padding,
            background: GUI_COLORS.playerListBackground,
            alpha: 0.7,
            // Fixed height based on player counts
            height: (parseInt(GUI_DIMENSIONS.playerListTitleHeight.toString()) + 
                   (parseInt(GUI_DIMENSIONS.playerEntryHeight.toString()) * (GUI_DIMENSIONS.maxVisiblePlayers - 1))) + "px"
        });
        mainHUDContainer.addControl(this.playerListContainer);

        // Create a title container at the top || "Players"
        const titleContainer = createRectangle({
            name: "titleContainer",
            width: "100%",
            height: GUI_DIMENSIONS.playerListTitleHeight,
            horizontalAlignment: Control.HORIZONTAL_ALIGNMENT_CENTER,
            verticalAlignment: Control.VERTICAL_ALIGNMENT_TOP,
            thickness: 0,
            background: GUI_COLORS.background, // Slightly darker background for the header
            // alpha: 0.7
        });
        this.playerListContainer.addControl(titleContainer);

        // Player list title - inside the title container
        this.playerListTitle = createTextBlock({
            name: "playerListTitle",
            text: "Players",
            color: GUI_COLORS.text,
            fontSize: GUI_FONT_SIZES.subtitle,
            height: GUI_DIMENSIONS.playerListTitleHeight,
            width: "100%",
            textHorizontalAlignment: Control.HORIZONTAL_ALIGNMENT_CENTER,
            textVerticalAlignment: Control.VERTICAL_ALIGNMENT_CENTER
        });
        titleContainer.addControl(this.playerListTitle);

        // Player list internal panel - starts below the title
        this.playerList = createPanel("playerListPanel", true);
        this.playerList.width = 1;
        this.playerList.paddingTop = GUI_DIMENSIONS.playerEntryPadding;
        this.playerList.paddingBottom = GUI_DIMENSIONS.playerEntryPadding;
        this.playerList.paddingLeft = GUI_DIMENSIONS.playerListPadding;
        this.playerList.paddingRight = GUI_DIMENSIONS.playerListPadding;
        this.playerList.top = GUI_DIMENSIONS.playerListTitleHeight; // Position below the title
        this.playerList.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP; // Align to top
        this.playerListContainer.addControl(this.playerList);

        // Congratulations message
        this.congratsMessage = createTextBlock({
            name: "congratsMessage",
            height: GUI_DIMENSIONS.congratsHeight,
            width: GUI_DIMENSIONS.congratsWidth,
            color: GUI_COLORS.highlight,
            fontSize: GUI_FONT_SIZES.title,
            text: "",
            horizontalAlignment: Control.HORIZONTAL_ALIGNMENT_CENTER,
            verticalAlignment: Control.VERTICAL_ALIGNMENT_CENTER,
            textHorizontalAlignment: Control.HORIZONTAL_ALIGNMENT_CENTER,
            textVerticalAlignment: Control.VERTICAL_ALIGNMENT_CENTER
        });
        this.gui.addControl(this.congratsMessage);

        // Timer state
        this.startTime = 0;
        this.isRunning = false;

        // Create the FIST box in the bottom right corner
        this.fistContainer = createContainer({
            name: "fistContainer",
            width: "120px",
            height: "120px",
            horizontalAlignment: Control.HORIZONTAL_ALIGNMENT_RIGHT,
            verticalAlignment: Control.VERTICAL_ALIGNMENT_BOTTOM,
            right: GUI_DIMENSIONS.padding,
            bottom: GUI_DIMENSIONS.padding,
            background: GUI_COLORS.background,
            alpha: 0.7,
            cornerRadius: GUI_DIMENSIONS.borderRadius
        });
        mainHUDContainer.addControl(this.fistContainer);

        // Try to load the fist icon immediately
        this.loadFistIcon("icons/fist.png");

        // Listen for clicks in the scene to activate the fist
        scene.onPointerObservable.add((pointerInfo) => {
            if (pointerInfo.type === PointerEventTypes.POINTERDOWN) {
                this.activateFist();
            }
        });

        // Render before every frame 
        scene.onBeforeRenderObservable.add(() => {
            if (this.isRunning) {
                // Update the timer
                this.updateTimer();
            }

            // Handle fist activation timeout
            if (this.isActivated) {
                this.activationTimer++;
                if (this.activationTimer > 10) { // ~10 frames of activation
                    this.deactivateFist();
                }
            }
        });
    }

    // Public functions
    startTimer(): void {
        this.startTime = Date.now();
        this.isRunning = true;
    }

    stopTimer(): string {
        this.isRunning = false;
        return this.timer.text;
    }

    showCongratulations(finalTime: string): void {
        this.congratsMessage.text = `Congratulations!\nFinal Time: ${finalTime}`;
    }

    updateHP(hp: number): void {
        this.hpText.text = hp.toString();
    }

    addPlayer(playerId: string, playerName?: string): void {
        if (this.players.has(playerId)) return;
        
        // Limit player ID length to prevent overflow
        const shortId = playerId.length > 8 ? playerId.substring(0, 8) + '...' : playerId;
        const displayText = playerName ? `${playerName} (${shortId})` : shortId;
        
        // Create player entry but don't add it yet
        const playerText = createPlayerEntry(playerId, displayText);
        this.players.set(playerId, playerText);
        
        // Update the player list display
        this.updatePlayerListDisplay();
    }

    removePlayer(playerId: string): void {
        const playerControl = this.players.get(playerId);
        if (playerControl) {
            // Remove from list if it's currently displayed
            if (playerControl.parent) {
                this.playerList.removeControl(playerControl);
            }
            this.players.delete(playerId);
            
            // Update the player list display
            this.updatePlayerListDisplay();
        } else {
            console.log(`Player ${playerId} not found`);
        }
    }

    private updatePlayerListDisplay(): void {
        // Clear existing player entries
        const children = this.playerList.children;
        while (children.length > 0) {
            this.playerList.removeControl(children[0]);
        }
        
        if (this.morePlayersText) {
            this.morePlayersText = null;
        }
        
        // Get all player entries
        const playerEntries = Array.from(this.players.values());
        
        // Calculate how many we can show
        const maxPlayerEntries = GUI_DIMENSIONS.maxVisiblePlayers - 1; // Subtract 1 for the title
        const displayCount = Math.min(maxPlayerEntries, playerEntries.length);
        const hasMore = playerEntries.length > maxPlayerEntries;
        
        // Add the players we can show
        for (let i = 0; i < displayCount; i++) {
            this.playerList.addControl(playerEntries[i]);
        }
        
        // If we have more players than we can show
        if (hasMore) {
            const moreCount = playerEntries.length - maxPlayerEntries;
            this.morePlayersText = createTextBlock({
                name: "morePlayersText",
                text: `...and ${moreCount} more`,
                color: GUI_COLORS.text,
                fontSize: GUI_FONT_SIZES.small,
                height: GUI_DIMENSIONS.playerEntryHeight,
                textHorizontalAlignment: Control.HORIZONTAL_ALIGNMENT_CENTER,
                fontWeight: "italic"
            });
            this.playerList.addControl(this.morePlayersText);
        }
    }

    // Private functions and cleanup
    private updateTimer(): void {
        const elapsedTime = Date.now() - this.startTime;
        const minutes = Math.floor(elapsedTime / 60000);
        const seconds = Math.floor((elapsedTime % 60000) / 1000);
        this.timer.text = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }

    dispose(): void {
        this.gui.dispose();
    }

    // Method to load the fist icon
    private loadFistIcon(iconPath: string): void {
        // Create a placeholder text until the image loads
        this.fistText = createTextBlock({
            name: "fistText",
            text: "FIST",
            color: GUI_COLORS.text,
            fontSize: GUI_FONT_SIZES.title,
            width: "100%",
            height: "100%",
            textHorizontalAlignment: Control.HORIZONTAL_ALIGNMENT_CENTER,
            textVerticalAlignment: Control.VERTICAL_ALIGNMENT_CENTER
        });
        this.fistContainer.addControl(this.fistText);

        // Create and load the image
        this.fistImage = new Image("fistIcon", iconPath);
        this.fistImage.width = "80%";
        this.fistImage.height = "80%";
        this.fistImage.stretch = Image.STRETCH_UNIFORM;
        this.fistImage.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
        this.fistImage.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;

        // When the image loads successfully, remove the text
        this.fistImage.onImageLoadedObservable.add(() => {
            try {
                if (this.fistText && this.fistText.parent) {
                    this.fistContainer.removeControl(this.fistText);
                }
                this.fistContainer.addControl(this.fistImage);
                console.log(`Fist icon loaded successfully from: ${iconPath}`);
            } catch (error) {
                console.error("Error loading fist icon:", error);
            }
        });
    }

    // Activate the fist
    activateFist(): void {
        if (!this.isActivated) {
            this.isActivated = true;
            this.activationTimer = 0;
            this.fistContainer.background = GUI_COLORS.accent; // Red background
            console.log("Fist activated!");
        }
    }

    // Deactivate the fist (return to normal)
    deactivateFist(): void {
        this.isActivated = false;
        this.fistContainer.background = GUI_COLORS.background; // Normal background
    }
}