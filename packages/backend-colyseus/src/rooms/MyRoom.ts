import { Room, Client } from "@colyseus/core";
import { MyRoomState, Player } from "./schema/MyRoomState";

export class MyRoom extends Room<MyRoomState> {
  maxClients = 4;

  onCreate (options: any) {
    this.setState(new MyRoomState());

    this.onMessage("type", (client, message) => {
      //
      // handle "type" message
      //
    });
  }

  onJoin (client: Client, options: any) {
    console.log(client.sessionId, "joined!");

    const player = new Player(); // Create a new player

    player.x = Math.random() * 100;
    player.y = 10;
    player.z = Math.random() * 100;

    this.state.players.set(client.sessionId, player); // Add the player to the players map
  }

  onLeave (client: Client, consented: boolean) {
    console.log(client.sessionId, "left!");
    
    this.state.players.delete(client.sessionId); // Remove the player from the players map
  }

  onDispose() {
    console.log("room", this.roomId, "disposing...");
  }

}
