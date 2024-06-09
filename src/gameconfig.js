import Phaser from "phaser";

class TTGameConfig {
    
    constructor() {
        this.game = {};
        this.eventsCenter = new Phaser.Events.EventEmitter();
        /**@type {number} 鸭子的数量*/
        this.NumDuck = 0;
        /**@type {boolean} 是否开始*/
        this.IsStart = false;
        /** @type {number} 最大数量*/
        this.NumMax = 5;
        /** @type {number} 最大数量*/
        this.NumMax2 = 5;
        /** @type {number} */
        this.NumRecordMax = 0;

        /** @type {number} */
        this.width = 0;
        /** @type {number} */
        this.height = 0;

        /** @type {boolean} */
        this.IsMultiPlayer = false;
        /** @type {boolean} */
        this.IsFullScreen = false;

        /** @type {boolean} */
        this.IsLandscape = false;

        /** @type {number} */
        this.Zoom = 0.5;

        this.ENUMPosition = {
            Center:0,
            LeftTop:1,
            RightTop:2,
            LeftBottom:3,
            RightBottom:4
        }
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

    ClearRecord(){
        localStorage.removeItem("data");
        this.NumMax = 5;
        this.NumRecordMax = 0;
    }

    GetX(){

    }

    GetY(){

    }

}
 
const instance = new TTGameConfig();
 
export default instance;