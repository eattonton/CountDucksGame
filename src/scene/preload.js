import Phaser from "phaser";
import pngNumbers from "../assets/numbers.png"
import pngDuck from "../assets/duck.png"
import pngBtnStart from "../assets/btn_start.png"
import pngBtnOk from "../assets/btn_ok.png"
import pngBtnNext from "../assets/btn_next.png"
import pngCup from "../assets/cup.png"
import pngWrong from "../assets/wrong.png"
import pngUi from "../assets/ui.png"
import mp3Yelp from "../assets/yelp.mp3"

export default class Preload extends Phaser.Scene{
    constructor(){
        super({
            key: "Preload",
            active: true
        });
    }

    preload(){
        this.load.spritesheet('numbers', pngNumbers, { frameWidth: 111, frameHeight: 160 });
        this.load.spritesheet('duck', pngDuck, { frameWidth: 116, frameHeight: 126 });
        this.load.image('btnStart',pngBtnStart);
        this.load.image('btnOk', pngBtnOk);
        this.load.image('btnNext', pngBtnNext);
        this.load.image('iconCup',pngCup);
        this.load.image('iconWrong', pngWrong);
        this.load.image('iconUi',pngUi);

        this.load.audio('musicYelp', mp3Yelp);
    }

    create(){
        this.anims.create({
            key:'duck-yelp',
           // frames:this.anims.generateFrameNumbers('duck', {start:0,end:1}),
            frames:this.anims.generateFrameNumbers('duck', {frames:[0,1,0]}),
            frameRate: 5,       // 每秒播放的帧数  
            repeat: 0,           // 动画是否重复，0 表示不重复  
            yoyo: false          // 是否在播放完动画后反向播放，false 表示不反向
        })
        
        //start game scene
        this.scene.launch('CountShow');
        this.scene.launch('Menu');
        this.scene.sleep('Menu');
        this.scene.launch('TitleScene');
    }
}