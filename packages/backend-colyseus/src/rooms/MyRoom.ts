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
      player.x = message.x;
      player.y = message.y;
      player.z = message.z;
      player.rotationY = message.rotationY;
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
      console.log("Updated map: ", this.state.map);
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
