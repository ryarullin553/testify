import { FC, ChangeEvent, MouseEvent } from 'react'
import { Answer, Question, QuestionWithCorrectAnswer, Test } from '../../../../types/Test'
import { useGetTestWithQuestionsQuery } from '@/services/testsApi'

interface Props {
  testID: Test['testID']
  questionID: Question['questionID']
  answerID: number
  actionAnswerDelete: (answerID: number) => void
}

// Заменить correctAnswerID на isCorrect

export const AnswerTile: FC<Props> = ({ testID, questionID, answerID, actionAnswerDelete }) => {
  const blankAnswer: Answer = {
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
  return (
    <li>
      <label htmlFor={`radio-${answerID}`}>
        <input
          type='radio'
          id={`radio-${answerID}`}
          name='correct-answer-form'
          value={answerID}
          defaultChecked={isCorrect}
        />
        <input
          type='text'
          id={`answerDescription-${answerID}`}
          name={`answerDescription-${answerID}`}
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
