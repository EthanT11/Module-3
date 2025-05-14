import { Scene, PointerEventTypes } from "@babylonjs/core";
import { Control, Rectangle, Image, TextBlock } from "@babylonjs/gui";
import { 
    createTextBlock, 
    createRectangle,
    GUI_COLORS, 
    GUI_FONT_SIZES,
    GUI_DIMENSIONS 
} from "../guiUtils";

export class FistComponent {
    // Container and visual elements
    container: Rectangle;
    private image: Image | null = null;
    private text: TextBlock | null = null;
    private fillRect: Rectangle | null = null;
    
    // Fist State
    private isActivated: boolean = false;
    private activationTimer: number = 0;
    private maxActivationTime: number = 60; // ~60 frames to fill
    private isFlashing: boolean = false;
    private flashCount: number = 0;
    private readonly maxFlashCount: number = 10;
    
    constructor(parent: Rectangle, scene: Scene) {
        // Create the FIST container
        this.container = createRectangle({
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
        parent.addControl(this.container);
        
        // Create fill effect
        this.fillRect = createRectangle({
            name: "fillRect",
            width: "100%",
            height: "0%", // Starts at 0% height
            background: GUI_COLORS.accent,
            horizontalAlignment: Control.HORIZONTAL_ALIGNMENT_CENTER,
            verticalAlignment: Control.VERTICAL_ALIGNMENT_BOTTOM,
            thickness: 0,
            alpha: 0.5
        });
        this.container.addControl(this.fillRect);
        
        // Try to load the fist icon
        try {
            this.loadIcon("icons/fist.png");
        } catch (error) {
            console.error("Error loading fist icon:", error);
        }
        
        // Set up event listeners
        this.setupEventListeners(scene);
    }
    
    private setupEventListeners(scene: Scene): void {
        // Listen for clicks in the scene to activate the fist
        scene.onPointerObservable.add((pointerInfo) => {
            if (pointerInfo.type === PointerEventTypes.POINTERDOWN) {
                this.startActivation();
            } else if (pointerInfo.type === PointerEventTypes.POINTERUP) {
                this.cancelActivation();
            }
        });
        
        // Add update logic to scene's render loop
        scene.onBeforeRenderObservable.add(() => this.update());
    }
    
    // Call every frame
    private update(): void {
        if (!this.isActivated) return;
        
        // Should take 1 second to fill
        this.activationTimer++;
        
        if (this.fillRect) {
            // Update fill height based on activation progress
            const fillPercentage = Math.min(100, (this.activationTimer / this.maxActivationTime) * 100);
            this.fillRect.height = fillPercentage + "%";
            
            // When completely filled
            if (this.activationTimer >= this.maxActivationTime && !this.isFlashing) {
                this.isFlashing = true;
                this.flashCount = 0;
            }
        }
        
        // Handle flashing
        // TODO: Also make this random for each player since the theme is randomness
        if (this.isFlashing) {
            this.flashCount++;
            
            if (this.flashCount % 10 === 0) { // Toggle color every 10 frames
                const isRed = Math.floor(this.flashCount / 10) % 2 === 0; // Check if the flash count is even or odd
                this.fillRect!.background = isRed ? GUI_COLORS.accent : "#33cc33"; // Toggle between red and green
            }
            
            if (this.flashCount >= this.maxFlashCount * 20) { // After complete flashing
                this.deactivate();
            }
        }
    }
    
    // Start filling the fist
    startActivation(): void {
        if (!this.isActivated) {
            this.isActivated = true;
            this.activationTimer = 0;
            this.isFlashing = false;
            console.log("Starting fist activation...");
        }
    }
    
    // Cancel activation if mouse is released before completion
    cancelActivation(): void {
        if (this.isActivated && !this.isFlashing) {
            this.deactivate();
        }
    }
    
    // Deactivate the fist (return to normal)
    deactivate(): void {
        this.isActivated = false;
        this.isFlashing = false;
        this.activationTimer = 0;
        if (this.fillRect) {
            this.fillRect.height = "0%";
            this.fillRect.background = GUI_COLORS.accent;
        }
        console.log("Fist deactivated");
    }
    
    // Method to load the fist icon
    private loadIcon(iconPath: string): void {
        // Create a placeholder text until the image loads
        this.text = createTextBlock({
            name: "fistText",
            text: "FIST",
            color: GUI_COLORS.text,
            fontSize: GUI_FONT_SIZES.title,
            width: "100%",
            height: "100%",
            textHorizontalAlignment: Control.HORIZONTAL_ALIGNMENT_CENTER,
            textVerticalAlignment: Control.VERTICAL_ALIGNMENT_CENTER
        });
        this.container.addControl(this.text);
        
        // Create and load the image
        this.image = new Image("fistIcon", iconPath);
        this.image.width = "80%";
        this.image.height = "80%";
        this.image.stretch = Image.STRETCH_UNIFORM;
        this.image.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
        this.image.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
        
        // When the image loads successfully, remove the text
        this.image.onImageLoadedObservable.add(() => {
            try {
                if (this.text && this.text.parent) {
                    this.container.removeControl(this.text);
                }
                this.container.addControl(this.image);
                console.log(`Fist icon loaded successfully from: ${iconPath}`);
            } catch (error) {
                console.error("Error loading fist icon:", error);
            }
        });
    }
} 