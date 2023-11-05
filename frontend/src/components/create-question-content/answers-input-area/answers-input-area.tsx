import { FC } from 'react'
import { AnswerTile } from './answer-tile/answer-tile'
import styles from './answers-input-area.module.scss'
import { Question, QuestionTypes, QuestionWithCorrectAnswer, Test } from '@/types/Test'

interface Props {
  testID: Test['testID']
  questionID: Question['questionID']
  answerOrder: Question['answerOrder']
  answerList: Question['answerList']
  correctAnswerIDs: QuestionWithCorrectAnswer['correctAnswerIDs']
  actionAnswerDelete: (answerID: number) => void
  questionType: keyof typeof QuestionTypes
}

export const AnswersInputArea: FC<Props> = ({
  testID,
  questionID,
  answerOrder,
  answerList,
  correctAnswerIDs,
  actionAnswerDelete,
  questionType,
}) => {
  const tip = {
    SINGLE_CHOICE: 'Добавьте варианты ответа и отметьте верный',
    MULTIPLE_CHOICE: 'Добавьте варианты ответа и отметьте верные',
    TEXT_INPUT: '',
    MATCHING: '',
    SEQUENCING: '',
  }

  return (
    <fieldset className={styles.answersArea}>
      <legend>Ответы</legend>
      <p>{tip[questionType]}</p>
      <ul>
        {answerOrder.map((answerID) => {
          const { answerDescription } = answerList[answerID]
          const isCorrect = correctAnswerIDs.includes(answerID)
          return (
            <AnswerTile
              key={answerID}
              testID={testID}
              questionID={questionID}
              answerID={answerID}
              answerDescription={answerDescription}
              isCorrect={isCorrect}
              actionAnswerDelete={actionAnswerDelete}
              questionType={questionType}
            />
          )
        })}
      </ul>
    </fieldset>
  )
}
