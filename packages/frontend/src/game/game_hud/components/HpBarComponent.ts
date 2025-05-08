import { Control, Rectangle, TextBlock } from "@babylonjs/gui";
import { 
    createTextBlock, 
    createRectangle,
    createPanel,
    GUI_COLORS, 
    GUI_FONT_SIZES,
    GUI_DIMENSIONS 
} from "../guiUtils";

export class HpBarComponent {
    container: Rectangle;
    private hpBar: Rectangle;
    private hpText: TextBlock;
    
    constructor(parent: Rectangle) {
        // HP Bar container (top left)
        this.container = createRectangle({
            name: "hpBarContainer",
            width: GUI_DIMENSIONS.hpBarContainerWidth,
            height: GUI_DIMENSIONS.elementHeight,
            horizontalAlignment: Control.HORIZONTAL_ALIGNMENT_LEFT,
            verticalAlignment: Control.VERTICAL_ALIGNMENT_TOP,
            top: GUI_DIMENSIONS.padding,
            left: GUI_DIMENSIONS.padding,
            background: GUI_COLORS.background,
            alpha: 0.7,
            cornerRadius: GUI_DIMENSIONS.borderRadius,
            thickness: 1
        });
        parent.addControl(this.container);
        
        // HP Bar layout
        const hpBarLayout = createPanel("hpBarLayout", false);
        hpBarLayout.width = 1; // Fill container
        hpBarLayout.height = 1;
        this.container.addControl(hpBarLayout);
        
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
    }
    
    // TODO: Add player interaction | Getting hit with the fist
    updateHP(hp: number): void {
        this.hpText.text = hp.toString();
    }
} 