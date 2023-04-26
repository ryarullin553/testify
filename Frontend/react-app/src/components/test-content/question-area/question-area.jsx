import { QUESTION_STATES } from '../test-content';
import styles from './question-area.module.scss';

export const QuestionArea = ({questionData, questionIndex, changeCorrectAnswer, submitNewAnswer, submitUpdatedAnswer, gotoNextQuestion, setQuestionState}) => {
  const isChecked = (answerID) => (!!questionData.selectedAnswer && answerID === questionData.selectedAnswer.answerID);

  const handleRadioToggle = (evt) => {
    const {value} = evt.target;
    const numVal = Number(value);
    changeCorrectAnswer(questionData.questionID, numVal);
    setQuestionState(QUESTION_STATES.PendingAnswer);
  }

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
    <section className={styles.questionArea}>
      <h2>Вопрос №{questionIndex + 1}</h2>
      <p className={styles.questionDescription}>{questionData.questionDescription}</p>
      <p className={styles.notice}>Выберите один вариант из списка</p>
      <form className={styles.answerForm} action='#'>
        <ul>
          {questionData.answerList.map(a =>
            <li key={a.answerID}>
              <input
                type='radio'
                id={a.answerID}
                name='answer-selection'
                value={a.answerID}
                checked={isChecked(a.answerID)}
                onChange={handleRadioToggle}
              />
              <label htmlFor={a.answerID}>{a.answerDescription}</label>
            </li>
          )}
        </ul>
      </form>
        <div className={styles.questionControls}>
          <button
            onClick={handleSubmitClick}
          >Ответить</button>
          <button
            onClick={handleNextClick}
          >Следующий вопрос</button>
        </div>
    </section>
  );
}
