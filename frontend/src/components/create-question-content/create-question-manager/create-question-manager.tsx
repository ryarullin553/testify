import { QuestionInputArea } from '../question-input-area/question-input-area'
import { AnswersInputArea } from '../answers-input-area/answers-input-area'
import styles from './create-question-manager.module.scss'
import { FC, useEffect, useState, MouseEvent, ChangeEvent, SyntheticEvent, FormEvent } from 'react'
import { generateAnswersAction } from '../../../api/questions'
import { Answer, Question, QuestionWithCorrectAnswer, Test } from '../../../types/Test'
import {
  useCreateQuestionMutation,
  useDeleteQuestionMutation,
  useUpdateQuestionMutation,
} from '@/services/testCreationApi'

interface Props {
  testID: Test['testID']
  questionData: QuestionWithCorrectAnswer
  actionQuestionAdd: () => void
  currentQuestionID: Question['questionID']
  currentQuestionIndex: number
}

export const CreateQuestionManager: FC<Props> = ({
  questionData,
  testID,
  actionQuestionAdd,
  currentQuestionID,
  currentQuestionIndex,
}) => {
  const blankAnswer: Answer = {
    answerDescription: '',
    isCorrect: false,
  }
  const blankQuestion: QuestionWithCorrectAnswer = {
    testID,
    questionDescription: '',
    questionAvatar: null,
    questionType: 'Single choice',
    questionID: -1,
    answerList: {
      0: blankAnswer,
      1: blankAnswer,
    },
    answerOrder: [0, 1],
    correctAnswerIDs: [0],
  }
  const { questionID, answerOrder, questionDescription } = questionData || blankQuestion
  const [answerOrderState, setAnswerOrderState] = useState([...answerOrder])
  const [createQuestion] = useCreateQuestionMutation()
  const [updateQuestion] = useUpdateQuestionMutation()
  const [deleteQuestion] = useDeleteQuestionMutation()
  // const [generateAmount, setGenerateAmount] = useState(1)

  const actionAnswerDelete = (answerID: number) => {
    setAnswerOrderState((prevState) => {
      const newState = [...prevState]
      return newState.filter((x) => x !== answerID)
    })
  }

  const actionAnswerAdd = () => {
    setAnswerOrderState((prevState) => {
      const newState = [...prevState]
      const newID = Math.max(...newState) + 1
      newState.push(newID)
      return newState
    })
  }

  const handleAnswerAdd = (evt: MouseEvent<HTMLButtonElement>) => {
    evt.preventDefault()
    actionAnswerAdd()
  }

  const handleQuestionDelete = async (evt: MouseEvent<HTMLButtonElement>) => {
    evt.preventDefault()
    deleteQuestion({ questionID, testID })
  }

  const handleAnswerDelete = (answerID: number) => {
    if (answerOrderState.length === 2) {
      actionAnswerAdd()
    }
    actionAnswerDelete(answerID)
  }

  const handleFormSubmit = async (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault()
    const formData = new FormData(evt.currentTarget)
    const questionData: QuestionWithCorrectAnswer = {
      testID,
      questionID,
      questionDescription: formData.get('questionDescription') as string,
      questionAvatar: null,
      questionType: 'Single choice',
      answerOrder: answerOrderState,
      answerList: answerOrderState.reduce((acc: Record<number, Answer>, x) => {
        acc[x] = {
          answerDescription: formData.get(`answerDescription-${x}`) as string,
          isCorrect: Number(formData.get('correct-answer-form')) === x,
        }
        return acc
      }, {}),
      correctAnswerIDs: [Number(formData.get('correct-answer-form'))],
    }
    if (currentQuestionID <= 0) {
      await createQuestion(questionData)
      actionQuestionAdd()
    } else await updateQuestion(questionData)
  }

  // const handleGenerateAmountChange = (evt: ChangeEvent<HTMLInputElement>) => {
  //   let newValue = Number(evt.target.value.replace(/\D/, ''))
  //   newValue = Math.max(Math.min(newValue, 10), 1)
  //   setGenerateAmount(newValue)
  // }

  // const handleGenerateAnswersClick = async (evt: MouseEvent<HTMLButtonElement>) => {
  //   evt.preventDefault()
  //   const { questionDescription, correctAnswerID, answerList } = currentQuestionData
  //   const request = {
  //     question: questionDescription,
  //     right_answer: answerList[correctAnswerID || -1].answerDescription,
  //     wrong_answers: answerList
  //       .slice()
  //       .map((a) => a.answerDescription)
  //       .splice(correctAnswerID || -1, 1),
  //     generate_count: generateAmount,
  //   }
  //   const { answer_set } = await generateAnswersAction(request)
  //   answer_set.map((a: string) => actionAnswerAdd(a))
  // }

  return (
    <form className={styles.questionForm} action='#' name='question-form' onSubmit={handleFormSubmit}>
      <QuestionInputArea currentQuestionIndex={currentQuestionIndex} questionDescription={questionDescription} />
      <AnswersInputArea
        testID={testID}
        questionID={questionID}
        answerOrder={answerOrderState}
        actionAnswerDelete={handleAnswerDelete}
      />
      <div className={styles.controls}>
        <button className={styles.plusButton} onClick={handleAnswerAdd}>
          +
        </button>
        {/* <fieldset className={styles.generateAnswersForm}>
          <button className={styles.generateAnswersButton} onClick={handleGenerateAnswersClick}>
            Сгенерировать варианты ответов
          </button>
          <input
            type='number'
            min={1}
            max={10}
            id='generateAmount'
            value={generateAmount}
            onChange={handleGenerateAmountChange}
          />
        </fieldset> */}
        <div className={styles.questionControls}>
          <button type={'button'} onClick={handleQuestionDelete}>
            Удалить вопрос
          </button>
          <button type={'submit'}>Сохранить вопрос</button>
        </div>
      </div>
    </form>
  )
}
