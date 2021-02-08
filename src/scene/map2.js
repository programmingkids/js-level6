import Phaser from "phaser";
import Config from './../data/config';
import PlayerFactory from './../factory/playerFactory';
import PlayerData from './../data/playerData';
import RandomEncounter from './../other/randomEncounter';

class Map2Scene extends Phaser.Scene {
    constructor() {
        // シーンの名前を設定
        super({key : "Map2Scene"});
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
        // シーンが待機状態から復帰した場合に呼び出すメソッドの設定
        this.events.on("wake", this.onWake, this);
        // シェイク完了後には、バトルシーンを起動する
        this.cameras.main.on("camerashakecomplete", function(camera, effect) {
            // シェイクの状態リセット
            this.cameras.main.resetFX();
            // 現在のシーンを待機状態に設定
            this.scene.pause("Map2Scene");
            // バトルシーンを待機状態から復帰
            this.scene.wake("BattleScene", {
                "from" : "Map2Scene",
                "player": this.player,
                "battleWithBoss" : false,
            });
            this.count = 0;
        }, this);
    }
    
    update() {
        // プレイヤーの処理を呼び出す
        this.player.update();
        
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
    }
    
    config(data) {
        this.data = data;
    }
    
    createMap() {
        // JSON形式のマップデータの読み込み Tilemapオブジェクトの作成
        this.map = this.make.tilemap({key: "map2"});

        // タイル画像をマップデータに反映する Tilesetオブジェクトの作成
        this.tiles = this.map.addTilesetImage("map_tiles1", "map_tiles1", Config.TILE_WIDTH, Config.TILE_HEIGTH, 0, Config.TILE_SPACING);
        
        const layerWidth = Config.TILE_WIDTH * Config.TILE_SCALE * Config.TILE_COLUMN;
        const layerHeight = Config.TILE_HEIGTH * Config.TILE_SCALE * Config.TILE_COLUMN;
        
        // Groundレイヤー
        this.groundLayer = this.map.createLayer("Ground", this.tiles, 0, 0);
        this.groundLayer.setDisplaySize(layerWidth, layerHeight);
        
        // Borderレイヤー
        this.borderLayer = this.map.createLayer("Border", this.tiles, 0, 0);
        this.borderLayer.setDisplaySize(layerWidth, layerHeight);
        this.borderLayer.setCollisionByExclusion([-1]);
        
        // Worldレイヤー
        this.worldLayer = this.map.createLayer("World", this.tiles, 0, 0);
        this.worldLayer.setDisplaySize(layerWidth, layerHeight);
        this.worldLayer.setCollisionByExclusion([-1]);
        
        // Environmentレイヤー
        this.environmentleLayer = this.map.createLayer("Environment", this.tiles, 0, 0);
        this.environmentleLayer.setDisplaySize(layerWidth, layerHeight);
        
        // ゲームワールドの幅と高さの設定
        this.physics.world.bounds.width = this.groundLayer.displayWidth;
        this.physics.world.bounds.height = this.groundLayer.displayHeight;
        
        // カメラの表示サイズの設定をする。マップのサイズがカメラの表示サイズ
        this.cameras.main.setBounds(0, 0, this.physics.world.bounds.width, this.physics.world.bounds.height);

        this.map.findObject("Area", function(object) {
            // マップ1へ遷移するZONEの作成
            if(object.name == "ToMap1Scene") {
                this.zoneToMap1 = new Phaser.GameObjects.Zone(
                    this,
                    object.x * Config.TILE_SCALE,
                    object.y * Config.TILE_SCALE,
                    object.width * Config.TILE_SCALE,
                    object.height * Config.TILE_SCALE);
                this.zoneToMap1.setOrigin(0, 0);
                this.physics.add.existing(this.zoneToMap1);
            }
            // マップ3へ遷移するZONEの作成
            if(object.name == "ToMap3Scene") {
                this.zoneToMap3 = new Phaser.GameObjects.Zone(
                    this,
                    object.x * Config.TILE_SCALE,
                    object.y * Config.TILE_SCALE,
                    object.width * Config.TILE_SCALE,
                    object.height * Config.TILE_SCALE);
                this.zoneToMap3.setOrigin(0, 0);
                this.physics.add.existing(this.zoneToMap3);
            }
        }, this);
    }

    createPlayer() {
        if(this.data.from == "Map1Scene") {
            // マップ1から移動してきた場合
            this.map.findObject("Player", function(object) {
                if (object.name == "FromMap1Scene") {
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
        } else if(this.data.from == "Map3Scene") {
            // マップ3から移動してきた場合
            this.map.findObject('Player', function(object) {
                if (object.name == "FromMap3Scene") {
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
        // プレイヤーはマップ1へ移動するZONEと衝突
        this.physics.add.overlap(this.player, this.zoneToMap1, this.moveSceneToMap1, null, this);
        // プレイヤーはマップ3へ移動するZONEと衝突
        this.physics.add.overlap(this.player, this.zoneToMap3, this.moveSceneToMap3, null, this);
    }
    
    moveSceneToMap1() {
        // マップ1へ移動
        this.scene.start("Map1Scene", {
            "from" : "Map2Scene",
            "player" : this.player,
        });
    }
    
    moveSceneToMap3() {
        // マップ3へ移動
        this.scene.start("Map3Scene", {
            "from" : "Map2Scene",
            "player" : this.player,
        });
    }
    
    gameOver() {
        // ゲームオーバーシーンへ移動
        this.scene.start("GameOverScene",{
            from : "Map2Scene",
        });
    }
}

export default Map2Scene;
