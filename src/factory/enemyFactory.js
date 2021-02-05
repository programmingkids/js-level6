import Enemy from './../sprite/enemy';
import enemyData from './../data/enemyData';
import bossEnemyData from './../data/bossEnemyData';

class EnemyFactory {
    static create(isBoss) {
        // Enemyクラスを作成
        if(isBoss) {
            // ボス敵としてEnemyクラスを作成
            return new Enemy(bossEnemyData);
        } else {
            // ボス敵以外をランダムに作成
            const enemy = JSON.parse(JSON.stringify(Phaser.Math.RND.pick(enemyData)));
            // Enemyクラスを作成
            return new Enemy(enemy);
        }
    }
}

export default EnemyFactory;
