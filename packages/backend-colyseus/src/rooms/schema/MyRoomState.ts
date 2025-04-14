import { Schema, type, MapSchema, ArraySchema } from "@colyseus/schema";

// References
// https://doc.babylonjs.com/guidedLearning/networking/Colyseus#room-state-and-schema

export class Player extends Schema {
  @type("number") x: number = 0;
  @type("number") y: number = 0;
  @type("number") z: number = 0;
  @type("number") rotationY: number = 0;
}

export class Map extends Schema {
  @type(["number"]) data = new ArraySchema<number>();
  @type("number") width: number = 0;
  @type("number") height: number = 0;
  @type(["number"]) fogColor: number[] = [0, 0, 0];
  @type("number") fogDensity: number = 0;
}

export class MyRoomState extends Schema {
  @type({ map: Player }) players = new MapSchema<Player>();
  @type(Map) map = new Map(); // Single shared map
  @type("string") hostId: string = ""; // Track host client ID
}
