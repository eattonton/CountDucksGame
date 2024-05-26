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
        //获得最新记录
        TT.RestoreRecord();
    }

    /** @type {number} 显示的序号 */
    m_ShowIndex = 0;
    /** @type {TimeCards} */
    m_Card0;
    /** @type {Array<Phaser.GameObjects.sprite>} */
    m_Ducks = [];

    /** @type {boolean} */
    m_IsAnim = false;
 
    m_MinX = 140;
    m_MinY = 320;
    m_MaxX = 540;
    m_MaxY = 1100;

    /** @type {Phaser.GameObjects.Text} */
    m_TextRecord = null;

    m_Step = 20;
     
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
            TT.eventsCenter.emit('event-buttonStart', {});
            //开始倒计时
            StartTimeCountDown(this, () => {
                maskbg.destroy();
                //创建鸭子
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
            if (data["data"]) {
                //回答正确 增加难度
                TT.NumMax += 5;
                if (TT.NumMax >= 90) {
                    TT.NumMax = 90;
                }
                //记录
                TT.SaveRecord();
                //更新显示
                this.CreateRecordMax();
            }
            //创建鸭子
            this.Reset();
        });

        this.CreateRecordMax();
        //遮罩mask
        let maskbg = CreateSceneMask(this);
    }

    update() {
        if (!TT.IsStart) return;
        if (this.m_IsAnim) return;
        //console.log(this.m_Ducks.length);
        if (this.m_Ducks.length == 0) return;

        if (RandomInt(0, 100) == 0) {
            this.m_IsAnim = true;
            let idx = RandomInt(0, this.m_Ducks.length - 1);
            if (RandomInt(0, 4) == 0) {
                this.m_Ducks[idx].setFlipX(true);
            }
            this.m_Ducks[idx].play("duck-yelp");

            if (TT.NumMax >= 15 && RandomInt(0, 2) == 0) {
                //移动位置
                this.PlayWalkAnim(idx);

            }
        }

    }

    Reset() {
        if (TT.NumMax <= 5) {
            TT.NumDuck = RandomInt(4, 5);
        }
        else {
            TT.NumDuck = RandomInt(TT.NumMax - 4, TT.NumMax);
        }

        this.m_ShowIndex = 0;
        this.m_Card0.RestoreCards();
        TT.IsStart = true;

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
            let duck0 = this.add.sprite(posx * (500 / col) + 140, posy * (780 / row) + 320, 'duck', 0).setOrigin(0.5);
            duck0.setScale(1.4);
            if (RandomInt(0, 3) == 0) {
                duck0.setFlipX(true);
            }

            let mm = RandomInt(0, 4);
            if(mm == 0){
                duck0.setX(duck0.x - this.m_Step);
            }
            else if(mm == 1){
                duck0.setX(duck0.x + this.m_Step);
            }
            mm = RandomInt(0, 4);
            if(mm == 0){
                duck0.setY(duck0.y - this.m_Step);
            }
            else if(mm == 1){
                duck0.setY(duck0.y + this.m_Step);
            }

            duck0.on('animationcomplete', (animation, frame) => {
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

    CreateRecordMax(){
        if(!this.m_TextRecord){
            this.m_TextRecord = this.add.text(350, 140, '', {
                fontFamily: '黑体',
                fontSize: '38px',
                fill: '#ff0000'
            });
        }

        this.m_TextRecord.setText(`最佳记录:${TT.NumRecordMax}只`);
    }

    PlayWalkAnim(idx) {
        let idir = RandomInt(0, 7);
        let stepX = 0;
        let stepY = 0;
        if (idir == 0) {
            stepX = this.m_Step;
            stepY = 0;
        } else if (idir == 1) {
            stepX = this.m_Step;
            stepY = -this.m_Step;
        } else if (idir == 2) {
            stepX = 0;
            stepY = -this.m_Step;
        } else if (idir == 3) {
            stepX = -this.m_Step;
            stepY = -this.m_Step;
        } else if (idir == 4) {
            stepX = -this.m_Step;
            stepY = 0;
        } else if (idir == 5) {
            stepX = -this.m_Step;
            stepY = this.m_Step;
        } else if (idir == 6) {
            stepX = 0;
            stepY = this.m_Step;
        } else if (idir == 7) {
            stepX = this.m_Step;
            stepY = this.m_Step;
        }
        let destX = this.m_Ducks[idx].x + stepX;
        let destY = this.m_Ducks[idx].y + stepY;
        if (destX >= this.m_MinX && destX <= this.m_MaxX
            && destY >= this.m_MinY && destY <= this.m_MaxY
        ) {
            this.tweens.add({
                targets: this.m_Ducks[idx],
                x: destX,
                y: destY,
                duration: 400, // 动画持续时间（毫秒）  
                ease: 'Cubic.easeInOut', // 缓动函数  
                yoyo: false,
                onComplete: () => {
                }
            });
        }
    }

}