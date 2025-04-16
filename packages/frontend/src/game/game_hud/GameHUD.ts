import { Scene } from "@babylonjs/core";
import { AdvancedDynamicTexture, TextBlock, StackPanel, Control } from "@babylonjs/gui";

// TODO: create config file for the HUD
// TODO: Try and display current users in the game

export class GameHUD {
    gui: AdvancedDynamicTexture;
    isRunning: boolean;
    private timer: TextBlock;
    private startTime: number;

    constructor(scene: Scene) {
        // Create the GUI
        this.gui = AdvancedDynamicTexture.CreateFullscreenUI("gameHUD");
        
        // Create main container for all HUD elements
        const mainContainer = new StackPanel("mainContainer");
        mainContainer.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
        mainContainer.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
        mainContainer.top = "20px";
        mainContainer.left = "-120px";
        this.gui.addControl(mainContainer);

        // Create timer
        this.timer = new TextBlock("gameTimer");
        this.timer.height = "50px";
        this.timer.color = "white";
        this.timer.fontSize = "50px";
        this.timer.text = "00:00";
        mainContainer.addControl(this.timer);

        // Init timer
        this.startTime = 0;
        this.isRunning = false;

        scene.onBeforeRenderObservable.add(() => {
            if (this.isRunning) {
                // Update the timer
                this.updateTimer();
            }
        });
    }

    startTimer() {
        this.startTime = Date.now();
        this.isRunning = true;
    }

    stopTimer() {
        this.isRunning = false;
        return this.timer.text;
    }

    private updateTimer() {
        const elapsedTime = Date.now() - this.startTime;
        const minutes = Math.floor(elapsedTime / 60000);
        const seconds = Math.floor((elapsedTime % 60000) / 1000);
        this.timer.text = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }
    

    dispose() {
        this.gui.dispose();
    }
}