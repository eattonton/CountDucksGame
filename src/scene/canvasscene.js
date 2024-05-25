import Phaser from "phaser";

export default class CanvasScene extends Phaser.Scene{
    constructor(){
        super({
            key: "CanvasScene",
            active: true
        });
    }

    preload(){

    }

    create(){
        console.log("11");
        // 创建一个离屏 Canvas  
        const canvas = document.createElement('canvas');  
        const ctx = canvas.getContext('2d');  
  
        // 设置 Canvas 的大小  
        canvas.width = 200;  
        canvas.height = 100;  
  
        // 在 Canvas 上绘制文本  
        ctx.font = '30px Arial';  
        ctx.fillStyle = '#ff0000'; // 红色  
        ctx.fillText('Hello Phaser!', 10, 50);  
   
        var texture = this.textures.createCanvas('myTexture', canvas.width, canvas.height);
        texture.context.drawImage(canvas, 0, 0);

        // 创建一个精灵并使用加载的纹理
        var sprite = this.add.sprite(200, 200, 'myTexture');

        // 如果需要更新纹理，可以调用以下方法
        texture.refresh();
 
  
        // 注意：这里为了简化示例，我们直接在 create 方法中加载了纹理。  
        // 在实际的游戏开发中，你可能需要在 preload 方法中加载资源。  
    }
}