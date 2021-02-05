import Phaser from "phaser";
import Game from './scene/game';
import LoadScene from './scene/load';
import StartScene from './scene/start';
import GameOverScene from './scene/gameover';
import GameClearScene from './scene/gameclear';
import Map1Scene from './scene/map1';
import Map2Scene from './scene/map2';
import Map3Scene from './scene/map3';
import BattleScene from './scene/battle';
import RexUIPlugin from 'phaser3-rex-plugins/templates/ui/ui-plugin.js';

// 設定情報の連想配列
const config = {
    type: Phaser.AUTO,
    // ゲームの幅はウィンドウの幅と同じ
    width: window.innerWidth,
    // ゲームの高さはウィンドウの高さと同じ
    height: window.innerHeight,
    pixelArt: true,
    roundPixels: true,
    backgroundColor: 0x000000,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug : true,
        }
    },
    plugins: {
        scene: [{
            key: 'rexUI',
            plugin: RexUIPlugin,
            mapping: 'rexUI',
        }],
    },
};

// Gameオブジェクト作成
const game = new Game(config);
// シーンの追加
game.scene.add("LoadScene", LoadScene);
game.scene.add("StartScene", StartScene);
game.scene.add("GameOverScene", GameOverScene);
game.scene.add("GameClearScene", GameClearScene);
game.scene.add("Map1Scene", Map1Scene);
game.scene.add("Map2Scene", Map2Scene);
game.scene.add("Map3Scene", Map3Scene);
game.scene.add("BattleScene", BattleScene);
// 最初にLoadSceneを起動
game.scene.start("LoadScene");

// ウィンドウの幅を変更したら、ゲームの幅と高さを変更する
window.addEventListener('resize', function (event) {
    game.scale.resize(window.innerWidth, window.innerHeight);
}, false);
