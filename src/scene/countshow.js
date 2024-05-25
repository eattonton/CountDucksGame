import Phaser from "phaser";
import TT from "../gameconfig"
import { GetRandQueueInRange, RandomInt } from "../js/math"
import { TimeCards, StartTimeCountDown, CreateSceneMask } from "../sprite/timecard";

export default class CountShow extends Phaser.Scene {
    constructor() {
        super({
            key: "CountShow"
        });
    }

    preload() {

    }
 
    /** @type {number} 显示的序号 */
    m_ShowIndex = 0;
    /** @type {TimeCards} */
    m_Card0;
    /** @type {Array<Phaser.GameObjects.sprite>} */
    m_Ducks = [];

    /** @type {boolean} */
    m_IsAnim = false;

    /** @type {number} */
    m_NumMax = 10;

    create() {
        //声音对象
        let musicYelp = this.sound.add('musicYelp');
        
        let centerX = this.scale.width / 2;
        let centerY = this.scale.height / 2;
        //背景色
        this.cameras.main.setBackgroundColor(0xF3E88E);
        //绘制开始按钮
        let btnStart = this.add.image(centerX, centerY, 'btnStart').setOrigin(0.5);
        btnStart.setScale(3);
        btnStart.setDepth(100);
        btnStart.setInteractive();
        btnStart.on('pointerdown', (pointer) => {
            //开始游戏 
            //开始倒计时
            StartTimeCountDown(this, () => {
                maskbg.destroy();
                this.Reset();
            });
            //隐藏自己
            btnStart.destroy();
        })
        //计数卡片
        this.m_Card0 = new TimeCards(this, 250, 120, 99);
        // 添加点击事件  
        this.input.on('pointerdown', (pointer) => {
            if (!TT.IsStart) return;
            //更新计数
            this.m_Card0.PlayFlipOneCard(this.m_ShowIndex++);
            musicYelp.play();
            // this.m_duck0.play('duck-yelp', true);
        }, this); // 注意这里的 'this' 是指 MyScene 的实例 

        //绘制提交按钮
        let btnOk = this.add.image(centerX, centerY + 550, 'btnOk');
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

        // 监听事件  
        TT.eventsCenter.on('event-buttonNext', (data) => {
            this.Reset();
        });

        //遮罩mask
        let maskbg = CreateSceneMask(this);
    }

    update() {
        if(!TT.IsStart) return;
        if(this.m_IsAnim) return;
        //console.log(this.m_Ducks.length);
        if(this.m_Ducks.length == 0) return;
        
        let iAnim = RandomInt(0,300);
        if(iAnim == 0){
            this.m_IsAnim = true;
            let idx = RandomInt(0,this.m_Ducks.length-1);
            this.m_Ducks[idx].play("duck-yelp");
        }
        
    }

    Reset() {
        this.m_ShowIndex = 0;
        this.m_Card0.RestoreCards();
        TT.IsStart = true;
        //创建鸭子
        TT.NumDuck = RandomInt(this.m_NumMax-4, this.m_NumMax);
        //重新生成鸭子
        this.CreateDucks(TT.NumDuck);
    }

    CreateDucks(num) {
        this.DestroyDucks();
        let col = 10;
        let row = 10;
        let posIdxs = GetRandQueueInRange(num / 2, 0, 50);
        let posIdxs2 = GetRandQueueInRange(num / 2, 51, 99);
        posIdxs = posIdxs.concat(posIdxs2);
        posIdxs.sort((a, b) => a - b);
        for (let i = 0; i < num; i++) {
            let posIdx = posIdxs[i];
            let posx = posIdx % col;
            let posy = parseInt(posIdx / col);
            let duck0 = this.add.sprite(posx * (500 / col) + 140, posy * (680 / row) + 320, 'duck', 0).setOrigin(0.5);
            duck0.setScale(1.4);
            let isFlip = RandomInt(0, 3);
            if (isFlip == 0) {
                duck0.setFlipX(true);
            }

            duck0.on('animationcomplete', (animation, frame) =>{
                this.m_IsAnim = false;
            })  
            this.m_Ducks.push(duck0);
        }
    }

    DestroyDucks() {
        for (let i = this.m_Ducks.length - 1; i >= 0; i--) {
            this.m_Ducks[i].destroy();
        }

        this.m_Ducks = [];
    }


}