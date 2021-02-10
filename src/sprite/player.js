import Phaser from "phaser";

// プレイヤーを表すPlayerクラス
class Player extends Phaser.Physics.Arcade.Sprite {
    
    update() {
        // カーソルオブジェクトの取得
        const cursors = this.scene.input.keyboard.createCursorKeys();
        if(cursors.right.isDown) {
            // 右に移動
            this.setVelocityX(this.speed);
            // 右向きのアニメーション
            this.anims.play('right', true);
        } else if(cursors.left.isDown) {
            // 左に移動
            this.setVelocityX(-this.speed);
            // 左向きのアニメーション
            this.anims.play('left', true);
        } else if(cursors.up.isDown) {
            // 上に移動
            this.setVelocityY(-this.speed);
            // 上向きのアニメーション
            this.anims.play('up', true);
        } else if(cursors.down.isDown) {
            // 下に移動
            this.setVelocityY(this.speed);
            // 下向きのアニメーション
            this.anims.play('down', true);
        } else {
            this.setVelocity(0,0);
            // キーを離すとアニメーション停止
            this.anims.stop();
        }
    }
    
    createAnimation() {
        // 正面を向く
        this.scene.anims.create({
            key: 'turn',
            frames: [ { key: 'player', frame: 0 } ],
            frameRate: 20
        });
        // 左向きのアニメーション
        this.scene.anims.create({
            key: 'left',
            frames: this.scene.anims.generateFrameNumbers('player', { start: 3, end: 5 }),
            frameRate: 10,
            repeat: -1
        });
        // 右向きのアニメーション
        this.scene.anims.create({
            key: 'right',
            frames: this.scene.anims.generateFrameNumbers('player', { start: 6, end: 8 }),
            frameRate: 10,
            repeat: -1
        });
        // 上向きのアニメーション
        this.scene.anims.create({
            key: 'up',
            frames: this.scene.anims.generateFrameNumbers('player', { start: 9, end: 11 }),
            frameRate: 10,
            repeat: -1
        });
        // 下向きのアニメーション
        this.scene.anims.create({
            key: 'down',
            frames: this.scene.anims.generateFrameNumbers('player', { start: 0, end: 2 }),
            frameRate: 10,
            repeat: -1
        });
    }
}

export default Player;
