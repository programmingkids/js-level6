// 一問のクイズを表すQuizクラス
class Quiz {
    constructor(data) {
        for(const key in data) {
            this[key] = data[key];
        }
        // クイズの問題文
        this.text = this.question;
        // クイズの正解
        this.correctAnswer = this.answer_entity;
        // クイズの選択肢
        this.answers = [this.answer_entity];
        let tempAnswers = this.answer_candidates.slice(1);
        tempAnswers = Phaser.Math.RND.shuffle(tempAnswers);
        this.answers = this.answers.concat(tempAnswers.slice(0,3));
        // クイズの選択肢をランダムにシャッフルする
        this.answers = Phaser.Math.RND.shuffle(this.answers);
    }
    
    getAnswer(index) {
        //クイズの正解を判定する
        if(this.answers[index] == this.correctAnswer) {
            // 正解
            return true;
        }
        // 間違い
        return false;
    }
}

export default Quiz;
