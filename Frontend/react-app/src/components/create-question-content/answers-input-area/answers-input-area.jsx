import { AnswerTile } from './answer-tile/answer-tile';
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
          answerList.map(answer => 
            <AnswerTile
              key={answer.answerID}
              answer={answer}
              correctAnswerID={correctAnswerID}
              handleAnswerDelete={handleAnswerDelete}
              handleAnswerDescriptionChange={handleAnswerDescriptionChange}
              handleCorrectAnswerChange={handleCorrectAnswerChange}
            />
          )
        }
      </ul>
    </fieldset>
  );
}
