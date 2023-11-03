import styles from './answer-tile.module.scss'
import { FC, MouseEvent } from 'react'
import { KnownAnswer, Question, QuestionTypes, Test } from '@/types/Test'
import { useGetTestWithQuestionsQuery } from '@/services/testCreationApi'

interface Props {
  testID: Test['testID']
  questionID: Question['questionID']
  answerID: number
  actionAnswerDelete: (answerID: number) => void
  questionType: keyof typeof QuestionTypes
}

export const AnswerTile: FC<Props> = ({ testID, questionID, answerID, actionAnswerDelete, questionType }) => {
  const blankAnswer: KnownAnswer = {
    answerDescription: '',
    isCorrect: false,
  }

  const { answerData } = useGetTestWithQuestionsQuery(testID, {
    selectFromResult: ({ data }) => ({
      answerData: data?.questionList[questionID]?.answerList[answerID] ?? blankAnswer,
    }),
  })

  const { answerDescription, isCorrect } = answerData
  const handleAnswerDelete = (evt: MouseEvent<HTMLButtonElement>, answerID: number) => {
    evt.preventDefault()
    actionAnswerDelete(answerID)
  }

  const inputElement =
    questionType === 'MULTIPLE_CHOICE' ? (
      <input
        type={'checkbox'}
        id={`checkbox-${answerID}`}
        name={`answer-select`}
        value={answerID}
        defaultChecked={isCorrect}
      />
    ) : (
      <input
        type={'radio'}
        id={`radio-${answerID}`}
        name={'answer-select'}
        value={answerID}
        defaultChecked={isCorrect}
      />
    )

  return (
    <li className={styles.answerTile}>
      <label>
        {inputElement}
        <input
          type='text'
          id={`answer-description-${answerID}`}
          name={`answer-description-${answerID}`}
          placeholder='Текст ответа'
          defaultValue={answerDescription}
        />
        <button type={'button'} onClick={(evt) => handleAnswerDelete(evt, answerID)}>
          🞩
        </button>
      </label>
    </li>
  )
}
