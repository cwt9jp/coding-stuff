import Phaser from "phaser";

/**
 * Class handles Room generation, overlap, and handling all interactions
 * within their area.
 */
class Room {

    /**
    * Create a new Room. Note that the u and v coordinates, along with the side, determine
    * how the room is generated. For example, if the side index is 0, the u and v coordinates
     * are the midpoint of the bottom side of the room. This is to make generating rooms that are
     * adjacent to one another easy.
     * @param {Phaser.Scene} scene The sceen this room will be in
     * @param {number} u The u-position of the entrance to the room
     * @param {number} v The v-position of the entrance to the room
     * @param {number} width The width of the room
     * @param {number} height The height of the room
     * @param {0 | 1 | 2 | 3} side The side of the room that this room will be generating next to. 0 - top, 1 - right, 2 - bottom, 3 - left
     * @param {-1 | 0 | 1 | 2 | 3 | 4 | 5 | 6} type The type of room this will be. -1 - threshold, 0 - aggressive, 1 - fort, 2 - passive, 3 - puzzle, 4 - chest, 5 - exit, 6 - entrance
     */
    constructor(scene, u, v, width, height, side, type) {

        /**
         * The bounds of the room
         * @type {Array<{ u: number, v: number }>} 
         */
        this.bounds = [];
        
        // Determine bounds based on the side that the room is generating adjacent to
        switch (side) {
            case 0:
                this.bounds = [{u: Math.floor(u - (width - 1) / 2), v: Math.floor(v - (height - 1))}, {u: Math.floor(u + (width - 1) / 2), v: Math.floor(v - (height - 1))}, {u: Math.floor(u + (width - 1) / 2), v: v}, {u: Math.floor(u - (width - 1) / 2), v: v}];
                break;
            case 1:
                this.bounds = [{u: u, v: Math.floor(v - (height- 1) / 2)}, {u: Math.floor(u + (width - 1)), v: Math.floor(v - (height- 1) / 2)}, {u: Math.floor(u + (width - 1)), v: Math.floor(v + (height - 1) / 2)}, {u: u, v: Math.floor(v + (height - 1) / 2)}];
                break;
            case 2:
                this.bounds = [{u: Math.floor(u - (width - 1) / 2), v: v}, {u: Math.floor(u + (width - 1) / 2), v: v}, {u: Math.floor(u + (width - 1) / 2), v: Math.floor(v + (height - 1))}, {u: Math.floor(u - (width - 1) / 2), v: Math.floor(v + (height- 1))}];
                break;
            case 3:
                this.bounds = [{u: Math.floor(u - (width - 1)), v: Math.floor(v - (height - 1) / 2)}, {u: u, v: Math.floor(v - (height - 1) / 2)}, {u: u, v: Math.floor(v + (height - 1) / 2)}, {u: Math.floor(u - (width - 1)), v: Math.floor(v + (height - 1) / 2)}];
                break;
            default:
                throw new Error(`Side index ${side} is not between 0-3`);
        }

        /**
         * The bounding box of the room, which the room will never be outside of.
         */
        this.boundingBox = {
            uMin: this.bounds[0].u,
            vMin: this.bounds[0].v,
            uMax: this.bounds[2].u,
            vMax: this.bounds[2].v
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
         * The direction the room faces (0 - top, 1 - right, 2 - bottom, 3 - left)
         */
        this.direction = side;

        /**
         * The scene the room is in
         */
        this.scene = scene;

        /**
         * The type of this room. -1 - threshold room, 0 - aggressive, 1 - fort, 2 - passive, 3 - puzzle, 4 - chest, 5 - exit, 6 - entrance
         */
        this.type = type;

        /**
         * Whether the room has an area removed
         */
        this.boundsModified = false;

        /**
         * The u-coordinate of the top-left corner of the room
         */
        this.u = this.bounds[0].u;

        /**
         * The v-coordinate of the top-left corner of the room
         */
        this.v = this.bounds[0].v;

        /**
         * The area inside the room, excluding the walls. If room is L-shaped, this will be an array of multiple areas.
         */
        this.insideArea = [{
            u: this.bounds[0].u + 1,
            v: this.bounds[0].v + 1,
            width: this.width - 2,
            height: this.height - 2
        }];
    }

    /**
     * Callback function that takes in the two corners of a side
     * @callback sideCallback
    * @param {{ u: number, v: number }} point1 One vertex of the side
    * @param {{ u: number, v: number }} point2 The other vertex of the side
     * @param {number} index The index of the side
     */

    /**
     * Modifies room bounds to exclude the given area
    * @param {{ u: number, v: number }} point The point relative to the top-left corner of the room that will be the new vertex of the bounds
     * @param {number} direction The direction in which the area will be removed. 0 - top left, 1 - top right, 2 - bottom right, 3 - bottom left
     */
    removeArea(point, direction) {
        if (point.u <= 0 || point.u >= this.width || point.u <= 0 || point.v >= this.height) {
            throw new Error(`Point ${point} is not in the room.`);
        }

        point.u += this.u;
        point.v += this.v;

        switch (direction) {
            case 0:
                this.bounds.push({u: this.bounds[direction].u, v: point.v}, point);
                this.bounds[0].u = point.u;

                this.insideArea = [
                    {
                        u: this.bounds[0].u + 1,
                        v: this.bounds[0].v + 1,
                        width: this.bounds[1].u - this.bounds[0].u - 1,
                        height: this.bounds[5].v - this.bounds[0].v
                    },
                    {
                        u: this.bounds[4].u + 1,
                        v: this.bounds[4].v + 1,
                        width: this.width - 2,
                        height: this.bounds[3].v - this.bounds[4].v - 1
                    }
                ];
                break;
            case 1:
                this.bounds = this.bounds.slice(0, direction).concat(
                    {u: point.u, v: this.bounds[direction].v},
                    point,
                    {u: this.bounds[direction].u, v: point.v})
                    .concat(this.bounds.slice(direction + 1, this.bounds.length));

                this.insideArea = [
                    {
                        u: this.bounds[0].u + 1,
                        v: this.bounds[0].v + 1,
                        width: this.bounds[1].u - this.bounds[0].u - 1,
                        height: this.height - 2
                    },
                    {
                        u: this.bounds[2].u,
                        v: this.bounds[2].v + 1,
                        width: this.bounds[3].u - this.bounds[2].u,
                        height: this.bounds[4].v - this.bounds[3].v - 1
                    }
                ];
                break;
            case 3:
                this.bounds = this.bounds.slice(0, direction).concat(
                    {u: point.u, v: this.bounds[direction].v},
                    point,
                    {u: this.bounds[direction].u, v: point.v})
                    .concat(this.bounds.slice(direction + 1, this.bounds.length));

                this.insideArea = [
                    {
                        u: this.bounds[0].u + 1,
                        v: this.bounds[0].v + 1,
                        width: this.bounds[1].u - this.bounds[0].u - 1,
                        height: this.bounds[5].v - this.bounds[0].v - 1
                    },
                    {
                        u: this.bounds[4].u + 1,
                        v: this.bounds[4].v,
                        width: this.bounds[2].u - this.bounds[3].u - 1,
                        height: this.bounds[3].v - this.bounds[4].v
                    }
                ];
                break;
            case 2:
                this.bounds = this.bounds.slice(0, direction).concat(
                    {u: this.bounds[direction].u, v: point.v},
                    point,
                    {u: point.u, v: this.bounds[direction].v})
                    .concat(this.bounds.slice(direction + 1, this.bounds.length));

                this.insideArea = [
                    {
                        u: this.bounds[0].u + 1,
                        v: this.bounds[0].v + 1,
                        width: this.width - 2,
                        height: this.bounds[2].v - this.bounds[1].v - 1
                    },
                    {
                        u: this.bounds[0].u + 1,
                        v: this.bounds[3].v,
                        width: this.bounds[4].u - this.bounds[5].u - 1,
                        height: this.bounds[4].v - this.bounds[3].v
                    }
                ];
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
            this.boundingBox.uMin > room.boundingBox.uMax 
            || room.boundingBox.uMin > this.boundingBox.uMax
            || this.boundingBox.vMin > room.boundingBox.vMax
            || room.boundingBox.vMin > this.boundingBox.vMax
        ) {
            return false;
        } else if (!this.boundsModified && !room.boundsModified) {
            return true;
        }
        
        // Rectangles exactly the same?
        if (this.boundingBox === room.boundingBox) { return true; }

        // Next check bounds
        for (let i = 0; i < room.bounds.length; i++) {
            if (this.pointInRoom(room.bounds[i])) {
                return true;
            }
        }

        // Finally, check all boundary points
        for (let i = 0; i < room.bounds.length; i++) {
            const NEXT_INDEX = (i + 1) % room.bounds.length;
            const point1 = room.bounds[i];
            const point2 = room.bounds[NEXT_INDEX];

            switch (i % 2) {
                case 0:
                    if (point1.u < point2.u) {
                        for (let u = point1.u + 1; u < point2.u; u++) {
                            if (this.pointInRoom({ u: u, v: point1.v })) {
                                return true;
                            }
                        }
                    } else {
                        for (let u = point2.u + 1; u < point1.u; u++) {
                            if (this.pointInRoom({ u: u, v: point2.v })) {
                                return true;
                            }
                        }
                    }
                    break;
                case 1:
                    if (point1.v < point2.v) {
                        for (let v = point1.v + 1; v < point2.v; v++) {
                            if (this.pointInRoom({ u: point1.u, v: v })) {
                                return true;
                            }
                        }
                    } else {
                        for (let v = point2.v + 1; v < point1.v; v++) {
                            if (this.pointInRoom({ u: point2.u, v: v })) {
                                return true;
                            }
                        }
                    }
                    break;
            }
        }

        return false;
    }


    /**
     * Naive check if a given point is within the bounds of the room.
     * Note that this INCLUDES points on the boundary of the room.
    * @param {{u: number, v: number}} point Point to check
     * @param {number} direction Leave unset.
     * @returns {boolean}
     */
    pointInRoom(point, direction = -2) {
        // On first iteration, check boundary points
        if (direction === -2) {
            let onBoundary = false;
            this.forEachSide((point1, point2, index) => {
                if (onBoundary) {
                    return;
                }
                switch (index % 2) {
                    case 0:
                        if (point1.v === point.v && (((point1.u <= point.u) == (point.u <= point2.u)) || point1.u === point.u || point.u === point2.u)) {
                            onBoundary = true;
                            return;
                        }
                        break;
                    case 1:
                        if (point1.u === point.u && (((point1.v <= point.v) == (point.v <= point2.v)) || point1.v === point.v || point.v === point2.v)) {
                            onBoundary = true;
                            return;
                        }
                        break;
                }
            });

            if (onBoundary) {
                return true;
            }
        }


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
                            if (point1.v !== point.v) {
                            continue;
                        } else if ((point1.u < point.u) === (point.u < point2.u)) {
                                return false;
                        } else {
                            return tryNext();
                        }
                    } else {
                        if (SIGN * point1.u < SIGN * point.u) {
                            continue;
                        } else if ((point1.v < point.v) === (point.v < point2.v)) {
                                if (point1.u === point.u) {
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
                            if (point1.u !== point.u) {
                            continue;
                        } else if ((point1.v < point.v) === (point.v < point2.v)) {
                                return false;
                        } else {
                            return tryNext();
                        }
                    } else {
                        if (SIGN * point1.v < SIGN * point.v) {
                            continue;
                        } else if ((point1.u < point.u) === (point.u < point2.u)) {
                                if (point1.v === point.v) {
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
     * @returns {0 | 1 | 2 | 3} The outward direction with respect to the given side. 0 - top, 1 - right, 2 - bottom, 3 - left
     */
    sideDirection(index) {
        if (index >= this.bounds.length) {
            throw new Error("Index is higher than amount of sides");
        }
        
        const side = [this.bounds[index], this.bounds[(index + 1) % this.bounds.length]];
        switch (index % 2) {
            case 0:
                if (this.pointInRoom({ u: (side[0].u + side[1].u) / 2, v: side[0].v + 1 })) {
                    return 0;
                } else return 2;
            case 1:
                if (this.pointInRoom({ u: side[0].u + 1, v: (side[0].v + side[1].v) / 2 })) {
                    return 3;
                } else return 1;
        }
        throw new Error("Some error occurred while determining the side direction.");
    }

    /**
     * Renders room to the screen.
     * 
     * @param {Phaser.Tilemaps.TilemapLayer} tileLayer The tile layer to render the room on.
     * @param {{u: number, v: number, width: number, height: number}} floorBoundingBox The bounding box of the floor.
     */
    render(tileLayer, floorBoundingBox) {
        // Render the inside area of the room on the specified tile layer, adjusted for the floor bounding box.
        this.insideArea.forEach((area) => {
            tileLayer.fill(13, area.u - floorBoundingBox.u, area.v - floorBoundingBox.v, area.width, area.height);
        });

        // Render the walls of the room on the specified tile layer, adjusted for the floor bounding box.
        this.forEachSide((point1, point2, index) => {
            const direction = this.sideDirection(index);

            // Depending on the side direction, render the appropriate wall tile (keep in account if walls have already been generated, as they can overlap)
            switch (direction) {
                case 0:
                    const startU0 = point1.u - floorBoundingBox.u;
                    const startV0 = point1.v - floorBoundingBox.v;
                    const endU0 = point2.u - floorBoundingBox.u;

                    if (!(index == 2)) {
                        tileLayer.putTileAt(12, startU0, startV0);
                    } else {
                        tileLayer.putTileAt(17, startU0, startV0);
                    }

                    tileLayer.fill(10, startU0 + 1, startV0, endU0 - startU0 - 1, 1);
                    break;
                case 1:
                    const startU1 = point1.u - floorBoundingBox.u;
                    const startV1 = point1.v - floorBoundingBox.v;
                    const endV1 = point2.v - floorBoundingBox.v;

                    if (!(index == 3 && point1.u != this.boundingBox.uMax)) {
                        tileLayer.putTileAt(11, startU1, startV1);
                    } else {
                        tileLayer.putTileAt(15, startU1, startV1);
                    }

                    tileLayer.fill(15, startU1, startV1 + 1, 1, endV1 - startV1 - 1);
                    break;
                // Cases 2 and 3 have their p1/p2 reversed compared to cases 0 and 1
                case 2:
                    const endU2 = point1.u - floorBoundingBox.u;
                    const endV2 = point1.v - floorBoundingBox.v;
                    const startU2 = point2.u - floorBoundingBox.u;

                    if (!(index == 4 && point1.v != this.boundingBox.vMax)) {
                        tileLayer.putTileAt(10, endU2, endV2);
                    } else {
                        tileLayer.putTileAt(14, endU2, endV2);
                    }
                    
                    tileLayer.fill(10, startU2 + 1, endV2, endU2 - startU2 - 1, 1);
                    break;
                case 3:
                    const endV3 = point1.v - floorBoundingBox.v;
                    const endU3 = point1.u - floorBoundingBox.u;
                    const startV3 = point2.v - floorBoundingBox.v;

                    if (!(index == 5 && point1.u != this.boundingBox.uMin)) {
                        tileLayer.putTileAt(10, endU3, endV3);
                    } else {
                        tileLayer.putTileAt(18, endU3, endV3);
                    }

                    tileLayer.fill(14, endU3, startV3 + 1, 1, endV3 - startV3 - 1);
                    break;
            }
        });

        return this;
    }
}

export default Room;