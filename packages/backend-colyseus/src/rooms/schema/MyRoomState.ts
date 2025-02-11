import { Schema, type, MapSchema } from "@colyseus/schema";

// References
// https://doc.babylonjs.com/guidedLearning/networking/Colyseus#room-state-and-schema

export class Player extends Schema {
  @type("number") x: number = 0;
  @type("number") y: number = 0;
  @type("number") z: number = 0;
}

export class MyRoomState extends Schema {
  @type({ map: Player }) players = new MapSchema<Player>(); // Players are stored in a map
  
  @type("string") mySynchronizedProperty: string = "Hello world";
}
