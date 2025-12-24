/**
 * Class handles Room generation, overlap, and handling all interactions
 * within their area.
 */
class Room {

    /**
     * Note that the x and y coordinates, along with the side, determine how the room
     * is generated. For example, if the side index is 0, the x and y coordinates are the
     * midpoint of the bottom side of the room. This is to make generating rooms that are
     * adjacent to one another easy.
     * @param {number} x The x-position of the entrance to the room
     * @param {number} y The y-position of the entrance to the room
     * @param {number} width The width of the room
     * @param {number} height The height of the room
     * @param {number} side The side of the room that this room will be generating next to. 0 - top, 1 - right, 2 - bottom, 3 - left
     * @param {number} type The type of room this will be. 0 - entrance, 1 - passive, 2 - chest, 3 - puzzle, 4 - fort, 5 - aggressive, 6 - exit
     */
    constructor(x, y, width, height, side, type) {

        /**
         * The bounds of the room
         * @type {Array<{ x: number, y: number }>} 
         */
        this.bounds = [];

        /**
         * The type of this room. 0 - entrance, 1 - passive, 2 - chest, 3 - puzzle, 4 - fort, 5 - aggressive, 6 - exit
         */
        this.type = type;

        // Determine bounds based on the side that the room is generating adjacent to
        switch (side) {
            case 0:
                this.bounds = [{x: x - width / 2, y: y - height}, {x: x + width / 2, y: y - height}, {x: x + width / 2, y: y}, {x: x - width / 2, y: y}];
                break;
            case 1:
                this.bounds = [{x: x, y: y - height / 2}, {x: x + width, y: y - height / 2}, {x: x + width, y: y + height / 2}, {x: x, y: y + height / 2}];
                break;
            case 2:
                this.bounds = [{x: x - width / 2, y: y}, {x: x + width / 2, y: y}, {x: x + width / 2, y: y + height}, {x: x - width / 2, y: y + height}];
                break;
            case 3:
                this.bounds = [{x: x - width, y: y - height / 2}, {x: x, y: y - height / 2}, {x: x, y: y + height / 2}, {x: x - width, y: y + height / 2}];
                break;
            default:
                throw new Error(`Side index ${side} is not between 0-3`);
        }

        console.log(this.bounds);
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
     * @param {Array<{ x: number, y: number }>} bounds The bounds of the area to remove
     */
    removeOverlap(bounds) {
        return this;
    }

    /**
     * Naive check if a given point is within the bounds of the room.
     * Note that the point has to be within the room, not on the boundary.
     * @param {{x: number, y: number}} point Point to check
     * @param {number} direction Leave unset.
     * @returns {boolean}
     */
    pointInRoom(point, direction = 2) {
        // We will use the horizontal line test to determine the point's location
        // Odd intersections with room - inside, Even - outside
        let crossedParallelLine = false;
        let count = 0;
        const SIGN = Math.sign(direction);

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
                            crossedParallelLine = true;
                            continue;
                        }
                    } else {
                        if (SIGN * point1.x < SIGN * point.x) {
                            continue;
                        } else if (SIGN * point.x === SIGN * point.x) {
                            return false;
                        } else if ((point1.y <= point.y) === (point.y <= point2.y)) {
                            count++;
                            continue;
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
                            crossedParallelLine = true;
                            continue;
                        }
                    } else {
                        if (SIGN * point1.y < SIGN * point.y) {
                            continue;
                        } else if ((point1.x <= point.x) === (point.x <= point2.x)) {
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
        

        if (crossedParallelLine && count === 0) {
            if (direction !== 2) {
                return this.pointInRoom(point, direction + 1);
            } else {
                throw new Error("Unable to determine whether point is in room. Make sure the room is not too complicated");
            }
        } else return count % 2 === 1;
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
     * Renders room to the screen. TODO: tilemap
     */
    render(scene) {
        // Right now this is very naive.
        this.forEachSide((point1, point2, index) => {
            if (index % 2 === 0) {
                scene.add.rectangle((point1.x + point2.x) / 2 + 1, point1.y, Math.abs(point2.x - point1.x) + 1, 1, 0x000000);
            } else {
                scene.add.rectangle(point1.x + 1, (point1.y + point2.y) / 2, 1, Math.abs(point2.y - point1.y) + 1, 0x000000);
            }
        });
    }
}

export default Room;