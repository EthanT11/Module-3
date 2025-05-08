import { Scene } from "@babylonjs/core";
import { AdvancedDynamicTexture, TextBlock, StackPanel, Control, Rectangle } from "@babylonjs/gui";

// TODO: Try and display current users in the game

export class GameHUD {
    // Public
    gui: AdvancedDynamicTexture;
    isRunning: boolean;

    // Private
    private timer: TextBlock;
    private startTime: number;
    private congratsMessage: TextBlock;
    private playerList: StackPanel;
    private hpBar: Rectangle;
    private hpText: TextBlock;
    private players: Map<string, TextBlock>;

    constructor(scene: Scene) {
        // Create the GUI
        this.gui = AdvancedDynamicTexture.CreateFullscreenUI("gameHUD");
        this.players = new Map();
        
        // Create main container
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

        // Create HP Bar (top left)
        const hpBarContainer = new Rectangle("hpBarContainer");
        hpBarContainer.width = "200px";
        hpBarContainer.height = "40px";
        hpBarContainer.thickness = 0;
        hpBarContainer.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
        hpBarContainer.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
        hpBarContainer.top = "20px";
        hpBarContainer.left = "20px";
        this.gui.addControl(hpBarContainer);

        const hpBarStack = new StackPanel();
        hpBarStack.isVertical = false;
        hpBarStack.width = 1;
        hpBarStack.height = 1;
        hpBarContainer.addControl(hpBarStack);

        const hpLabel = new TextBlock("hpLabel");
        hpLabel.text = "HP ";
        hpLabel.color = "white";
        hpLabel.fontSize = "24px";
        hpLabel.width = "40px";
        hpLabel.height = "40px";
        hpLabel.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
        hpBarStack.addControl(hpLabel);

        // HP Bar background
        this.hpBar = new Rectangle("hpBar");
        this.hpBar.width = "120px";
        this.hpBar.height = "30px";
        this.hpBar.color = "white";
        this.hpBar.thickness = 2;
        this.hpBar.background = "#900";
        this.hpBar.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
        this.hpBar.cornerRadius = 8;
        hpBarStack.addControl(this.hpBar);

        // HP value overlay
        this.hpText = new TextBlock("hpText");
        this.hpText.text = "0";
        this.hpText.color = "white";
        this.hpText.fontSize = "22px";
        this.hpText.width = "120px";
        this.hpText.height = "30px";
        this.hpText.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
        this.hpText.textVerticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
        this.hpBar.addControl(this.hpText);

        // Create player list
        this.playerList = new StackPanel("playerList");
        this.playerList.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;
        this.playerList.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
        this.playerList.top = "20px";
        this.playerList.left = "20px";
        this.playerList.width = "200px";
        this.gui.addControl(this.playerList);

        // Add a title for the player list
        const playerListTitle = new TextBlock("playerListTitle");
        playerListTitle.text = "Players";
        playerListTitle.color = "white";
        playerListTitle.fontSize = "24px";
        playerListTitle.height = "30px";
        this.playerList.addControl(playerListTitle);

        // Add a sample player (you can modify this later to show actual players)
        const samplePlayer = new TextBlock("samplePlayer");
        samplePlayer.text = "Player 1";
        samplePlayer.color = "white";
        samplePlayer.fontSize = "18px";
        samplePlayer.height = "25px";
        this.playerList.addControl(samplePlayer);

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

    updateHP(hp: number) {
        this.hpText.text = hp.toString();
    }

    addPlayer(playerName: string) {
        const playerText = new TextBlock(`player_${playerName}`);
        playerText.text = playerName;
        playerText.color = "white";
        playerText.fontSize = "18px";
        playerText.height = "25px";
        this.playerList.addControl(playerText);
        this.players.set(playerName, playerText);
    }

    removePlayer(playerName: string) {
        const playerControl = this.players.get(playerName);
        if (playerControl) {
            this.playerList.removeControl(playerControl);
            this.players.delete(playerName);
        }
    }

    dispose() {
        this.gui.dispose();
    }
}