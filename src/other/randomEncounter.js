import CONFIG from './../data/config';

class RandomEncounter {
    static encounter(count) {
        // ランダムエンカウンターを実現
        const randomNumber = Phaser.Math.RND.pick(CONFIG.RANDOM_ARRAY);
        if( count % randomNumber == 0 ) {
            // 割り切れた場合、「true」
            return true;
        }
        // それ以外の場合、「false」
        return false;
    }
}

export default RandomEncounter;
