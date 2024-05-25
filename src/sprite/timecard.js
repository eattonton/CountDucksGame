import Phaser from "phaser";

export class OneTimeCard {
    /** @type {Array<Phaser.GameObjects.Sprite>} */
    m_Cards = [];

    /** @type {Phaser.GameObjects.scene} */
    scene;
    /** @type {number} */
    x = 0;
    /** @type {number} */
    y = 0;
    constructor(scene, x, y) {
        this.scene = scene;
        this.x = x;
        this.y = y;
        //创建卡片
        for (let i = 0; i <= 9; i++) {
            this.CreateOneCard(i);
        }
    }

    CreateOneCard(idx) {
        let card = this.scene.add.sprite(this.x, this.y, 'numbers', idx).setOrigin(0.5);
        //card.setTint(0xDE9D49);
        card.setTint(0x00bfff);
        card.setDepth(-1 * idx);
        // this.card.setInteractive();
        // 创建一个具有倒圆角的 Graphics 对象作为遮罩  
        const graphicsMask = this.scene.add.graphics();
        graphicsMask.fillStyle(0x000000, 0); // 白色，不透明度为1（完全不透明）  
        graphicsMask.fillRoundedRect(card.x - 0.5 * card.width, card.y - 0.5 * card.height,
            card.width, card.height, 15); // 圆角半径为10  

        graphicsMask.setVisible(false);
        // 将 maskSprite 应用到 sprite 上作为遮罩  
        card.setMask(graphicsMask.createGeometryMask());
        this.m_Cards.push(card);
    }

    PlayFlipOneCard(idx) {
        idx = idx % 10;
        let card = this.m_Cards[idx];
        let cardNum = this.m_Cards.length;
        let sourceY = card.y;

        let idx2 = 0;
        if (idx < 9) {
            idx2 = idx + 1;
        }
        let card2 = this.m_Cards[idx2];
        card2.setDepth(-1 * (idx));  //设置下一个 显示需要靠前一位

        // 创建补间动画，使精灵往上移动并逐渐消失  
        this.scene.tweens.add({
            targets: card, // 要应用动画的物体  
            y: sourceY - 100, // 精灵的目标y坐标（负数表示向上移动）  
            alpha: 0, // 精灵的目标透明度（0表示完全透明，即消失）  
            duration: 100, // 动画持续时间（毫秒）  
            ease: 'Linear', // 缓动函数，这里使用线性缓动  
            onComplete: () => {
                // 动画完成后，可以选择销毁精灵或执行其他操作  
                // sprite.destroy(); // 销毁精灵  
                card.setY(sourceY);
                card.setAlpha(1);
                card.setDepth(-1 * cardNum);  //把显示完的层 放到最后
            },
            yoyo: false // 不重复动画
        });
    }

    RestoreCards(){
        for (let i = 0; i <= 9; i++) {
            this.m_Cards[i].setDepth(-1 * i);
        }
    }
}

export class TimeCards {
    /** @type {Array<OneTimeCard>} */
    m_Cards = [];
    /** @type {Phaser.GameObjects.scene} */
    scene;
    /** @type {number} */
    x = 0;
    /** @type {number} */
    y = 0;

    /** @type {number} 显示的序号 */
    m_ShowIndex = 0;

    /**
     * 
     * @param {Phaser.GameObjects.scene} scene 
     * @param {*} x 
     * @param {*} y 
     * @param {number} maxNum 最大数
     */
    constructor(scene, x, y, maxNum) {
        let stepX = 120;
        for (let i = 0; i < 3; i++) {
            if (i == 1 && maxNum < 10) break;
            if (i == 2 && maxNum < 100) break;

            this.m_Cards.push(new OneTimeCard(scene, x - stepX * i, y));
        }

    }

    PlayFlipOneCard(idx) {
        this.m_Cards[0].PlayFlipOneCard(idx);
        let nextIndex = idx + 1;
        if (this.m_Cards.length >= 1 && nextIndex >= 10 && nextIndex % 10 == 0) {
            this.m_Cards[1].PlayFlipOneCard(parseInt((nextIndex) / 10) - 1);
        }
    }

    RestoreCards(){
        this.m_Cards[0].RestoreCards();
        if(this.m_Cards.length >= 1){
            this.m_Cards[1].RestoreCards();
        }
    }
}

/**
 * 
 * @param {Phaser.GameObjects.scene} scene 
 * @param {*} cb 
 */
export function StartTimeCountDown(scene, cb) {
    const centerX = scene.scale.width / 2;
    const centerY = scene.scale.height / 2;
    // 创建一个图形对象并绘制一个灰色矩形作为背景  
    //let graphics2 = CreateSceneMask(scene);

    const circle = new Phaser.Geom.Circle(centerX, centerY, 150);
    const graphics = scene.add.graphics({ lineStyle: { color: 0x909090,width:31 } });
    graphics.strokeCircleShape(circle);
 
    let totalNum = 3;
    // 假设你有一个要更新的文本对象  
    let text = scene.add.text(centerX, centerY, totalNum+'', { fontFamily: '微软雅黑', fontSize: '220px', fill: '#909090' });
    text.setOrigin(0.5);
    // 创建一个计数补间，从0开始，到100结束，持续2秒  
    scene.tweens.addCounter({
        from: 0,
        to: totalNum,
        duration: totalNum*1000, // 毫秒  
        ease: 'Linear', // 缓动函数  
        yoyo: false, // 是否往返  
        repeat: 0, // 重复次数，0表示不重复  
        delay: 0, // 延迟开始时间  
        onComplete: tween => {
            text.destroy();
            graphics.destroy();
            //graphics2.destroy();
            if (typeof cb == "function") {
                cb();
            }
        },
        onUpdate: tween => {
            // 每一帧更新时的回调函数  
            const value = Math.round(tween.getValue());
            text.setText(`${totalNum - value}`);
            //渐变颜色
            let step = 0.23 * tween.getValue();
            step = (step % 1);
            let t = Math.sin(2.0 * Math.PI * step);
            let a = Math.abs(parseInt(255 * t));
            let color = ((a << 24) + (a << 16) + (a << 8) + a);
            //graphics.lineStyle(20,color,step);
            //graphics.strokeCircleShape(circle);
            //text.setAlpha(step);
            //text.setTint(color);
        }
    });

}

export function CreateSceneMask(scene){
    let graphics = scene.add.graphics({ fillStyle: { color: 0xdfdfdf ,alpha:0.5 }, x: 0, y: 0}); // 灰色 #808080  
    graphics.fillRect(0, 0, scene.scale.width, scene.scale.height);  

    return graphics;
}