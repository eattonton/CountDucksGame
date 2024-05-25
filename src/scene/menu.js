import Phaser from "phaser";
import TT from "../gameconfig"
import { CreateSceneMask } from "../sprite/timecard";

export default class Menu extends Phaser.Scene {  
    constructor(){
        super({
            key:"Menu"
        });
    }

    preload() {  
         
    }  
  
    create() {  
        let centerX = this.scale.width/2;
        let centerY = this.scale.height/2;  
        
        let mask = CreateSceneMask(this);

        let dlg = this.add.image(0, 0, 'iconUi').setOrigin(0.5);
        dlg.setScale(2);

        let win = this.add.image(0, -220, 'iconCup').setOrigin(0.5);
        win.setScale(2);

        let wrong = this.add.image(0, -220, 'iconWrong').setOrigin(0.5);
        wrong.setScale(2);

        let next = this.add.image(0, 140, 'btnNext').setOrigin(0.5);
        next.setScale(1.8);

        let text = this.add.text(-150, -70, '', {   
            fontSize: '45px',   
            fill: '#000000', // 白色字体  
            align: 'left',  
            baseline: 'middle',
            fontFamily: '微软雅黑'  
        });  
        text.setText("成绩：");

        let container = this.add.container(centerX, centerY);  
        container.add(dlg);  
        container.add(win);  
        container.add(next);  
        container.add(wrong);
        container.add(text);

        // 监听事件  
        TT.eventsCenter.on('event-buttonOk', (data) => {
             if(data["numDuck"] == data["numUser"]){
                wrong.setVisible(false);
                win.setVisible(true);
             }else{
                wrong.setVisible(true);
                win.setVisible(false);
             }
             
         });
         
        //不显示
        //container.visible = false;
        //添加事件
        next.setInteractive({ useHandCursor: true }); // 使用手型光标（可选）  
  
        // 为文本对象添加点击事件的监听器  
        next.on('pointerdown', (pointer, event) =>{  
           this.scene.sleep('Menu');
           TT.eventsCenter.emit('event-buttonNext', { data: 'some data' }); 
        });  
    }
}