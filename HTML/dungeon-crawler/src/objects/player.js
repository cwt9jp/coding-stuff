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

        // Add player hitbox for collision with objects
        this.hitbox = this.scene.add.rectangle(0, 0, 6, 12);
        
        this.hitbox.setOrigin(0.5, 0.5);
        this.scene.physics.add.existing(this.hitbox);
        

        this.canMove = true;
        this.canDash = true;
    }

    /**
     * Updates player velocity based on inputs
     */
    updateVelocityFromKeyPress(keys) {
        if (!this.canMove) {
            return;
        }

        // Normal movement
        if (keys.left.isDown & !keys.right.isDown) {
            this.body.setVelocityX(-50);
        } else if (keys.right.isDown & !keys.left.isDown) {
            this.body.setVelocityX(50);
        } else {
            this.body.setVelocityX(0);
        }

        if (keys.up.isDown & !keys.down.isDown) {
            this.body.setVelocityY(-50);
        } else if (keys.down.isDown & !keys.up.isDown) {
            this.body.setVelocityY(50);
        } else {
            this.body.setVelocityY(0);
        }

        // Dashing
        if (keys.dash.isDown) {
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
}

export default Player;