import Phaser from "phaser";
import EnemyFactory from './../factory/enemyFactory';
import QuizFactory from './../factory/quizFactory';

class BattleScene extends Phaser.Scene {
    constructor() {
        // シーンの名前を設定
        super({
            key : "BattleScene",
        });
    }
    
    create(data) {
        // シーンの設定を保存する
        this.config(data);
        // バトル結果の状態を表す変数
        this.status = null;
        // シーンが待機状態から復帰したときの処理
        this.events.on('wake', this.onWake, this);
        // 初回起動時に基本UIだけ描いておく
        this.drawScene();
    }
    
    update() {
        // nothing to do
    }
    
    onWake(sys, data) {
        this.config(data);
        // 敵を作成
        this.enemy = EnemyFactory.create(this.data.battleWithBoss);
        // すべてのボタンを有効化
        this.enableButton();
        // テキストエリアをクリアする
        this.clearMessage();
        // プレイヤーと敵は待機状態から復帰するたびに描く
        this.drawOnWake();
    }
    
    config(data){
        this.data = data;
    }
    
    drawScene() {
        // ベースとなる基本UI作成
        // 背景を作成
        this.drawBackground();
        // テキストエリアを作成
        this.createTextArea();
        // 解答用ボタンを作成
        this.craeteAnswerButton();
        // その他のボタンを作成
        this.createOtherButton();
    }
    
    drawOnWake() {
        // バトルシーンが待機状態から復帰したときに描く処理
        // プレイヤーを描く
        this.drawPlayer();
        // 敵を描く
        this.drawEnemy();
        // 最初のメッセージを表示
        this.initialMessage();
        // 質問を作成
        this.setQuestion();
    }

    drawBackground() {
        // シーン全体の背景色 黒の透過画面
        this.cameras.main.setBackgroundColor('rgba(0,0,0,150)');
        // 画面中央の灰色の枠を透過画面で表示
        this.add.rectangle(0, 0, 800, 600, 0xf1f1f1, 0.8).setOrigin(0,0);
        // カメラの中心を移動
        this.cameras.main.centerOn(400, 300);
    }
    
    createTextArea() {
        // メッセージエリア
        this.textArea = this.rexUI.add.textArea({
            x: 400,
            y: 300,
            width: 700,
            height: 200,
            background: this.rexUI.add.roundRectangle(0, 0, 700, 200, 0, 0xffffff),
            text: this.add.text(0,0, "",{
                font: '14px Open Sans',
                fill: '#000000',
                wordWrap: {
                    width: 300,
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
    }
    
    craeteAnswerButton() {
        // 解答用ボタンを作成
        this.answerButtons = [];
        for( var i = 0; i < 4; i++ ) {
            const space = 20;
            const width = 160;
            const height = 50;
            const x = 50 + i * width + i * space + width / 2;
            const y = 475;
            const button = this.add.image(x, y, 'button_orange');
            this.answerButtons.push(button);
            button.setDisplaySize(width, height);
            this.add.text( x - 5 , y - 15, i + 1, {
                font: '20px Open Sans',
                fill: '#ffffff'
            });
            button.setInteractive({
                useHandCursor: true,
            });
            
            (function(i, context){
                button.on('pointerdown',function(){
                    this.disableButton();
                    this.answerQuestion(i);
                }, context);
            }(i, this));
        }
    }

    createOtherButton() {
        // 薬草ボタン
        this.portionButton = this.add.image(150, 550, 'button_green');
        this.portionButton.setDisplaySize(230, 50);
        this.portionText = this.add.text( 130, 540, "薬草", {
            font: '20px Open Sans',
            fill: '#ffffff'
        });
        this.portionButton.setInteractive({
            useHandCursor: true,
        });
        // 薬草ボタンをクリックすると、薬草を利用して、HPを回復
        this.portionButton.on('pointerdown',function(){
            this.recovery();
        },this);
        
        // 逃げるボタン
        this.escapeButton = this.add.image(650, 550, 'button_red');
        this.escapeButton.setDisplaySize(230, 50);
        this.escapeText = this.add.text( 620, 540, "逃げる", {
            font: '20px Open Sans',
            fill: '#ffffff'
        });
        this.escapeButton.setInteractive({
            useHandCursor: true,
        });
        // 逃げるボタンをクリックすると「逃げる」
        this.escapeButton.on('pointerdown',function(){
            this.escape();
        },this);
    }
    
    drawPlayer() {
        if(this.playerImage != null) {
            this.playerImage.destroy();
            this.playerNameLabel.destroy();
            this.playerNameText.destroy();
            this.playerHpLabel.destroy();
            this.playerHpText.destroy();
            this.playerPortionLabel.destroy();
            this.playerPortionText.destroy();
        }
        // プレイヤー画像表示
        this.playerImage = this.add.image( 100, 100, this.data.player.frame.texture);
        this.playerImage.setDisplaySize(100, 100);
        // プレイヤーの名前
        this.playerNameLabel = this.add.text( 160, 50, "名前：", {
            font: '20px Open Sans',
            fill: '#000'
        });
        this.playerNameText = this.add.text( 220, 50, this.data.player.name, {
            font: '20px Open Sans',
            fill: '#000'
        });
        // プレイヤーのHP
        this.playerHpLabel = this.add.text( 160, 90, "HP：", {
            font: '20px Open Sans',
            fill: '#000'
        });
        this.playerHpText = this.add.text( 220, 90, this.data.player.hp, {
            font: '20px Open Sans',
            fill: '#000'
        });
        // プレイヤーのポーション
        this.playerPortionLabel = this.add.text( 160, 130, "薬草：", {
            font: '20px Open Sans',
            fill: '#000'
        });
        this.playerPortionText = this.add.text( 220, 130, this.data.player.portion, {
            font: '20px Open Sans',
            fill: '#000'
        });
    }
    
    drawEnemy() {
        if(this.enemyImage != null) {
            this.enemyImage.destroy();
            this.enemyNameLabel.destroy();
            this.enemyNameText.destroy();
            this.enemyHpLabel.destroy();
            this.enemyHpText.destroy();
        }
        // 敵の画像
        this.enemyImage = this.add.image( 400, 100, this.enemy.image);
        this.enemyImage.setDisplaySize(100, 100);

        // 敵の名前
        this.enemyNameLabel = this.add.text( 460, 50, "名前：", {
            font: '20px Open Sans',
            fill: '#000'
        });
        this.enemyNameText = this.add.text( 520, 50, this.enemy.name, {
            font: '20px Open Sans',
            fill: '#000',
        });
        // 敵のHP
        this.enemyHpLabel = this.add.text( 460, 90, "HP：", {
            font: '20px Open Sans',
            fill: '#000'
        });
        this.enemyHpText = this.add.text( 520, 90, this.enemy.hp, {
            font: '20px Open Sans',
            fill: '#000'
        });
    }
    
    initialMessage() {
        // 最初のメッセージを表示
        let text = "「" + this.enemy.name + "」が現れた！";
        this.showMessage(text);
        this.showMessage("");
    }

    setQuestion() {
        // クイズに関する情報を作成
        // Quizクラスの作成
        this.quiz = QuizFactory.create(this);
        
        // クイズの問題文を表示
        this.showMessage(this.quiz.text);
        this.showMessage("");
        this.showMessage("");
        
        // クイズの選択肢を画面に表示
        this.quiz.answers.forEach((answer, index) => {
            let a = (index + 1) + " : " + answer;
            this.showMessage(a);
        }, this);
    }
    
    answerQuestion(index) {
        // 解答用ボタンをクリックしたときの処理
        let text = "";
        let fill = "";
        this.result = null;
        if(this.quiz.getAnswer(index)) {
            // 正解
            this.result = true;
            text = "〇";
            fill = "#0000ff";
        } else {
            // 間違い
            this.result = false;
            text = "×";
            fill = "#ff0000";
        }
        // メッセージを表示
        this.resultText = this.add.text( 200, 0, text, {
            font: '400px Open Sans',
            fill: fill,
        });
        // 1秒後にメッセージ後の処理を実行
        this.time.addEvent({
            delay: 1000,
            callback : this.afterAnswer,
            loop: false,
            callbackScope: this,
        });
    }
    
    afterAnswer() {
        // 解答後のメッセージを表示した後の処理
        // メッセージを作成
        this.resultText.destroy();
        let message = "";
        if(this.result) {
            // 正解なので敵のHPを減少
            this.enemy.hp--;
            this.enemyHpText.setText(this.enemy.hp);
            message = "正解!";
            this.showMessage(message);
            this.showMessage("");
            message = "敵にダメージを与えた";
            this.showMessage(message);
            this.showMessage("");
        } else {
            // 間違いなのでプレイヤーのHPを減少
            this.data.player.hp--;
            this.playerHpText.setText(this.data.player.hp);
            message = "残念！間違い…";
            this.showMessage(message);
            this.showMessage("");
            message = "プレイヤーはダメージを受けた";
            this.showMessage(message);
            this.showMessage("");
        }
        // 問題解答後の次の処理を判定
        this.judgeNextTurn();
    }
    
    judgeNextTurn() {
        // 問題解答後の次の処理を判定
        let message = "";
        if(this.data.player.hp <= 0) {
            // プレイヤーが負けた
            message = "プレイヤーは負けた";
            this.showMessage(message);
            this.showMessage("");
            
            // ステータスを「lose」に設定
            this.status = "lose";
            
            // マップシーンに移動
            this.time.addEvent({
                delay: 2000,
                callback: this.sleepSceneAndBackToMap,
                loop: false,
                callbackScope: this,
            });
        } else if(this.enemy.hp <= 0) {
            // 敵を倒した
            message = "敵を倒した";
            this.showMessage(message);
            this.showMessage("");

            // ステータスを「win」に設定
            this.status = "win";
            
            // プレイヤーのHPを加算
            this.data.player.hp++;
            this.playerHpText.setText(this.data.player.hp);
            message = "プレイヤーのHPが回復した";
            this.showMessage(message);
            this.showMessage("");
            
            // 薬草を見つける
            const randomNum = Phaser.Math.RND.between(1, 3);
            if(randomNum == 1) {
                this.data.player.portion++;
                this.playerPortionText.setText(this.data.player.portion);
                message = "プレイヤーは薬草を見つけた";
                this.showMessage(message);
                this.showMessage("");
            }
            
            // マップシーンに移動
            this.time.addEvent({
                delay: 2000,
                callback: this.sleepSceneAndBackToMap,
                loop: false,
                callbackScope: this,
            });
        } else {
            // バトル継続
            message = "＜＜＜バトルは続きます＞＞";
            this.showMessage(message);
            this.showMessage("");
            // 次のクイズを設定する
            this.time.addEvent({
                delay: 2000,
                callback: this.setNextQuestion,
                loop: false,
                callbackScope: this,
            });
        }
    }
    
    setNextQuestion() {
        // 次のクイズを設定する
        // テキストエリアをクリア
        this.clearMessage();
        // 次のクイズを作成
        this.setQuestion();
        // ボタンを有効化
        this.enableButton();
    }
    
    recovery() {
        // ボタンを無効化
        this.disableButton();
        let message = "";
        if(this.data.player.portion > 0) {
            // プレイヤーのHP回復
            this.data.player.hp++;
            this.playerHpText.setText(this.data.player.hp);
            this.data.player.portion--;
            this.playerPortionText.setText(this.data.player.portion);
            message = "プレイヤーは薬草を使った";
            this.showMessage(message);
            this.showMessage("");
            message = "プレイヤーのHPが回復した!";
            this.showMessage(message);
            this.showMessage("");
        } else {
            message = "薬草がありません";
            this.showMessage(message);
            this.showMessage("");
        }
        // ボタンを有効化
        this.enableButton();
    }
    
    escape() {
        // 逃げる
        // ボタンを無効化
        this.disableButton();
        // ステータスを「escape」に設定
        this.status = "escape";
        // マップシーンに移動
        this.sleepSceneAndBackToMap();
    }

    showMessage(text) {
        // メッセージに文字の追加
        this.textArea.appendText(text + "\n");
        // 自動的にテキストエリアの最下部にスクロール
        this.textArea.scrollToBottom();
    }
    
    clearMessage() {
        // テキストエリアの文字をクリアする
        this.textArea.setText("");
        this.textArea.scrollToBottom();
    }
    
    sleepSceneAndBackToMap() {
        // マップシーンに戻る
        // テキストエリアの文字をクリアする
        this.clearMessage();
        // カメラをフェードアウト
        this.cameras.main.fadeOut(500, 0,0,0);
        // フェードアウト完了後にシーンを移動
        this.cameras.main.on('camerafadeoutcomplete', function(camera, effect) {
            // カメラの状態リセット
            this.cameras.main.resetFX();
            // バトルシーンを停止
            this.scene.sleep('BattleScene');
            // マップシーンに戻る
            this.scene.wake(this.data.from, {
                "from" : "BattleScene",
                "player" : this.data.player,
                "status" : this.status,
            });
        }, this);
    }
    
    disableButton() {
        // 全てのボタンの無効化
        for(const button of this.answerButtons) {
            button.disableInteractive();
        }
        this.portionButton.disableInteractive();
        this.escapeButton.disableInteractive();
    }

    enableButton() {
        // 全てのボタンの有効化
        for(const button of this.answerButtons) {
            button.setInteractive();
        }
        this.portionButton.setInteractive();
        this.escapeButton.setInteractive();
    }
}

export default BattleScene;
