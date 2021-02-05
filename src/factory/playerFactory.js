import Player from './../sprite/player';

class PlayerFactory {
    static create(scene, config) {
        // 設定に基づいて、Playerクラスを作成
        const x = config.x;
        const y = config.y;
        const image = config.image;
        const player = new Player(scene, x, y, image);
        player.name = config.name;
        player.hp = config.hp;
        player.portion = config.portion;
        return player;
    }
}

export default PlayerFactory;
