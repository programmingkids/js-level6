import Quiz from './../sprite/quiz';

class QuizFactory {
    static create(scene) {
        // Quizクラスを作成する
        // ランダムにクイズを取得
        const quiz = Phaser.Math.RND.pick(scene.cache.json.get('quizData'));
        // Quizクラスを作成
        return new Quiz(quiz);
    }
}

export default QuizFactory;
