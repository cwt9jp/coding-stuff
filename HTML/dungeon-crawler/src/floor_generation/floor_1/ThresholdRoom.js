import Room from './Room.js';

class ThresholdRoom extends Room {

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
     */
    constructor(scene, u, v, width, height, side) {
        super(scene, u, v, width, height, side, -1);

        this.side = side;
    }

    /**
     * Renders the threshold room
     * @param {Phaser.Tilemaps.TilemapLayer} tileLayer The tile layer to render the room on
     * @param {{u: number, v: number, width: number, height: number}} floorBoundingBox The bounding box of the floor for positioning the room correctly
     */
    render(tileLayer, floorBoundingBox) {
        this.insideArea.forEach(area => {
            tileLayer.fill(13, area.u - floorBoundingBox.u, area.v - floorBoundingBox.v, area.width, area.height);
        })

        switch (this.side) {
            case 1:
            case 3:
                tileLayer.fill(10, this.u - floorBoundingBox.u + 1, this.v - floorBoundingBox.v, this.width - 2, 1);
                tileLayer.fill(10, this.u - floorBoundingBox.u + 1, this.v - floorBoundingBox.v + this.height - 1, this.width - 2, 1);
                
                // TODO: add door tiles
                tileLayer.fill(13, this.u - floorBoundingBox.u, this.v - floorBoundingBox.v + 1, 1, this.height - 2);
                tileLayer.fill(13, this.u - floorBoundingBox.u + this.width - 1, this.v - floorBoundingBox.v + 1, 1, this.height - 2);
                break;
            case 0:
            case 2:
                tileLayer.putTileAt(12, this.u - floorBoundingBox.u, this.v - floorBoundingBox.v);
                tileLayer.putTileAt(11, this.u - floorBoundingBox.u + this.width - 1, this.v - floorBoundingBox.v);
                tileLayer.fill(14, this.u - floorBoundingBox.u, this.v - floorBoundingBox.v + 1, 1, this.height - 2);
                tileLayer.fill(15, this.u - floorBoundingBox.u + this.width - 1, this.v - floorBoundingBox.v + 1, 1, this.height - 2);

                // TODO: add door tiles
                tileLayer.fill(13, this.u - floorBoundingBox.u + 1, this.v - floorBoundingBox.v, this.width - 2, 1);
                tileLayer.fill(13, this.u - floorBoundingBox.u + 1, this.v - floorBoundingBox.v + this.height - 1, this.width - 2, 1);
                break;
        }
    }
}

export default ThresholdRoom;