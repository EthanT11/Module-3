import { Room, Client } from "@colyseus/core";
import { MyRoomState, Player, Map } from "./schema/MyRoomState";

// TODO: Rename to GameRoom
export class MyRoom extends Room<MyRoomState> {
  maxClients = 4;

  onCreate (options: any) {
    this.setState(new MyRoomState());
    
    // Create initial map instance
    this.state.map = new Map();

    // Handle player position updates
    this.onMessage("updatePosition", (client, message): void => {
      const player = this.state.players.get(client.sessionId); // Get the player from the players map
      if (!player) return;
      // console.log("Updating player position: ", player.x, player.y, player.z, player.rotationY, message);
      // Check if player is moving by comparing the current position with the new position
      const isMoving = Math.abs(player.x - message.x) > 0.01 || Math.abs(player.z - message.z) > 0.01;
      
      player.x = message.x;
      player.y = message.y;
      player.z = message.z;
      player.rotationY = message.rotationY;
      player.isMoving = isMoving;
      // console.log("Updated player position: ", player.x, player.y, player.z, player.rotationY);
    });

    // Handle map updates
    this.onMessage("setMapState", (client, message): void => {
      // Only allow host to set map state
      if (client.sessionId !== this.state.hostId) return;
      
      this.state.map.data = message.data;
      this.state.map.width = message.width;
      this.state.map.height = message.height;
      this.state.map.fogColor = message.fogColor;
      this.state.map.fogDensity = message.fogDensity;
      console.log("Updated map: ", this.state.map.fogColor);
    });

    this.onMessage("getMapState", (client): void => {
      // Send map state back to requesting client
      client.send("mapState", {
        data: this.state.map.data,
        width: this.state.map.width,
        height: this.state.map.height,
        fogColor: this.state.map.fogColor,
        fogDensity: this.state.map.fogDensity
      });
      console.log("Sent map state to client: ", client.sessionId);
    });

    // Handle hit notifications
    this.onMessage("hit", (client, message): void => {
      console.log("Hit received: ", message);
      const player = this.state.players.get(message.hitPlayer);
      if (!player) return;
      player.health -= message.damage;
      console.log("Player health: ", player.health);
      if (player.health <= 0) {
        player.isDead = true;
        console.log("Player is dead: ", player.isDead);
      }
      // Broadcast the hit message to all clients
      this.broadcast("hit", message);
    });

    // Handle punch animations
    this.onMessage("punch", (client, message): void => {
      // Broadcast the punch message to all clients except the sender
      this.broadcast("punch", message, { except: client });
    });

    // Handle ready state updates
    this.onMessage("setReady", (client, message): void => {
      const player = this.state.players.get(client.sessionId);
      if (!player) return;
      
      player.ready = message.ready;
      console.log(`Player ${client.sessionId} ready state: ${player.ready}`);
      
      // Broadcast ready state update to all clients
      this.broadcast("playerReady", {
        playerId: client.sessionId,
        ready: player.ready
      });
    });

    // Handle start game request
    this.onMessage("startGame", (client, message): void => {
      // Only allow host to start the game
      if (client.sessionId !== this.state.hostId) return;
      
      // Check if all players are ready
      const allPlayersReady = Array.from(this.state.players.values()).every(player => player.ready);
      const hasMultiplePlayers = this.state.players.size >= 2;
      
      if (allPlayersReady && hasMultiplePlayers) {
        console.log("Starting game - all players ready");
        this.broadcast("gameStarted");
      } else {
        console.log("Cannot start game - not all players ready or insufficient players");
        // TODO: Implement a single player ready but for now we need at least 2 players to start
        client.send("startGameError", {
          message: allPlayersReady ? "Need at least 2 players to start" : "All players must be ready"
        });
      }
    });

    // Catch playground message types |
    this.onMessage("_playground_message_types", (client, message) => {
      console.log("Playground Message: ", message, "From: ", client.sessionId);
      return ["List ofmessage types: ", "updatePosition"]; // Return the list of available message types
    });
  }

  onJoin (client: Client, options: any) {
    console.log(client.sessionId, "joined!");

    const player = new Player();
    
    // Set first player as host
    if (this.clients.length === 1) {
      this.state.hostId = client.sessionId;
    }

    this.state.players.set(client.sessionId, player);
  }

  onLeave (client: Client, consented: boolean) {
    console.log(client.sessionId, "left!");
    
    this.state.players.delete(client.sessionId); // Remove the player from the players map
  }

  onDispose() {
    console.log("room: ", this.roomId, "disposing...");
  }

}
