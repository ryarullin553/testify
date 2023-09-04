import styles from './question-input-area.module.scss'

export const QuestionInputArea = ({
  questionDescription,
  handleQuestionDescriptionChange,
  currentQuestionID,
  currentQuestionIndex,
}) => {
  return (
    <fieldset className={styles.questionArea}>
      <label>{`Вопрос ${currentQuestionIndex + 1}`}</label>
      <textarea
        name='questionDescription'
        id='questionDescription'
        placeholder='Напишите ваш вопрос или условие задачи'
        value={questionDescription}
        onChange={handleQuestionDescriptionChange}
      />
    </fieldset>
  )
}
