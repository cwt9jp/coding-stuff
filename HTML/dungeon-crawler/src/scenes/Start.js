import Player from "../objects/player.js"
import Goblin from "../objects/goblin.js"

export class Start extends Phaser.Scene {

    constructor() {
        super('Start');
    }

    preload() {
        this.load.image('background', 'assets/stone-tiles.png');
        this.load.image("tiles", "assets/tilemap.png")
    }

    create() {
        this.width = this.sys.game.config.width;
        this.height = this.sys.game.config.height;
        this.center_width = this.width / 2;
        this.center_height = this.height / 2;

        // Tiles and tilemap
        this.map = this.make.tilemap({ tileWidth: 16, tileHeight: 16, width: this.width / 16 + 1, height: this.height / 16 + 1 });
        this.tiles = this.map.addTilesetImage('tiles');

        this.groundLayer = this.map.createBlankLayer("Ground Layer", this.tiles, -16, -17);

        this.groundLayer.weightedRandomize([
            { index: 11, weight: 42 },
            { index: 1, weight: 1 },
            { index: 2, weight: 1 },
            { index: 3, weight: 1 },
            { index: 4, weight: 1 },
            { index: 5, weight: 1 },
            { index: 6, weight: 1 },
            { index: 7, weight: 2 },
            { index: 8, weight: 2 },
            { index: 9, weight: 2 },
            { index: 10, weight: 2 },
        ], 1, 1, this.map.width, this.map.height);
        
        // Randomize rotation


        // Player
        this.player = new Player(this, this.center_width, this.center_height);

        this.movementKeys = this.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            right: Phaser.Input.Keyboard.KeyCodes.D,
            dash: Phaser.Input.Keyboard.KeyCodes.SHIFT
        });

        this.input.on("pointerdown", (pointer, _) => {
            this.player.attack(pointer, this.enemies);
        });

        // Enemies
        this.enemies = this.add.group();
        for (let i = -1; i < 2; i++) {
            this.enemies.add(new Goblin(this, this.center_width + 50, this.center_height + 30 * i), true);
        }

        this.physics.add.collider(this.enemies);
        this.physics.add.collider(this.player, this.enemies);

    }

    update() {
        // Move player
        this.player.updateVelocityFromKeyPress(this.movementKeys);
        this.player.updateDepth();

        // Move enemies
        this.enemies.getChildren().forEach((enemy) => {
            enemy.updateDepth();
            enemy.updateVelocity("aggressive", this.player);
        });
    }
    
}
