import { QUESTION_STATES } from '../test-content';
import styles from './question-area.module.scss';

export const QuestionArea = ({
  children,
  questionData,
  questionIndex,
  changeCorrectAnswer,
  setQuestionState,
  isTogglable,
}) => {
  const isChecked = (answerID) => (!!questionData.selectedAnswer && answerID === questionData.selectedAnswer.answerID);

  const handleRadioToggle = (evt) => {
    if (!isTogglable) {
      evt.preventDefault();
      return;
    }
    const {value} = evt.target;
    const numVal = Number(value);
    changeCorrectAnswer(questionData.questionID, numVal);
    setQuestionState(QUESTION_STATES.PendingAnswer);
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
      {children}
    </section>
  );
}
