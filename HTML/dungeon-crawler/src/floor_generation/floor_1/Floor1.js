import Room from "./Room.js";
import Phaser from "phaser";

/**
 * Class for generating and handling all Floor 1 (The Basement / Foyer) activities
 */
class Floor1 {
    
    /**
     * Create the first floor dungeon. Will not generate until generate() is called
     * @param {Phaser.Scene} scene The Floor 1 scene. TODO: Update type so it is the right scene
     * @param {number} roomNumber The amount of rooms this floor will attempt to generate. May be lower than intended, especially for higher amounts
     * @param {number} difficulty Scale from 1-10 on how difficult this floor should be.
     * @param {number[]} roomWeights Array of weights that determine the likelihood of a room a specific type. Should be 5 long (aggressive, fort, passive, puzzle, chest)
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
         * Array of probabilities that each room type will spawn (0 - aggressive, 1 - fort, 2 - passive, 3 - puzzle, 4 - chest)
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
            0,
            0,
            Phaser.Math.RND.between(7, 9),
            Phaser.Math.RND.between(7, 9),
            Phaser.Math.RND.between(0, 3), 6)
        );

        if (Phaser.Math.RND.between(1, 3) === 1) {
            this.rooms[0].removeArea({
                    u: Math.floor(this.rooms[0].width / 2),
                    v: Math.floor(this.rooms[0].height / 2)
            }, Phaser.Math.RND.between(0, 3));
        }
        
        // Generation loop
        for (let i = 0; i < this.roomNumber - 1; i++) {
            for (let j = 0; j < 5 * i + 1; j++) {
                // Random room
                const adjacentRoom = Phaser.Math.RND.pick(this.rooms);
                // Random side index
                const sideIndex = Phaser.Math.RND.between(0, adjacentRoom.bounds.length - 1);
                // Random side
                const side = [adjacentRoom.bounds[sideIndex], adjacentRoom.bounds[(sideIndex + 1) % adjacentRoom.bounds.length]];

                const potentialRoom = new Room(
                    this.scene,
                        Phaser.Math.RND.between(side[0].u, side[1].u),
                        Phaser.Math.RND.between(side[0].v, side[1].v),
                    Phaser.Math.RND.weightedPick([10, 11, 12, 13, 14, 15, 16, 17, 18]),
                    Phaser.Math.RND.weightedPick([10, 11, 12, 13, 14, 15, 16, 17, 18]),
                    adjacentRoom.sideDirection(sideIndex),
                    0 // Doesn't make sense to set the type if room may not be generated, so just set it to 0 for now
                );

                // Make room L-shaped
                if (Phaser.Math.RND.between(1, 3) === 1) {
                    potentialRoom.removeArea({
                        u: Phaser.Math.RND.between(5, potentialRoom.width - 5),
                        v: Phaser.Math.RND.between(3, potentialRoom.height - 5)
                    }, Phaser.Math.RND.pick([potentialRoom.direction, (potentialRoom.direction + 1) % potentialRoom.bounds.length]))
                }

                if (!this.checkPotentialOverlap(potentialRoom)) {
                    potentialRoom.type = this.randomWeightedPick([0, 1, 2, 3, 4], this.roomWeights);
                    this.rooms.push(potentialRoom);
                    break;
                } else continue;
            }
        }
        
        // Last two rooms - fort and exit
        this.rooms.at(-2).type = 3;
        this.rooms.at(-1).type = 5;

        this.render();

        console.log(this); // debug
        return this;
    }

    /**
     * Renders the floor. Called in generate() after all rooms are generated.
     */
    render() {
        const floorBoundingBox = this.getFloorBoundingBox();

        this.map = this.scene.make.tilemap({ tileWidth: 16, tileHeight: 16, width: floorBoundingBox.width, height: floorBoundingBox.height });
        this.tiles = this.map.addTilesetImage('tiles');

        this.groundLayer = this.map.createBlankLayer("Ground Layer", this.tiles, floorBoundingBox.u * 16, floorBoundingBox.v * 16);
        this.groundLayer.fill(16);

        this.rooms.forEach((room) => {
            room.render();
        })
    }

    // /**
    //  * Generates a random integer point within the bounds.
    //  * @param {number} u1 Lowest u-value
    //  * @param {number} u2 Highest u-value
    //  * @param {number} v1 Lowest v-value
    //  * @param {number} v2 Highest v-value
    //  */
    // randomPoint(u1, u2, v1, v2) {
    //     return {
    //         u: Phaser.Math.RND.between(u1, u2),
    //         v: Phaser.Math.RND.between(v1, v2)
    //     }
    // }

    /**
     * Picks a random element from an array based on weighted probabilities.
     * 
     * @param {T[]} array 
     * @param {number[]} weights 
     * 
     * @returns {T} A random element from the array, chosen based on the provided weights.
     */
    randomWeightedPick(array, weights) {
        if (array.length !== weights.length) {
            throw new Error("Array and weights must have the same length.");
        }

        const totalWeight = weights.reduce((acc, weight) => acc + weight, 0);
        const randomValue = Phaser.Math.RND.between(0, totalWeight - 1);
        let cumulativeWeight = 0;

        for (let i = 0; i < array.length; i++) {
            cumulativeWeight += weights[i];
            if (randomValue < cumulativeWeight) {
                return array[i];
            }
        }
    }
    
    /**
     * Checks if a potential room overlaps with other rooms on the floor.
     * @param {Room} potentialRoom The room to check overlap with.
     */
    checkPotentialOverlap(potentialRoom) {
        for (let k = 0; k < this.rooms.length; k++) {
            if (this.rooms[k].checkOverlap(potentialRoom) || potentialRoom.checkOverlap(this.rooms[k])) {
                return true;
            }
        }

        return false;
    }

    /**
     * Gets the total bounding box (in tiles) of the floor based on the rooms generated.
    * @returns {{u: number, v: number, width: number, height: number}} The bounding box of the floor.
     */
    getFloorBoundingBox() {
        let minU = Infinity, minV = Infinity, maxU = -Infinity, maxV = -Infinity;

        this.rooms.forEach((room) => {
            const { u, v, width, height } = room;
            minU = Math.min(minU, u);
            minV = Math.min(minV, v);
            maxU = Math.max(maxU, u + width);
            maxV = Math.max(maxV, v + height);
        });

        return { u: minU, v: minV, width: maxU - minU, height: maxV - minV };
    }
}

export default Floor1;