import { FC, ChangeEvent, MouseEvent } from 'react';
import { Answer, QuestionWithCorrectAnswer } from '../../../../types/Test';

interface Props {
  answerItem: Answer,
  correctAnswerID: QuestionWithCorrectAnswer['correctAnswerID'],
  handleCorrectAnswerChange: (evt: ChangeEvent<HTMLInputElement>) => void,
  handleAnswerDescriptionChange: (evt: ChangeEvent<HTMLInputElement>, answerID: Answer['answerID']) => void,
  handleAnswerDelete: (evt: MouseEvent<HTMLButtonElement>, answerID: Answer['answerID']) => void,
}

// Заменить correctAnswerID на isCorrect

export const AnswerTile: FC<Props> = ({ answerItem, correctAnswerID, handleCorrectAnswerChange, handleAnswerDescriptionChange, handleAnswerDelete}) => {
  const { answerID, answerDescription } = answerItem

  return (
    <li>
      <label htmlFor={`radio-${answerID}`}>
        <input
          type="radio"
          id={`radio-${answerID}`}
          name="correct-answer-form"
          defaultValue={answerID}
          checked={answerID === correctAnswerID}
          onChange={handleCorrectAnswerChange}
        />
        <input
          type="text"
          id={`answerDescription-${answerID}`}
          name={`answerDescription-${answerID}`}
          placeholder="Текст ответа"
          value={answerDescription}
          onChange={(evt) => handleAnswerDescriptionChange(evt, answerID)}
        />
        <button onClick={(evt) => handleAnswerDelete(evt, answerID)}>🞩</button>
      </label>
    </li>
  );
}
