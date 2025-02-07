import { Schema, type, MapSchema } from "@colyseus/schema";

// References
// https://doc.babylonjs.com/guidedLearning/networking/Colyseus#room-state-and-schema

export class Player extends Schema {
  @type("number") x: number;
  @type("number") y: number;
  @type("number") z: number;
}

export class MyRoomState extends Schema {
  @type({ map: Player }) players = new MapSchema<Player>(); // Players are stored in a map
  
  @type("string") mySynchronizedProperty: string = "Hello world";
}
