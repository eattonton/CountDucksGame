import Phaser from "phaser";
import TT from "../gameconfig"
import { CreateSceneMask } from "../sprite/timecard";

export default class Menu extends Phaser.Scene {
    constructor() {
        super({
            key: "Menu"
        });
    }

    preload() {

    }
    //是否答对了
    m_isSuccess = false;
    /** @type {Phaser.GameObjects.Container} */
    m_containerDlg = null;

    /** @type {Phaser.GameObjects.Container} */
    m_containerMenu = null;

    create() {
        let centerX = this.scale.width / 2;
        let centerY = this.scale.height / 2;

        let mask = CreateSceneMask(this);
        this.m_containerDlg = this.CreateResultDlg(centerX, centerY);
        this.m_containerDlg.setVisible(false);

        this.m_containerMenu = this.CreateMenuDlg(centerX, centerY);
        this.m_containerMenu.setVisible(false);
    }

    CreateMenuDlg(centerX, centerY) {
        let dlg = this.add.graphics();
        dlg.fillStyle(0xfff9e1);
        dlg.lineStyle(10, 0xf49d5b);
        dlg.fillRoundedRect(-260, -280, 520, 480, 25);
        dlg.strokeRoundedRect(-260, -280, 520, 480, 25);

        let logo = this.add.image(0, -220, 'iconLogo').setOrigin(0.5);
        //logo.setScale(2);
        //生成按钮
        let btnA = this.CreateBtnSingle();
        let btnB = this.CreateBtnDouble();
        let btnC = this.CreateBtnClear();
        let container = this.add.container(centerX, centerY);
        container.add(dlg);
        container.add(btnA);
        container.add(btnB);
        container.add(btnC);
        container.add(logo);
        // 监听事件  
        TT.eventsCenter.on('event-buttonMenu', (data) => {
            this.m_containerMenu.setVisible(true);
            this.m_containerDlg.setVisible(false);

        });
        return container;
    }

    CreateResultDlg(centerX, centerY) {
        let dlg = this.add.graphics();
        dlg.fillStyle(0xfff9e1);
        dlg.lineStyle(10, 0xf49d5b);
        dlg.fillRoundedRect(-260, -200, 520, 420, 25);
        dlg.strokeRoundedRect(-260, -200, 520, 420, 25);

        let dlg2 = this.add.graphics();
        dlg2.fillStyle(0xfee6ca);
        dlg2.lineStyle(6, 0xe2ceb3);
        dlg2.fillRoundedRect(-200, -100, 400, 160, 20);
        dlg2.strokeRoundedRect(-200, -100, 400, 160, 20);

        let win = this.add.image(0, -220, 'iconCup').setOrigin(0.5);
        win.setScale(2);

        let wrong = this.add.image(0, -220, 'iconWrong').setOrigin(0.5);
        wrong.setScale(2);

        let text = this.add.text(-150, -70, '', {
            fontSize: '45px',
            fill: '#000000', // 白色字体  
            align: 'left',
            baseline: 'middle',
            fontFamily: '微软雅黑'
        });
        text.setText("成绩：");
        //生成按钮
        let btnNext = this.CreateBtnNext();
        let container = this.add.container(centerX, centerY);
        container.add(dlg);
        container.add(dlg2);
        container.add(win);
        container.add(btnNext);
        container.add(wrong);
        container.add(text);

        // 监听事件  
        TT.eventsCenter.on('event-buttonOk', (data) => {
            this.m_containerMenu.setVisible(false);
            this.m_containerDlg.setVisible(true);
            if (data["numDuck"] == data["numUser"]) {
                wrong.setVisible(false);
                win.setVisible(true);
                text.setText("真厉害");
                this.m_isSuccess = true;
                if (data["numDuck"] > TT.NumRecordMax) {
                    TT.NumRecordMax = data["numDuck"];
                }
            } else {
                wrong.setVisible(true);
                win.setVisible(false);
                text.setText(`错啦,有${data["numDuck"]}只`);
                this.m_isSuccess = false;
            }
        });

        return container;
    }

    CreateBtnNext() {
        return this.CreateButton(0, 140, "继  续", (pointer, event) => {
            this.scene.sleep('Menu');
            TT.eventsCenter.emit('event-buttonNext', { data: this.m_isSuccess });
        });
    }

    CreateBtnSingle() {
        return this.CreateButton(0, -120, "单人玩", (pointer, event) => {
            this.scene.sleep('Menu');
            TT.eventsCenter.emit('event-buttonNext', { data: false });
        });
    }

    CreateBtnDouble() {
        return this.CreateButton(0, 0, "双人玩", (pointer, event) => {
            this.scene.sleep('CountShow');
            this.scene.sleep('Menu');
            this.scene.sleep('TitleScene');
            this.scene.wake('MultiPlayer');
        });
    }

    CreateBtnClear() {
        return this.CreateButton(0, 120, "清除历史", (pointer, event) => {
            this.scene.sleep('Menu');
            TT.ClearRecord();
            TT.eventsCenter.emit('event-buttonNext', { data: false });
        });
    }

    CreateButton(x, y, txt, cb) {
        let next = this.add.image(0, 0, 'btnNext').setOrigin(0.5);
        next.setScale(1.8);
        //添加事件
        next.setInteractive({ useHandCursor: true }); // 使用手型光标（可选）  

        // 为文本对象添加点击事件的监听器  
        next.on('pointerdown', (pointer, event) => {
            if (typeof cb == "function") {
                cb(pointer, event);
            }
        });

        let text = this.CreateBtnText(txt);
        let btn = this.add.container(x, y);
        btn.add(next);
        btn.add(text);

        return btn;
    }

    CreateBtnText(txt) {
        let text = this.add.text(0, -5, txt, {
            fontSize: '45px',
            fill: '#fff', // 白色字体  
            align: 'left',
            baseline: 'middle',
            fontFamily: '黑体',
            // stroke:'#fff',
            // strokeThickness:1.2
        }).setOrigin(0.5);
        return text;
    }
}