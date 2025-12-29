import Floor1 from "../floor_generation/floor_1/Floor1.js"
export class Map extends Phaser.Scene {

    constructor() {
        super('Map');
    }

    preload() {
        
    }

    create() {
        const floor = new Floor1(this, 12, 5, [1/6, 1/6, 1/6, 1/6, 1/6, 1/6]).generate();
        // this.input.on("pointerdown", (pointer) => {
        //     console.log(Math.trunc(pointer.worldX), Math.trunc(pointer.worldY));
        //     console.log(floor.rooms[0].pointInRoom({
        //         x: Math.trunc(pointer.worldX),
        //         y: Math.trunc(pointer.worldY)
        //     }))
        // });
    }

    update() {

    }
    
}