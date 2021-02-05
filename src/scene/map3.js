import Phaser from "phaser";
import Config from './../data/config';
import PlayerFactory from './../factory/playerFactory';
import PlayerData from './../data/playerData';
import bossEnemyData from './../data/bossEnemyData';
import RandomEncounter from './../other/randomEncounter';

class Map3Scene extends Phaser.Scene {
    constructor() {
        // シーンの名前を設定
        super({key : "Map3Scene"});
    }
    
    create(data) {
        this.config(data);
        // マップの作成
        this.createMap();
        // プレイヤーの作成
        this.createPlayer();
        // 各種衝突の設定
        this.setCollider();
        
        // ランダムエンカウンターのカウント変数
        this.count = 0;
        // ラスボスとの対戦フラグ
        this.battleWithBoss = false;
        // ゲームクリアフラグ
        this.isGameClear = false;
        // シーンが待機状態から復帰した場合に呼び出すメソッドの設定
        this.events.on('wake', this.onWake, this);
        // シェイク完了後には、バトルシーンを起動する
        this.cameras.main.on('camerashakecomplete', function(camera, effect) {
            // シェイクの状態リセット
            this.cameras.main.resetFX();
            // 現在のシーンを待機状態に設定
            this.scene.pause('Map3Scene');
            // バトルシーンを待機状態から復帰
            this.scene.wake('BattleScene', {
                "from" : "Map3Scene",
                "player": this.player,
                "battleWithBoss" : this.battleWithBoss,
            });
            this.count = 0;
        }, this);
    }
    
    update() {
        // プレイヤーの処理を呼び出す
        this.player.update();

        // ゲームクリア、またはボス敵であれば、ランダムエンカウンターは実行しない
        if(this.isGameClear || this.battleWithBoss) {
            return;
        }
        
        // ランダムエンカウンター
        this.count++;
        if(RandomEncounter.encounter(this.count)) {
            // シェイクする
            this.cameras.main.shake(500, 0.1, true);
            // シェイク完了後は、自動的にバトルシーンを起動する
        }
    }

    onWake(sys,data) {
        this.config(data);
        // 物理エンジンを再起動
        this.physics.resume();
        // プレイヤーのHPが「0」になった場合
        if(this.data.player.hp <= 0) {
            // ゲームオーバーシーンに移動
            this.time.addEvent({
                delay: 500,
                callback: this.gameOver,
                loop: false,
                callbackScope: this,
            });
        }
        // ラスボスとのバトルに勝利した場合
        if(this.battleWithBoss && this.data.status == "win") {
            // ラスボス画像を削除
            this.bossEnemy.destroy();
            
        }
        // ラスボスとのバトルから逃げた場合
        if(this.battleWithBoss && this.data.status == "escape") {
            // プレイヤーを上方に移動
            this.player.y -= 50;
            // ラスボスとの対戦フラグを「false」
            this.battleWithBoss = false;
        }
    }
    
    config(data){
        this.data = data;
    }
    
    createMap() {
        // JSON形式のマップデータの読み込み Tilemapオブジェクトの作成
        this.map = this.make.tilemap({key: 'map3'});

        // タイル画像をマップデータに反映する Tilesetオブジェクトの作成
        this.tiles = this.map.addTilesetImage('map_tiles1', 'map_tiles1',Config.TILE_WIDTH, Config.TILE_HEIGTH, 0, Config.TILE_SPACING);
        
        const layerWidth = Config.TILE_WIDTH * Config.TILE_SCALE * Config.TILE_COLUMN;
        const layerHeight = Config.TILE_HEIGTH * Config.TILE_SCALE * Config.TILE_COLUMN;
        
        // Groundレイヤー
        this.groundLayer = this.map.createLayer('Ground', this.tiles, 0, 0);
        this.groundLayer.setDisplaySize(layerWidth, layerHeight);
        
        // Borderレイヤー
        this.borderLayer = this.map.createLayer('Border', this.tiles, 0, 0);
        this.borderLayer.setDisplaySize(layerWidth, layerHeight);
        this.borderLayer.setCollisionByExclusion([-1]);
        
        // Worldレイヤー
        this.worldLayer = this.map.createLayer('World', this.tiles, 0, 0);
        this.worldLayer.setDisplaySize(layerWidth, layerHeight);
        this.worldLayer.setCollisionByExclusion([-1]);
        
        // Environmentレイヤー
        this.environmentleLayer = this.map.createLayer('Environment', this.tiles, 0, 0);
        this.environmentleLayer.setDisplaySize(layerWidth, layerHeight);
        
        // ゲームワールドの幅と高さの設定
        this.physics.world.bounds.width = this.groundLayer.displayWidth;
        this.physics.world.bounds.height = this.groundLayer.displayHeight;
        
        // カメラの表示サイズの設定をする。マップのサイズがカメラの表示サイズ
        this.cameras.main.setBounds(0, 0, this.physics.world.bounds.width, this.physics.world.bounds.height);
        
        this.map.findObject('Area', function(object) {
            // マップ2へ遷移するZONEの作成
            if(object.name == 'ToMap2Scene') {
                this.zoneToMap2 = new Phaser.GameObjects.Zone(
                    this,
                    object.x * Config.TILE_SCALE,
                    object.y * Config.TILE_SCALE,
                    object.width * Config.TILE_SCALE,
                    object.height * Config.TILE_SCALE);
                this.zoneToMap2.setOrigin(0, 0);
                this.physics.add.existing(this.zoneToMap2);
            }
        }, this);
        this.map.findObject('Goal', function(object) {
            // ラスボスと会敵するZONEの作成
            if(object.name == 'BossArea') {
                this.zoneBossArea = new Phaser.GameObjects.Zone(
                    this,
                    object.x * Config.TILE_SCALE,
                    object.y * Config.TILE_SCALE,
                    object.width * Config.TILE_SCALE,
                    object.height * Config.TILE_SCALE);
                this.zoneBossArea.setOrigin(0, 0);
                this.physics.add.existing(this.zoneBossArea);
            }
            // ラスボスの画像表示
            if(object.name == 'BossEnemy') {
                const x = object.x * Config.TILE_SCALE;
                const y = object.y * Config.TILE_SCALE;
                this.bossEnemy = this.add.image(x, y, bossEnemyData.image);
                this.bossEnemy.setDisplaySize(48, 48);
            }
            // 宝箱の画像表示
            if(object.name == "TreasureBox") {
                const x = object.x * Config.TILE_SCALE;
                const y = object.y * Config.TILE_SCALE;
                this.treasuaBox = this.physics.add.image(x, y, 'treasure01');
                // 表示サイズを変更する前に、物理エンジンでの判定サイズの変更
                this.treasuaBox.body.setSize(20,20);
                this.treasuaBox.setDisplaySize(48, 48);
            }
        }, this);
    }
    
    createPlayer() {
        if(this.data.from == 'Map2Scene') {
            // マップ2から移動してきた場合
            this.map.findObject('Player', function(object) {
                if (object.name == 'FromMap2Scene') {
                    PlayerData.x = object.x * Config.TILE_SCALE;
                    PlayerData.y = object.y * Config.TILE_SCALE;
                    PlayerData.hp = this.data.player.hp;
                    PlayerData.portion = this.data.player.portion;
                    this.player = PlayerFactory.create(this, PlayerData);
                }
            }, this);
        }
        
        // プレイヤーをシーンに追加
        this.add.existing(this.player);
        // プレイヤーを物理エンジンの対象に追加
        this.physics.add.existing(this.player);
        // カメラはプレイヤーを追跡
        this.cameras.main.startFollow(this.player);
    }
    
    setCollider() {
        // プレイヤーはゲーム空間と衝突
        this.player.setCollideWorldBounds(true);
        // プレイヤーはborderレイヤーと衝突
        this.physics.add.collider(this.player, this.borderLayer);
        // プレイヤーはworldレイヤーと衝突
        this.physics.add.collider(this.player, this.worldLayer);
        // プレイヤーはマップ2へ移動するZONEと衝突
        this.physics.add.overlap(this.player, this.zoneToMap2, this.moveSceneToMap2, null, this);
        // プレイヤーはラスボスと戦闘するZONEと衝突
        this.physics.add.overlap(this.player, this.zoneBossArea, this.startBossBattle, null, this);
        // プレイヤーは宝箱と衝突
        this.physics.add.overlap(this.player, this.treasuaBox, this.hitTreasure, null, this);
    }
    
    moveSceneToMap2() {
        // マップ2へ移動
        this.scene.start("Map2Scene",{
            "from" : "Map3Scene",
            "player" : this.player,
        });
    }
    
    startBossBattle() {
        // ラスボスとの戦闘開始
        if(!this.battleWithBoss) {
            // ラスボスとの戦闘フラグを「true」
            this.battleWithBoss = true;
            // 物理エンジンを停止
            this.physics.pause();
            // シェイクする
            this.cameras.main.shake(500, 0.1, true);
        }
    }
    
    gameOver() {
        // ゲームオーバーシーンへ移動
        this.scene.start("GameOverScene",{
            from : "Map3Scene",
        });
    }
    
    hitTreasure() {
        // 宝箱と衝突したときの処理
        // ゲームクリアフラグが「true」なら実行しない
        if(this.isGameClear) {
            return;
        }
        // ゲームクリアフラグを「true」
        this.isGameClear = true;
        // プレイヤーの移動処理停止
        this.player.setVelocity(0,0);
        // プレイヤーのアニメーション停止
        this.player.anims.stop();
        // 物理エンジン停止
        this.physics.pause();
        // 画面の中央座標の取得
        const cameraPositionX = this.cameras.main.midPoint.x;
        const cameraPositionY = this.cameras.main.midPoint.y;
        // 宝物画像の表示
        const treasureImage = this.add.image(cameraPositionX, cameraPositionY-200, 'treasure');
        treasureImage.setDisplaySize(300, 300);
        // メッセージの表示
        this.message = this.add.text( cameraPositionX-300, cameraPositionY, "宝物を見つけた！", {
            font: '100px Open Sans',
            fill: "#ff0000",
        });
        // 2秒後にゲームクリア処理を実行
        this.time.addEvent({
            delay: 2000,
            callback: this.gameClear,
            loop: false,
            callbackScope: this,
        });
    }
    
    gameClear() {
        // ゲームクリア処理
        // カメラをフェードアウト
        this.cameras.main.fadeOut(1000, 255,215,0);
        // フェードアウト完了後
        this.cameras.main.on('camerafadeoutcomplete', function(camera, effect) {
            // ゲームクリアシーンへ移動する
            this.scene.start("GameClearScene",{
                from : "Map3Scene",
            });
        }, this);
    }
}

export default Map3Scene;
