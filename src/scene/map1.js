import Phaser from "phaser";
import Config from './../data/config';
import PlayerFactory from './../factory/playerFactory';
import PlayerData from './../data/playerData';
import RandomEncounter from './../other/randomEncounter';

class Map1Scene extends Phaser.Scene {
    constructor() {
        // シーンの名前を設定
        super({key : "Map1Scene"});
    }
    
    create(data) {
        this.config(data);
        // マップの作成
        
        // プレイヤーの作成
        
        // 各種衝突の設定
        
        
        // ランダムエンカウンターのカウント変数
        
        // シーンが待機状態から復帰した場合に呼び出すメソッドの設定
        
        
        // シェイク完了後には、バトルシーンを起動する
        
    }
    
    update() {
        // プレイヤーの処理を呼び出す
        
        
        // ランダムエンカウンター
        
    }

    onWake(sys,data) {
        this.config(data);
        // プレイヤーのHPが「0」になった場合
        
    }
    
    config(data) {
        this.data = data;
    }
    
    createMap() {
        // JSON形式のマップデータの読み込み Tilemapオブジェクトの作成
        

        // タイル画像をマップデータに反映する Tilesetオブジェクトの作成
        
        
        // Groundレイヤー
        
        
        // Borderレイヤー
        
        
        // Worldレイヤー
        
        
        // Environmentレイヤー
        
        
        // ゲームワールドの幅と高さの設定
        
        
        // カメラの表示サイズの設定をする。マップのサイズがカメラの表示サイズ
        
        
        this.map.findObject("Area", function(object) {
            // マップ2へ遷移するZONEの作成
            if(object.name == "ToMap2Scene") {
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
    }
    
    createPlayer() {
        // スタートシーンから移動してきた場合
        if(this.data.from == "StartScene") {
            this.map.findObject('Player', function(object) {
                if (object.name == "FromStartScene") {
                    PlayerData.x = object.x * Config.TILE_SCALE;
                    PlayerData.y = object.y * Config.TILE_SCALE;
                    // 設定基づいてプレイヤーを作成
                    this.player = PlayerFactory.create(this, PlayerData);
                }
            }, this);
        }
        // マップ2から移動してきた場合
        if(this.data.from == "Map2Scene") {
            this.map.findObject("Player", function(object) {
                if (object.name == "FromMap2Scene") {
                    PlayerData.x = object.x * Config.TILE_SCALE;
                    PlayerData.y = object.y * Config.TILE_SCALE;
                    // プレイヤーのHPを引き継ぐ
                    PlayerData.hp = this.data.player.hp;
                    // プレイヤーの薬草を引き継ぐ
                    PlayerData.portion = this.data.player.portion;
                    // 設定基づいてプレイヤーを作成
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
    }
    
    moveSceneToMap2() {
        // マップ2へ移動
        this.scene.start("Map2Scene",{
            "from" : "Map1Scene",
            "player" : this.player,
        });
    }
    
    gameOver() {
        // ゲームオーバーシーンへ移動
        
    }
}

export default Map1Scene;
