import Phaser from "phaser";
import { Start } from './scenes/Start.js';
import { Map } from './scenes/Map.js';

/**
 * @type {Phaser.Types.Core.GameConfig}
 */
const config = {
    type: Phaser.AUTO,
    title: 'The Stronghold',
    description: '',
    parent: 'game-container',
    width: 16*16,
    height: 10*16,
    backgroundColor: '#ffffff',
    physics: {
        default: "arcade",
        arcade: {
            debug: false
        }
    },
    pixelArt: true,
    zoom: 3,
    scene: [
        Map
    ],
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
}

new Phaser.Game(config);
            