import Phaser from "phaser";

export default class MultiPlayerScene extends Phaser.Scene{
    constructor(){
        super({
            key: "MultiPlayer"
        });
    }

    preload(){
        
    }

    create(){
        let centerX = this.scale.width / 2;
        let centerY = this.scale.height / 2;
        this.cameras.main.setRotation(0.5*Math.PI);
        // 假设你想要限制相机只能看到场景中的 (100, 100) 到 (300, 300) 区域  
        //this.cameras.main.setViewport(100, 100, 600, 600);

        let iconCA = this.add.image(centerX,centerY,'iconController').setOrigin(0.5);
        iconCA.setScale(1);
    
    }

    update(){

    }
}