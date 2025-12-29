import Room from "./Room.js";

/**
 * Class for generating and handling all Floor 1 (The Basement / Foyer) activities
 */
class Floor1 {
    
    /**
     * Create the first floor dungeon. Will not generate until generate() is called
     * @param {Phaser.Scene} scene The Floor 1 scene. TODO: Update type so it is the right scene
     * @param {number} roomNumber The amount of rooms this floor will attempt to generate. May be lower than intended, especially for higher amounts
     * @param {number} difficulty Scale from 1-10 on how difficult this floor should be.
     * @param {number[]} roomWeights Array of weights that determine the likelihood of a room a specific type. Should be 6 long, all entries sum to 1
     */
    constructor(scene, roomNumber, difficulty, roomWeights) {
        /**
         * The Floor 1 scene
         */
        this.scene = scene;

        /**
         * The number of rooms that should be generated
         */
        this.roomNumber = roomNumber;

        /**
         * The difficulty of the floor (1-10)
         */
        this.difficulty = difficulty;

        /**
         * Array of probabilities that each room type will spawn (0 - passive, 1 - chest, 2 - puzzle, 3 - fort, 4 - aggressive, 5 - exit)
         */
        this.roomWeights = roomWeights;

        /**
         * Array of all rooms on the floor
         * @type {Room[]}
         */
        this.rooms = [];
    }

    /**
     * Generate all rooms, rendering them on the scene's tilemap and creating all relevant mobs
     */
    generate() {
        // First room
        this.rooms.push(new Room(
            this.scene,
            Phaser.Math.RND.between(28, 36),
            Phaser.Math.RND.between(28, 36),
            Phaser.Math.RND.between(7, 9),
            Phaser.Math.RND.between(7, 9),
            Phaser.Math.RND.between(0, 3), 6)
        );

        if (Phaser.Math.RND.between(1, 3) === 1) {
            this.rooms[0].removeArea({
                x: Math.trunc(this.rooms[0].width / 2),
                y: Math.trunc(this.rooms[0].height / 2)
            }, Phaser.Math.RND.between(0, 3));
        }
        
        // Generation loop
        for (let i = 0; i < this.roomNumber; i++) {
            for (let j = 0; j < 5 * i + 1; j++) {
                // Random room
                const adjacentRoom = Phaser.Math.RND.weightedPick(this.rooms);
                // Random side index
                const sideIndex = Phaser.Math.RND.between(0, adjacentRoom.bounds.length - 1);
                // Random side
                const side = [adjacentRoom.bounds[sideIndex], adjacentRoom.bounds[(sideIndex + 1) % adjacentRoom.bounds.length]];

                // Now decide whether the room will be L-shaped or not
                if (true) {
                    const potentialRoom = new Room(
                        this.scene,
                        Phaser.Math.RND.between(side[0].x, side[1].x),
                        Phaser.Math.RND.between(side[0].y, side[1].y),
                        Phaser.Math.RND.weightedPick([10, 11, 12, 13, 14, 15, 16, 17, 18]),
                        Phaser.Math.RND.weightedPick([10, 11, 12, 13, 14, 15, 16, 17, 18]),
                        adjacentRoom.sideDirection(sideIndex),
                        ((i) => {
                            if (i === this.roomNumber - 1) {
                                return 5;
                            } else {
                                return Phaser.Math.RND.weightedPick([4, 2, 0, 3, 1]);
                            }
                        })(i)
                    );

                    let overlapped = false;
                    for (let k = 0; k < this.rooms.length; k++) {
                        if (this.rooms[k].checkOverlap(potentialRoom) || potentialRoom.checkOverlap(this.rooms[k])) {
                            overlapped = true;
                            break;
                        }
                    }

                    if (overlapped) {
                        continue;
                    } else {
                        this.rooms.push(potentialRoom);
                        break;
                    }
                }
            }
        }
        
        this.rooms.forEach((room) => {
            room.render();
        })

        return this;
    }

    /**
     * Generates a random integer point within the bounds.
     * @param {number} x1 Lowest x-value
     * @param {number} x2 Highest x-value
     * @param {number} y1 Lowest y-value
     * @param {number} y2 Highest y-value
     */
    randomPoint(x1, x2, y1, y2) {
        return {
            x: Phaser.Math.RND.between(x1, x2),
            y: Phaser.Math.RND.between(y1, y2)
        }
    }
    
}

export default Floor1;