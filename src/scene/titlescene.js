import Phaser from "phaser";

export default class CountDownScene extends Phaser.Scene {  
    constructor(){
        super({
            key:"TitleScene"
        });
    }

    preload() {  
        // 在这里预加载任何资源  
    }  
  
    create() {  
        // 假设你想要限制相机只能看到场景中的 (100, 100) 到 (300, 300) 区域  
       // this.cameras.main.setViewport(100, 100, 1200, 1200);
       // const centerX = this.cameras.main.width / 2;  
       // const centerY = this.cameras.main.height / 2; 
       
        const graphics = this.add.graphics({ fillStyle: { color: 0xff0000,alpha:0.5 } });
        graphics.fillRect(0, 200, this.scale.width, 10);

        // const circle2 = new Phaser.Geom.Circle(centerX, centerY, 80);
        // const graphics2 = this.add.graphics({ fillStyle: { color: 0xffffff } });
        // graphics2.fillCircleShape(circle2);
        // // 假设你有一个要更新的文本对象  
        let text = this.add.text(350, 20, '数鸭子',
             { fontFamily: '黑体', 
                fontSize: '90px', 
                fill: '#000' });  
         
    }  
  
      
}  
  
 