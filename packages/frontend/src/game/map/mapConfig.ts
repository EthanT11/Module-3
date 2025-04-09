import { Vector3, Color3 } from "@babylonjs/core";

// current assetFolder names:
// mossy_brick
// lichen_rock
// rocky_terrain

export const MAP_CONFIG = {
    LIGHT_CONFIG: {
        intensity: 0.8,
        position: new Vector3(0, 20, 0),
    },

    FOG_CONFIG: {
        color: new Color3(0.5, 0.5, 0.5),
        density: 0.02,
    },

    GROUND_CONFIG: {
        assetFolder: "lichen_rock",
        uvScale: 10,
        height: 100,
        width: 100,
        yOffset: 1.1,
    },  

    // Individual Wall Config
    WALL_CONFIG: {
        assetFolder: "mossy_brick",
        uvScale: 4,
        height: 10,
    },

    PILLAR_CONFIG: {
        assetFolder: "lichen_rock",
        uvScale: 4,
        height: 10,
    },
        
}
