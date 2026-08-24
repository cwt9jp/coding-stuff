import Phaser from "phaser";
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
        this.hittable = true;
        this.hp = 30;
        this.dying = false;

        this.body.setSize(12, 6);
        this.body.setOffset(0, 6);

        this.color = Phaser.Display.Color.IntegerToRGB(this.fillColor); // Container for original color: TEMP
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

            if (normFactor < 1 / 5) {
                return;
            }

            this.body.setVelocityX(deltaX / normFactor);
            this.body.setVelocityY(deltaY / normFactor);
        }
    }

    /**
     * Function called when object is attacked
     */
    attacked(dTheta) {
        this.canMove = false;
        this.body.setVelocity(200 * Math.cos(dTheta), 200 * Math.sin(dTheta));

        // Tween for knock-back
        this.scene.tweens.add({
            targets: this.body.velocity,
            x: 0,
            y: 0,

            ease: "Cubic.easeOut",
            duration: 500,
            repeat: 0,
            yoyo: false,

            completeDelay: 0,
            onComplete: () => {
                if (this.dying && !this.scene.tweens.isTweening(this)) {
                    this.dead();
                    return;
                }
                this.canMove = true;
            }
        });

        // Tween for color
        this.scene.tweens.addCounter({
            from: 0,
            to: 1,
            duration: 500,
            onUpdate: (tween) => {
                const weight = tween.getValue();
                this.setFillStyle(Phaser.Display.Color.GetColor((1 - weight) * 255 + weight * this.color.r, weight * this.color.g, weight * this.color.b));
            },
            onComplete: () => {
                if (this.dying && !this.scene.tweens.isTweening(this)) {
                    this.dead();
                    return;
                }
            }
        });

        this.updateHealth(-10);
    }

    /**
     * Use to update health. Kills gameObject when health is below zero
     */
    updateHealth(dHP) {
        this.hp += dHP;

        if (this.hp <= 0) {
            this.dying = true;
        }
    }

    /**
     * Call when object is dead
     */
    dead() {
        this.hp = 0;
        this.canMove = false;
        this.hittable = false;
        this.setFillStyle(0);

        this.body.setVelocity(0);
        this.body.drag.x = 5000;
        this.body.drag.y = 5000;
    }
}

export default Goblin;