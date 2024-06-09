import Phaser from "phaser";
import TT from "../gameconfig"
import { TimeCards, StartTimeCountDown, CreateSceneMask } from "../sprite/timecard";

/** 用于手柄用户处理 */
class ControlUser {
    /** @type {number} 用户序号*/
    m_Index = -1;
    /** @type {number} 显示的序号 */
    m_ShowIndex = 0;
    /** @type {TimeCards} */
    m_Card;
    /** @type {boolean} */
    m_btn3 = false;
    /** @type {boolean} */
    m_btnSel = false;
    /** @type {Phaser.GameObjects.Image} */
    m_iconCtrl;
    /** @type {Phaser.GameObjects.Image} */
    m_iconCup;
    /** @type {Phaser.GameObjects.Text} */
    m_textOk;
    /** @type {Phaser.Scene} */
    thisScene;

    constructor(idx) {
        this.m_Index = idx;
    }

    Create(scene, x, y) {
        this.thisScene = scene;
        let posSide = this.m_Index == 0 ? -1 : 1;
        let ctrlColor = [0xff0000, 0x0000ff][this.m_Index];
        //按钮
        this.m_iconCtrl = scene.add.image(posSide * (x + 100), y, 'iconController').setOrigin(0.5);
        this.m_iconCtrl.setScale(1);
        this.m_iconCtrl.setTint(ctrlColor);

        //计数卡片
        let posCard = [300, 400][this.m_Index]
        this.m_Card = new TimeCards(scene, posSide * (x + posCard), y, 99);
        //奖杯
        this.m_iconCup = scene.add.image(posSide * (x + 600), -y - 100, 'iconCup');
        this.m_iconCup.setScale(2.4);
        this.m_iconCup.setVisible(false);
        //确认
        let posTxt = [650,500][this.m_Index];
        this.m_textOk = scene.add.text(posSide * (x + posTxt), y-50, '确认', {
            fontFamily: '黑体',
            fontSize: '70px',
            fill: '#000'
        });
        this.m_textOk.setVisible(false);
    }

    UpdateCountDuck(pad, cb) {
        if (pad.index == this.m_Index && !this.m_btn3 && !this.m_btnSel) {
            this.m_btn3 = true;
            this.m_Card.PlayFlipOneCard(this.m_ShowIndex++);
            this.RunDownBtnTween();
            //this.m_musicYelp.play();
            if (typeof cb === 'function') {
                cb();
            }
        }
    }

    RunDownBtnTween() {
        // 原始颜色 
        let originalColor = this.m_iconCtrl.tint; // 白色
        // 原始颜色
        let pressedColor = 0xffffff; // 白色
        // 使用Tween创建一个颜色渐变动画  
        this.thisScene.tweens.add({
            targets: this.m_iconCtrl, // 指向当前按钮  
            duration: 200, // 动画持续时间  
            tint: pressedColor, // 目标颜色  
            ease: 'Linear', // 缓动函数  
            onComplete: () => {
                this.m_iconCtrl.setTint(originalColor);
                this.m_btn3 = false;
            }
        });
    }

    OkCount(pad, cb) {
        if (pad.index == this.m_Index && !this.m_btnSel) {
            this.m_btnSel = true;
            this.m_textOk.setVisible(true);
            this.m_iconCtrl.setTint(0xdfdfdf);
            if (typeof cb === 'function') {
                cb();
            }
        }
    }

    IsOkBtn() {
        return this.m_btnSel;
    }

    GetCount() {
        return this.m_ShowIndex;
    }

    SetCupVisible(val){
        this.m_iconCup.setVisible(val);
    }

    Reset() {
        this.m_ShowIndex = 0;
        this.m_Card.RestoreCards();
        let ctrlColor = [0xff0000, 0x0000ff][this.m_Index];
        this.m_iconCtrl.setTint(ctrlColor);
        this.m_btn3 =false;
        this.m_btnSel=false;
    }

}

export default class MultiPlayerScene extends Phaser.Scene {
    constructor() {
        super({
            key: "MultiPlayer"
        });
    }

    preload() {

    }

    /** @type {ControlUser} 玩家A */
    m_UserA = 0;
    /** @type {ControlUser} 玩家B */
    m_UserB = 0;
    /** 叫声 */
    m_musicYelp;

    create() {
        //声音对象
        this.m_musicYelp = this.sound.add('musicYelp');
        //背景色
        this.cameras.main.setBackgroundColor(0xf3e88e);
        //进入竖屏
        this.RotateScene();
        this.cameras.main.setZoom(0.4);
        //创建用户
        let halfCenterX = this.scale.width / 2;
        let halfCenterY = this.scale.height / 2;
        this.m_UserA = new ControlUser(0);
        this.m_UserA.Create(this, halfCenterX, halfCenterY);

        this.m_UserB = new ControlUser(1);
        this.m_UserB.Create(this, halfCenterX, halfCenterY);
        //标题
        this.DrawTitle(halfCenterX, halfCenterY);

        //菜单
        let btnMenu = this.add.image(halfCenterX + 380, -halfCenterY + 5, 'btnMenu').setOrigin(0.5, 1);
        btnMenu.setScale(3.3);
        btnMenu.setInteractive();
        btnMenu.on('pointerdown', (pointer, event) => {
            if (!TT.IsStart) return;
            // 阻止事件冒泡
            TT.IsStart = false;
            //显示菜单
            this.scene.wake("Menu");
            if (this.scale.isFullscreen) {
                //全屏状态 不用旋转
                this.scene.get("Menu").RestoreScene();
            } else {
                //非全屏状态 旋转
                this.scene.get("Menu").RotateScene();
            }

            // 这里可以添加你的逻辑  
            TT.eventsCenter.emit('event-buttonMenu', {});
        })
        //全屏按钮
        let btnFull = this.add.image(halfCenterX + 200, -halfCenterY + 20, 'iconFull').setOrigin(0.5, 1);
        btnFull.setScale(0.7);
        btnFull.setTint(0xd96330);
        btnFull.setInteractive();
        btnFull.on('pointerdown', () => {
            this.scale.toggleFullscreen();
        })

        this.scale.on('enterfullscreen', () => {
            //进入全屏
            this.RestoreScene();
        });

        this.scale.on('leavefullscreen', () => {
            //离开全屏
            this.RotateScene();
        });

        TT.eventsCenter.on('event-buttonTwo', (data) => {
            this.Reset();
        })

        //初始化输入
        this.InitInputGamePad();
        this.CreateEvents();
    }

    InitInputGamePad() {
        if (this.input.gamepad.total > 0) {
            return;
        }

        this.input.gamepad.on('connected', (pad) => {
            pad.on('down', (button, value, gamepad) => {
                if (button === 3 && TT.IsStart) {
                    //更新计数
                    this.m_UserA.UpdateCountDuck(pad, () => {
                        this.m_musicYelp.play();
                    });
                    this.m_UserB.UpdateCountDuck(pad, () => {
                        this.m_musicYelp.play();
                    });
                } else if (button === 8 && TT.IsStart) {
                    //确认 select
                    this.m_UserA.OkCount(pad, null);
                    this.m_UserB.OkCount(pad, null);
                    //两个都确认 判断
                    if (this.m_UserA.IsOkBtn() && this.m_UserB.IsOkBtn()) {
                        //弹出继续窗口
                        //if (!TT.IsStart) return;
                        // 阻止事件冒泡
                        TT.IsStart = false;
                        //显示菜单
                        this.scene.wake("Menu");
                        // 这里可以添加你的逻辑  
                        TT.eventsCenter.emit('event-buttonOk', {
                            type: "resultTwo", 
                            numDuck: TT.NumDuck,
                            numUserA: this.m_UserA.GetCount(), 
                            numUserB: this.m_UserB.GetCount()
                        });
                    }
                } else if (button === 9) {
                    //继续 start

                }

            })
        })
    }

    CreateEvents(){
        TT.eventsCenter.on('event-buttonNext2', (data) => {
            if (data["data"]) {
                //回答正确 增加难度
                TT.NumMax2 += 5;
                if (TT.NumMax2 >= 90) {
                    TT.NumMax2 = 90;
                }                
            }
            this.m_UserA.SetCupVisible(false);
            this.m_UserB.SetCupVisible(false);
            //设置胜利者的奖杯
            if(data["userIndex"] == 10){
                this.m_UserA.SetCupVisible(true);
                this.m_UserB.SetCupVisible(true);
            }else if(data["userIndex"] == 0){
                this.m_UserA.SetCupVisible(true);
                this.m_UserB.SetCupVisible(false);
            }else if(data["userIndex"] == 1){
                this.m_UserA.SetCupVisible(false);
                this.m_UserB.SetCupVisible(true);
            }
            //创建鸭子
            this.Reset();
        });
    }

    update() {
    }

    Reset() {
        this.m_UserA.Reset();
        this.m_UserB.Reset();
        TT.IsStart = true;
        this.RotateScene();
        //重新生成鸭子
        TT.eventsCenter.emit('event-createDucksB', { data: false });
    }

    DrawTitle(x, y) {
        const graphics = this.add.graphics({ fillStyle: { color: 0xff0000, alpha: 0.5 } });
        graphics.fillRect(-2000, -y + 10, 4000, 20);

        let textTitle = this.add.text(-x, -y - 120, '数鸭子PK', {
            fontFamily: '黑体',
            fontSize: '120px',
            fill: '#000'
        });
        // // 游戏规则
        // this.m_textRule = this.add.text(x-280, y-480, '游戏规则:\n点击开始游戏，会随机出现小\n鸭子，玩家点击屏幕数鸭子。\n交卷点下方的确认按钮。',
        // {
        //     fontFamily: '黑体',
        //     fontSize: '40px',
        //     fill: '#000'
        // });
    }

    RotateScene() {
        if (!TT.IsMultiPlayer) return;
        if (TT.IsLandscape) {
            //横屏
            this.scale.setGameSize(TT.game.height, TT.game.width);
            this.scene.get('Ducks').RestoreScene();
            this.scene.get("Menu").RestoreScene();
        } else {
            //竖直
            this.scale.setGameSize(TT.game.width, TT.game.height);
            // this.scale.resize(TT.game.width, TT.game.height);
            // this.scale.updateScale();
            //this.cameras.main.setSize(TT.game.width, TT.game.height);
            this.cameras.main.setRotation(0.5 * Math.PI);
            this.scene.get('Ducks').RotateScene();
            this.scene.get("Menu").RotateScene();
        }
        this.cameras.main.centerOn(0, 0);

    }

    RestoreScene() {
        //横屏
        this.scale.setGameSize(TT.game.height, TT.game.width);
        // this.scale.setGameSize(TT.height, TT.width);
        // this.scale.resize(TT.game.height, TT.game.width);
        // this.scale.updateScale();
        //this.cameras.main.setSize(TT.game.width, TT.game.height);
        this.cameras.main.setRotation(0);
        this.cameras.main.centerOn(0, 0);

        this.scene.get('Ducks').RestoreScene();
        this.scene.get("Menu").RestoreScene();
    }

}