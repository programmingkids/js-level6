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
        // クイズの選択肢の作成、まずは正解の選択肢を追加
        this.answers = [this.answer_entity];
        // 正解以外の選択肢を作成する
        let tempAnswers = this.answer_candidates.slice(1);
        // 正解以外の選択肢をシャッフルする
        tempAnswers = Phaser.Math.RND.shuffle(tempAnswers);
        // 正解以外の選択肢を先頭から3個だけ取り出して、正解の選択肢と結合する（選択肢を4個にする）
        this.answers = this.answers.concat(tempAnswers.slice(0,3));
        // クイズの選択肢を再度ランダムにシャッフルする
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
