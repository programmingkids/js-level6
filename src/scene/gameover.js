import Phaser from "phaser";

class GameOverScene extends Phaser.Scene {
    constructor() {
        // シーンの名前を設定
        super({key : "GameOverScene"});
    }
    
    create(data) {
        // 背景色を設定
        this.cameras.main.setBackgroundColor("#000");
        // 画面の中央座標を取得
        const cameraPositionX = this.cameras.main.midPoint.x;
        const cameraPositionY = this.cameras.main.midPoint.y;
        // メッセージを表示
        this.add.text(cameraPositionX-150, cameraPositionY-300, "残念！", {
            font: "100px Open Sans",
            fill: "#ff0000",
        });
        // ゲームオーバー画像を画面中央に表示
        
        // ゲームオーバー画像サイズの変更
        
    }
}

export default GameOverScene;
