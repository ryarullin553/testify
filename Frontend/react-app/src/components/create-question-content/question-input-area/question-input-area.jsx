import styles from './question-input-area.module.scss';

export const QuestionInputArea = ({questionDescription, handleQuestionDescriptionChange}) => {
  return (
    <fieldset className={styles.questionArea}>
      <label>Вопрос</label>
      <textarea
        name="questionDescription"
        id="questionDescription"
        placeholder="Напишите ваш вопрос или условие задачи"
        value={questionDescription}
        onChange={handleQuestionDescriptionChange}
      />
    </fieldset>
  );
}
