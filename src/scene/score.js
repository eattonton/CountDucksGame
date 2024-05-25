
        //this.scene.sleep("Menu");
        // // 创建一个图形对象并绘制一个灰色矩形作为背景  
        // let graphics = this.add.graphics({ fillStyle: { color: 0x808080 }, x: 0, y: 0 }); // 灰色 #808080  
        // graphics.fillRect(0, 0, 60, 100); // 绘制一个200x50的矩形  

        // // 添加文本到图形对象上，使用白色字体  
        // let text = this.add.text(0, 0, '8', {
        //     fontSize: '64px',
        //     fill: '#ffffff', // 白色字体  
        //     backgroundColor: '', // Phaser的文本对象不支持背景色，这里留空  
        //     align: 'center',
        //     baseline: 'middle',
        //     fontFamily: '微软雅黑'
        // });

        // 2. 将 Graphics 对象生成纹理  
        // let texture = this.textures.createCanvas('myTexture', graphics.width, graphics.height);
        // graphics.generateTexture('myTexture'); // 使用生成的纹理名  

        //sprite.setInteractive({ useHandCursor: true }); // 使用手型光标（可选）  
        // 4. 为 Sprite 对象添加 pointerdown 事件监听器  
        //sprite.on('pointerdown', function (pointer, localX, localY, event) {
        //    console.log('Sprite was clicked!', localX, localY);
        // 在这里添加你的点击事件处理逻辑  
        //});

        // 如果你希望文本和背景一起移动或缩放，可以将它们组合到一个容器（Container）中  
        // let container = this.add.container(100, 100);
        // container.add(graphics);
        // container.add(text);

        // text.setInteractive({ useHandCursor: true }); // 使用手型光标（可选）  

        // // 为文本对象添加点击事件的监听器  
        // text.on('pointerdown', function (pointer, event) {
        //     console.log('8被点击了!');

        // });

        
       
        // 创建一个翻牌动画（这里使用简单的旋转动画作为示例）  

        // this.tweens.add({  
        //     targets: this.card,  
        //     x: this.card.x, // 保持 x 坐标不变  
        //   //  rotation: { from: 0, to: Phaser.Math.DegToRad(180) }, // 从 0 度旋转到 180 度  
        //     scaleX:{from:1, to:0},
        //     duration: 500, // 动画持续时间（毫秒）  
        //     ease: 'Sine.easeInOut', // 缓动函数  
        //     onComplete: () => {  
        //         // 动画完成后，交换卡牌的正反面图像，并准备下一次翻牌  
        //         this.card.setTexture('numbers',2); // 设置为正面图像  
        //         this.card.scaleX = 1.0;
        //        // this.card.setFlipX(true); // 如果正面图像是镜像的，则翻转 X 轴  
        //         //this.card.rotation = 0; // 重置旋转  
        //       //  this.card.on('pointerdown', () => this.flipCardBack()); // 绑定下一次翻牌的监听器  
        //     },  
        //     yoyo: false // 不重复动画（如果要实现连续翻牌效果，可以设置为 true）  
        // });  
        // 设置背景颜色  
        // this.cameras.main.setBackgroundColor('#f2f2f2');  
        //  // 创建一个矩形来模拟页面的上半部分  
        //  const pageTop = this.add.graphics({ fillStyle: { color: 0xffffff, alpha: 0.5 } });  
        //  pageTop.fillRect(100, 100, 600, 300); // 示例位置和尺寸  

        //  // 创建一个矩形来模拟页面的下半部分（稍后会向上移动以模拟翻页）  
        //  const pageBottom = this.add.graphics({ fillStyle: { color: 0xffffff, alpha: 0.5 } });  
        //  pageBottom.fillRect(100, 400, 600, 300); // 示例位置和尺寸  

        //  // 使用 Tweens 来创建翻页动画  
        //  this.tweens.add({  
        //      targets: pageBottom,  
        //      y: 100, // 向上移动到与 pageTop 相同的 y 坐标  
        //      duration: 1000, // 动画持续时间（毫秒）  
        //      ease: 'Cubic.easeInOut', // 缓动函数  
        //      onComplete: () => {  
        //          // 动画完成后可以执行的回调函数  
        //          // 例如，你可以在这里隐藏 pageBottom 或添加新的页面内容  
        //      }  
        //  });  

        // this.gameTimer = this.time.addEvent({
        //         delay: 1000,
        //         callback: function(){
        //             this.timeLeft --;
     
        //             // dividing enery bar width by the number of seconds gives us the amount
        //             // of pixels we need to move the energy bar each second
        //             let stepWidth = this.energyMask.displayWidth / gameOptions.initialTime;
     
        //             // moving the mask
        //             this.energyMask.x -= stepWidth;
        //             if(this.timeLeft == 0){
        //                 this.scene.start("PlayGame")
        //             }
        //         },
        //         callbackScope: this,
        //         loop: true
        //     });

        // // 创建一个计数补间，从0开始，到100结束，持续2秒  
        // this.tweens.addCounter({  
        //         from: 0,  
        //         to: 9,  
        //         duration: 10000, // 毫秒  
        //         ease: 'Linear', // 缓动函数  
        //         yoyo: false, // 是否往返  
        //         repeat: 0, // 重复次数，0表示不重复  
        //         delay: 0, // 延迟开始时间  
        //         onComplete: tween => {  
        //             // 补间完成时的回调函数  
        //             //console.log('Tween completed!'); 
        //             //graphics.clear();  
      
        //             // 开始新的填充颜色，例如蓝色  
        //             //graphics.beginFill(0x0000ff); // RGB for blue  
        //             //graphics.defaultFillColor = 0x0000ff;
        //             //graphics.fillStyle(0x0000ff);
        //             // 重新绘制矩形（使用相同的坐标和大小）  
        //             //graphics.fillCircleShape(circle);
      
        //             // 结束填充  
        //             //graphics.endFill();  
        //         },  
        //         onUpdate: tween => {  
        //             // 每一帧更新时的回调函数  
        //             //text.setText(tween.getValue()); // 更新文本内容为当前计数值  
        //             const value = Math.round(tween.getValue());
        //             text.setText(`${9-value}`);
        //             //渐变颜色
        //             let step = 0.23*tween.getValue();
        //             let a = (step%1);
        //             let t = Math.sin(2.0*Math.PI*a);
        //             a =Math.abs(parseInt(255 * t));
        //            // let a = tween.getValue()%1;
        //             //console.log(b);
        //             let color = ((a << 24) + (a << 16) + (a << 8) + a);
        //             graphics.fillStyle(color);
        //             graphics.fillCircleShape(circle);
    
        //             //text.setFillColor(color);
        //             text.setTint(color);
        //         }  
        //     });  