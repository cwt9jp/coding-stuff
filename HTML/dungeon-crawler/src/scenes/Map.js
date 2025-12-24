import Room from "../floor_generation/floor_1/Room.js";
export class Map extends Phaser.Scene {

    constructor() {
        super('Map');
    }

    preload() {
        
    }

    create() {
        const firstRoom = new Room(32, 32, 10, 10, 1, 0);
        firstRoom.render(this);

        this.input.on('pointerdown', (pointer) => {
            console.log(Math.trunc(pointer.worldX), Math.trunc(pointer.worldY));
            console.log(firstRoom.pointInRoom({
                x: Math.trunc(pointer.worldX),
                y: Math.trunc(pointer.worldY)
            }));
        })
    }

    update() {

    }
    
}