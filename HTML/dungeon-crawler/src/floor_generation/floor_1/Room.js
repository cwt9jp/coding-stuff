/**
 * Class handles Room generation, overlap, and handling all interactions
 * within their area.
 */
class Room {

    /**
     * Create a new Room. Note that the x and y coordinates, along with the side, determine
     * how the room is generated. For example, if the side index is 0, the x and y coordinates
     * are the midpoint of the bottom side of the room. This is to make generating rooms that are
     * adjacent to one another easy.
     * @param {Phaser.Scene} scene The sceen this room will be in
     * @param {number} x The x-position of the entrance to the room
     * @param {number} y The y-position of the entrance to the room
     * @param {number} width The width of the room
     * @param {number} height The height of the room
     * @param {0 | 1 | 2 | 3} side The side of the room that this room will be generating next to. 0 - top, 1 - right, 2 - bottom, 3 - left
     * @param {0 | 1 | 2 | 3 | 4 | 5 | 6} type The type of room this will be. 0 - passive, 1 - chest, 2 - puzzle, 3 - fort, 4 - aggressive, 5 - exit, 6 - entrance
     */
    constructor(scene, x, y, width, height, side, type) {

        /**
         * The bounds of the room
         * @type {Array<{ x: number, y: number }>} 
         */
        this.bounds = [];
        
        // Determine bounds based on the side that the room is generating adjacent to
        switch (side) {
            case 0:
                this.bounds = [{x: Math.trunc(x - (width - 1) / 2), y: Math.trunc(y - (height - 1))}, {x: Math.trunc(x + (width - 1) / 2), y: Math.trunc(y - (height - 1))}, {x: Math.trunc(x + (width - 1) / 2), y: y}, {x: Math.trunc(x - (width - 1) / 2), y: y}];
                break;
            case 1:
                this.bounds = [{x: x, y: Math.trunc(y - (height- 1) / 2)}, {x: Math.trunc(x + (width - 1)), y: Math.trunc(y - (height- 1) / 2)}, {x: Math.trunc(x + (width - 1)), y: Math.trunc(y + (height - 1) / 2)}, {x: x, y: Math.trunc(y + (height - 1) / 2)}];
                break;
            case 2:
                this.bounds = [{x: Math.trunc(x - (width - 1) / 2), y: y}, {x: Math.trunc(x + (width - 1) / 2), y: y}, {x: Math.trunc(x + (width - 1) / 2), y: Math.trunc(y + (height - 1))}, {x: Math.trunc(x - (width - 1) / 2), y: Math.trunc(y + (height- 1))}];
                break;
            case 3:
                this.bounds = [{x: Math.trunc(x - (width - 1)), y: Math.trunc(y - (height - 1) / 2)}, {x: x, y: Math.trunc(y - (height - 1) / 2)}, {x: x, y: Math.trunc(y + (height - 1) / 2)}, {x: Math.trunc(x - (width - 1)), y: Math.trunc(y + (height - 1) / 2)}];
                break;
            default:
                throw new Error(`Side index ${side} is not between 0-3`);
        }

        /**
         * The bounding box of the room, which the room will never be outside of.
         */
        this.boundingBox = {
            xMin: this.bounds[0].x,
            yMin: this.bounds[0].y,
            xMax: this.bounds[2].x,
            yMax: this.bounds[2].y
        };

        /**
         * The width of the room's bounding box
         */
        this.width = width;

        /**
         * The height of the room's bounding box
         */
        this.height = height;

        /**
         * The scene the room is in
         */
        this.scene = scene;

        /**
         * The type of this room. 0 - passive, 1 - chest, 2 - puzzle, 3 - fort, 4 - aggressive, 5 - exit, 6 - entrance
         */
        this.type = type;

        /**
         * Whether the room already has an area removed
         */
        this.boundsModified = false;

        /**
         * The x-coordinate of the top-left corner of the room
         */
        this.x = this.bounds[0].x;

        /**
         * The y-coordinate of the top-left corner of the room
         */
        this.y = this.bounds[0].y;
    }

    /**
     * Callback function that takes in the two corners of a side
     * @callback sideCallback
     * @param {{ x: number, y: number }} point1 One vertex of the side
     * @param {{ x: number, y: number }} point2 The other vertex of the side
     * @param {number} index The index of the side
     */

    /**
     * Modifies room bounds to exclude the given area
     * @param {{ x: number, y: number }} point The point relative to the top-left corner of the room that will be the new vertex of the bounds
     * @param {number} direction The direction in which the area will be removed. 0 - top left, 1 - top right, 2 - bottom right, 3 - bottom left
     */
    removeArea(point, direction) {
        if (point.x <= 0 || point.x >= this.width || point.x <= 0 || point.y >= this.height) {
            throw new Error(`Point ${point} is not in the room.`);
        }

        point.x += this.x;
        point.y += this.y;

        switch (direction) {
            case 0:
                this.bounds.push({x: this.bounds[direction].x, y: point.y}, point);
                this.bounds[0].x = point.x;
                break;
            case 1:
            case 3:
                this.bounds = this.bounds.slice(0, direction).concat(
                    {x: point.x, y: this.bounds[direction].y},
                    point,
                    {x: this.bounds[direction].x, y: point.y})
                    .concat(this.bounds.slice(direction + 1, this.bounds.length));
                break;
            case 2:
                this.bounds = this.bounds.slice(0, direction).concat(
                    {x: this.bounds[direction].x, y: point.y},
                    point,
                    {x: point.x, y: this.bounds[direction].y})
                    .concat(this.bounds.slice(direction + 1, this.bounds.length));
                break;
        }

        this.boundsModified = true;
        return this;
    }

    /**
     * Checks if another room is overlapping this one. Returns true if the room does overlap with this one
     * @param {Room} room Room to check overlap with
     */
    checkOverlap(room) {
        // First check bounding box
        if (
            this.boundingBox.xMin > room.boundingBox.xMax 
            || room.boundingBox.xMin > this.boundingBox.xMax
            || this.boundingBox.yMin > room.boundingBox.yMax
            || room.boundingBox.yMin > this.boundingBox.yMax
        ) {
            return false;
        } else if (!this.boundsModified && !room.boundsModified) {
            return true;
        }
        
        // Next check bounds
        let overlapping = false;

        for (let i = 0; i < room.bounds.length; i++) {
            if (this.pointInRoom(room.bounds[i])) {
                overlapping = true;
                break;
            }
        }
        
        if (overlapping === true) {
            return true;
        }

        // Finally, check all boundary points
        for (let i = 0; i < this.bounds.length; i++) {
            const NEXT_INDEX = (i + 1) % this.bounds.length;
            const point1 = this.bounds[i];
            const point2 = this.bounds[NEXT_INDEX];

            switch (i % 2) {
                case 0:
                    for (let x = point1.x + 1; x < point2.x; x++) {
                        
                    }
            }
        }     
    }


    /**
     * Naive check if a given point is within the bounds of the room.
     * Note that the point has to be within the room, not on the boundary.
     * @param {{x: number, y: number}} point Point to check
     * @param {number} direction Leave unset.
     * @returns {boolean}
     */
    pointInRoom(point, direction = -2) {
        // We will use the horizontal line test to determine the point's location
        // Odd intersections with room - inside, Even - outside
        let count = 0;
        const SIGN = Math.sign(direction);

        const tryNext = () => {
            if (direction != 1) {
                return this.pointInRoom(point, direction + 1);
            } else {
                throw new Error("Unable to determine whether point is in room. Make sure the room is not too complicated");
            }
        }

        switch (Math.abs(direction)) {
            case 1: 
                for (let i = 0; i < this.bounds.length; i++) {
                    const NEXT_INDEX = (i + 1) % this.bounds.length;
                    const point1 = this.bounds[i];
                    const point2 = this.bounds[NEXT_INDEX];

                    if (i % 2 === 0) { // Note pattern in bounds: 2nth pair horizontal, 2n+1th pair vertical
                        if (point1.y !== point.y) {
                            continue;
                        } else if ((point1.x < point.x) === (point.x < point2.x)) {
                            return false;
                        } else {
                            return tryNext();
                        }
                    } else {
                        if (SIGN * point1.x < SIGN * point.x) {
                            continue;
                        } else if ((point1.y < point.y) === (point.y < point2.y)) {
                            if (point1.x === point.x) {
                                return false;
                            } else {
                                count++;
                                continue;
                            }
                        }
                    }
                };
                break;
            case 2:
                for (let i = 0; i < this.bounds.length; i++) {
                    const NEXT_INDEX = (i + 1) % this.bounds.length;
                    const point1 = this.bounds[i];
                    const point2 = this.bounds[NEXT_INDEX];

                    if (i % 2 === 1) { // Note pattern in bounds: 2nth pair horizontal, 2n+1th pair vertical
                        if (point1.x !== point.x) {
                            continue;
                        } else if ((point1.y < point.y) === (point.y < point2.y)) {
                            return false;
                        } else {
                            return tryNext();
                        }
                    } else {
                        if (SIGN * point1.y < SIGN * point.y) {
                            continue;
                        } else if ((point1.x < point.x) === (point.x < point2.x)) {
                            if (point1.y === point.y) {
                                return false;
                            } else {
                                count++;
                                continue;
                            }
                        }
                    }
                };
                break;
            }
        
        return count % 2 === 1;
    }

    /**
     * Iterate over each side of the room.
     * @param {sideCallback} callback Function that each side will be passed into.
     */
    forEachSide(callback) {
        for (let i = 0; i < this.bounds.length; i++) {
            const NEXT_INDEX = (i + 1) % this.bounds.length;
            callback(this.bounds[i], this.bounds[NEXT_INDEX], i);
        }
    }

    /**
     * Gets the outward direction with respect to the given side.
     * @param {number} index The index of the side whose direction will be checked.
     */
    sideDirection(index) {
        if (index >= this.bounds.length) {
            throw new Error("Index is higher than amount of sides");
        }
        
        const side = [this.bounds[index], this.bounds[(index + 1) % this.bounds.length]];
        switch (index % 2) {
            case 0:
                if (this.pointInRoom({ x: (side[0].x + side[1].x) / 2, y: side[0].y + 1 })) {
                    return 0;
                } else return 2;
            case 1:
                if (this.pointInRoom({ x: side[0].x + 1, y: (side[0].x + side[1].x) / 2 })) {
                    return 3;
                } else return 1;
        }
    }

    /**
     * Renders room to the screen. TODO: tilemap
     */
    render() {
        // Right now this is very naive.
        this.forEachSide((point1, point2, index) => {
            if (index % 2 === 0) {
                this.scene.add.rectangle((point1.x + point2.x) / 2 + 1, point1.y, Math.abs(point2.x - point1.x) + 1, 1, 0x000000);
            } else {
                this.scene.add.rectangle(point1.x + 1, (point1.y + point2.y) / 2, 1, Math.abs(point2.y - point1.y) + 1, 0x000000);
            }
        });
    }
}

export default Room;