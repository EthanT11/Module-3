import { Scene } from "@babylonjs/core";
import { Control, Rectangle, TextBlock } from "@babylonjs/gui";
import { 
    createTextBlock, 
    createContainer,
    GUI_COLORS, 
    GUI_FONT_SIZES,
    GUI_DIMENSIONS 
} from "../guiUtils";

export class TimerComponent {
    container: Rectangle;
    private timer: TextBlock;
    private startTime: number;
    private isRunning: boolean;
    private congratsMessage: TextBlock;
    
    constructor(parent: Rectangle, scene: Scene) {
        // Timer container
        this.container = createContainer({
            name: "timerContainer",
            width: GUI_DIMENSIONS.timerWidth,
            height: GUI_DIMENSIONS.timerHeight,
            horizontalAlignment: Control.HORIZONTAL_ALIGNMENT_CENTER,
            verticalAlignment: Control.VERTICAL_ALIGNMENT_TOP,
            top: GUI_DIMENSIONS.padding,
            background: GUI_COLORS.background,
            alpha: 0.7
        });
        parent.addControl(this.container);
        
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
        this.container.addControl(this.timer);
        
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
        parent.addControl(this.congratsMessage);
        
        // Timer state
        this.startTime = 0;
        this.isRunning = false;
        
        // Set up update loop
        scene.onBeforeRenderObservable.add(() => {
            if (this.isRunning) {
                this.updateTimer();
            }
        });
    }
    
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
    
    private updateTimer(): void {
        const elapsedTime = Date.now() - this.startTime;
        const minutes = Math.floor(elapsedTime / 60000);
        const seconds = Math.floor((elapsedTime % 60000) / 1000);
        this.timer.text = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }
} 