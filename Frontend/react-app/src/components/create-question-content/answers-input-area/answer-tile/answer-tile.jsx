export const AnswerTile = ({answer, correctAnswerID, handleCorrectAnswerChange, handleAnswerDescriptionChange, handleAnswerDelete}) => {
  return (
    <li>
      <label htmlFor={`radio-${answer.answerID}`}>
        <input
          type="radio"
          id={`radio-${answer.answerID}`}
          name="correct-answer-form"
          defaultValue={answer.answerID}
          checked={answer.answerID === correctAnswerID}
          onChange={handleCorrectAnswerChange}
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
  );
}
