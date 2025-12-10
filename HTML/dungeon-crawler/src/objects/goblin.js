import Player from "./player.js"

/**
 * Goblin is 12 wide and 12 tall
 */
class Goblin extends Phaser.GameObjects.Rectangle {
    constructor(scene, x, y) {
        super(scene, x, y, 12, 12, Math.floor(Math.random() * 0xffffff));
        this.setOrigin(0.5, 1);
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        this.body.collideWorldBounds = true;
        this.setScale(1);
        this.canMove = true;
        this.body.setSize(6, 6, true);
    }

    updateDepth() {
        this.setDepth(this.y);
    }

    /**
     * Updates enemy velocity based on its state
     * 
     * @param {string} state - State of enemy (rest, patrol, aggressive)
     * @param {Player|null} player - Player object
     */
    updateVelocity(state, player = null) {
        if (!this.canMove) {
            return;
        }

        // TODO: Make pathfinding with easystar
        // For now, just run directly at player
        if (state === "aggressive") {
            let deltaX = player.x - this.x;
            let deltaY = player.y - this.y;
            let normFactor = Math.sqrt(deltaX * deltaX + deltaY * deltaY) / 40;
            this.body.setVelocityX(deltaX / normFactor);
            this.body.setVelocityY(deltaY / normFactor);
        }
    }
}

export default Goblin;