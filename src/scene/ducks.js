import Phaser from "phaser";
import TT from "../gameconfig"
import { GetRandQueueInRange, RandomInt } from "../js/math"

export default class Ducks extends Phaser.Scene{
    constructor(){
        super({
            key:'Ducks'
        })
    }
    /** @type {Array<Phaser.GameObjects.sprite>} */
    m_Ducks = [];

    /** @type {boolean} */
    m_IsAnim = false;
 
    m_MinX = 0;
    m_MinY = 0;
    m_MaxX = 400;
    m_MaxY = 1100;
    m_Step = 20;
     
    preload(){

    }

    create(){
        this.cameras.main.setZoom(TT.Zoom*1.4);
        // 监听事件  
        TT.eventsCenter.on('event-createDucks', (data) => {
            this.m_MaxX = 600;
            this.m_MaxY = 900;
            this.cameras.main.setRotation(0);
            this.cameras.main.centerOn(0.5*this.m_MaxX, 0.5*this.m_MaxY);
            if (TT.NumMax <= 5) {
                TT.NumDuck = RandomInt(4, 5);
            }
            else {
                TT.NumDuck = RandomInt(TT.NumMax - 4, TT.NumMax);
            }    
            this.CreateDucks(TT.NumDuck);
        })

        TT.eventsCenter.on('event-createDucksB', (data)=>{
            if(!TT.IsLandscape){
                //竖屏
                this.cameras.main.setRotation(0.5*Math.PI);
            } 
            this.m_MaxX = 1200;
            this.m_MaxY = 400;
            if (TT.NumMax2 <= 5) {
                TT.NumDuck = RandomInt(4, 5);
            }
            else {
                TT.NumDuck = RandomInt(TT.NumMax2 - 4, TT.NumMax2);
            }    
            this.cameras.main.centerOn(0.5*this.m_MaxX-50, 0.5*this.m_MaxY);
            this.CreateDucks(TT.NumDuck);
        })
    }

    update(){
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

    RotateScene() {
        //竖直
        this.cameras.main.setRotation(0.5*Math.PI);
        this.cameras.main.centerOn(0.5*this.m_MaxX-50, 0.5*this.m_MaxY);
 
    }

    RestoreScene() {
        //横屏
        this.cameras.main.setRotation(0);
        this.cameras.main.centerOn(0.5*this.m_MaxX-50, 0.5*this.m_MaxY);
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
            let duck0 = this.add.sprite(posx * (this.m_MaxX / col) + 0, posy * (this.m_MaxY / row) + 0, 'duck', 0).setOrigin(0.5);
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