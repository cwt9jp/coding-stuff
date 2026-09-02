import Phaser from "phaser";

/**
 * Player is 12 wide and 24 tall
 */
class Player extends Phaser.GameObjects.Rectangle {
    constructor(scene, x, y) {
        super(scene, x, y, 12, 24, 0x00ff00);
        this.setOrigin(0.5, 1);
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        this.body.collideWorldBounds = true;
        this.setScale(1);

        this.body.setSize(12, 8);
        this.body.setOffset(0, 16);
        this.body.setMass(5);

        this.canMove = true;
        this.canDash = true;
        this.hittable = false;

        /**
         * @type {{up: Phaser.Input.Keyboard.Key, left: Phaser.Input.Keyboard.Key, down: Phaser.Input.Keyboard.Key, right: Phaser.Input.Keyboard.Key, dash: Phaser.Input.Keyboard.Key}}
         */
        this.movementKeys = this.scene.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            right: Phaser.Input.Keyboard.KeyCodes.D,
            dash: Phaser.Input.Keyboard.KeyCodes.SHIFT
        });

    }

    /**
     * Updates player velocity based on inputs
     */
    updateVelocityFromKeyPress() {
        if (!this.canMove) {
            return;
        }

        // Normal movement
        if (this.movementKeys.left.isDown & !this.movementKeys.right.isDown) {
            this.body.setVelocityX(-50);
        } else if (this.movementKeys.right.isDown & !this.movementKeys.left.isDown) {
            this.body.setVelocityX(50);
        } else {
            this.body.setVelocityX(0);
        }

        if (this.movementKeys.up.isDown & !this.movementKeys.down.isDown) {
            this.body.setVelocityY(-50);
        } else if (this.movementKeys.down.isDown & !this.movementKeys.up.isDown) {
            this.body.setVelocityY(50);
        } else {
            this.body.setVelocityY(0);
        }

        // Dashing
        if (this.movementKeys.dash.isDown) {
            if (this.canDash) {
                this.canMove = false;
                this.canDash = false;

                this.body.velocity.x *= 8;
                this.body.velocity.y *= 8;

                this.scene.tweens.add({
                    targets: this.body.velocity,
                    x: 0,
                    y: 0,

                    ease: "Cubic.easeOut",
                    duration: 300,
                    repeat: 0,
                    yoyo: false,

                    completeDelay: 0,
                    onComplete: () => {
                        this.canMove = true;
                    }
                });
            }
        } else if (this.canMove) {
            this.canDash = true;
        }
        
    }

    updateDepth() {
        this.setDepth(this.y);
    }

    /**
     * Initiate attack on enemies depending on pointer
     */
    attack(pointer) {

        const pointerD = {
            x: pointer.x - this.x,
            y: pointer.y - this.y
        };

        // Note that d.r is not necessary but could be later for different weapons
        // pointerD.r = Math.sqrt(pointerD.x * pointerD.x + pointerD.y * pointerD.y);
        pointerD.theta = Math.atan2(pointerD.y, pointerD.x);

        // Use overlapCirc to find enemies to hit
        let overlappingBodies = this.scene.physics.overlapRect(this.x - 15, this.y - 15, 30, 30);

        overlappingBodies.forEach((body) => {
            if (body.gameObject.hittable) {
                const d = {
                    x: body.x - this.x,
                    y: body.y - this.y
                }
                d.theta = Math.atan2(body.y - this.y, body.x - this.x);

                if (Math.abs(d.theta - pointerD.theta) < Math.PI / 4) {
                    body.gameObject.attacked(d.theta); // TODO: Damage
                } else if (d.x * d.x + d.y * d.y < 100) {
                    body.gameObject.attacked(pointerD.theta);
                }
            }
        });
    }
}

export default Player;