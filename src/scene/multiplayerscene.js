import Phaser from "phaser";
import TT from "../gameconfig"

export default class MultiPlayerScene extends Phaser.Scene {
    constructor() {
        super({
            key: "MultiPlayer"
        });
    }

    preload() {

    }
    fullScreen = false;
    
    create() {
        let centerX = TT.width / 2;
        let centerY = TT.height / 2;
        //默认进入竖屏
        this.RotateScene();
       // this.RestoreScene();
        this.cameras.main.setZoom(1);
 
        let iconCA = this.add.sprite(centerY, centerX, 'iconController').setOrigin(0.5);
        iconCA.setScale(1);
        iconCA.setInteractive();
 
        iconCA.on('pointerdown', () => {
            this.scale.toggleFullscreen();
        })

        this.scale.on('enterfullscreen', ()=> {
            //进入全屏
            this.RestoreScene();
        });

        this.scale.on('leavefullscreen', ()=>{
            //离开全屏
            this.RotateScene();
        });

        TT.eventsCenter.on('event-buttonTwo', (data)=>{
            TT.eventsCenter.emit('event-createDucksB', { data: false });
        })

    }

    update() {

    }

    RotateScene(){
        //竖直
        this.cameras.main.setSize(TT.width, TT.height);
        this.cameras.main.setRotation(0.5*Math.PI);
        this.cameras.main.centerOn(TT.CenterY(), TT.CenterX());
        
    }

    RestoreScene(){
        //横屏
        this.cameras.main.setSize(TT.height, TT.width);
        this.cameras.main.setRotation(0);
        this.cameras.main.centerOn(TT.CenterY(), TT.CenterX());
        
    }
}