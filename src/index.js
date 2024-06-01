import Phaser from "phaser";
import TT from "./gameconfig";
import CountShow from "./scene/countshow";
import Menu from "./scene/menu";
import MultiPlayer from "./scene/multiplayerscene";
import Preload from "./scene/preload";
import Ducks from "./scene/ducks";

const config = {
    type: Phaser.AUTO,
    backgroundColor: 0xffffff,
    width:1920,
    height:1080,
    //scale: {
     //   mode: Phaser.Scale.HEIGHT_CONTROLS_WIDTH,
        //mode:Phaser.Scale.WIDTH_CONTROLS_HEIGHT,
        //mode:Phaser.Scale.NONE,
        //autoCenter: Phaser.Scale.NO_CENTER,
       // width: window.innerWidth,
       // height: window.innerHeight
       //width:1280,
       //height:720
    //},
    pixelArt: true,
    physics:{
        default: "arcade",
        arcade:{
            debug:true,
            gravity: {y:0}
        },
    },
    scene:[Preload,CountShow,MultiPlayer,Ducks,Menu]
 
}

class GameConfig extends Phaser.Game {
    width = parseInt(this.config.width);
    height = parseInt(this.config.height);

    constructor (config) {
        super(config);
    }
}

TT.game = new GameConfig(config);
 