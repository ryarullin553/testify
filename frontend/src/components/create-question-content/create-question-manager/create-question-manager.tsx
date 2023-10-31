import { QuestionInputArea } from '../question-input-area/question-input-area'
import { AnswersInputArea } from '../answers-input-area/answers-input-area'
import styles from './create-question-manager.module.scss'
import TrashIcon from './img/trash_icon.svg'
import { FC, useState, FormEvent } from 'react'
import { KnownAnswer, Question, QuestionWithCorrectAnswer, Test } from '../../../types/Test'
import { useCreateQuestionMutation, useUpdateQuestionMutation } from '@/services/testCreationApi'
import { Button } from '@/components/Button/Button'
import { Select, SelectOption } from '@/components/Select/Select'

interface Props {
  testID: Test['testID']
  questionData: QuestionWithCorrectAnswer
  addNewQuestion: () => void
  handleQuestionDelete: () => void
  currentQuestionID: Question['questionID']
  currentQuestionIndex: number
  hasQuestionSubmitted: boolean
}

export const CreateQuestionManager: FC<Props> = ({
  questionData,
  testID,
  addNewQuestion,
  handleQuestionDelete,
  currentQuestionID,
  currentQuestionIndex,
  hasQuestionSubmitted,
}) => {
  const { questionID, answerOrder, questionDescription, questionType } = questionData
  const [answerOrderState, setAnswerOrderState] = useState([...answerOrder])
  const [questionTypeState, setQuestionTypeState] = useState(questionType)
  const [createQuestion] = useCreateQuestionMutation()
  const [updateQuestion] = useUpdateQuestionMutation()
  // const [generateAmount, setGenerateAmount] = useState(1)
  const options: SelectOption[] = [
    { value: '1', label: 'a' },
    { value: '2', label: 'b' },
  ]

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

  const handleAnswerAdd = () => {
    actionAnswerAdd()
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
      answerList: answerOrderState.reduce((acc: Record<number, KnownAnswer>, x) => {
        acc[x] = {
          answerID: x,
          answerDescription: formData.get(`answerDescription-${x}`) as string,
          isCorrect: Number(formData.get('correct-answer-form')) === x,
        }
        return acc
      }, {}),
      correctAnswerIDs: [Number(formData.get('correct-answer-form'))],
    }
    if (currentQuestionID <= 0) {
      await createQuestion(questionData)
      addNewQuestion()
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
      <Select options={options} currentValue='' handleSelect={() => {}} />
      <AnswersInputArea
        testID={testID}
        questionID={questionID}
        answerOrder={answerOrderState}
        actionAnswerDelete={handleAnswerDelete}
      />
      <div className={styles.controls}>
        <Button type={'button'} colorTheme={'hoverDark'} outerStyles={styles.plusButton} onClick={handleAnswerAdd}>
          +
        </Button>
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
          <Button
            type={'button'}
            view={'flat'}
            onClick={handleQuestionDelete}
            outerStyles={styles.deleteButton}
            disabled={hasQuestionSubmitted}>
            <TrashIcon />
          </Button>
          <Button type={'submit'} outerStyles={styles.saveButton}>
            Сохранить вопрос
          </Button>
        </div>
      </div>
    </form>
  )
}
