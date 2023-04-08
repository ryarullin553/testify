import styles from './question-list-sidebar.module.scss';

export const QuestionListSidebar = ({testTitle, questionList, setCurrentQuestionID}) => {
  return (
    <section className={styles.questionListSection}>
      <h2>{testTitle}</h2>
      <ol>
        {questionList.map(question => 
        <li>
          <button
            className={styles.selectQuestionButton}
            onClick={() => setCurrentQuestionID(question.questionID)}
          >{question.questionDescription}
          </button>
        </li>
        )}
      </ol>
      <button className={styles.submitTestButton}>Опубликовать тест</button>
    </section>
  );
}
