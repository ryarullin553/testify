import { FC, ChangeEvent, MouseEvent } from 'react'
import { AnswerTile } from './answer-tile/answer-tile'
import styles from './answers-input-area.module.scss'
import { Answer, QuestionWithCorrectAnswer } from '../../../types/Test'

interface Props {
  answerList: Answer[]
  correctAnswerID: QuestionWithCorrectAnswer['correctAnswerID']
  handleCorrectAnswerChange: (evt: ChangeEvent<HTMLInputElement>) => void
  handleAnswerDescriptionChange: (evt: ChangeEvent<HTMLInputElement>, answerID: Answer['answerID']) => void
  handleAnswerDelete: (evt: MouseEvent<HTMLButtonElement>, answerID: Answer['answerID']) => void
}

export const AnswersInputArea: FC<Props> = ({
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
        {answerList.map((answerItem) => (
          <AnswerTile
            key={answerItem.answerID}
            answerItem={answerItem}
            correctAnswerID={correctAnswerID}
            handleAnswerDelete={handleAnswerDelete}
            handleAnswerDescriptionChange={handleAnswerDescriptionChange}
            handleCorrectAnswerChange={handleCorrectAnswerChange}
          />
        ))}
      </ul>
    </fieldset>
  )
}
