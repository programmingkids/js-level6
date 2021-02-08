import Phaser from "phaser";

class StartScene extends Phaser.Scene {
    constructor() {
        // シーンの名前を設定
        super({key : "StartScene"});
    }
    
    create(data) {
        // 背景色を設定
        this.cameras.main.setBackgroundColor("#B0E0E6");
        // 画面の中央座標を取得
        const cameraPositionX = this.cameras.main.midPoint.x;
        const cameraPositionY = this.cameras.main.midPoint.y;
        // メッセージを表示
        this.add.text(cameraPositionX-350, cameraPositionY-300, "クイズモンスター", {
            font: "100px Open Sans",
            fill: "#ff0000",
        });
        // スタート画像を画面中央に表示
        const startImage = this.add.image(cameraPositionX, cameraPositionY, "button_start");
        // スタート画像サイズの変更
        startImage.setDisplaySize(400, 150);
        startImage.setInteractive({
            useHandCursor: true,
        });
        startImage.on("pointerdown",function() {
            // スタート画像をクリックするとマップシーンを起動
            // バトルシーンが待機中でない場合、起動して、待機状態にする
            if(!this.scene.isSleeping("BattleScene")) {
                // バトルシーンを起動
                this.scene.start("BattleScene");
                // バトルシーンを待機状態
                this.scene.sleep("BattleScene");
            }
            // マップシーンを起動
            this.scene.start("Map1Scene", {
                "from" : "StartScene",
            });
        }, this);
        // テキストエリアを表示
        this.createTextArea();
    }
    
    createTextArea() {
        // 画面の中央座標を取得
        const cameraPositionX = this.cameras.main.midPoint.x;
        const cameraPositionY = this.cameras.main.midPoint.y;
        // メッセージエリア
        this.textArea = this.rexUI.add.textArea({
            x: cameraPositionX,
            y: cameraPositionY + 200,
            width: 600,
            height: 200,
            background: this.rexUI.add.roundRectangle(0, 0, 600, 200, 0, 0xffffff),
            text: this.add.text(0,0, "", {
                font: "14px Open Sans",
                fill: "#000000",
                wordWrap: {
                    width: 600,
                    useAdvancedWrap: true
                }
            }),
            space: {
                left: 20,
                right: 20,
                top: 20,
                bottom: 20,
            },
            slider: {
                track: this.rexUI.add.roundRectangle(0, 0, 20, 450, 10, 0xcccccc),
                thumb: this.rexUI.add.roundRectangle(0, 0, 20, 10, 10, 0xff0000),
            },
            scroller: true,
        });
        this.textArea.layout();
        this.textArea.drawBounds(this.add.graphics());
        // 注意事項のメッセージ
        const text = "<<< 重要 >>>\n"
                   + "このゲームのクイズは「AI」により自動作成した問題です。"
                   + "そのため、問題、選択肢は「不正確」な場合があります\n\n\n"
                   + "1 : 問題文の日本語がおかしい場合があります\n"
                   + "2 : 問題文が質問形式になっていない場合があります\n"
                   + "3 : 問題文と選択肢がミスマッチしている場合があります\n"
                   + "4 : 選択肢に「正解」が含まれない場合があります\n"
                   + "5 : 選択肢の「正解」が実際には「誤り」の場合があります\n";
        this.textArea.setText(text);
    }
}

export default StartScene;
