import Floor1 from "../floor_generation/floor_1/Floor1.js"
import Room from "../floor_generation/floor_1/Room.js"
import Player from "../objects/player.js"
import Phaser from "phaser";

export class Map extends Phaser.Scene {

    constructor() {
        super('Map');
    }

    preload() {
        this.load.image("tiles", "assets/tileset.png")
        this.load.spritesheet("tile_sprites", "assets/tileset.png", { frameWidth: 16, frameHeight: 16 });
    }

    create() {
        this.floor = new Floor1(this, 24, 5, [4, 3, 2, 1, 1]).generate();
        this.physics.world.setBounds(this.floor.getFloorBoundingBox().u * 16, this.floor.getFloorBoundingBox().v * 16, this.floor.getFloorBoundingBox().width * 16, this.floor.getFloorBoundingBox().height * 16);

        // Player
        this.player = new Player(this, this.center_width, this.center_height);

        this.physics.add.collider(this.player, this.floor.wallSprites);

        this.input.on("pointerdown", (pointer) => {
            // console.log(floor.rooms[0].pointInRoom({ u: Math.floor(pointer.worldX / 16), v: Math.floor(pointer.worldY / 16) }));
            console.log(Math.floor(pointer.worldX), Math.floor(pointer.worldY));
        });

        // this.cameras.main.centerOn(0, 0);

        // let pointerX, pointerY;
        // let cameraX, cameraY;
        // let pointerPressed = false;
        // this.input.on("pointerdown", (pointer) => {
        //     pointerPressed = true;
        //     pointerX = pointer.x
        //     pointerY = pointer.y;
        //     cameraX = this.cameras.main.scrollX;
        //     cameraY = this.cameras.main.scrollY;
        // });

        // this.input.on("pointermove", (pointer) => {
        //     if (pointerPressed) {
        //         this.cameras.main.scrollX = cameraX + (pointerX - pointer.x);
        //         this.cameras.main.scrollY = cameraY + (pointerY - pointer.y);
        //     }
        // });

        // this.input.on("pointerup", () => {
        //     pointerPressed = false;
        // });
    }

    update() {
        // Move player
        this.cameras.main.centerOn(Math.round(this.player.x), Math.round(this.player.y));
        this.player.updateVelocityFromKeyPress();
        this.player.updateDepth();
    }
    
}