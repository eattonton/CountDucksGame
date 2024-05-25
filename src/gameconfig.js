import Phaser from "phaser";

class TTGameConfig {
    constructor() {
        this.game = {};
        this.eventsCenter = new Phaser.Events.EventEmitter();
        /**@type {number} 鸭子的数量*/
        this.NumDuck = 0;
        /**@type {boolean} 是否开始*/
        this.IsStart = false;
    }

    SetRecord(){

    }

    GetRecord(){
        
    }
}
 
const instance = new TTGameConfig();
 
export default instance;