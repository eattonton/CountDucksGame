import Phaser from "phaser";
import TT from "../gameconfig"
import { TimeCards, StartTimeCountDown, CreateSceneMask } from "../sprite/timecard";

export default class CountShow extends Phaser.Scene {
    constructor() {
        super({
            key: "CountShow"
        });
    }

    preload() {
        //获得最新记录
        TT.RestoreRecord();
    }

    /** @type {number} 显示的序号 */
    m_ShowIndex = 0;
    /** @type {TimeCards} */
    m_Card0;
    
    /** @type {Phaser.GameObjects.Text} */
    m_TextRecord = null;

    /** @type {Phaser.GameObjects.Text} */
    m_textRule = null;

    create() {
        //声音对象
        let musicYelp = this.sound.add('musicYelp');

        let centerX = this.scale.width / 2;
        let centerY = this.scale.height / 2;
        //背景色
        this.cameras.main.setBackgroundColor(0xf3e88e);
       // this.cameras.main.setViewport(0,0,TT.width,TT.height);
        this.cameras.main.setZoom(TT.Zoom*1.4);
        //this.cameras.main.centerOn(centerX, centerY);
        //绘制开始按钮
        let btnStart = this.add.image(centerX, centerY, 'btnStart').setOrigin(0.5);
        btnStart.setVisible(false);
        btnStart.setScale(3);
        btnStart.setDepth(100);
        btnStart.setInteractive();
        btnStart.on('pointerdown', (pointer) => {
            //开始游戏 
            TT.eventsCenter.emit('event-buttonStart', {});
            //开始倒计时
            StartTimeCountDown(this, () => {
               // maskbg.destroy();
                //创建鸭子
                this.Reset();
            });
            //隐藏自己
            btnStart.destroy();
        })
        //计数卡片
        this.m_Card0 = new TimeCards(this, centerX-130, centerY-580, 99);
        // 添加点击事件  
        this.input.on('pointerdown', (pointer) => {
            if (!TT.IsStart) return;
            //更新计数
            this.m_Card0.PlayFlipOneCard(this.m_ShowIndex++);
            musicYelp.play();
            // this.m_duck0.play('duck-yelp', true);
        }, this); // 注意这里的 'this' 是指 MyScene 的实例 

        //绘制提交按钮
        let btnOk = this.add.image(centerX, centerY + 570, 'btnOk').setOrigin(0.5);
        btnOk.setInteractive();
        btnOk.setScale(1.8);
        btnOk.on('pointerdown', (pointer, event) => {
            if (!TT.IsStart) return;
            // 阻止事件冒泡
            TT.IsStart = false;
            //显示菜单
            this.scene.wake("Menu");
            // 这里可以添加你的逻辑  
            TT.eventsCenter.emit('event-buttonOk', { type: "result", numDuck: TT.NumDuck, numUser: this.m_ShowIndex });
        });

        //菜单
        let btnMenu = this.add.image(centerX+240,centerY+570,'btnMenu');
        btnMenu.setInteractive();
        btnMenu.setScale(1.8);
        btnMenu.on('pointerdown',(pointer, event)=>{
            if (!TT.IsStart) return;
            // 阻止事件冒泡
            TT.IsStart = false;
            //显示菜单
            this.scene.wake("Menu");
            // 这里可以添加你的逻辑  
            TT.eventsCenter.emit('event-buttonMenu', {  });
        })
 
        this.CreateRecordMax(centerX, centerY);
        //遮罩mask
        //let maskbg = CreateSceneMask(this);
        //绘制title
        this.DrawTitle(centerX, centerY);
        // 监听事件 
        this.CreateEvents(centerX, centerY);
    }

    CreateEvents(centerX, centerY){
        TT.eventsCenter.on('event-buttonNext', (data) => {
            this.m_textRule.setVisible(false);
            if (data["data"]) {
                //回答正确 增加难度
                TT.NumMax += 5;
                if (TT.NumMax >= 90) {
                    TT.NumMax = 90;
                }
                //记录
                TT.SaveRecord();
            }
            //更新显示
            this.CreateRecordMax(centerX, centerY);
            //创建鸭子
            this.Reset();
        });
    }

    update() {
    }

    Reset() {
        this.m_ShowIndex = 0;
        this.m_Card0.RestoreCards();
        TT.IsStart = true;
        this.RestoreScene();
        //重新生成鸭子
        //this.CreateDucks(TT.NumDuck);
        TT.eventsCenter.emit('event-createDucks', {  });
    }

    RestoreScene() {
        //横屏
        this.scale.setGameSize(TT.game.width, TT.game.height);
        this.cameras.main.setRotation(0);
        this.cameras.main.centerOn(this.scale.width / 2, this.scale.height / 2);

        this.scene.get('Ducks').RestoreScene();
        this.scene.get("Menu").RestoreScene();
    }

    CreateRecordMax(x,y){
        if(!this.m_TextRecord){
            this.m_TextRecord = this.add.text(x, y-550, '', {
                fontFamily: '黑体',
                fontSize: '38px',
                fill: '#ff0000'
            });
        }

        this.m_TextRecord.setText(`最佳记录:${TT.NumRecordMax}只`);
    }

    DrawTitle(x,y){
        const graphics = this.add.graphics({ fillStyle: { color: 0xff0000, alpha: 0.5 } });
        graphics.fillRect(-400, y-500, this.scale.width*4.0, 10);

        let textTitle = this.add.text(x, y-650, '数鸭子', {
            fontFamily: '黑体',
            fontSize: '90px',
            fill: '#000'
        });
        // 游戏规则
        this.m_textRule = this.add.text(x-280, y-480, '游戏规则:\n点击开始游戏，会随机出现小\n鸭子，玩家点击屏幕数鸭子。\n交卷点下方的确认按钮。',
        {
            fontFamily: '黑体',
            fontSize: '40px',
            fill: '#000'
        });
    }


}