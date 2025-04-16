import { Scene } from "@babylonjs/core";
import { AdvancedDynamicTexture, TextBlock, StackPanel, Control } from "@babylonjs/gui";


export class GameHUD {
    private gui: AdvancedDynamicTexture;
    private timer: TextBlock;

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
        this.timer = new TextBlock("timer");
        this.timer.height = "20px";
        this.timer.text = "00:00";
        this.timer.color = "white";
        mainContainer.addControl(this.timer);
    }

    dispose() {
        this.gui.dispose();
    }
}