import { QuestionInputArea } from './question-input-area/question-input-area'
import styles from './create-question-manager.module.scss'
import TrashIcon from './img/trash_icon.svg'
import { FC, useState, FormEvent, useRef } from 'react'
import { Answer, Question, QuestionWithCorrectAnswer, Test } from '../../../types/Test'
import { useCreateQuestionMutation, useUpdateQuestionMutation } from '@/services/testCreationApi'
import { Button } from '@/components/Button/Button'
import { Select } from '@/components/Select/Select'
import { useGenerateAnswersMutation } from '@/services/generativeApi'
import { PointsField } from './PointsField/PointsField'
import { AnswerGenerator } from './AnswerGenerator/AnswerGenerator'
import { AnswersInputArea } from './answers-input-area/answers-input-area'

interface Props {
  testID: Test['testID']
  hasQuestionPoints: boolean
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
  hasQuestionPoints,
  addNewQuestion,
  handleQuestionDelete,
  currentQuestionID,
  currentQuestionIndex,
  hasQuestionSubmitted,
}) => {
  const { questionID, answerOrder, answerList, correctAnswerIDs, questionDescription, questionType, questionPoints } =
    questionData
  const [answerOrderState, setAnswerOrderState] = useState([...answerOrder])
  const [questionTypeState, setQuestionTypeState] = useState(questionType)
  const [createQuestion] = useCreateQuestionMutation()
  const [updateQuestion] = useUpdateQuestionMutation()
  const formRef = useRef<HTMLFormElement>(null)

  const options = {
    SINGLE_CHOICE: 'Одиночный выбор',
    MULTIPLE_CHOICE: 'Множественный выбор',
    // TEXT_INPUT: 'Ввод текста',
    // MATCHING: 'Cоответствие',
    // SEQUENCING: 'Последовательность',
  }

  const handleSelect = (newValue: Question['questionType']) => {
    setQuestionTypeState(newValue)
  }

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
    const correctAnswerIDs = formData.getAll(`answer-select`).map(Number)
    const answerList = answerOrderState.reduce((acc: Record<number, Answer>, x) => {
      acc[x] = {
        answerID: x,
        answerDescription: formData.get(`answer-description-${x}`) as string,
      }
      return acc
    }, {})
    const questionData: QuestionWithCorrectAnswer = {
      testID,
      questionID,
      questionDescription: formData.get('questionDescription') as string,
      questionAvatar: null,
      questionType: questionTypeState,
      answerOrder: answerOrderState,
      answerList,
      correctAnswerIDs,
      questionPoints: Number(formData.get('question-points')),
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

  return (
    <section className={styles.formWrapper}>
      <form
        className={styles.questionForm}
        ref={formRef}
        id={'question-form'}
        name={'question-form'}
        onSubmit={handleFormSubmit}>
        <div className={styles.questionContainer}>
          <QuestionInputArea currentQuestionIndex={currentQuestionIndex} questionDescription={questionDescription} />
          <Select options={options} currentValue={questionTypeState} handleSelect={handleSelect} />
        </div>
        <AnswersInputArea
          questionType={questionTypeState}
          testID={testID}
          questionID={questionID}
          answerOrder={answerOrderState}
          answerList={answerList}
          correctAnswerIDs={correctAnswerIDs}
          actionAnswerDelete={handleAnswerDelete}
        />
      </form>
      <div className={styles.controls}>
        <Button type={'button'} colorTheme={'hoverDark'} outerStyles={styles.plusButton} onClick={handleAnswerAdd}>
          +
        </Button>
        <AnswerGenerator formRef={formRef.current} />
        <PointsField
          defaultValue={questionPoints}
          disabled={!hasQuestionPoints}
          formID={'question-form'}
          fieldID={'question-points'}
        />
        <div className={styles.questionControls}>
          <Button
            type={'button'}
            view={'flat'}
            onClick={handleQuestionDelete}
            outerStyles={styles.deleteButton}
            disabled={hasQuestionSubmitted}>
            <TrashIcon />
          </Button>
          <Button form={'question-form'} type={'submit'} outerStyles={styles.saveButton}>
            Сохранить вопрос
          </Button>
        </div>
      </div>
    </section>
  )
}
