import Phaser from "phaser";

class GameClearScene extends Phaser.Scene {
    constructor() {
        // シーンの名前を設定
        super({key : "GameClearScene"});
    }
    
    create(data) {
        // 背景色を設定
        this.cameras.main.setBackgroundColor("#FFD700");
        // 画面の中央座標を取得
        const cameraPositionX = this.cameras.main.midPoint.x;
        const cameraPositionY = this.cameras.main.midPoint.y;
        // メッセージを表示
        this.add.text( cameraPositionX-250, cameraPositionY-300, "おめでとう", {
            font: '100px Open Sans',
            fill: "#ff0000",
        });
        // ゲームクリア画像を画面中央に表示
        const gameClearImage = this.add.image(cameraPositionX, cameraPositionY, 'button_gameclear');
        // ゲームクリア画像サイズの変更
        gameClearImage.setDisplaySize(400, 150);
        gameClearImage.setInteractive({
            useHandCursor: true,
        });
        gameClearImage.on('pointerdown',function(){
            // ゲームクリア画像をクリックするとスタートシーンを起動
            this.scene.start("StartScene", {
                "from" : "GameClearScene",
            });
        }, this);
    }
}

export default GameClearScene;
