import styles from './answers-input-area.module.scss';

export const AnswersInputArea = ({
  answerList,
  correctAnswerID,
  handleCorrectAnswerChange,
  handleAnswerDescriptionChange,
  handleAnswerDelete,
}) => {
  return (
    <fieldset className={styles.answersArea}>
      <legend>Ответы</legend>
      <p>Добавьте варианты ответа и отметьте правильный</p>
      <ul>
        {
          answerList.map(answer => (
            <li>
              <label htmlFor={`radio-${answer.answerID}`}>
                <input
                  type="radio"
                  id={`radio-${answer.answerID}`}
                  name="correct-answer-form"
                  value={answer.answerID}
                  checked={answer.answerID === correctAnswerID}
                  onClick={handleCorrectAnswerChange}
                />
                <input
                  type="text"
                  id={`answerDescription-${answer.answerID}`}
                  name={`answerDescription-${answer.answerID}`}
                  placeholder="Текст ответа"
                  value={answer.answerDescription}
                  onChange={(evt) => handleAnswerDescriptionChange(evt, answer.answerID)}
                />
                <button onClick={(evt) => handleAnswerDelete(evt, answer.answerID)}>🞩</button>
              </label>
            </li>
          ))
        }
      </ul>
    </fieldset>
  );
}
