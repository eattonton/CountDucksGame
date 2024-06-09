import Phaser from "phaser";
import TT from "./gameconfig";
import CountShow from "./scene/countshow";
import Menu from "./scene/menu";
import MultiPlayer from "./scene/multiplayerscene";
import Preload from "./scene/preload";
import Ducks from "./scene/ducks";

const ScreenScale = 1080/1920;
const ScreenHeight = window.innerHeight;
const ScreenWidth = window.innerHeight * ScreenScale;

const config = {
    type: Phaser.AUTO,
    backgroundColor: 0xffffff,
    width: ScreenWidth,
    height: ScreenHeight,
    // scale: {
    //     mode: Phaser.Scale.HEIGHT_CONTROLS_WIDTH,
    //     autoCenter: Phaser.Scale.CENTER,
    //     width: 1080,
    //     height: 1920
    // },
    pixelArt: true,
    physics: {
        default: "arcade",
        arcade: {
            debug: true,
            gravity: { y: 0 }
        },
    },
    input: {
        gamepad: true
    },
    scene: [Preload, CountShow, MultiPlayer, Ducks, Menu]

}

class GameConfig extends Phaser.Game {
    //显示尺寸
    width = parseInt(this.config.width);
    height = parseInt(this.config.height);

    constructor(config) {
        //画布尺寸
        //TT.width = 1080;
        //TT.height = 1920;
        TT.Zoom = ScreenHeight / 1920;
        if(window.innerWidth > window.innerHeight){
            TT.IsLandscape = true;  //横屏
        }
        super(config);
    }
}

TT.game = new GameConfig(config);
