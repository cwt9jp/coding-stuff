import Player from "../objects/player.js"
import Goblin from "../objects/goblin.js"

export class Start extends Phaser.Scene {

    constructor() {
        super('Start');
    }

    preload() {
        this.load.image('background', 'assets/stone-tiles.png');
    }

    create() {
        this.width = this.sys.game.config.width;
        this.height = this.sys.game.config.height;
        this.center_width = this.width / 2;
        this.center_height = this.height / 2;
        
        this.movementKeys = this.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            right: Phaser.Input.Keyboard.KeyCodes.D,
            dash: Phaser.Input.Keyboard.KeyCodes.SHIFT
        });

        this.background = this.add.tileSprite(120, 69, 240, 138, 'background');

        this.player = new Player(this, this.center_width, this.center_height);
        this.enemies = this.add.group();
        for (let i = -1; i < 2; i++) {
            this.enemies.add(new Goblin(this, this.center_width + 50, this.center_height + 30 * i), true);
        }

        this.physics.add.collider(this.enemies, this.enemies);

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
