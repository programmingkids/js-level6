// 敵を表すEnemyクラス
class Enemy {
    constructor(data) {
        for(const key in data) {
            this[key] = data[key];
        }
    }
}

export default Enemy;
