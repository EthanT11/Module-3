import { Control, Rectangle, StackPanel, TextBlock } from "@babylonjs/gui";
import { 
    createTextBlock, 
    createRectangle,
    createPanel,
    createPlayerEntry,
    GUI_COLORS, 
    GUI_FONT_SIZES,
    GUI_DIMENSIONS 
} from "../guiUtils";

// TODO: Fix padding issue, I think it has to do with how the containers are being created but looks okay for now
export class PlayerListComponent {
    container: Rectangle;
    private playerList: StackPanel;
    private playerListTitle: TextBlock;
    private players: Map<string, TextBlock>;
    private morePlayersText: TextBlock | null = null;
    
    constructor(parent: Rectangle) {
        // Player list container (top right)
        this.container = createContainer({
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
        parent.addControl(this.container);
        
        // Initialize players map
        this.players = new Map();
        
        // Create a title container at the top
        const titleContainer = createRectangle({
            name: "titleContainer",
            width: "100%",
            height: GUI_DIMENSIONS.playerListTitleHeight,
            horizontalAlignment: Control.HORIZONTAL_ALIGNMENT_CENTER,
            verticalAlignment: Control.VERTICAL_ALIGNMENT_TOP,
            thickness: 0,
            background: GUI_COLORS.background
        });
        this.container.addControl(titleContainer);
        
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
        this.container.addControl(this.playerList);
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
}

// Create a container with background
function createContainer(options: any): Rectangle {
    const defaults = {
        background: GUI_COLORS.background,
        thickness: 1,
        cornerRadius: GUI_DIMENSIONS.borderRadius
    };
    
    // Spread operator is used to merge the two objects
    return createRectangle({...defaults, ...options});
} 