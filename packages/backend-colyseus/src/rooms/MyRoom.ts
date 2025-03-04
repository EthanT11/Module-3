import { Room, Client } from "@colyseus/core";
import { MyRoomState, Player } from "./schema/MyRoomState";

// TODO: Rename to GameRoom
export class MyRoom extends Room<MyRoomState> {
  maxClients = 4;

  onCreate (options: any) {
    this.setState(new MyRoomState());

    // Handle player position updates
    this.onMessage("updatePosition", (client, message): void => {
      const player = this.state.players.get(client.sessionId); // Get the player from the players map
      if (!player) return;
      
      player.x = message.x;
      player.y = message.y;
      player.z = message.z;
      
    });

    // Catch playground message types |
    this.onMessage("_playground_message_types", (client, message) => {
      console.log("Playground Message: ", message, "From: ", client.sessionId);
      return ["List ofmessage types: ", "updatePosition"]; // Return the list of available message types
    });
  }

  onJoin (client: Client, options: any) {
    console.log(client.sessionId, "joined!");

    const player = new Player(); // Create a new player

    this.state.players.set(client.sessionId, player); // Add the player to the players map
  }

  onLeave (client: Client, consented: boolean) {
    console.log(client.sessionId, "left!");
    
    this.state.players.delete(client.sessionId); // Remove the player from the players map
  }

  onDispose() {
    console.log("room: ", this.roomId, "disposing...");
  }

}
