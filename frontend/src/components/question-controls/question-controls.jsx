import { QUESTION_STATES } from '../test-content/test-content';
import styles from './question-controls.module.scss';

export const QuestionControls = ({
  questionData,
  setQuestionState,
  submitNewAnswer,
  submitUpdatedAnswer,
  gotoNextQuestion,
}) => {
  const handleSubmitClick = async (evt) => {
    evt.preventDefault();
    if (questionData.selectedAnswer.dbEntry) {
      await submitUpdatedAnswer(questionData);
    } else {
      await submitNewAnswer(questionData.questionID, questionData.selectedAnswer.answerID);
    }
    setQuestionState(QUESTION_STATES.Submitted);
    gotoNextQuestion();
  }

  const handleNextClick = (evt) => {
    evt.preventDefault();
    gotoNextQuestion();
  }

  return (
    <div className={styles.questionControls}>
      <button
        onClick={handleSubmitClick}
      >Ответить</button>
      <button
        onClick={handleNextClick}
      >Следующий вопрос</button>
    </div>
  );
}
