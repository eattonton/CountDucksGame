import Phaser from "phaser";
import pngNumbers from "../assets/numbers.png"
import pngDuck from "../assets/duck.png"
import pngBtnStart from "../assets/btn_start.png"
import pngBtnOk from "../assets/btn_ok.png"
import pngBtnNext from "../assets/btn_next.png"
import pngCup from "../assets/cup.png"
import pngWrong from "../assets/wrong.png"
import pngLogo from "../assets/logo.png"
import pngMenu from "../assets/menu.png"
import mp3Yelp from "../assets/yelp.mp3"

export default class Preload extends Phaser.Scene {
    constructor() {
        super({
            key: "Preload",
            active: true
        });
    }

    preload() {
        document.getElementById("homeload").remove();
        this.load.spritesheet('numbers', pngNumbers, { frameWidth: 111, frameHeight: 160 });
        this.load.spritesheet('duck', pngDuck, { frameWidth: 116, frameHeight: 126 });
        this.load.image('btnStart', pngBtnStart);
        this.load.image('btnOk', pngBtnOk);
        this.load.image('btnNext', pngBtnNext);
        this.load.image('iconCup', pngCup);
        this.load.image('iconWrong', pngWrong);
        this.load.image('iconLogo', pngLogo);
        this.load.image('btnMenu',pngMenu);
        this.load.audio('musicYelp', mp3Yelp);

        // 监听加载过程
        this.load.on('progress', (value) => {
            this.UpdateProgressBar(value)
        });
        this.load.on('complete', () => {
            this.LoadComplete();
        });
    }

    /** @type {Phaser.GameObjects.Graphics} */
    m_ProgressBar=null;

    create() {
        this.anims.create({
            key: 'duck-yelp',
            // frames:this.anims.generateFrameNumbers('duck', {start:0,end:1}),
            frames: this.anims.generateFrameNumbers('duck', { frames: [0, 1, 0] }),
            frameRate: 5,       // 每秒播放的帧数  
            repeat: 0,           // 动画是否重复，0 表示不重复  
            yoyo: false          // 是否在播放完动画后反向播放，false 表示不反向
        })
    }

    // 更新进度条
    UpdateProgressBar(progress) {
        if (!this.m_ProgressBar) {
            // 创建进度条
            this.m_ProgressBar = this.add.graphics();
        }
        this.m_ProgressBar.clear();
        this.m_ProgressBar.fillStyle(0x3f72af);
        this.m_ProgressBar.fillRoundedRect(100, 490, 520 * progress, 90, 38);
    }

    // 加载完成
    LoadComplete() {
        // 进度条加载完毕后的操作
        this.m_ProgressBar.destroy();
        this.scene.launch('CountShow');
        this.scene.launch('Menu');
        this.scene.sleep('Menu');
        this.scene.launch('TitleScene');
    }

}