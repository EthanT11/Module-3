import { Scene } from "@babylonjs/core";
import { AdvancedDynamicTexture, Rectangle } from "@babylonjs/gui";
import { 
    HpBarComponent, 
    PlayerListComponent, 
    TimerComponent, 
    FistComponent,
    LobbyComponent
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
    private lobbyComponent: LobbyComponent;
    
    // State
    private isLobbyVisible: boolean = false;

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
        this.lobbyComponent = new LobbyComponent(this.mainContainer);
        
        // Set up initial state
        this.isRunning = false;
        
        // Set up TAB key listener
        this.setupTabKeyListener(scene);
    }
    
    private setupTabKeyListener(scene: Scene): void {
        scene.onKeyboardObservable.add((kb) => {
            if (kb.type === 1 && kb.event.code === "Tab") { 
                kb.event.preventDefault(); // Prevent default TAB behavior
                this.toggleLobby();
            }
        });
    }
    
    private toggleLobby(): void {
        if (this.isLobbyVisible) {
            this.showGame();
        } else {
            this.showLobby();
        }
    }
    
    private showGame(): void {
        this.timerComponent.show();
        this.hpBarComponent.show();
        this.playerListComponent.show();
        this.fistComponent.show();
        this.lobbyComponent.hide();
        this.isLobbyVisible = false;
    }
    
    private showLobby(): void {
        this.timerComponent.hide();
        this.hpBarComponent.hide();
        this.playerListComponent.hide();
        this.fistComponent.hide();
        this.lobbyComponent.show();
        this.isLobbyVisible = true;
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

    // Lobby functions
    onReadyClick(callback: () => void): void {
        this.lobbyComponent.onReadyClick(callback);
    }
    
    onStartClick(callback: () => void): void {
        this.lobbyComponent.onStartClick(callback);
    }
    
    onMainMenuClick(callback: () => void): void {
        this.lobbyComponent.onMainMenuClick(callback);
    }

    // Cleanup
    dispose(): void {
        this.gui.dispose();
    }
}