import { Scene } from "@babylonjs/core";
import { AdvancedDynamicTexture, Rectangle } from "@babylonjs/gui";
import { 
    HpBarComponent, 
    PlayerListComponent, 
    TimerComponent, 
    FistComponent 
} from "./components";

export class GameHUD {
    // Public properties
    gui: AdvancedDynamicTexture;
    isRunning: boolean;
    
    // Components
    private mainContainer: Rectangle;
    private timerComponent: TimerComponent;
    private playerListComponent: PlayerListComponent;
    private hpBarComponent: HpBarComponent;
    private fistComponent: FistComponent;

    constructor(scene: Scene) {
        // Create the GUI
        this.gui = AdvancedDynamicTexture.CreateFullscreenUI("gameHUD");
        
        // Create main container for the entire HUD
        this.mainContainer = new Rectangle("mainHUDContainer");
        this.mainContainer.width = 1;
        this.mainContainer.height = 1;
        this.mainContainer.thickness = 0;
        this.mainContainer.background = "transparent";
        this.mainContainer.isPointerBlocker = false;
        this.gui.addControl(this.mainContainer);
        
        // Initialize components
        this.timerComponent = new TimerComponent(this.mainContainer, scene);
        this.hpBarComponent = new HpBarComponent(this.mainContainer);
        this.playerListComponent = new PlayerListComponent(this.mainContainer);
        this.fistComponent = new FistComponent(this.mainContainer, scene);
        
        // Set up initial state
        this.isRunning = false;
    }

    // Timer functions
    startTimer(): void {
        this.timerComponent.startTimer();
        this.isRunning = true;
    }

    stopTimer(): string {
        this.isRunning = false;
        return this.timerComponent.stopTimer();
    }

    showCongratulations(finalTime: string): void {
        this.timerComponent.showCongratulations(finalTime);
    }

    // HP functions
    updateHP(hp: number): void {
        this.hpBarComponent.updateHP(hp);
    }

    // Player list functions
    addPlayer(playerId: string, playerName?: string): void {
        this.playerListComponent.addPlayer(playerId, playerName);
    }

    removePlayer(playerId: string): void {
        this.playerListComponent.removePlayer(playerId);
    }

    // Cleanup
    dispose(): void {
        this.gui.dispose();
    }
}