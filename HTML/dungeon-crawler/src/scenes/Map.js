import Floor1 from "../floor_generation/floor_1/Floor1.js"
import Room from "../floor_generation/floor_1/Room.js"
import Phaser from "phaser";

export class Map extends Phaser.Scene {

    constructor() {
        super('Map');
    }

    preload() {
        this.load.image("tiles", "assets/tilemap.png")
    }

    create() {
        const floor = new Floor1(this, 24, 5, [4, 3, 2, 1, 1]).generate();
        this.input.on("pointerdown", (pointer) => {
            console.log(Math.floor(pointer.worldX), Math.floor(pointer.worldY));
        });

        this.cameras.main.centerOn(0, 0);
    }

    update() {

    }
    
}