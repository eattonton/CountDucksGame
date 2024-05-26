import Phaser from "phaser";
import TT from "../gameconfig"

export default class CountDownScene extends Phaser.Scene {
    constructor() {
        super({
            key: "TitleScene"
        });
    }

    preload() {
        // 在这里预加载任何资源  
    }

    create() {
        // 假设你想要限制相机只能看到场景中的 (100, 100) 到 (300, 300) 区域  
        // this.cameras.main.setViewport(100, 100, 1200, 1200);
        const graphics = this.add.graphics({ fillStyle: { color: 0xff0000, alpha: 0.5 } });
        graphics.fillRect(0, 200, this.scale.width, 10);

        // const circle2 = new Phaser.Geom.Circle(centerX, centerY, 80);
        // const graphics2 = this.add.graphics({ fillStyle: { color: 0xffffff } });
        // graphics2.fillCircleShape(circle2);
        // title 
        let textTitle = this.add.text(350, 20, '数鸭子', {
            fontFamily: '黑体',
            fontSize: '90px',
            fill: '#000'
        });
        // 游戏规则
        let text2 = this.add.text(90, 220, '游戏规则:\n点击开始游戏，会随机出现小\n鸭子，玩家点击屏幕数鸭子。\n交卷点下方的确认按钮。',
            {
                fontFamily: '黑体',
                fontSize: '40px',
                fill: '#000'
            });

        TT.eventsCenter.on('event-buttonStart', () => {
            text2.setVisible(false);
        });
    }


}

