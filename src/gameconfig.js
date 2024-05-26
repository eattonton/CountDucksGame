import Phaser from "phaser";

class TTGameConfig {
    constructor() {
        this.game = {};
        this.eventsCenter = new Phaser.Events.EventEmitter();
        /**@type {number} 鸭子的数量*/
        this.NumDuck = 0;
        /**@type {boolean} 是否开始*/
        this.IsStart = false;
        /** @type {number} */
        this.NumMax = 5;
        /** @type {number} */
        this.NumRecordMax = 0;
    }

    SaveRecord(){
        let data = {numMax:this.NumMax, numRecordMax:this.NumRecordMax};
        localStorage.setItem("data",JSON.stringify(data));
    }

    RestoreRecord(){
        let data=JSON.parse(localStorage.getItem("data"));
        if(data){
            this.NumMax = data["numMax"] || 5;
            this.NumRecordMax = data["numRecordMax"] || 0;
        }
    }
}
 
const instance = new TTGameConfig();
 
export default instance;