import { Scene } from "@babylonjs/core";
import { AdvancedDynamicTexture, TextBlock, StackPanel, Control } from "@babylonjs/gui";

// TODO: create config file for the HUD
// TODO: Try and display current users in the game

export class GameHUD {
    // Public
    gui: AdvancedDynamicTexture;
    isRunning: boolean;

    // Private
    private timer: TextBlock;
    private startTime: number;
    private congratsMessage: TextBlock;

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

        // Create congratulations message
        this.congratsMessage = new TextBlock("congratsMessage");
        this.congratsMessage.height = "100px";
        this.congratsMessage.color = "gold";
        this.congratsMessage.fontSize = "60px";
        this.congratsMessage.text = "";
        this.congratsMessage.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
        this.congratsMessage.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
        this.gui.addControl(this.congratsMessage);

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

    showCongratulations(finalTime: string) {
        this.congratsMessage.text = `Congratulations!\nFinal Time: ${finalTime}`;
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