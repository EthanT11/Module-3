import { Scene } from "@babylonjs/core";
import { AdvancedDynamicTexture, TextBlock, StackPanel, Control } from "@babylonjs/gui";


export class GameHUD {
    private gui: AdvancedDynamicTexture;
    private timer: TextBlock;
    private startTime: number;
    private isRunning: boolean;

    constructor(scene: Scene) {
        // Create the GUI
        this.gui = AdvancedDynamicTexture.CreateFullscreenUI("gameHUD");
        
        // Create main container for all HUD elements
        const mainContainer = new StackPanel();
        mainContainer.width = "200px";
        mainContainer.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
        mainContainer.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
        mainContainer.top = "20px";
        mainContainer.left = "20px";
        this.gui.addControl(mainContainer);

        // Create timer
        this.timer = new TextBlock("gameTimer");
        this.timer.height = "20px";
        this.timer.color = "white";
        this.timer.fontSize = "20px";
        this.timer.text = "00:00";
        mainContainer.addControl(this.timer);

        // Init timer
        this.startTime = 0;
        this.isRunning = false;

        scene.onBeforeRenderObservable.add(() => {
            if (this.isRunning) {
                const elapsedTime = Date.now() - this.startTime;
                const minutes = Math.floor(elapsedTime / 60000);
                const seconds = Math.floor((elapsedTime % 60000) / 1000);
                this.timer.text = `${minutes}:${seconds.toString().padStart(2, '0')}`;
            }
        });
    }

    startTimer() {
        this.startTime = Date.now();
        this.isRunning = true;
    }
    

    dispose() {
        this.gui.dispose();
    }
}