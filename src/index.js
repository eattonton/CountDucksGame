import Phaser from "phaser";
import TT from "./gameconfig";
import TitleScene from "./scene/titlescene"
import CountShow from "./scene/countshow";
import Menu from "./scene/menu";
import MultiPlayer from "./scene/multiplayerscene";
import Preload from "./scene/preload";

const config = {
    type: Phaser.AUTO,
    backgroundColor: 0xffffff,
    scale: {
        mode: Phaser.Scale.HEIGHT_CONTROLS_WIDTH,
        autoCenter: Phaser.Scale.CENTER_BOTH,
       // width: window.innerWidth,
       // height: window.innerHeight
       width:720,
       height:1280
    },
    pixelArt: true,
    physics:{
        default: "arcade",
        arcade:{
            debug:true,
            gravity: {y:0}
        },
    },
    scene:[Preload,CountShow,Menu,TitleScene,MultiPlayer]
 
}

class GameConfig extends Phaser.Game {
    width = parseInt(this.config.width);
    height = parseInt(this.config.height);

    constructor (config) {
        super(config);
    }
}

TT.game = new GameConfig(config);

