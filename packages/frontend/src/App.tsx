import "./App.css";
import { FreeCamera, Vector3, HemisphericLight, MeshBuilder } from "@babylonjs/core";
import SceneComponent from "./SceneComponent";
import CreateBasicScene from "./BasicScene";

export default () => (
  <div>
    {/* <SceneComponent antialias onSceneReady={onSceneReady} onRender={onRender} id="my-canvas" /> */}
    <CreateBasicScene />
  </div>
);