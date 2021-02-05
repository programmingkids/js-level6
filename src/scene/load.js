import Phaser from "phaser";
import Config from './../data/config';
// マップ画像のインポート
import map_tiles1 from './../assets/images/map/map_tiles1.png';
// プレイヤー画像のインポート
import player from './../assets/images/player/player03.png';
// マップのJSONファイルのインポート
import map1 from './../assets/json/map1.json';
import map2 from './../assets/json/map2.json';
import map3 from './../assets/json/map3.json';
// ボタン画像のインポート
import button_blue from './../assets/images/other/button_blue.png';
import button_green from './../assets/images/other/button_green.png';
import button_orange from './../assets/images/other/button_orange.png';
import button_pink from './../assets/images/other/button_pink.png';
import button_red from './../assets/images/other/button_red.png';
import button_start from './../assets/images/other/button_start.png';
import button_gameclear from './../assets/images/other/button_gameclear.png';
import button_gameover from './../assets/images/other/button_gameover.png';
// 敵画像のインポート
import enemy001 from './../assets/images/enemy/enemy001.png';
import enemy002 from './../assets/images/enemy/enemy002.png';
import enemy003 from './../assets/images/enemy/enemy003.png';
import enemy004 from './../assets/images/enemy/enemy004.png';
import enemy005 from './../assets/images/enemy/enemy005.png';
import enemy006 from './../assets/images/enemy/enemy006.png';
import enemy007 from './../assets/images/enemy/enemy007.png';
import enemy008 from './../assets/images/enemy/enemy008.png';
import enemy009 from './../assets/images/enemy/enemy009.png';
import enemy010 from './../assets/images/enemy/enemy010.png';
import enemy011 from './../assets/images/enemy/enemy011.png';
import enemy012 from './../assets/images/enemy/enemy012.png';
import enemy013 from './../assets/images/enemy/enemy013.png';
import enemy014 from './../assets/images/enemy/enemy014.png';
import enemy015 from './../assets/images/enemy/enemy015.png';
import enemy016 from './../assets/images/enemy/enemy016.png';
import enemy017 from './../assets/images/enemy/enemy017.png';
import enemy018 from './../assets/images/enemy/enemy018.png';
import enemy019 from './../assets/images/enemy/enemy019.png';
import enemy020 from './../assets/images/enemy/enemy020.png';
import enemy021 from './../assets/images/enemy/enemy021.png';
import enemy022 from './../assets/images/enemy/enemy022.png';
import enemy023 from './../assets/images/enemy/enemy023.png';
import enemy024 from './../assets/images/enemy/enemy024.png';
import enemy025 from './../assets/images/enemy/enemy025.png';
import enemy026 from './../assets/images/enemy/enemy026.png';
import enemy027 from './../assets/images/enemy/enemy027.png';
import enemy028 from './../assets/images/enemy/enemy028.png';
import enemy029 from './../assets/images/enemy/enemy029.png';
import enemy030 from './../assets/images/enemy/enemy030.png';
import enemy031 from './../assets/images/enemy/enemy031.png';
import enemy032 from './../assets/images/enemy/enemy032.png';
import enemy033 from './../assets/images/enemy/enemy033.png';
import enemy034 from './../assets/images/enemy/enemy034.png';
import enemy035 from './../assets/images/enemy/enemy035.png';
import enemy036 from './../assets/images/enemy/enemy036.png';
import enemy037 from './../assets/images/enemy/enemy037.png';
import enemy038 from './../assets/images/enemy/enemy038.png';
// クイズデータのインポート
import quizJson from './../assets/json/quiz.json';
// 宝箱のインポート
import treasure01 from './../assets/images/other/treasure01.png';
import treasure02 from './../assets/images/other/treasure02.png';
import treasure03 from './../assets/images/other/treasure03.png';
import treasure from './../assets/images/other/treasure.png';

// 「Phaser.Scene」を継承した「LoadScene」クラスの作成
class LoadScene extends Phaser.Scene {
    constructor() {
        // シーンの名前を設定
        super({key : "LoadScene"});
    }
    
    preload() {
        // マップのスプライトシート画像の読み込み
        this.load.spritesheet('map_tiles1', map_tiles1, { 
            frameWidth: Config.TILE_WIDTH, 
            frameHeight: Config.TILE_HEIGTH,
            spacing : Config.TILE_SPACING,
        });
        // プレイヤーのスプライトシートの読み込み
        this.load.spritesheet('player', player, {
            frameWidth: 32,
            frameHeight: 32 
        });
        // マップのJSONファイルの読み込み
        this.load.tilemapTiledJSON('map1', map1);
        this.load.tilemapTiledJSON('map2', map2);
        this.load.tilemapTiledJSON('map3', map3);
        // ボタン画像の読み込み
        this.load.image('button_blue', button_blue);
        this.load.image('button_green', button_green);
        this.load.image('button_orange', button_orange);
        this.load.image('button_pink', button_pink);
        this.load.image('button_red', button_red);
        this.load.image('button_start', button_start);
        this.load.image('button_gameclear', button_gameclear);
        this.load.image('button_gameover', button_gameover);
        // 敵画像の読み込み
        this.load.image('enemy001', enemy001);
        this.load.image('enemy002', enemy002);
        this.load.image('enemy003', enemy003);
        this.load.image('enemy004', enemy004);
        this.load.image('enemy005', enemy005);
        this.load.image('enemy006', enemy006);
        this.load.image('enemy007', enemy007);
        this.load.image('enemy008', enemy008);
        this.load.image('enemy009', enemy009);
        this.load.image('enemy010', enemy010);
        this.load.image('enemy011', enemy011);
        this.load.image('enemy012', enemy012);
        this.load.image('enemy013', enemy013);
        this.load.image('enemy014', enemy014);
        this.load.image('enemy015', enemy015);
        this.load.image('enemy016', enemy016);
        this.load.image('enemy017', enemy017);
        this.load.image('enemy018', enemy018);
        this.load.image('enemy019', enemy019);
        this.load.image('enemy020', enemy020);
        this.load.image('enemy021', enemy021);
        this.load.image('enemy022', enemy022);
        this.load.image('enemy023', enemy023);
        this.load.image('enemy024', enemy024);
        this.load.image('enemy025', enemy025);
        this.load.image('enemy026', enemy026);
        this.load.image('enemy027', enemy027);
        this.load.image('enemy028', enemy028);
        this.load.image('enemy029', enemy029);
        this.load.image('enemy030', enemy030);
        this.load.image('enemy031', enemy031);
        this.load.image('enemy032', enemy032);
        this.load.image('enemy033', enemy033);
        this.load.image('enemy034', enemy034);
        this.load.image('enemy035', enemy035);
        this.load.image('enemy036', enemy036);
        this.load.image('enemy037', enemy037);
        this.load.image('enemy038', enemy038);
        // クイズデータの読み込み
        this.load.json('quizData', quizJson, 'quizData');
        // 宝箱の読み込み
        this.load.image('treasure01', treasure01);
        this.load.image('treasure02', treasure02);
        this.load.image('treasure03', treasure03);
        this.load.image('treasure', treasure);
    }
    
    create() {
        this.scene.start('StartScene');
    }
}

export default LoadScene;
